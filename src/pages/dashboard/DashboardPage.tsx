import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  TrendingUp, TrendingDown, AlertTriangle, FileText, Clock,
  CheckCircle2, ArrowRight, Upload, MessageSquare, BarChart3,
  Target, Calendar, Brain, Zap, Sparkles, Shield, RefreshCw
} from 'lucide-react';

interface CreditScore {
  score: number;
  bureau: string;
  change: number;
  date: string;
}

interface Dispute {
  id: string;
  dispute_number: string;
  status: string;
  target_bureau: string;
  created_at: string;
  fcra_days_remaining: number | null;
}

function ScoreGauge({ score }: { score: number | null }) {
  const safeScore = score || 0;
  const min = 300;
  const max = 850;
  const pct = safeScore > 0 ? ((safeScore - min) / (max - min)) * 100 : 0;

  const getColor = (s: number) => {
    if (s >= 800) return '#22c55e';
    if (s >= 740) return '#4ade80';
    if (s >= 670) return '#0ea5e9';
    if (s >= 580) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = (s: number) => {
    if (s >= 800) return 'Excellent';
    if (s >= 740) return 'Very Good';
    if (s >= 670) return 'Good';
    if (s >= 580) return 'Fair';
    if (s > 0) return 'Poor';
    return 'No Data';
  };

  const color = safeScore > 0 ? getColor(safeScore) : '#94a3b8';
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (pct / 100) * (circumference * 0.75);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeLinecap="round" />
          <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease-out' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-secondary-900">
            {safeScore > 0 ? safeScore : '—'}
          </span>
          <span className="text-xs text-secondary-500 font-medium">avg score</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold" style={{ color }}>
        {getLabel(safeScore)}
      </span>
    </div>
  );
}

