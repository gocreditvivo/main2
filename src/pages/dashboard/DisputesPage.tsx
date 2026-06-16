import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Plus, FileText, Clock, CheckCircle2, XCircle,
  Search, Send, Eye, Brain, Zap, Shield, AlertCircle,
  ChevronRight, RotateCcw, Sparkles, Scale
} from 'lucide-react';

interface Dispute {
  id: string;
  dispute_number: string;
  dispute_type: string;
  target_bureau: string | null;
  status: string;
  priority: string;
  submitted_at: string | null;
  bureau_response_due_date: string | null;
  fcra_days_remaining: number | null;
  created_at: string;
}

const STATUS_META: Record<string, { label: string; badge: string; dot: string }> = {
  draft: { label: 'Draft', badge: 'badge-secondary', dot: 'bg-secondary-400' },
  ready: { label: 'Ready', badge: 'badge-primary', dot: 'bg-primary-500' },
  submitted: { label: 'Submitted', badge: 'badge-primary', dot: 'bg-primary-500' },
  in_review: { label: 'In Review', badge: 'badge-warning', dot: 'bg-warning-500' },
  partial_success: { label: 'Partial Win', badge: 'badge-success', dot: 'bg-accent-500' },
  success: { label: 'Removed', badge: 'badge-success', dot: 'bg-accent-500' },
  denied: { label: 'Denied', badge: 'badge-error', dot: 'bg-error-500' },
  escalated: { label: 'Escalated', badge: 'badge-warning', dot: 'bg-warning-600' },
  closed: { label: 'Closed', badge: 'badge-secondary', dot: 'bg-secondary-400' },
};

const BUREAU_META: Record<string, { color: string; bg: string; border: string }> = {
  equifax: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  experian: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  transunion: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
};

const AI_DISPUTE_REASONS = [
  {
    code: 'NOT_MINE',
    title: 'Not My Account',
    description: 'This account does not belong to me. Possible identity theft or mixed file.',
    statute: 'FCRA §605B',
    strength: 96,
    category: 'Identity',
  },
  {
    code: 'INACCURATE_BALANCE',
    title: 'Inaccurate Balance / Amount',
    description: 'The reported balance or amount owed is incorrect per my records.',
    statute: 'Metro 2 — Field 33',
    strength: 87,
    category: 'Factual',
  },
  {
    code: 'OBSOLETE',
    title: 'Obsolete — Exceeds 7 Years',
    description: 'This account is older than 7 years and must be removed under the FCRA reporting time limit.',
    statute: 'FCRA §605(a)',
    strength: 93,
    category: 'Statutory',
  },
  {
    code: 'DUPLICATE',
    title: 'Duplicate Tradeline',
    description: 'This account appears more than once on my report from the same or a related creditor.',
    statute: 'Metro 2 — Uniqueness',
    strength: 89,
    category: 'Factual',
  },
  {
    code: 'UNVERIFIABLE',
    title: 'Cannot Be Verified',
    description: 'Request full Method of Verification — the bureau cannot substantiate this account.',
    statute: 'FCRA §611(a)(6)',
    strength: 79,
    category: 'Procedural',
  },
  {
    code: 'LATE_PAYMENT_ERROR',
    title: 'Incorrect Late Payment',
    description: 'The payment was made on time. The late payment notation is factually inaccurate.',
    statute: 'FCRA §623(a)(2)',
    strength: 82,
    category: 'Factual',
  },
  {
    code: 'PAID_COLLECTION',
    title: 'Paid Collection / Settled',
    description: 'This debt was paid or settled in full. The balance should reflect $0 or be removed.',
    statute: 'Metro 2 — Account Status',
    strength: 75,
    category: 'Factual',
  },
  {
    code: 'DISCHARGED_BANKRUPTCY',
    title: 'Discharged in Bankruptcy',
    description: 'This debt was discharged in bankruptcy and must be reported as such with a $0 balance.',
    statute: 'FCRA §623(a)(1)(B)',
    strength: 91,
    category: 'Statutory',
  },
];

interface CreateDisputeState {
  disputeType: string;
  bureau: string;
  priority: string;
  selectedReason: string;
  notes: string;
  isSubmitting: boolean;
  error: string | null;
}

