import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Scale, Plus, Send, X, Clock, CheckCircle2, AlertTriangle,
  FileText, Shield, Brain, ChevronRight, User, MessageSquare,
  Gavel, AlertCircle, ExternalLink, Sparkles, ArrowRight,
  Building2, CreditCard, Lock, Eye, RotateCcw
} from 'lucide-react';

interface Escalation {
  id: string;
  escalation_number: string;
  escalation_type: string;
  status: string;
  priority: string;
  creditor_name: string | null;
  client_description: string | null;
  legal_basis: string | null;
  requested_remedy: string | null;
  disputed_amount: number | null;
  action_description: string | null;
  outcome: string | null;
  outcome_date: string | null;
  response_deadline: string | null;
  assigned_attorney_id: string | null;
  assigned_at: string | null;
  attorney_notes: string | null;
  created_at: string;
}

interface EscalationMessage {
  id: string;
  sender_id: string;
  message: string;
  is_attorney: boolean;
  is_internal: boolean;
  created_at: string;
}

const ESCALATION_TYPES = [
  {
    code: 'dispute_escalation',
    title: 'Bureau Dispute Escalation',
    description: 'Bureau denied your dispute. Attorney sends a formal demand citing FCRA §623(b) data furnisher liability.',
    icon: Scale,
    legal: 'FCRA §623(b)',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
  },
  {
    code: 'cfpb_complaint',
    title: 'CFPB Complaint',
    description: 'File a formal complaint with the Consumer Financial Protection Bureau. Bureaus must respond within 15 days.',
    icon: Building2,
    legal: 'CFPB §1034',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    code: 'debt_validation',
    title: 'FDCPA Debt Validation',
    description: 'Formal demand for the collector to validate the debt under the Fair Debt Collection Practices Act.',
    icon: FileText,
    legal: 'FDCPA §809',
    color: 'text-warning-600',
    bg: 'bg-warning-50',
    border: 'border-warning-200',
  },
  {
    code: 'cease_desist',
    title: 'Cease & Desist Letter',
    description: 'Attorney-signed letter demanding collectors stop all contact. Violations after receipt = $1,000 per call.',
    icon: Lock,
    legal: 'FDCPA §805(c)',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  {
    code: 'identity_theft_affidavit',
    title: 'ID Theft Affidavit',
    description: 'FTC Identity Theft Affidavit with attorney signature for fraudulent account removal under FCRA §605B.',
    icon: Shield,
    legal: 'FCRA §605B',
    color: 'text-accent-600',
    bg: 'bg-accent-50',
    border: 'border-accent-200',
  },
  {
    code: 'ftc_complaint',
    title: 'FTC Complaint',
    description: 'File a Federal Trade Commission complaint for FCRA violations. Creates an official federal record.',
    icon: Gavel,
    legal: 'FCRA §616-617',
    color: 'text-secondary-600',
    bg: 'bg-secondary-100',
    border: 'border-secondary-200',
  },
  {
    code: 'goodwill_intervention',
    title: 'Goodwill Intervention',
    description: 'Attorney letter to the original creditor requesting compassionate removal of paid or settled accounts.',
    icon: CreditCard,
    legal: 'FCRA §623(a)(4)',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    code: 'litigation_threat',
    title: 'Pre-Litigation Demand',
    description: 'Formal demand letter threatening FCRA lawsuit. Actual damages + $100–$1,000 statutory damages per violation.',
    icon: AlertTriangle,
    legal: 'FCRA §616',
    color: 'text-error-600',
    bg: 'bg-error-50',
    border: 'border-error-200',
  },
];

const STATUS_META: Record<string, { label: string; badge: string; dot: string; desc: string }> = {
  pending_review: { label: 'Pending Review', badge: 'badge-secondary', dot: 'bg-secondary-400', desc: 'Awaiting attorney assignment' },
  attorney_assigned: { label: 'Attorney Assigned', badge: 'badge-primary', dot: 'bg-primary-500', desc: 'Attorney reviewing your case' },
  in_progress: { label: 'In Progress', badge: 'badge-warning', dot: 'bg-warning-500', desc: 'Attorney actively working' },
  action_taken: { label: 'Action Taken', badge: 'badge-success', dot: 'bg-accent-500', desc: 'Letter sent / Complaint filed' },
  resolved: { label: 'Resolved', badge: 'badge-success', dot: 'bg-accent-600', desc: 'Positive outcome achieved' },
  closed_no_action: { label: 'Closed', badge: 'badge-secondary', dot: 'bg-secondary-400', desc: 'No further action available' },
  escalated_litigation: { label: 'Litigation', badge: 'badge-error', dot: 'bg-error-600', desc: 'Formal litigation in progress' },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-secondary-500' },
  normal: { label: 'Normal', color: 'text-primary-600' },
  high: { label: 'High', color: 'text-warning-600' },
  urgent: { label: 'Urgent', color: 'text-error-600' },
  critical: { label: 'Critical', color: 'text-error-700' },
};

export default function LegalTeamPage() {
  const { user, clientData } = useAuth();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [messages, setMessages] = useState<EscalationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New case form state
  const [formStep, setFormStep] = useState<'type' | 'details'>('type');
  const [form, setForm] = useState({
    escalation_type: '',
    priority: 'normal',
    creditor_name: '',
    account_number_partial: '',
    disputed_amount: '',
    client_description: '',
    legal_basis: '',
    requested_remedy: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (clientData?.id) loadEscalations();
    else setIsLoading(false);
  }, [clientData]);

  useEffect(() => {
    if (selectedEscalation) loadMessages(selectedEscalation.id);
  }, [selectedEscalation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadEscalations = async () => {
    try {
      const { data } = await supabase
        .from('attorney_escalations')
        .select('*')
        .eq('client_id', clientData?.id)
        .order('created_at', { ascending: false });
      setEscalations(data || []);
    } catch (err) {
      console.error('Error loading escalations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (escalationId: string) => {
    try {
      const { data } = await supabase
        .from('escalation_messages')
        .select('*')
        .eq('escalation_id', escalationId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSubmitCase = async () => {
    if (!clientData?.id || !user || !form.escalation_type || !form.client_description) return;
    setSubmitting(true);
    setFormError(null);

    try {
      const escalationNumber = `ESC-${Date.now().toString().slice(-8)}`;
      const selectedType = ESCALATION_TYPES.find(t => t.code === form.escalation_type);

      const { data: newEsc, error } = await supabase
        .from('attorney_escalations')
        .insert({
          client_id: clientData.id,
          escalation_number: escalationNumber,
          escalation_type: form.escalation_type,
          priority: form.priority,
          creditor_name: form.creditor_name || null,
          account_number_partial: form.account_number_partial || null,
          disputed_amount: form.disputed_amount ? parseFloat(form.disputed_amount) : null,
          client_description: form.client_description,
          legal_basis: form.legal_basis || selectedType?.legal || null,
          requested_remedy: form.requested_remedy || null,
          status: 'pending_review',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-send a system message acknowledging the case
      if (newEsc) {
        await supabase.from('escalation_messages').insert({
          escalation_id: newEsc.id,
          sender_id: user.id,
          message: `Case opened: ${selectedType?.title}. Our Legal Shield attorney team has been notified and will review within 24 hours.`,
          is_attorney: false,
        });
      }

      await loadEscalations();
      setShowNewModal(false);
      setFormStep('type');
      setForm({ escalation_type: '', priority: 'normal', creditor_name: '', account_number_partial: '', disputed_amount: '', client_description: '', legal_basis: '', requested_remedy: '' });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit case');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedEscalation || !user) return;
    setSending(true);
    try {
      const { error } = await supabase.from('escalation_messages').insert({
        escalation_id: selectedEscalation.id,
        sender_id: user.id,
        message: newMessage.trim(),
        is_attorney: false,
      });
      if (!error) {
        setNewMessage('');
        loadMessages(selectedEscalation.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const stats = {
    total: escalations.length,
    active: escalations.filter(e => ['pending_review', 'attorney_assigned', 'in_progress'].includes(e.status)).length,
    resolved: escalations.filter(e => e.status === 'resolved').length,
    actionTaken: escalations.filter(e => e.status === 'action_taken').length,
  };

  const selectedType = ESCALATION_TYPES.find(t => t.code === form.escalation_type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-900">
              <Scale className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">Legal Shield</h1>
          </div>
          <p className="text-secondary-500 text-sm">
            Attorney-powered escalation for cases that require legal action beyond AI automation.
          </p>
        </div>
        <button
          onClick={() => { setShowNewModal(true); setFormStep('type'); }}
          className="btn btn-primary shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Open Legal Case
        </button>
      </div>

      {/* Attorney Team Banner */}
      <div className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex -space-x-3">
                {['AJ', 'SK', 'RM'].map((init, i) => (
                  <div
                    key={i}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-secondary-700 bg-primary-600 text-white text-sm font-bold"
                  >
                    {init}
                  </div>
                ))}
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-secondary-700 bg-secondary-700 text-secondary-300 text-xs font-bold">
                  +12
                </div>
              </div>
              <div>
                <p className="text-white font-semibold">Legal Shield Attorney Network</p>
                <p className="text-secondary-400 text-sm">15 licensed attorneys • FCRA & FDCPA specialists • Avg. 4h response time</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: '95%', label: 'Win Rate' },
                { value: '$0', label: 'Upfront' },
                { value: '24h', label: 'Response' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-secondary-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-primary-600 px-6 py-3 flex flex-wrap items-center gap-6">
          {[
            'FCRA §616 Litigation',
            'FDCPA §809 Validation',
            'CFPB Complaints',
            'CFPB §1034 Portal',
            'Identity Theft Affidavits',
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary-200 flex-shrink-0" />
              <span className="text-xs text-primary-100">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Cases', value: stats.total, bg: 'bg-white border-secondary-200', val: 'text-secondary-900' },
          { label: 'Active Cases', value: stats.active, bg: 'bg-warning-50 border-warning-200', val: 'text-warning-700' },
          { label: 'Actions Taken', value: stats.actionTaken, bg: 'bg-primary-50 border-primary-200', val: 'text-primary-700' },
          { label: 'Resolved', value: stats.resolved, bg: 'bg-accent-50 border-accent-200', val: 'text-accent-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
            <p className="text-xs font-medium text-secondary-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.val}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Escalation Types Reference */}
      {escalations.length === 0 && !isLoading && (
        <div>
          <h2 className="text-base font-semibold text-secondary-900 mb-4">Available Legal Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ESCALATION_TYPES.map((type) => (
              <button
                key={type.code}
                onClick={() => { setForm(f => ({ ...f, escalation_type: type.code })); setFormStep('details'); setShowNewModal(true); }}
                className={`rounded-xl border text-left p-4 hover:shadow-md transition-all group ${type.bg} ${type.border}`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm mb-3 ${type.color}`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <p className={`text-sm font-semibold ${type.color} mb-1`}>{type.title}</p>
                <p className="text-xs text-secondary-500 leading-relaxed">{type.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 ${type.color}`}>
                    {type.legal}
                  </span>
                  <ArrowRight className={`h-3.5 w-3.5 ${type.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cases List */}
      {isLoading ? (
        <div className="rounded-xl bg-white border border-secondary-200 flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm text-secondary-500">Loading cases...</p>
          </div>
        </div>
      ) : escalations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-secondary-900">Your Legal Cases</h2>
          {escalations.map((esc) => {
            const meta = STATUS_META[esc.status] || STATUS_META.pending_review;
            const typeInfo = ESCALATION_TYPES.find(t => t.code === esc.escalation_type);
            const TypeIcon = typeInfo?.icon || Scale;
            const priorityInfo = PRIORITY_META[esc.priority] || PRIORITY_META.normal;

            return (
              <div
                key={esc.id}
                className="rounded-xl bg-white border border-secondary-200 shadow-sm hover:shadow-elevated transition-all cursor-pointer"
                onClick={() => setSelectedEscalation(esc)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${typeInfo?.bg || 'bg-secondary-100'}`}>
                        <TypeIcon className={`h-5 w-5 ${typeInfo?.color || 'text-secondary-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-bold text-secondary-900">{typeInfo?.title || esc.escalation_type}</p>
                          <span className="font-mono text-xs text-secondary-400">{esc.escalation_number}</span>
                        </div>
                        {esc.creditor_name && (
                          <p className="text-xs text-secondary-500 mb-1">Creditor: <span className="font-medium text-secondary-700">{esc.creditor_name}</span></p>
                        )}
                        {esc.client_description && (
                          <p className="text-xs text-secondary-400 line-clamp-1">{esc.client_description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${meta.dot}`} />
                        <span className={`badge text-xs ${meta.badge}`}>{meta.label}</span>
                      </div>
                      <span className={`text-xs font-semibold ${priorityInfo.color}`}>
                        {priorityInfo.label} priority
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-secondary-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(esc.created_at).toLocaleDateString()}
                      </div>
                      {esc.legal_basis && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" />
                          {esc.legal_basis}
                        </div>
                      )}
                      {esc.response_deadline && (
                        <div className="flex items-center gap-1 text-warning-600">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Deadline: {new Date(esc.response_deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-primary-600 text-xs font-medium">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Open Case
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {esc.status === 'action_taken' && esc.action_description && (
                    <div className="mt-3 rounded-lg bg-accent-50 border border-accent-200 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-600 flex-shrink-0" />
                        <p className="text-xs text-accent-700">{esc.action_description}</p>
                      </div>
                    </div>
                  )}
                  {esc.status === 'resolved' && esc.outcome && (
                    <div className="mt-3 rounded-lg bg-accent-50 border border-accent-200 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-600 flex-shrink-0" />
                        <p className="text-xs font-semibold text-accent-700">Resolved: {esc.outcome}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Case Modal */}
      {showNewModal && (
        <div className="modal-backdrop">
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-900">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary-900">Open Legal Case</h2>
                  <p className="text-xs text-secondary-500">Attorney review within 24 hours • $0 upfront</p>
                </div>
              </div>
              <button onClick={() => { setShowNewModal(false); setFormStep('type'); }} className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[72vh] overflow-y-auto">
              {formStep === 'type' ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-secondary-700 mb-4">Select the type of legal action needed:</p>
                  {ESCALATION_TYPES.map((type) => (
                    <label
                      key={type.code}
                      className={`flex items-start gap-4 cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        form.escalation_type === type.code
                          ? `${type.border} ${type.bg} ring-2 ring-primary-200`
                          : 'border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50'
                      }`}
                    >
                      <input type="radio" name="escalation_type" value={type.code}
                        checked={form.escalation_type === type.code}
                        onChange={() => setForm(f => ({ ...f, escalation_type: type.code, legal_basis: type.legal }))}
                        className="sr-only" />
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
                        form.escalation_type === type.code ? `bg-white ${type.color}` : 'bg-secondary-100 text-secondary-500'
                      }`}>
                        <type.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-secondary-900">{type.title}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.bg} ${type.color} border ${type.border}`}>
                            {type.legal}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1 leading-relaxed">{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {selectedType && (
                    <div className={`rounded-xl border p-4 ${selectedType.bg} ${selectedType.border}`}>
                      <div className="flex items-center gap-2">
                        <selectedType.icon className={`h-5 w-5 ${selectedType.color}`} />
                        <p className={`text-sm font-semibold ${selectedType.color}`}>{selectedType.title}</p>
                        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 ${selectedType.color}`}>
                          {selectedType.legal}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="input-label">Creditor / Collection Agency Name</label>
                      <input type="text" className="mt-1 w-full" placeholder="e.g. Portfolio Recovery Associates"
                        value={form.creditor_name} onChange={e => setForm(f => ({ ...f, creditor_name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">Account # (Last 4)</label>
                      <input type="text" className="mt-1 w-full" placeholder="e.g. 4521" maxLength={4}
                        value={form.account_number_partial} onChange={e => setForm(f => ({ ...f, account_number_partial: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">Disputed Amount ($)</label>
                      <input type="number" className="mt-1 w-full" placeholder="e.g. 1250.00"
                        value={form.disputed_amount} onChange={e => setForm(f => ({ ...f, disputed_amount: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">Priority</label>
                      <select className="mt-1 w-full" value={form.priority}
                        onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Requested Remedy</label>
                    <select className="mt-1 w-full" value={form.requested_remedy}
                      onChange={e => setForm(f => ({ ...f, requested_remedy: e.target.value }))}>
                      <option value="">Select what you want...</option>
                      <option value="Complete removal from all bureaus">Complete removal from all bureaus</option>
                      <option value="Update to paid/settled status">Update to paid/settled status</option>
                      <option value="Stop collections contact">Stop collections contact</option>
                      <option value="Validate the debt">Validate the debt</option>
                      <option value="File CFPB complaint">File CFPB complaint</option>
                      <option value="Pursue statutory damages ($100-$1,000)">Pursue statutory damages ($100–$1,000)</option>
                      <option value="Identity theft restoration">Identity theft restoration</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Describe the Issue <span className="text-error-500">*</span></label>
                    <textarea rows={4} className="mt-1 w-full resize-none"
                      placeholder="Describe what happened, when it started, what you've tried, and why you believe this is inaccurate or a violation of your rights..."
                      value={form.client_description}
                      onChange={e => setForm(f => ({ ...f, client_description: e.target.value }))} />
                  </div>

                  {formError && (
                    <div className="rounded-lg bg-error-50 border border-error-200 p-3">
                      <p className="text-sm text-error-700">{formError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-secondary-100 bg-secondary-50">
              {formStep === 'type' ? (
                <>
                  <button onClick={() => setShowNewModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                  <button
                    disabled={!form.escalation_type}
                    onClick={() => setFormStep('details')}
                    className="btn btn-primary flex-1 shadow-sm"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setFormStep('type')} className="btn btn-secondary">Back</button>
                  <button
                    disabled={!form.client_description.trim() || submitting}
                    onClick={handleSubmitCase}
                    className="btn btn-primary flex-1 shadow-sm"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Scale className="h-4 w-4 mr-2" />
                        Submit to Legal Team
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Case Detail / Chat Modal */}
      {selectedEscalation && (
        <div className="modal-backdrop">
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-elevated overflow-hidden flex flex-col"
            style={{ maxHeight: '88vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-100 bg-secondary-900 flex-shrink-0">
              <div className="flex items-center gap-3">
                {(() => {
                  const typeInfo = ESCALATION_TYPES.find(t => t.code === selectedEscalation.escalation_type);
                  const TypeIcon = typeInfo?.icon || Scale;
                  return (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <TypeIcon className="h-5 w-5 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <p className="text-sm font-bold text-white">
                    {ESCALATION_TYPES.find(t => t.code === selectedEscalation.escalation_type)?.title || selectedEscalation.escalation_type}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-secondary-400">{selectedEscalation.escalation_number}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${STATUS_META[selectedEscalation.status]?.dot || 'bg-secondary-400'}`} />
                    <span className="text-xs text-secondary-400">{STATUS_META[selectedEscalation.status]?.label}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedEscalation(null)} className="p-2 text-secondary-400 hover:text-white rounded-lg hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Case Details */}
            <div className="px-6 py-4 border-b border-secondary-100 bg-secondary-50 flex-shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {selectedEscalation.creditor_name && (
                  <div><p className="text-secondary-400">Creditor</p><p className="font-semibold text-secondary-900 mt-0.5">{selectedEscalation.creditor_name}</p></div>
                )}
                {selectedEscalation.disputed_amount && (
                  <div><p className="text-secondary-400">Amount</p><p className="font-semibold text-secondary-900 mt-0.5">${selectedEscalation.disputed_amount.toLocaleString()}</p></div>
                )}
                {selectedEscalation.legal_basis && (
                  <div><p className="text-secondary-400">Legal Basis</p><p className="font-semibold text-primary-700 mt-0.5">{selectedEscalation.legal_basis}</p></div>
                )}
                {selectedEscalation.response_deadline && (
                  <div><p className="text-secondary-400">Deadline</p><p className="font-semibold text-warning-700 mt-0.5">{new Date(selectedEscalation.response_deadline).toLocaleDateString()}</p></div>
                )}
              </div>
              {selectedEscalation.attorney_notes && (
                <div className="mt-3 rounded-lg bg-primary-50 border border-primary-200 p-3">
                  <p className="text-xs font-semibold text-primary-700 mb-1 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5" />
                    Attorney Notes
                  </p>
                  <p className="text-xs text-primary-800">{selectedEscalation.attorney_notes}</p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-secondary-200 mx-auto mb-2" />
                  <p className="text-sm text-secondary-400">No messages yet</p>
                  <p className="text-xs text-secondary-400 mt-1">Send a message to your assigned attorney</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_attorney ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] ${msg.is_attorney ? 'order-2' : ''}`}>
                      {msg.is_attorney && (
                        <div className="flex items-center gap-1.5 mb-1 ml-1">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-900">
                            <Scale className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-secondary-500">Legal Shield Attorney</span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 text-sm ${
                        msg.is_attorney
                          ? 'rounded-tl-sm bg-secondary-100 text-secondary-900'
                          : 'rounded-tr-sm bg-primary-600 text-white'
                      }`}>
                        {msg.message}
                      </div>
                      <p className={`text-xs mt-1 ${msg.is_attorney ? 'text-secondary-400' : 'text-right text-secondary-400'}`}>
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-secondary-100 p-4 flex-shrink-0">
              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-secondary-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  placeholder="Message your attorney... (Enter to send)"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="btn btn-primary h-12 w-12 p-0 flex-shrink-0"
                >
                  {sending
                    ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : <Send className="h-4 w-4" />
                  }
                </button>
              </div>
              <p className="text-xs text-secondary-400 mt-2 text-center">
                Protected by attorney-client privilege • End-to-end encrypted
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
