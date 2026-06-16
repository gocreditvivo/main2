-- RLS Policies for Credit Repair Platform

-- Profiles table policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Clients table policies
CREATE POLICY "clients_select_own" ON clients FOR SELECT
  TO authenticated USING (
    user_id = auth.uid() OR 
    assigned_attorney_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "clients_insert_own" ON clients FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_update_own" ON clients FOR UPDATE
  TO authenticated USING (
    user_id = auth.uid() OR 
    assigned_attorney_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Credit reports policies
CREATE POLICY "credit_reports_select_own" ON credit_reports FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_reports.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "credit_reports_insert_own" ON credit_reports FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_reports.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Credit items policies
CREATE POLICY "credit_items_select_own" ON credit_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_items.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "credit_items_insert_own" ON credit_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_items.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "credit_items_update_own" ON credit_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_items.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Disputes policies
CREATE POLICY "disputes_select_own" ON disputes FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = disputes.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "disputes_insert_own" ON disputes FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = disputes.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "disputes_update_own" ON disputes FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = disputes.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

-- Dispute items policies
CREATE POLICY "dispute_items_select_own" ON dispute_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM disputes d JOIN clients c ON d.client_id = c.id WHERE d.id = dispute_items.dispute_id AND 
      (c.user_id = auth.uid() OR c.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "dispute_items_insert_own" ON dispute_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM disputes d JOIN clients c ON d.client_id = c.id WHERE d.id = dispute_items.dispute_id AND 
      (c.user_id = auth.uid() OR c.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "dispute_items_update_own" ON dispute_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM disputes d JOIN clients c ON d.client_id = c.id WHERE d.id = dispute_items.dispute_id AND 
      (c.user_id = auth.uid() OR c.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

-- Dispute letters policies
CREATE POLICY "dispute_letters_select_own" ON dispute_letters FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM disputes d JOIN clients c ON d.client_id = c.id WHERE d.id = dispute_letters.dispute_id AND 
      (c.user_id = auth.uid() OR c.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "dispute_letters_insert_own" ON dispute_letters FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "dispute_letters_update_own" ON dispute_letters FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

-- Documents policies
CREATE POLICY "documents_select_own" ON documents FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = documents.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "documents_insert_own" ON documents FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = documents.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "documents_delete_own" ON documents FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Attorney assignments policies
CREATE POLICY "attorney_assignments_select_own" ON attorney_assignments FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = attorney_assignments.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "attorney_assignments_insert_own" ON attorney_assignments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "attorney_assignments_update_own" ON attorney_assignments FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Communications policies
CREATE POLICY "communications_select_own" ON communications FOR SELECT
  TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid() OR assigned_attorney_id = auth.uid())
    OR sender_id = auth.uid()
    OR recipient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "communications_insert_own" ON communications FOR INSERT
  TO authenticated WITH CHECK (
    sender_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Credit score snapshots policies
CREATE POLICY "credit_score_snapshots_select_own" ON credit_score_snapshots FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_score_snapshots.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "credit_score_snapshots_insert_own" ON credit_score_snapshots FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = credit_score_snapshots.client_id AND 
      (clients.user_id = auth.uid() OR clients.assigned_attorney_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Tasks policies
CREATE POLICY "tasks_select_own" ON tasks FOR SELECT
  TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid() OR assigned_attorney_id = auth.uid())
    OR assigned_to = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "tasks_insert_own" ON tasks FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney', 'paralegal'))
  );

CREATE POLICY "tasks_update_own" ON tasks FOR UPDATE
  TO authenticated USING (
    assigned_to = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Letter templates policies
CREATE POLICY "letter_templates_select_all" ON letter_templates FOR SELECT
  TO authenticated USING (is_active = TRUE OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "letter_templates_insert_own" ON letter_templates FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney'))
  );

CREATE POLICY "letter_templates_update_own" ON letter_templates FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney'))
  );

-- Subscriptions policies
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = subscriptions.client_id AND clients.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "subscriptions_update_own" ON subscriptions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "subscriptions_insert_own" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = subscriptions.client_id AND clients.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Consent records policies
CREATE POLICY "consent_records_select_own" ON consent_records FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = consent_records.client_id AND clients.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "consent_records_insert_own" ON consent_records FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = consent_records.client_id AND clients.user_id = auth.uid())
  );

-- Audit logs policies (read-only for authorized users)
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney'))
    OR user_id = auth.uid()
  );

CREATE POLICY "audit_logs_insert_authenticated" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));