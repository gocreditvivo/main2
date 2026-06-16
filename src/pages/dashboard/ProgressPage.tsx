import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  TrendingUp, Target, Award, Calendar, BarChart3,
  CheckCircle2, Clock, Brain, Sparkles, ArrowUp, ArrowDown,
  Zap, Shield, CreditCard, AlertTriangle
} from 'lucide-react';

interface ScoreSnapshot {
  id: string;
  bureau: string;
  score: number | null;
  score_date: string;
  change_from_prior: number | null;
}

const SCORE_RANGES = [
  { min: 800, max: 850, label: 'Exceptional', color: '#22c55e', bg: 'bg-success-100', text: 'text-success-700' },
  { min: 740, max: 799, label: 'Very Good', color: '#4ade80', bg: 'bg-success-50', text: 'text-success-600' },
  { min: 670, max: 739, label: 'Good', color: '#0ea5e9', bg: 'bg-primary-100', text: 'text-primary-700' },
  { min: 580, max: 669, label: 'Fair', color: '#f59e0b', bg: 'bg-warning-100', text: 'text-warning-700' },
  { min: 300, max: 579, label: 'Poor', color: '#ef4444', bg: 'bg-error-100', text: 'text-error-700' },
];

function getScoreRange(score: number) {
  return SCORE_RANGES.find(r => score >= r.min && score <= r.max) || SCORE_RANGES[SCORE_RANGES.length - 1];
}

function MiniBarChart({ scores }: { scores: ScoreSnapshot[] }) {
  if (scores.length === 0) return null;
  const max = Math.max(...scores.map(s => s.score || 0));
  const min = Math.min(...scores.map(s => s.score || 0));
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1.5 h-16">
      {scores.slice(-12).map((s, i) => {
        const pct = ((s.score || 0) - min) / range;
        const height = Math.max(15, Math.round(pct * 100));
        const range_ = getScoreRange(s.score || 0);
        return (
          <div
            key={s.id}
            className="flex-1 rounded-t transition-all"
            style={{ height: `${height}%`, backgroundColor: range_.color, opacity: 0.7 + (i / scores.length) * 0.3 }}
            title={`${s.score} — ${new Date(s.score_date).toLocaleDateString()}`}
          />
        );
      })}
    </div>
  );
}

const AI_RECOMMENDATIONS = [
  {
    icon: CreditCard,
    title: 'Reduce credit utilization to under 10%',
    impact: '+35 pts potential',
    priority: 'high',
  },
  {
    icon: CheckCircle2,
    title: 'Pay all bills on time for 6+ months',
    impact: '+40 pts potential',
    priority: 'high',
  },
  {
    icon: Clock,
    title: 'Keep oldest accounts open — length matters',
    impact: '+15 pts potential',
    priority: 'medium',
  },
  {
    icon: AlertTriangle,
    title: 'Avoid new hard inquiries for 90 days',
    impact: '+10 pts potential',
    priority: 'medium',
  },
  {
    icon: Shield,
    title: 'Become authorized user on a trusted account',
    impact: '+25 pts potential',
    priority: 'low',
  },
];

