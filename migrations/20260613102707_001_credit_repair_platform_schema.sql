-- Credit Repair Platform Schema
-- FCRA, Metro 2, and compliance-focused design

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'attorney', 'paralegal', 'admin', 'admin', 'super_admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}',
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Client-specific information
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ssn_last4 TEXT CHECK (LENGTH(ssn_last4) = 4),
  date_of_birth DATE,
  current_address TEXT,
  previous_addresses JSONB DEFAULT '[]',
  employment_status TEXT,
  annual_income INTEGER,
  credit_monitoring_service TEXT,
  primary_bureau TEXT DEFAULT 'all' CHECK (primary_bureau IN ('equifax', 'experian', 'transunion', 'all')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  consent_signed_at TIMESTAMPTZ,
  consent_ip_address TEXT,
  terms_accepted_at TIMESTAMPTZ,
  privacy_policy_accepted_at TIMESTAMPTZ,
  fcra_disclosure_accepted_at TIMESTAMPTZ,
  state_of_residence TEXT,
  client_status TEXT DEFAULT 'active' CHECK (client_status IN ('prospect', 'active', 'paused', 'cancelled', 'completed')),
  assigned_attorney_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credit reports (from bureau imports)
CREATE TABLE credit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  bureau TEXT NOT NULL CHECK (bureau IN ('equifax', 'experian', 'transunion')),
  report_date DATE NOT NULL,
  report_type TEXT DEFAULT 'full' CHECK (report_type IN ('full', 'monitoring', 'tri-merge')),
  file_url TEXT,
  file_name TEXT,
  parsing_metadata JSONB DEFAULT '{}', -- Changed from reserved word
  report_metadata JSONB DEFAULT '{}',
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'processed', 'error')),
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id)
);