function AIInsightCard({ score, disputes }: { score: number | null; disputes: Dispute[] }) {
  const insights: string[] = [];

  if (!score || score === 0) {
    insights.push('Import your credit reports to unlock AI-powered analysis and dispute recommendations.');
  } else {
    if (score < 580) insights.push('Your score is in the "Poor" range. AI identifies accounts to dispute as the fastest path to improvement.');
    else if (score < 670) insights.push('Your score is "Fair". Removing derogatory marks could push you into the "Good" range within 60–90 days.');
    else if (score < 740) insights.push('Your score is "Good". Targeted disputes on any remaining negatives could reach "Very Good" soon.');
    else insights.push('Your score is strong! Focus on maintaining utilization below 10% for "Excellent" status.');
  }

  const activeCount = disputes.filter(d => ['submitted', 'in_review'].includes(d.status)).length;
  if (activeCount > 0) {
    insights.push(`${activeCount} dispute${activeCount > 1 ? 's' : ''} actively being processed. Bureaus must respond within 30 days under FCRA §611.`);
  }

  const urgent = disputes.filter(d => d.fcra_days_remaining !== null && d.fcra_days_remaining <= 7 && d.fcra_days_remaining > 0);
  if (urgent.length > 0) {
    insights.push(`${urgent.length} dispute${urgent.length > 1 ? 's' : ''} approaching the 30-day FCRA deadline. Escalation letters are being prepared automatically.`);
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-secondary-900 to-secondary-800 p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20">
          <Brain className="h-4 w-4 text-primary-300" />
        </div>
        <div>
          <p className="text-xs text-secondary-400 font-medium uppercase tracking-wide">AI Credit Advisor</p>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
            <p className="text-xs text-accent-400">Active</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary-200 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  draft: 'badge-secondary',
  submitted: 'badge-primary',
  in_review: 'badge-warning',
  success: 'badge-success',
  partial_success: 'badge-success',
  denied: 'badge-error',
  escalated: 'badge-warning',
};

export default function DashboardPage() {
  const { user, clientData, profile } = useAuth();
  const [creditScores, setCreditScores] = useState<CreditScore[]>([]);
  const [recentDisputes, setRecentDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientData?.id) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [clientData]);

  const loadData = async () => {
    try {
      const [scoresRes, disputesRes] = await Promise.all([
        supabase
          .from('credit_score_snapshots')
          .select('*')
          .eq('client_id', clientData?.id)
          .order('score_date', { ascending: false })
          .limit(6),
        supabase
          .from('disputes')
          .select('*')
          .eq('client_id', clientData?.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (scoresRes.data) {
        setCreditScores(scoresRes.data.map(s => ({
          score: s.score || 0,
          bureau: s.bureau,
          change: s.change_from_prior || 0,
          date: s.score_date,
        })));
      }
      if (disputesRes.data) setRecentDisputes(disputesRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const averageScore = creditScores.length > 0
    ? Math.round(creditScores.reduce((sum, s) => sum + s.score, 0) / creditScores.length)
    : null;

  const totalChange = creditScores.length > 1
    ? creditScores[0].score - creditScores[creditScores.length - 1].score
    : 0;

  const daysActive = clientData?.created_at
    ? Math.floor((Date.now() - new Date(clientData.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const bureauScores: Record<string, number> = {};
  creditScores.forEach(s => { bureauScores[s.bureau] = s.score; });

  const stats = [
    {
      label: 'Avg. Credit Score',
      value: averageScore ? String(averageScore) : '—',
      sub: totalChange !== 0 ? `${totalChange > 0 ? '+' : ''}${totalChange} pts total` : 'No change yet',
      icon: BarChart3,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      trend: totalChange > 0 ? 'up' : totalChange < 0 ? 'down' : null,
    },
    {
      label: 'Active Disputes',
      value: String(recentDisputes.filter(d => ['submitted', 'in_review'].includes(d.status)).length),
      sub: 'Being processed now',
      icon: RefreshCw,
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
      trend: null,
    },
    {
      label: 'Items Removed',
      value: String(recentDisputes.filter(d => d.status === 'success').length),
      sub: 'Negative items deleted',
      icon: CheckCircle2,
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
      trend: null,
    },
    {
      label: 'Days Active',
      value: String(daysActive),
      sub: 'Since enrollment',
      icon: Calendar,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      trend: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Free TransUnion Dispute Banner */}
      <div className="rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 p-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 flex-shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Free TransUnion Dispute Available</p>
            <p className="text-xs text-accent-100">No credit card needed — dispute 1 TransUnion item free every month</p>
          </div>
        </div>
        <Link to="/dashboard/disputes" className="btn bg-white text-accent-700 hover:bg-accent-50 btn-sm flex-shrink-0 shadow-sm font-bold">
          Dispute Free
          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
        </Link>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary-900 via-secondary-800 to-primary-900 px-6 py-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-900/50" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-600/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              <p className="text-xs text-accent-400 font-semibold uppercase tracking-wide">AI Engine Running</p>
            </div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="mt-1.5 text-secondary-300 text-sm">
              Your AI credit advisor is actively monitoring and disputing on your behalf.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/dashboard/credit-reports" className="btn bg-white text-secondary-900 hover:bg-secondary-50 btn-sm shadow-sm">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Import Report
              </Link>
              <Link to="/dashboard/disputes" className="btn border border-white/30 text-white hover:bg-white/10 btn-sm">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                New Dispute
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ScoreGauge score={averageScore} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white border border-secondary-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-secondary-500">{stat.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
              {stat.trend === 'up' && <TrendingUp className="h-5 w-5 text-accent-500 mb-1" />}
              {stat.trend === 'down' && <TrendingDown className="h-5 w-5 text-error-500 mb-1" />}
            </div>
            <p className="text-xs text-secondary-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Bureau Scores Row */}
      {Object.keys(bureauScores).length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { key: 'equifax', label: 'Equifax', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
            { key: 'experian', label: 'Experian', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
            { key: 'transunion', label: 'TransUnion', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
          ].map((b) => (
            <div key={b.key} className={`rounded-xl border ${b.border} ${b.bg} p-5 flex items-center gap-4`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm font-bold text-lg ${b.color}`}>
                {b.label[0]}
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500">{b.label}</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {bureauScores[b.key] || '—'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Disputes */}
        <div className="lg:col-span-3 rounded-xl bg-white border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-100">
            <h2 className="text-base font-semibold text-secondary-900">Recent Disputes</h2>
            <Link to="/dashboard/disputes" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : recentDisputes.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100 mb-3">
                  <FileText className="h-7 w-7 text-secondary-400" />
                </div>
                <p className="text-secondary-600 font-medium">No disputes yet</p>
                <p className="text-sm text-secondary-500 mt-1">Import a report first, then the AI will suggest what to dispute.</p>
                <Link to="/dashboard/credit-reports" className="btn btn-primary btn-sm mt-4">
                  Import Credit Report
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100">
                {recentDisputes.slice(0, 5).map((dispute) => (
                  <div key={dispute.id} className="flex items-center justify-between py-3 px-2 hover:bg-secondary-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                        dispute.status === 'success' ? 'bg-accent-500' :
                        dispute.status === 'in_review' ? 'bg-warning-500' :
                        dispute.status === 'denied' ? 'bg-error-500' :
                        'bg-primary-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{dispute.dispute_number}</p>
                        <p className="text-xs text-secondary-500">
                          {(dispute.target_bureau || 'All').toUpperCase()} • {new Date(dispute.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-xs ${statusColors[dispute.status] || 'badge-secondary'}`}>
                        {dispute.status.replace(/_/g, ' ')}
                      </span>
                      {dispute.fcra_days_remaining !== null && dispute.fcra_days_remaining > 0 && (
                        <p className={`text-xs mt-1 ${dispute.fcra_days_remaining < 7 ? 'text-error-600 font-medium' : 'text-secondary-400'}`}>
                          {dispute.fcra_days_remaining}d left
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Insights */}
          <AIInsightCard score={averageScore} disputes={recentDisputes} />

          {/* Quick Actions */}
          <div className="rounded-xl bg-white border border-secondary-200 shadow-sm p-4">
            <p className="text-sm font-semibold text-secondary-700 mb-3">Quick Actions</p>
            <div className="space-y-2">
              {[
                { to: '/dashboard/credit-reports', icon: Upload, label: 'Import Credit Report', color: 'text-primary-600 bg-primary-50' },
                { to: '/dashboard/disputes', icon: Zap, label: 'Create New Dispute', color: 'text-warning-600 bg-warning-50' },
                { to: '/dashboard/progress', icon: BarChart3, label: 'View Score History', color: 'text-accent-600 bg-accent-50' },
                { to: '/dashboard/documents', icon: FileText, label: 'Upload Documents', color: 'text-secondary-600 bg-secondary-100' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-secondary-50 transition-colors group"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-secondary-700 group-hover:text-secondary-900">{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-secondary-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FCRA Info Banner */}
      <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 flex-shrink-0">
            <Shield className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-900">Your FCRA Rights Are Being Enforced</h3>
            <p className="text-sm text-primary-700 mt-1">
              Under FCRA §611, credit bureaus must investigate disputes within 30 days (37 if additional info is submitted).
              Our AI tracks every deadline and auto-escalates if bureaus fail to respond in time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
