-- Attorney Escalation Cases
-- Legal Shield integration for human attorney intervention

CREATE TABLE attorney_escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  dispute_id UUID REFERENCES disputes(id) ON DELETE SET NULL,

  -- Case details
  escalation_number TEXT UNIQUE NOT NULL,
  escalation_type TEXT NOT NULL DEFAULT 'dispute_escalation' CHECK (escalation_type IN (
    'dispute_escalation',       -- Bureau denied, need attorney review
    'cfpb_complaint',           -- File CFPB complaint
    'ftc_complaint',            -- File FTC complaint
    'debt_validation',          -- Formal debt validation letter (FDCPA)
    'cease_desist',             -- Cease & desist to collector
    'litigation_threat',        -- Demand letter / pre-litigation
    'identity_theft_affidavit', -- FTC Identity Theft Affidavit
    'goodwill_intervention',    -- Attorney goodwill letter to creditor
    'arbitration'               -- Arbitration filing
  )),

  -- Status workflow
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN (
    'pending_review',   -- Submitted, awaiting attorney pickup
    'attorney_assigned',-- Attorney assigned to case
    'in_progress',      -- Attorney actively working
    'action_taken',     -- Letter sent / complaint filed
    'resolved',         -- Positive outcome
    'closed_no_action', -- Closed, no further action possible
    'escalated_litigation' -- Moved to formal litigation
  )),

  -- Attorney assignment
  assigned_attorney_id UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ,
  attorney_notes TEXT,

  -- Legal action details
  legal_basis TEXT,             -- FCRA §623, FDCPA §809, etc.
  requested_remedy TEXT,        -- Delete, update, damages, etc.
  creditor_name TEXT,
  creditor_address TEXT,
  account_number_partial TEXT,
  disputed_amount NUMERIC(10,2),

  -- Client context
  client_description TEXT,      -- Client's own description of the issue
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'critical')),
  
  -- Action tracking
  action_taken_at TIMESTAMPTZ,
  action_description TEXT,
  outcome TEXT,
  outcome_date DATE,

  -- Documents
  supporting_documents JSONB DEFAULT '[]',
  generated_letter_url TEXT,

  -- Deadlines
  response_deadline DATE,       -- 30/37/45 day FCRA/FDCPA deadlines
  statute_of_limitations DATE,  -- SOL for potential lawsuit

  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attorney escalation messages (secure attorney-client comms)
CREATE TABLE escalation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escalation_id UUID NOT NULL REFERENCES attorney_escalations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  is_attorney BOOLEAN DEFAULT FALSE,
  is_internal BOOLEAN DEFAULT FALSE,  -- Internal attorney notes (not visible to client)
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE attorney_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attorney_escalations
CREATE POLICY "select_own_escalations" ON attorney_escalations FOR SELECT
  TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR auth.uid() = assigned_attorney_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "insert_own_escalations" ON attorney_escalations FOR INSERT
  TO authenticated WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "update_own_escalations" ON attorney_escalations FOR UPDATE
  TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR auth.uid() = assigned_attorney_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  ) WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR auth.uid() = assigned_attorney_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "delete_own_escalations" ON attorney_escalations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- RLS Policies for escalation_messages
CREATE POLICY "select_escalation_messages" ON escalation_messages FOR SELECT
  TO authenticated USING (
    escalation_id IN (
      SELECT id FROM attorney_escalations WHERE
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
        OR assigned_attorney_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
    )
    AND (is_internal = FALSE OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal')
    ))
  );

CREATE POLICY "insert_escalation_messages" ON escalation_messages FOR INSERT
  TO authenticated WITH CHECK (
    sender_id = auth.uid()
    AND escalation_id IN (
      SELECT id FROM attorney_escalations WHERE
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
        OR assigned_attorney_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
    )
  );

CREATE POLICY "update_escalation_messages" ON escalation_messages FOR UPDATE
  TO authenticated USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "delete_escalation_messages" ON escalation_messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Indexes
CREATE INDEX idx_attorney_escalations_client_id ON attorney_escalations(client_id);
CREATE INDEX idx_attorney_escalations_dispute_id ON attorney_escalations(dispute_id);
CREATE INDEX idx_attorney_escalations_attorney_id ON attorney_escalations(assigned_attorney_id);
CREATE INDEX idx_attorney_escalations_status ON attorney_escalations(status);
CREATE INDEX idx_escalation_messages_escalation_id ON escalation_messages(escalation_id);

-- Updated_at trigger
CREATE TRIGGER update_attorney_escalations_updated_at
  BEFORE UPDATE ON attorney_escalations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