export default function ProgressPage() {
  const { clientData } = useAuth();
  const [scores, setScores] = useState<ScoreSnapshot[]>([]);
  const [targetScore, setTargetScore] = useState(750);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientData?.id) loadData();
    else setIsLoading(false);
  }, [clientData]);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from('credit_score_snapshots')
        .select('*')
        .eq('client_id', clientData?.id)
        .order('score_date', { ascending: true });
      if (data) setScores(data);
    } catch (err) {
      console.error('Error loading progress data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const latestScore = scores[scores.length - 1];
  const firstScore = scores[0];
  const totalImprovement = latestScore?.score && firstScore?.score
    ? latestScore.score - firstScore.score : 0;

  const currentScore = latestScore?.score || 0;
  const progressPct = currentScore > 0
    ? Math.min(100, Math.max(0, ((currentScore - (firstScore?.score || 300)) / (targetScore - (firstScore?.score || 300))) * 100))
    : 0;

  const scoreRange = getScoreRange(currentScore);

  // Latest per bureau
  const bureauLatest: Record<string, number> = {};
  scores.forEach(s => {
    if (!bureauLatest[s.bureau] || new Date(s.score_date) > new Date(scores.find(x => x.bureau === s.bureau && bureauLatest[s.bureau] === x.score)?.score_date || '')) {
      bureauLatest[s.bureau] = s.score || 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Progress Tracker</h1>
        <p className="mt-1 text-secondary-500 text-sm">
          AI-powered score monitoring with predictive improvement modeling.
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Current Score Card */}
        <div className={`rounded-2xl border-2 p-6 text-center ${scoreRange.bg} ${scoreRange.bg.replace('bg-', 'border-').replace('-100', '-200').replace('-50', '-100')}`}>
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3">Average Score</p>
          <div className="relative inline-block">
            <div className="text-6xl font-bold" style={{ color: scoreRange.color }}>
              {currentScore || '—'}
            </div>
          </div>
          <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${scoreRange.text} bg-white/60`}>
            {scoreRange.label}
          </div>
          {totalImprovement !== 0 && (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {totalImprovement > 0
                ? <ArrowUp className="h-4 w-4 text-accent-500" />
                : <ArrowDown className="h-4 w-4 text-error-500" />
              }
              <span className={`text-sm font-semibold ${totalImprovement > 0 ? 'text-accent-600' : 'text-error-600'}`}>
                {totalImprovement > 0 ? '+' : ''}{totalImprovement} pts since start
              </span>
            </div>
          )}
        </div>

        {/* Goal Progress */}
        <div className="rounded-2xl border border-secondary-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-secondary-700">Goal Progress</p>
            <Target className="h-5 w-5 text-primary-500" />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-secondary-500">Current: {currentScore || 'N/A'}</span>
            <span className="text-xs text-secondary-500">Target: {targetScore}</span>
          </div>
          <div className="h-3 rounded-full bg-secondary-100 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-secondary-500 text-center mb-4">
            {targetScore - currentScore > 0 ? `${targetScore - currentScore} points to goal` : 'Goal achieved!'}
          </p>

          <div className="mt-2">
            <label className="text-xs text-secondary-500 mb-1 block">Adjust target</label>
            <input
              type="range"
              min={600}
              max={850}
              step={10}
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-secondary-400 mt-1">
              <span>600</span>
              <span className="font-semibold text-primary-600">{targetScore}</span>
              <span>850</span>
            </div>
          </div>
        </div>

        {/* Bureau Breakdown */}
        <div className="rounded-2xl border border-secondary-200 bg-white p-6">
          <p className="text-sm font-semibold text-secondary-700 mb-4">Bureau Breakdown</p>
          <div className="space-y-3">
            {[
              { key: 'equifax', label: 'Equifax', color: '#ef4444', bg: 'bg-red-100' },
              { key: 'experian', label: 'Experian', color: '#3b82f6', bg: 'bg-blue-100' },
              { key: 'transunion', label: 'TransUnion', color: '#22c55e', bg: 'bg-green-100' },
            ].map((b) => {
              const score = bureauLatest[b.key] || 0;
              const pct = score > 0 ? ((score - 300) / 550) * 100 : 0;
              return (
                <div key={b.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-md ${b.bg} flex items-center justify-center text-xs font-bold`}
                        style={{ color: b.color }}>
                        {b.label[0]}
                      </div>
                      <span className="text-xs font-medium text-secondary-600">{b.label}</span>
                    </div>
                    <span className="text-sm font-bold text-secondary-900">{score || '—'}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score History Chart */}
      <div className="rounded-2xl bg-white border border-secondary-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-secondary-900">Score History</h2>
            <p className="text-xs text-secondary-500 mt-0.5">All bureaus over time</p>
          </div>
          <BarChart3 className="h-5 w-5 text-secondary-400" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-14 w-14 text-secondary-200 mx-auto mb-3" />
            <p className="text-secondary-500 font-medium">No score history yet</p>
            <p className="text-sm text-secondary-400 mt-1">Import a credit report to start tracking</p>
          </div>
        ) : (
          <>
            <MiniBarChart scores={scores} />
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-100">
                    {['Date', 'Bureau', 'Score', 'Change', 'Category'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {scores.slice().reverse().map((score) => {
                    const range = getScoreRange(score.score || 0);
                    return (
                      <tr key={score.id} className="hover:bg-secondary-50">
                        <td className="px-3 py-3 text-sm text-secondary-600">
                          {new Date(score.score_date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3">
                          <span className="badge badge-secondary capitalize text-xs">{score.bureau}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-sm font-bold text-secondary-900">{score.score}</span>
                        </td>
                        <td className="px-3 py-3">
                          {score.change_from_prior !== null && (
                            <div className="flex items-center gap-1">
                              {score.change_from_prior > 0
                                ? <ArrowUp className="h-3.5 w-3.5 text-accent-500" />
                                : score.change_from_prior < 0
                                ? <ArrowDown className="h-3.5 w-3.5 text-error-500" />
                                : null
                              }
                              <span className={`text-sm font-semibold ${score.change_from_prior >= 0 ? 'text-accent-600' : 'text-error-600'}`}>
                                {score.change_from_prior > 0 ? '+' : ''}{score.change_from_prior}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${range.bg} ${range.text}`}>
                            {range.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="rounded-2xl border border-secondary-800 bg-secondary-900 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/20">
            <Brain className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Credit Recommendations</p>
            <p className="text-xs text-secondary-400">Personalized actions to boost your score</p>
          </div>
        </div>

        <div className="space-y-3">
          {AI_RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg bg-secondary-800/60 p-4 hover:bg-secondary-800 transition-colors">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                rec.priority === 'high' ? 'bg-error-500/20' :
                rec.priority === 'medium' ? 'bg-warning-500/20' :
                'bg-primary-500/20'
              }`}>
                <rec.icon className={`h-4 w-4 ${
                  rec.priority === 'high' ? 'text-error-400' :
                  rec.priority === 'medium' ? 'text-warning-400' :
                  'text-primary-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{rec.title}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                <span className="text-xs font-semibold text-accent-400">{rec.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