-- Credit items (individual tradelines/accounts)
CREATE TABLE credit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_report_id UUID NOT NULL REFERENCES credit_reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('tradeline', 'inquiry', 'public_record', 'collection', 'charge-off', 'late_payment', 'account')),
  bureau TEXT NOT NULL CHECK (bureau IN ('equifax', 'experian', 'transunion')),
  -- Metro 2 compliant fields
  account_name TEXT,
  account_number_partial TEXT,
  account_type TEXT,
  account_status TEXT,
  responsibility_type TEXT,
  current_balance INTEGER,
  high_balance INTEGER,
  credit_limit INTEGER,
  payment_status TEXT,
  -- --metadata JSONB DEFAULT '{}', -- Changed from reserved word
  item_metadata JSONB DEFAULT '{}',
  -- Score impact indicators
  derogatory BOOLEAN DEFAULT FALSE,
  dispute_candidate BOOLEAN DEFAULT FALSE,
  -- Metro 2 reporting fields
  date_opened DATE,
  date_reported DATE,
  date_last_payment DATE,
  date_last_activity DATE,
  date_closed DATE,
  months_reviewed INTEGER,
  late_30_days INTEGER,
  late_60_days INTEGER,
  late_90_days INTEGER,
  -- Compliance tracking
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dispute cases
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  dispute_number TEXT UNIQUE NOT NULL,
  dispute_type TEXT NOT NULL DEFAULT 'initial' CHECK (dispute_type IN ('initial', 'followup', 'escalation', 'method_of_verification', 'procedural_request', 'fcra_section_611')),
  target_bureau TEXT CHECK (target_bureau IN ('equifax', 'experian', 'transunion', 'all')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'submitted', 'in_review', 'partial_success', 'success', 'denied', 'escalated', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  -- Compliance fields
  submitted_at TIMESTAMPTZ,
  bureau_response_due_date DATE,
  response_received_at TIMESTAMPTZ,
  bureau_response TEXT,
  bureau_response_file_url TEXT,
  -- FCRA timeline tracking
  fcra_days_remaining INTEGER,
  fcra_extension_used BOOLEAN DEFAULT FALSE,
  -- Attorney oversight
  reviewed_by_attorney BOOLEAN DEFAULT FALSE,
  attorney_reviewed_at TIMESTAMPTZ,
  attorney_notes TEXT,
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Items being disputed
CREATE TABLE dispute_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  credit_item_id UUID NOT NULL REFERENCES credit_items(id),
  dispute_reason TEXT NOT NULL,
  dispute_reason_code TEXT, -- CFPB compliant reason codes
  consumer_statement TEXT,
  requested_action TEXT DEFAULT 'delete' CHECK (requested_action IN ('delete', 'update', 'correct', 'investigate')),
  result TEXT CHECK (result IN ('pending', 'deleted', 'updated', 'verified', 'remains', 'updated_as_agreed')),
  result_notes TEXT,
  result_date DATE,
  verified_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dispute letters (generated documents)
CREATE TABLE dispute_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  letter_type TEXT NOT NULL,
  letter_template_id UUID,
  recipient_type TEXT CHECK (recipient_type IN ('credit_bureau', 'data_furnisher', 'both')),
  recipient_bureau TEXT,
  recipient_address TEXT,
  subject_line TEXT,
  body_content TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generated_by UUID REFERENCES profiles(id),
  approved_by_attorney UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  -- Document management
  file_url TEXT,
  file_name TEXT,
  sent_at TIMESTAMPTZ,
  tracking_number TEXT,
  certified_mail BOOLEAN DEFAULT FALSE,
  -- Compliance
  contains_pii BOOLEAN DEFAULT TRUE,
  encryption_applied BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document uploads
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN (
    'credit_report', 'id_verification', 'proof_of_address', 'dispute_letter',
    'bureau_response', 'court_document', 'bank_statement', 'utility_bill',
    'other', 'signed_agreement', 'power_of_attorney', 'pay_stub',
    'tax_return', 'social_security_card', 'birth_certificate'
  )),
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  -- Security & Compliance
  encrypted BOOLEAN DEFAULT TRUE,
  encryption_key_id TEXT,
  access_level TEXT DEFAULT 'client' CHECK (access_level IN ('client', 'attorney', 'both', 'admin')),
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  -- --metadata
  document_metadata JSONB DEFAULT '{}',
  retention_until DATE, -- GDPR/data retention compliance
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attorney-client assignments
CREATE TABLE attorney_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  attorney_id UUID NOT NULL REFERENCES profiles(id),
  assigned_by UUID NOT NULL REFERENCES profiles(id),
  assignment_type TEXT DEFAULT 'primary' CHECK (assignment_type IN ('primary', 'secondary', 'review', 'supervising')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'closed')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Communications
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id), -- NULL for broadcast messages
  comm_type TEXT NOT NULL CHECK (comm_type IN ('message', 'call_log', 'email', 'video_call', 'system_notification')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  body TEXT,
  -- Compliance (call recording, etc.)
  compliance_compliant BOOLEAN DEFAULT TRUE,
  consent_verified_at TIMESTAMPTZ,
  --metadata JSONB DEFAULT '{}', -- Changed from reserved word
  comm_metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs (FCRA compliance trail)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  --metadata JSONB DEFAULT '{}', -- Changed from reserved word
  action_metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  -- Compliance fields
  fcra_relevant BOOLEAN DEFAULT FALSE,
  data_accessed TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credit score snapshots
CREATE TABLE credit_score_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  bureau TEXT NOT NULL CHECK (bureau IN ('equifax', 'experian', 'transunion', 'combined')),
  score INTEGER CHECK (score > 0 AND score <= 850),
  score_model TEXT DEFAULT 'fico_8',
  score_date DATE NOT NULL,
  change_from_prior INTEGER,
  improvement_goal INTEGER,
  --metadata JSONB DEFAULT '{}', -- Changed from reserved word
  score_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task management system
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  dispute_id UUID REFERENCES disputes(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id),
  task_type TEXT NOT NULL CHECK (task_type IN (
    'import_report', 'review_report', 'initiate_dispute', 'follow_up',
    'client_communication', 'document_review', 'approval_needed',
    'bureau_followup', 'escalation', 're-import'
  )),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Letter templates
CREATE TABLE letter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  description TEXT,
  subject_template TEXT,
  body_template TEXT NOT NULL,
  applicable_bureaus TEXT[] DEFAULT ARRAY['equifax', 'experian', 'transunion'],
  is_active BOOLEAN DEFAULT TRUE,
  attorney_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions and payments
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  plan_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('trial', 'active', 'paused', 'cancelled', 'expired')),
  amount_cents INTEGER,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
  current_period_start DATE,
  current_period_end DATE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consent records (compliance)
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'terms_of_service', 'privacy_policy', 'fcra_disclosure', 'croa_disclosure',
    'electronic_signature_consent', 'credit_pull_authorization', 
    'representation_agreement', 'communication_consent', 'data_processing'
  )),
  version TEXT NOT NULL,
  content TEXT,
  signed_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attorney_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_score_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_attorney_id ON clients(assigned_attorney_id);
CREATE INDEX idx_credit_reports_client_id ON credit_reports(client_id);
CREATE INDEX idx_credit_items_client_id ON credit_items(client_id);
CREATE INDEX idx_credit_items_report_id ON credit_items(credit_report_id);
CREATE INDEX idx_disputes_client_id ON disputes(client_id);
CREATE INDEX idx_dispute_items_dispute_id ON dispute_items(dispute_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create update timestamp functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_items_updated_at BEFORE UPDATE ON credit_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dispute_items_updated_at BEFORE UPDATE ON dispute_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_letter_templates_updated_at BEFORE UPDATE ON letter_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();