export default function DisputesPage() {
  const { clientData } = useAuth();
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [createState, setCreateState] = useState<CreateDisputeState>({
    disputeType: 'initial',
    bureau: 'all',
    priority: 'normal',
    selectedReason: '',
    notes: '',
    isSubmitting: false,
    error: null,
  });

  useEffect(() => {
    if (clientData?.id) loadDisputes();
    else setIsLoading(false);
  }, [clientData]);

  const loadDisputes = async () => {
    try {
      const { data } = await supabase
        .from('disputes')
        .select('*')
        .eq('client_id', clientData?.id)
        .order('created_at', { ascending: false });
      setDisputes(data || []);
    } catch (err) {
      console.error('Error loading disputes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    if (!clientData?.id || !createState.selectedReason) return;
    setCreateState(s => ({ ...s, isSubmitting: true, error: null }));

    try {
      const disputeNumber = `DIS-${Date.now().toString().slice(-8)}`;
      const bureauResponseDue = createState.bureau !== 'all'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null;

      const { error } = await supabase.from('disputes').insert({
        client_id: clientData.id,
        dispute_number: disputeNumber,
        dispute_type: createState.disputeType,
        target_bureau: createState.bureau === 'all' ? null : createState.bureau,
        priority: createState.priority,
        status: 'draft',
        bureau_response_due_date: bureauResponseDue,
        fcra_days_remaining: bureauResponseDue ? 30 : null,
      });

      if (error) throw error;
      await loadDisputes();
      setShowCreateModal(false);
      setCreateState(s => ({ ...s, disputeType: 'initial', bureau: 'all', priority: 'normal', selectedReason: '', notes: '', isSubmitting: false }));
    } catch (err) {
      setCreateState(s => ({ ...s, isSubmitting: false, error: err instanceof Error ? err.message : 'Failed to create dispute' }));
    }
  };

  const filteredDisputes = disputes.filter((d) => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (searchQuery && !d.dispute_number.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: disputes.length,
    active: disputes.filter(d => ['submitted', 'in_review'].includes(d.status)).length,
    successful: disputes.filter(d => ['success', 'partial_success'].includes(d.status)).length,
    pending: disputes.filter(d => d.status === 'draft').length,
  };

  const selectedReason = AI_DISPUTE_REASONS.find(r => r.code === createState.selectedReason);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">AI Dispute Center</h1>
          <p className="mt-1 text-secondary-500 text-sm">
            All disputes are generated with FCRA-compliant language and Metro 2 standards.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary shadow-sm">
          <Zap className="h-4 w-4 mr-2" />
          Create AI Dispute
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Disputes', value: stats.total, color: 'text-secondary-900', bg: 'bg-white border-secondary-200' },
          { label: 'In Progress', value: stats.active, color: 'text-primary-700', bg: 'bg-primary-50 border-primary-200' },
          { label: 'Successfully Removed', value: stats.successful, color: 'text-accent-700', bg: 'bg-accent-50 border-accent-200' },
          { label: 'Drafts', value: stats.pending, color: 'text-secondary-700', bg: 'bg-secondary-50 border-secondary-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
            <p className="text-xs font-medium text-secondary-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* AI Banner */}
      <div className="rounded-xl border border-secondary-800 bg-secondary-900 p-4 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/20 flex-shrink-0">
          <Brain className="h-5 w-5 text-primary-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">AI Dispute Engine Active</p>
          <p className="text-xs text-secondary-400">
            Our AI selects the legally strongest dispute reason for each item, citing exact FCRA statutes and Metro 2 compliance standards.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-xs text-accent-400 font-medium">Live</span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white border border-secondary-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search disputes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sm:w-48"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="success">Removed</option>
            <option value="denied">Denied</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Disputes Table */}
      {isLoading ? (
        <div className="rounded-xl bg-white border border-secondary-200 flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm text-secondary-500">Loading disputes...</p>
          </div>
        </div>
      ) : filteredDisputes.length === 0 ? (
        <div className="rounded-xl bg-white border border-secondary-200 text-center py-16 px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100 mb-4">
            <Brain className="h-8 w-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {disputes.length === 0 ? 'No disputes created yet' : 'No matching disputes'}
          </h3>
          <p className="text-secondary-500 text-sm max-w-sm mx-auto mb-6">
            {disputes.length === 0
              ? 'Import a credit report and let the AI identify items to dispute automatically.'
              : 'Try changing your search or filter.'}
          </p>
          {disputes.length === 0 && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Zap className="h-4 w-4 mr-2" />
              Create First Dispute
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-secondary-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100 bg-secondary-50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Dispute</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Bureau</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">FCRA Deadline</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredDisputes.map((dispute) => {
                  const meta = STATUS_META[dispute.status] || { label: dispute.status, badge: 'badge-secondary', dot: 'bg-secondary-400' };
                  const bMeta = dispute.target_bureau ? BUREAU_META[dispute.target_bureau] : null;
                  return (
                    <tr key={dispute.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-2 w-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                          <span className="text-sm font-semibold text-secondary-900">{dispute.dispute_number}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {bMeta ? (
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${bMeta.bg} ${bMeta.color} border ${bMeta.border}`}>
                            {(dispute.target_bureau || '').toUpperCase()}
                          </span>
                        ) : (
                          <span className="badge badge-secondary text-xs">ALL 3</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 capitalize">
                        {dispute.dispute_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${meta.badge}`}>{meta.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        {dispute.fcra_days_remaining !== null && dispute.fcra_days_remaining > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className={`h-3.5 w-3.5 ${dispute.fcra_days_remaining < 7 ? 'text-error-500' : 'text-secondary-400'}`} />
                            <span className={`text-sm font-medium ${dispute.fcra_days_remaining < 7 ? 'text-error-600' : 'text-secondary-600'}`}>
                              {dispute.fcra_days_remaining}d
                            </span>
                          </div>
                        ) : (
                          <span className="text-secondary-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-500">
                        {new Date(dispute.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedDispute(dispute)}
                          className="btn btn-ghost btn-sm text-secondary-500 hover:text-secondary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Dispute Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-900">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary-900">AI Dispute Generator</h2>
                  <p className="text-xs text-secondary-500">FCRA §611 + Metro 2 Compliant</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Basic Config */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="input-label">Dispute Type</label>
                  <select className="mt-1 w-full" value={createState.disputeType}
                    onChange={(e) => setCreateState(s => ({ ...s, disputeType: e.target.value }))}>
                    <option value="initial">Initial Dispute</option>
                    <option value="followup">Follow-Up</option>
                    <option value="escalation">Escalation (MOV)</option>
                    <option value="method_of_verification">Method of Verification</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Target Bureau</label>
                  <select className="mt-1 w-full" value={createState.bureau}
                    onChange={(e) => setCreateState(s => ({ ...s, bureau: e.target.value }))}>
                    <option value="all">All 3 Bureaus</option>
                    <option value="equifax">Equifax</option>
                    <option value="experian">Experian</option>
                    <option value="transunion">TransUnion</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Priority</label>
                  <select className="mt-1 w-full" value={createState.priority}
                    onChange={(e) => setCreateState(s => ({ ...s, priority: e.target.value }))}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* AI Reason Selector */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  <label className="text-sm font-semibold text-secondary-900">Select AI Dispute Reason</label>
                  <span className="badge badge-primary text-xs">AI Ranked by Strength</span>
                </div>
                <div className="space-y-2">
                  {AI_DISPUTE_REASONS.sort((a, b) => b.strength - a.strength).map((reason) => (
                    <label
                      key={reason.code}
                      className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3.5 transition-all ${
                        createState.selectedReason === reason.code
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-secondary-200 hover:border-primary-200 hover:bg-secondary-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.code}
                        checked={createState.selectedReason === reason.code}
                        onChange={() => setCreateState(s => ({ ...s, selectedReason: reason.code }))}
                        className="mt-0.5 text-primary-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-secondary-900">{reason.title}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-bold text-accent-600">{reason.strength}%</span>
                            <div className="w-16 h-1.5 rounded-full bg-secondary-200">
                              <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                                style={{ width: `${reason.strength}%` }} />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-secondary-500 mb-1.5">{reason.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                            <Shield className="h-3 w-3" />
                            {reason.statute}
                          </span>
                          <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-xs text-secondary-600">
                            {reason.category}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="input-label">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  className="mt-1 w-full resize-none"
                  placeholder="Any specific details about this dispute..."
                  value={createState.notes}
                  onChange={(e) => setCreateState(s => ({ ...s, notes: e.target.value }))}
                />
              </div>

              {/* Selected Reason Preview */}
              {selectedReason && (
                <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-primary-600" />
                    <p className="text-sm font-semibold text-primary-900">AI Will Generate</p>
                  </div>
                  <p className="text-xs text-primary-700">
                    A Metro 2-compliant dispute letter citing <strong>{selectedReason.statute}</strong>, arguing: "{selectedReason.description}"
                    {createState.bureau !== 'all' ? ` — sent to ${createState.bureau.charAt(0).toUpperCase() + createState.bureau.slice(1)}.` : ' — sent to all 3 bureaus.'}
                  </p>
                </div>
              )}

              {createState.error && (
                <div className="rounded-lg bg-error-50 border border-error-200 p-3">
                  <p className="text-sm text-error-700">{createState.error}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-secondary-100 bg-secondary-50">
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleCreateDispute}
                disabled={!createState.selectedReason || createState.isSubmitting}
                className="btn btn-primary flex-1 shadow-sm"
              >
                {createState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Generate Dispute
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDispute && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-900">Dispute Details</h2>
                <p className="text-sm text-secondary-500 font-mono">{selectedDispute.dispute_number}</p>
              </div>
              <button onClick={() => setSelectedDispute(null)} className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Status', content: <span className={`badge ${(STATUS_META[selectedDispute.status] || {}).badge || 'badge-secondary'}`}>{(STATUS_META[selectedDispute.status] || {}).label || selectedDispute.status}</span> },
                  { label: 'Bureau', content: <span className="font-semibold text-secondary-900">{(selectedDispute.target_bureau || 'All 3').toUpperCase()}</span> },
                  { label: 'Type', content: <span className="capitalize text-secondary-700">{selectedDispute.dispute_type.replace(/_/g, ' ')}</span> },
                  { label: 'Priority', content: <span className="capitalize font-medium text-secondary-700">{selectedDispute.priority}</span> },
                ].map((row) => (
                  <div key={row.label} className="rounded-lg bg-secondary-50 p-3">
                    <p className="text-xs text-secondary-500 mb-1">{row.label}</p>
                    {row.content}
                  </div>
                ))}
              </div>

              {selectedDispute.fcra_days_remaining !== null && selectedDispute.fcra_days_remaining > 0 && (
                <div className={`rounded-lg border p-4 ${selectedDispute.fcra_days_remaining < 7 ? 'border-error-200 bg-error-50' : 'border-warning-200 bg-warning-50'}`}>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-5 w-5 ${selectedDispute.fcra_days_remaining < 7 ? 'text-error-600' : 'text-warning-600'}`} />
                    <span className={`font-semibold text-sm ${selectedDispute.fcra_days_remaining < 7 ? 'text-error-800' : 'text-warning-800'}`}>
                      {selectedDispute.fcra_days_remaining} days remaining for bureau response (FCRA §611)
                    </span>
                  </div>
                  {selectedDispute.fcra_days_remaining < 7 && (
                    <p className="text-xs text-error-700 mt-1 ml-7">
                      Escalation letter will be auto-generated if no response received.
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-lg bg-secondary-50 border border-secondary-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary-600" />
                  <p className="text-sm font-semibold text-secondary-900">AI Status</p>
                </div>
                <p className="text-sm text-secondary-600">
                  {selectedDispute.status === 'submitted' && 'Dispute submitted. AI is monitoring the FCRA deadline and will auto-escalate if needed.'}
                  {selectedDispute.status === 'in_review' && 'Bureau is reviewing. AI will process the response and recommend next steps.'}
                  {selectedDispute.status === 'success' && 'Item successfully removed! AI has updated your score projection.'}
                  {selectedDispute.status === 'denied' && 'Bureau denied the dispute. AI is preparing an escalation / MOV letter.'}
                  {selectedDispute.status === 'draft' && 'Dispute draft created. Review and submit to begin the FCRA timeline.'}
                  {selectedDispute.status === 'escalated' && 'Escalation letter sent. Bureau has 15 additional days to respond under FCRA.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5 border-t border-secondary-100">
              <button onClick={() => setSelectedDispute(null)} className="btn btn-secondary flex-1">Close</button>
              {selectedDispute.status === 'denied' && (
                <button
                  onClick={() => { setSelectedDispute(null); navigate('/dashboard/legal-team'); }}
                  className="btn flex-1 bg-secondary-900 text-white hover:bg-secondary-800 shadow-sm"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Escalate to Attorney
                </button>
              )}
              {selectedDispute.status === 'draft' && (
                <button className="btn btn-primary flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Dispute
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
