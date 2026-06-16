import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Upload, FileText, Calendar, AlertCircle,
  CheckCircle2, Clock, X, Eye, Brain, Zap,
  TrendingUp, AlertTriangle, Shield, Sparkles
} from 'lucide-react';

interface CreditReport {
  id: string;
  bureau: string;
  report_date: string;
  report_type: string;
  processing_status: string;
  imported_at: string;
  file_name: string | null;
}

interface CreditItem {
  id: string;
  account_name: string;
  item_type: string;
  account_status: string;
  current_balance: number | null;
  derogatory: boolean;
  dispute_candidate: boolean;
}

const BUREAU_META = {
  equifax: { label: 'Equifax', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', light: 'bg-red-100' },
  experian: { label: 'Experian', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', light: 'bg-blue-100' },
  transunion: { label: 'TransUnion', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', light: 'bg-green-100' },
};

export default function CreditReportsPage() {
  const { clientData } = useAuth();
  const [reports, setReports] = useState<CreditReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CreditReport | null>(null);
  const [items, setItems] = useState<CreditItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadBureau, setUploadBureau] = useState<string>('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'derogatory' | 'candidates'>('all');

  useEffect(() => {
    if (clientData?.id) loadReports();
    else setIsLoading(false);
  }, [clientData]);

  const loadReports = async () => {
    try {
      const { data } = await supabase
        .from('credit_reports')
        .select('*')
        .eq('client_id', clientData?.id)
        .order('imported_at', { ascending: false });
      setReports(data || []);
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReportItems = async (reportId: string) => {
    const { data } = await supabase
      .from('credit_items')
      .select('*')
      .eq('credit_report_id', reportId)
      .order('derogatory', { ascending: false });
    setItems(data || []);
  };

  const handleViewReport = (report: CreditReport) => {
    setSelectedReport(report);
    loadReportItems(report.id);
    setActiveTab('all');
  };

  const getStatusIcon = (status: string) => {
    if (status === 'processed') return <CheckCircle2 className="h-5 w-5 text-accent-500" />;
    if (status === 'processing') return <Clock className="h-5 w-5 text-warning-500 animate-spin" />;
    if (status === 'error') return <AlertCircle className="h-5 w-5 text-error-500" />;
    return <Clock className="h-5 w-5 text-secondary-400" />;
  };

  const bureauCoverage = ['equifax', 'experian', 'transunion'].map(bureau => ({
    bureau,
    meta: BUREAU_META[bureau as keyof typeof BUREAU_META],
    report: reports.find(r => r.bureau === bureau),
  }));

  const filteredItems = items.filter(item => {
    if (activeTab === 'derogatory') return item.derogatory;
    if (activeTab === 'candidates') return item.dispute_candidate;
    return true;
  });

  const derogatoryCount = items.filter(i => i.derogatory).length;
  const candidateCount = items.filter(i => i.dispute_candidate).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Credit Reports</h1>
          <p className="mt-1 text-secondary-500 text-sm">
            AI analyzes every account, inquiry, and public record across all 3 bureaus.
          </p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary shadow-sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Report
        </button>
      </div>

      {/* Bureau Coverage Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {bureauCoverage.map(({ bureau, meta, report }) => (
          <div
            key={bureau}
            className={`rounded-xl border-2 p-5 cursor-pointer transition-all ${
              report
                ? `${meta.border} ${meta.bg} hover:shadow-md`
                : 'border-dashed border-secondary-200 bg-white hover:border-primary-300 hover:bg-primary-50'
            }`}
            onClick={() => report ? handleViewReport(report) : setShowUploadModal(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg ${report ? `${meta.light} ${meta.color}` : 'bg-secondary-100 text-secondary-400'}`}>
                {meta.label[0]}
              </div>
              {report ? getStatusIcon(report.processing_status) : (
                <Upload className="h-4 w-4 text-secondary-400" />
              )}
            </div>
            <p className={`font-semibold text-sm ${report ? meta.color : 'text-secondary-500'}`}>{meta.label}</p>
            {report ? (
              <div className="mt-1">
                <p className="text-xs text-secondary-500">
                  Imported {new Date(report.imported_at).toLocaleDateString()}
                </p>
                <p className={`text-xs font-medium mt-0.5 ${report.processing_status === 'processed' ? 'text-accent-600' : 'text-warning-600'}`}>
                  {report.processing_status === 'processed' ? 'AI Analysis Complete' : 'Processing...'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-secondary-400 mt-1">Click to import</p>
            )}
          </div>
        ))}
      </div>

      {/* Info banner if no reports */}
      {reports.length === 0 && !isLoading && (
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Get your free credit reports</p>
              <p className="text-sm text-primary-700 mt-1">
                Download your free reports at{' '}
                <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                  AnnualCreditReport.com
                </a>
                {' '}(free weekly). Then import them here for AI analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      {isLoading ? (
        <div className="rounded-xl bg-white border border-secondary-200 flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm text-secondary-500">Loading reports...</p>
          </div>
        </div>
      ) : reports.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const meta = BUREAU_META[report.bureau as keyof typeof BUREAU_META] || {
              label: report.bureau,
              color: 'text-secondary-600',
              bg: 'bg-secondary-50',
              border: 'border-secondary-200',
              light: 'bg-secondary-100',
            };
            return (
              <div
                key={report.id}
                className="rounded-xl bg-white border border-secondary-200 shadow-sm hover:shadow-elevated transition-all cursor-pointer group"
                onClick={() => handleViewReport(report)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-lg ${meta.light} ${meta.color}`}>
                      {meta.label[0]}
                    </div>
                    {getStatusIcon(report.processing_status)}
                  </div>
                  <h3 className={`font-semibold text-sm mb-0.5 ${meta.color}`}>{meta.label}</h3>
                  <p className="text-xs text-secondary-500">
                    {report.file_name || 'Credit Report'}
                  </p>
                  <div className="mt-4 space-y-1.5 text-xs text-secondary-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Report: {new Date(report.report_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {report.report_type}
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <button className={`btn w-full text-sm ${meta.bg} ${meta.color} border ${meta.border} hover:opacity-90`}>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View AI Analysis
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-backdrop">
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100">
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-secondary-900">AI Analysis Report</h2>
                </div>
                <p className="text-sm text-secondary-500 mt-0.5">
                  {BUREAU_META[selectedReport.bureau as keyof typeof BUREAU_META]?.label || selectedReport.bureau}
                  {' '}• {new Date(selectedReport.report_date).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stats Row */}
            {items.length > 0 && (
              <div className="grid grid-cols-3 gap-px bg-secondary-100">
                <div className="bg-white px-6 py-3 text-center">
                  <p className="text-2xl font-bold text-secondary-900">{items.length}</p>
                  <p className="text-xs text-secondary-500">Total Items</p>
                </div>
                <div className={`px-6 py-3 text-center ${derogatoryCount > 0 ? 'bg-error-50' : 'bg-white'}`}>
                  <p className={`text-2xl font-bold ${derogatoryCount > 0 ? 'text-error-600' : 'text-secondary-900'}`}>{derogatoryCount}</p>
                  <p className="text-xs text-secondary-500">Derogatory</p>
                </div>
                <div className={`px-6 py-3 text-center ${candidateCount > 0 ? 'bg-warning-50' : 'bg-white'}`}>
                  <p className={`text-2xl font-bold ${candidateCount > 0 ? 'text-warning-600' : 'text-secondary-900'}`}>{candidateCount}</p>
                  <p className="text-xs text-secondary-500">Dispute Candidates</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            {items.length > 0 && (
              <div className="flex border-b border-secondary-100">
                {[
                  { key: 'all', label: `All Items (${items.length})` },
                  { key: 'derogatory', label: `Derogatory (${derogatoryCount})` },
                  { key: 'candidates', label: `Dispute Candidates (${candidateCount})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'border-b-2 border-primary-600 text-primary-700 bg-primary-50/50'
                        : 'text-secondary-500 hover:text-secondary-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <div className="p-5 max-h-[50vh] overflow-y-auto space-y-2">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                  <p className="text-secondary-500">No items found in this report</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-10 w-10 text-accent-400 mx-auto mb-2" />
                  <p className="text-secondary-500 text-sm">No items in this category</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 ${
                      item.derogatory ? 'border-error-200 bg-error-50' : 'border-secondary-200 bg-secondary-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-secondary-900 text-sm">{item.account_name || 'Unknown Account'}</p>
                        <p className="text-xs text-secondary-500 mt-0.5">
                          {item.item_type} • {item.account_status || 'Active'}
                          {item.current_balance != null && ` • Balance: $${item.current_balance.toLocaleString()}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {item.derogatory && <span className="badge badge-error text-xs">Derogatory</span>}
                        {item.dispute_candidate && (
                          <span className="inline-flex items-center gap-1 badge bg-warning-100 text-warning-700 text-xs">
                            <Zap className="h-3 w-3" />
                            AI: Dispute
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-secondary-100 bg-secondary-50">
              <button onClick={() => setSelectedReport(null)} className="btn btn-secondary flex-1">
                Close
              </button>
              {candidateCount > 0 && (
                <button className="btn btn-primary flex-1 shadow-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Dispute All {candidateCount} Items with AI
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Import Credit Report</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="input-label">Select Bureau *</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {Object.entries(BUREAU_META).map(([key, meta]) => (
                    <label key={key} className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                      uploadBureau === key
                        ? `${meta.border} ${meta.bg} ring-2 ring-primary-300`
                        : 'border-secondary-200 hover:border-primary-200'
                    }`}>
                      <input type="radio" name="bureau" value={key} checked={uploadBureau === key}
                        onChange={() => setUploadBureau(key)} className="sr-only" />
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${meta.light} ${meta.color}`}>
                        {meta.label[0]}
                      </div>
                      <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">Report Date *</label>
                <input type="date" className="mt-1 w-full" value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)} />
              </div>

              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-8 text-center hover:border-primary-300 hover:bg-primary-50/50 transition-colors cursor-pointer">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-100 mx-auto mb-4">
                  <Upload className="h-7 w-7 text-secondary-400" />
                </div>
                <p className="text-sm font-medium text-secondary-700">
                  Drop your report here, or{' '}
                  <span className="text-primary-600 cursor-pointer underline">browse</span>
                </p>
                <p className="mt-2 text-xs text-secondary-400">PDF, JPG, PNG — Max 10MB</p>
              </div>

              <div className="rounded-lg bg-accent-50 border border-accent-200 p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent-600 flex-shrink-0" />
                  <p className="text-xs text-accent-700">
                    Your reports are encrypted with 256-bit AES and never shared with third parties.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5 border-t border-secondary-100">
              <button onClick={() => setShowUploadModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button className="btn btn-primary flex-1 shadow-sm" disabled={!uploadBureau}>
                <Brain className="h-4 w-4 mr-2" />
                Import & Analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
