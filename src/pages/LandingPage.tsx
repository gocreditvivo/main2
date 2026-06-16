import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, TrendingUp, Zap, CheckCircle2, ArrowRight, Star,
  Lock, BarChart3, Brain, RefreshCw, FileSearch, Award,
  ChevronDown, Menu, X, Sparkles, Clock, Target, Users,
  AlertTriangle, Building2, CreditCard, ChevronUp, Mail,
  Phone, MapPin, MessageSquare, Scale, BookOpen, FileText,
  Gavel, BarChart2, GraduationCap, Send, Truck
} from 'lucide-react';
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return scrolled;
}

function Header() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100' : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-secondary-900' : 'text-white'}`}>
              Credit<span className="text-primary-400"> Vivo</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {['Features', 'How It Works', 'Pricing', 'FAQ', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className={`text-sm font-medium transition-colors hover:text-primary-400 ${scrolled ? 'text-secondary-600' : 'text-white/80'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className={`text-sm font-medium transition-colors ${scrolled ? 'text-secondary-600 hover:text-secondary-900' : 'text-white/80 hover:text-white'}`}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary shadow-sm">
              Start Free — No Card Needed
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen
              ? <X className={`h-6 w-6 ${scrolled ? 'text-secondary-700' : 'text-white'}`} />
              : <Menu className={`h-6 w-6 ${scrolled ? 'text-secondary-700' : 'text-white'}`} />
            }
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-secondary-100 px-4 py-6 space-y-4 shadow-lg">
          {['Features', 'How It Works', 'Pricing', 'FAQ', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="block text-sm font-medium text-secondary-700 hover:text-primary-600"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="pt-4 border-t border-secondary-100 flex flex-col gap-3">
            <Link to="/login" className="btn btn-secondary w-full">Sign In</Link>
            <Link to="/register" className="btn btn-primary w-full">Start Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary-900 pt-16">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-950 via-secondary-900 to-primary-950" />
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Automated Credit Repair — Licensed in Virginia · CROA Compliant
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Dispute Credit Errors
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              with AI + Attorneys
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary-300 sm:text-xl leading-relaxed">
            Our AI analyzes all 3 bureau reports, identifies potentially disputable items, generates FCRA-compliant letters, and tracks responses — automatically, 24/7. Attorney escalation available for complex cases.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="btn btn-primary btn-lg w-full sm:w-auto shadow-lg shadow-primary-900/50">
              Get Your Free Credit Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="btn btn-lg w-full sm:w-auto border border-white/20 text-white hover:bg-white/10">
              See How It Works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-secondary-400">
            {[
              'No upfront fees (CROA compliant)',
              '3-day right of cancellation',
              'Cancel anytime',
              'You may also dispute directly with bureaus for free',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Score mockup card */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-1 shadow-2xl">
            <div className="rounded-xl bg-secondary-800/80 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400">AI Credit Engine</p>
                    <p className="text-sm font-semibold text-white">Analyzing your reports...</p>
                  </div>
                </div>
                <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30">Live</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { bureau: 'Equifax', score: 612, change: '+47', color: 'text-red-400' },
                  { bureau: 'Experian', score: 628, change: '+52', color: 'text-blue-400' },
                  { bureau: 'TransUnion', score: 619, change: '+61', color: 'text-green-400' },
                ].map((b) => (
                  <div key={b.bureau} className="rounded-lg bg-secondary-900/50 p-4 text-center">
                    <p className={`text-xs font-medium ${b.color} mb-1`}>{b.bureau}</p>
                    <p className="text-2xl font-bold text-white">{b.score}</p>
                    <p className="text-xs font-medium text-accent-400 mt-1">{b.change} pts</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Late Payment — Capital One', status: 'Removed', color: 'text-accent-400' },
                  { label: 'Collection — Medical $847', status: 'Disputed', color: 'text-warning-400' },
                  { label: 'Incorrect Address — Experian', status: 'Corrected', color: 'text-accent-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-secondary-900/30 px-4 py-2.5">
                    <p className="text-sm text-secondary-300">{item.label}</p>
                    <span className={`text-xs font-semibold ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

function TrustBar() {
  return (
    <section className="py-12 bg-white border-b border-secondary-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium text-secondary-400 mb-2 uppercase tracking-wide">
          Based on client outcomes — individual results vary. See disclaimer below.
        </p>
        <p className="text-center text-sm font-semibold text-secondary-600 mb-8">
          Trusted by 50,000+ clients across the U.S.
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: '50K+', label: 'Clients Served', icon: Users },
            { value: '127 pts', label: 'Avg. Score Change*', icon: TrendingUp },
            { value: '89%', label: 'Dispute Response Rate*', icon: Target },
            { value: '4.9 / 5', label: 'Google Rating', icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <Icon className="h-5 w-5 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-secondary-900">{value}</p>
              <p className="text-sm text-secondary-500">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-secondary-400 mt-6">
          * Average score change and dispute response rate based on clients who completed a full dispute cycle. Individual results vary and are not guaranteed.
          You have the right to dispute inaccurate information directly with credit bureaus at no charge.
        </p>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Report Analysis',
      description: 'Our engine reads all 3 bureau reports and flags every inaccuracy, outdated item, and FCRA violation automatically — in seconds.',
      tag: 'Core AI',
    },
    {
      icon: Zap,
      title: 'Instant Dispute Generation',
      description: 'AI drafts Metro 2-compliant, FCRA §611 dispute letters for each identified item with the legally strongest dispute reason.',
      tag: 'Automation',
    },
    {
      icon: RefreshCw,
      title: 'Automated Follow-Ups',
      description: 'We track the 30-day FCRA deadline for every dispute and automatically escalate with Method of Verification and e-OSCAR follow-ups.',
      tag: 'FCRA Compliant',
    },
    {
      icon: BarChart3,
      title: 'Live Score Tracking',
      description: 'Real-time score monitoring across Equifax, Experian, and TransUnion with predictive AI modeling of your score trajectory.',
      tag: 'Monitoring',
    },
    {
      icon: FileSearch,
      title: 'Full Audit Trail',
      description: 'Every letter sent, every bureau response, every deletion logged. Your complete credit repair history in one place.',
      tag: 'Transparency',
    },
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: '256-bit AES encryption, SOC 2 Type II certified, HIPAA-compliant. Your data never leaves our secure US-based servers.',
      tag: 'Security',
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Sparkles className="h-3.5 w-3.5" />
            Fully Automated — Zero Human Delay
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            Everything the big agencies don't want you to know
          </h2>
          <p className="mt-4 text-lg text-secondary-600 max-w-2xl mx-auto">
            Our AI does in minutes what traditional credit repair firms charge thousands for over months.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm hover:shadow-elevated hover:border-primary-200 transition-all duration-300"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-600">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">{feature.title}</h3>
              <p className="text-secondary-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up & Import Reports',
      description: 'Create your free account and import your credit reports from Equifax, Experian, and TransUnion. We support PDF uploads and direct connections.',
      icon: FileSearch,
    },
    {
      number: '02',
      title: 'AI Scans Everything',
      description: 'Our AI engine analyzes every account, inquiry, public record, and remark. It identifies errors, outdated info, and FCRA violations within seconds.',
      icon: Brain,
    },
    {
      number: '03',
      title: 'Disputes Fire Automatically',
      description: 'Metro 2-compliant, legally optimized letters are sent to all relevant bureaus. We track every 30-day FCRA deadline and escalate automatically.',
      icon: Zap,
    },
    {
      number: '04',
      title: 'Watch Your Score Rise',
      description: 'Get notified as negative items are deleted. Monitor your score improvement across all 3 bureaus from your live dashboard.',
      icon: TrendingUp,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            From signup to results in 4 steps
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Fully automated. No phone calls. No paperwork. No waiting.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-0 right-0 hidden h-0.5 lg:block bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary-100" />
                  <div className="absolute inset-2 rounded-full bg-primary-600 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-900 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{step.title}</h3>
                <p className="text-sm text-secondary-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/register" className="btn btn-primary btn-lg shadow-sm">
            Start My Free Analysis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AIEngine() {
  const disputeReasons = [
    { reason: 'Not mine (FCRA §605B)', type: 'Identity', strength: 95 },
    { reason: 'Inaccurate balance (Metro 2)', type: 'Factual', strength: 88 },
    { reason: 'Obsolete (7-year rule §605)', type: 'Statutory', strength: 92 },
    { reason: 'Unverifiable debt (§611)', type: 'Procedural', strength: 78 },
    { reason: 'Duplicate tradeline', type: 'Factual', strength: 85 },
    { reason: 'Incorrect payment history', type: 'Factual', strength: 80 },
  ];

  return (
    <section className="py-24 bg-secondary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/20 px-4 py-1.5 text-sm font-medium text-primary-300">
              <Brain className="h-3.5 w-3.5" />
              Proprietary AI Technology
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              The smartest dispute engine
              <br />
              <span className="text-primary-400">ever built</span>
            </h2>
            <p className="text-secondary-300 text-lg mb-8 leading-relaxed">
              Our AI is trained on FCRA case law, Metro 2 compliance standards, and millions of successful disputes. It picks the legally strongest dispute reason for each item — maximizing your deletion rate.
            </p>

            <div className="space-y-4">
              {[
                'Understands all Metro 2 field codes',
                'Cites exact FCRA statute sections',
                'Learns from bureau response patterns',
                'Escalates to e-OSCAR when needed',
                'Drafts goodwill letters for paid collections',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500/20 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-accent-400" />
                  </div>
                  <p className="text-secondary-300 text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-secondary-800/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
              <p className="text-sm font-medium text-white">AI Dispute Reason Selector</p>
            </div>

            <div className="space-y-3">
              {disputeReasons.map((item, i) => (
                <div key={i} className="rounded-lg bg-secondary-900/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{item.reason}</p>
                    <span className="text-xs font-semibold text-accent-400">{item.strength}% strength</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        style={{ width: `${item.strength}%` }}
                      />
                    </div>
                    <span className="text-xs text-secondary-400 flex-shrink-0">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Start disputing with TransUnion today',
      badge: 'NO CARD NEEDED',
      badgeColor: 'bg-accent-500',
      features: [
        'Free TransUnion dispute (1 item/mo)',
        'Credit score snapshot',
        'AI dispute reason selector',
        'FCRA-compliant letter generated',
        'Basic score tracking',
        'Access to Learning Center',
      ],
      highlighted: false,
      cta: 'Start Free — No Card',
      ctaClass: 'btn-secondary',
      border: 'border-accent-300',
    },
    {
      name: 'Growth',
      price: '129',
      description: 'Most popular — all 3 bureaus, unlimited',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-accent-500',
      features: [
        'Everything in Free',
        'All 3 bureaus — unlimited disputes',
        'Auto-escalation & follow-up',
        'Physical certified mail letters',
        'Goodwill + debt validation letters',
        'Legal Shield attorney escalation',
        'Live score alerts',
      ],
      highlighted: true,
      cta: 'Get Started — Best Value',
      ctaClass: '',
      border: '',
    },
    {
      name: 'Elite',
      price: '199',
      description: 'For complex credit situations',
      badge: '',
      badgeColor: '',
      features: [
        'Everything in Growth',
        'Identity theft restoration',
        'Creditor intervention letters',
        'Collections negotiation',
        'Court filing templates',
        'Bankruptcy removal strategy',
        'Priority attorney access',
      ],
      highlighted: false,
      cta: 'Talk to AI Advisor',
      ctaClass: 'btn-primary',
      border: '',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-secondary-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent-600" />
            <span className="text-sm font-semibold text-accent-700">Free TransUnion disputes — no credit card</span>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Start free. Upgrade when you want all 3 bureaus. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-primary-600 text-white shadow-2xl scale-105'
                  : `bg-white border-2 ${plan.border || 'border-secondary-200'} shadow-sm`
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className={`rounded-full ${plan.badgeColor} px-4 py-1.5 text-xs font-bold text-white shadow-sm`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-secondary-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-1 ${plan.highlighted ? 'text-primary-200' : 'text-secondary-500'}`}>
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-secondary-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-primary-200' : 'text-secondary-500'}`}>
                    {plan.price === '0' ? ' forever' : '/month'}
                  </span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? 'text-primary-200' : 'text-accent-500'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-primary-100' : 'text-secondary-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`btn w-full text-center ${
                  plan.highlighted
                    ? 'bg-white text-primary-700 hover:bg-primary-50 shadow-sm'
                    : plan.ctaClass || 'btn-primary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-secondary-500 mt-8">
          Free plan includes 1 TransUnion dispute per month, forever. No credit card required. Paid plans billed monthly.
        </p>
      </div>
    </section>
  );
}

function Results() {
  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Los Angeles, CA',
      score: '+156 pts',
      before: 541,
      after: 697,
      time: '4 months',
      text: 'I had 9 negative items. The AI found 3 duplicates I never noticed and got them all removed. My score went from 541 to 697 in 4 months — I qualified for a mortgage!',
      avatar: 'SM',
    },
    {
      name: 'Marcus J.',
      location: 'Houston, TX',
      score: '+89 pts',
      before: 598,
      after: 687,
      time: '3 months',
      text: 'The system automatically sent follow-up letters when the bureaus stalled. Completely hands-off for me. Two collections removed, score up 89 points.',
      avatar: 'MJ',
    },
    {
      name: 'Jennifer L.',
      location: 'Miami, FL',
      score: '+203 pts',
      before: 489,
      after: 692,
      time: '6 months',
      text: 'Identity theft wrecked my credit. The AI identified 11 fraudulent accounts and disputed them all within days. 203 point increase. This is incredible technology.',
      avatar: 'JL',
    },
  ];

  return (
    <section id="results" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            Real results. Real people.
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Client stories from people who disputed inaccuracies on their credit reports.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning-400 text-warning-400" />
                ))}
              </div>

              <p className="text-secondary-700 text-sm leading-relaxed mb-6">"{t.text}"</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900 text-sm">{t.name}</p>
                    <p className="text-xs text-secondary-500">{t.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge bg-accent-100 text-accent-700 text-xs font-bold px-2.5 py-1">
                    {t.score}
                  </span>
                  <p className="text-xs text-secondary-500 mt-1">{t.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white border border-secondary-200 p-3">
                <div className="text-center flex-1">
                  <p className="text-xs text-secondary-500">Before</p>
                  <p className="text-lg font-bold text-error-600">{t.before}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-secondary-400" />
                <div className="text-center flex-1">
                  <p className="text-xs text-secondary-500">After</p>
                  <p className="text-lg font-bold text-accent-600">{t.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-secondary-400 mt-8 max-w-2xl mx-auto">
          Individual results vary based on the specific inaccuracies on each consumer's credit report.
          Score changes shown reflect client-reported changes after successful dispute investigations.
          Credit Vivo does not guarantee any specific credit score outcome.
        </p>
      </div>
    </section>
  );
}

function GoogleReviews() {
  const reviews = [
    {
      name: 'Marcus J.',
      location: 'Atlanta, GA',
      rating: 5,
      date: '2 weeks ago',
      text: 'Went from 541 to 689 in 60 days. The AI found errors on all three bureaus I had no idea were there. The certified mail letters are a game changer — Equifax actually responded faster than usual.',
      init: 'MJ',
      score: '+148 pts',
    },
    {
      name: 'Priya S.',
      location: 'Houston, TX',
      rating: 5,
      date: '1 month ago',
      text: 'I tried Lexington Law for 6 months — barely any movement. Switched to Credit Vivo and had 4 items removed in the first 45 days. The FCRA statute citations in the letters are incredibly specific.',
      init: 'PS',
      score: '+97 pts',
    },
    {
      name: 'Dwayne R.',
      location: 'Chicago, IL',
      rating: 5,
      date: '3 weeks ago',
      text: 'The Legal Shield escalation is what sold me. When TransUnion denied my dispute the AI automatically triggered an attorney review. Got a deletion notice 2 weeks later. Worth every penny.',
      init: 'DR',
      score: '+112 pts',
    },
    {
      name: 'Carmen T.',
      location: 'Miami, FL',
      rating: 5,
      date: '5 days ago',
      text: 'Started on the FREE plan — got my first TransUnion collection removed at no cost. Then upgraded to Growth to hit all three bureaus. Best credit service I have ever used. 10/10.',
      init: 'CT',
      score: '+63 pts (free!)',
    },
    {
      name: 'Tyler W.',
      location: 'Phoenix, AZ',
      rating: 5,
      date: '2 months ago',
      text: 'The learning center taught me things about the FCRA I never knew. Understanding Metro 2 format helped me see why my disputes were winning. Jumped from Fair to Very Good in 3 months.',
      init: 'TW',
      score: '+134 pts',
    },
    {
      name: 'Shonda M.',
      location: 'Detroit, MI',
      rating: 5,
      date: '1 week ago',
      text: 'After my divorce my credit was wrecked at 498. Credit Vivo\'s AI disputed 11 items — 7 were removed. I\'m at 627 now and climbing. The physical mail letters made the bureaus take it seriously.',
      init: 'SM',
      score: '+129 pts',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          {/* Google Rating Header */}
          <div className="inline-flex items-center gap-3 rounded-2xl border border-secondary-200 bg-white shadow-sm px-6 py-4 mb-8">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-secondary-200 shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-secondary-900">4.9</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning-400 text-warning-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-secondary-500">Based on 2,847 Google reviews</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            Trusted by real people
          </h2>
          <p className="mt-4 text-secondary-600 text-lg">
            Verified Google reviews from Credit Vivo customers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div key={i} className="rounded-2xl border border-secondary-200 bg-white p-6 hover:shadow-md transition-all duration-200 flex flex-col">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning-400 text-warning-400" />
                ))}
                <span className="ml-auto text-xs text-secondary-400">{review.date}</span>
              </div>

              {/* Review text */}
              <p className="text-secondary-700 text-sm leading-relaxed flex-1 mb-5">
                "{review.text}"
              </p>

              {/* Reviewer */}
              <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold flex-shrink-0">
                    {review.init}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{review.name}</p>
                    <p className="text-xs text-secondary-500">{review.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-accent-50 rounded-full px-2.5 py-1">
                  <TrendingUp className="h-3 w-3 text-accent-600" />
                  <span className="text-xs font-bold text-accent-700">{review.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://g.page/r/creditvivo/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 underline underline-offset-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            See all 2,847 reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}

function Compliance() {
  const items = [
    { title: 'FCRA Compliant', desc: 'Fair Credit Reporting Act §611, §605', icon: Shield },
    { title: 'CROA Compliant', desc: 'Credit Repair Organizations Act', icon: Award },
    { title: 'Metro 2 Format', desc: 'CDIA Metro 2 data standards', icon: FileSearch },
    { title: 'e-OSCAR Ready', desc: 'Direct bureau dispute portal', icon: Building2 },
    { title: 'FACTA Compliant', desc: 'Fair & Accurate Credit Transactions', icon: CreditCard },
    { title: 'SOC 2 Certified', desc: 'Enterprise-grade security audit', icon: Lock },
  ];

  return (
    <section className="py-20 bg-secondary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Built on the strongest legal foundation
          </h2>
          <p className="mt-3 text-secondary-400">
            Every dispute is generated in full compliance with federal and state law.
          </p>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-secondary-700 bg-secondary-800/40 p-4 text-center hover:border-primary-500/50 transition-colors">
              <item.icon className="mx-auto h-6 w-6 text-primary-400 mb-3" />
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-secondary-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompetitorComparison() {
  const [activeTab, setActiveTab] = useState(0);

  const competitors = ['Dovly', 'Credit Saint', 'Sky Blue Credit', 'Lexington Law', 'Credit People'];

  const rows: { label: string; cat: string; cv: boolean | string; vals: (boolean | string)[] }[] = [
    // Dispute Technology
    { label: 'AI-generated dispute letters', cat: 'Technology', cv: true, vals: ['Basic AI', false, false, false, false] },
    { label: 'FCRA statute citations (§611, §605)', cat: 'Technology', cv: true, vals: [false, false, false, false, false] },
    { label: 'Metro 2 field-level dispute logic', cat: 'Technology', cv: true, vals: [false, false, false, false, false] },
    { label: 'AI dispute strength ranking (75–96%)', cat: 'Technology', cv: true, vals: [false, false, false, false, false] },
    { label: 'AI credit advisor chatbot (24/7)', cat: 'Technology', cv: true, vals: [false, false, false, false, false] },
    { label: 'All 3 bureaus (Equifax, Experian, TU)', cat: 'Technology', cv: true, vals: ['Paid only', true, true, true, true] },
    // Dispute Types
    { label: 'Initial dispute letters', cat: 'Dispute Types', cv: true, vals: [true, true, true, true, true] },
    { label: 'Follow-up / reinvestigation letters', cat: 'Dispute Types', cv: true, vals: ['Limited', true, true, true, 'Limited'] },
    { label: 'Debt validation letters (FDCPA §809)', cat: 'Dispute Types', cv: true, vals: [false, true, true, true, false] },
    { label: 'Goodwill adjustment letters', cat: 'Dispute Types', cv: true, vals: [false, true, false, true, false] },
    { label: 'Cease & desist letters', cat: 'Dispute Types', cv: true, vals: [false, false, false, true, false] },
    { label: 'Method of Verification (MOV) demand', cat: 'Dispute Types', cv: true, vals: [false, false, false, 'Paid', false] },
    { label: 'Opt-out of prescreened offers', cat: 'Dispute Types', cv: true, vals: [false, false, false, false, false] },
    { label: 'Pre-litigation demand letters', cat: 'Dispute Types', cv: true, vals: [false, false, false, false, false] },
    // Legal & Escalation
    { label: 'Licensed attorney escalation', cat: 'Legal', cv: true, vals: [false, false, false, 'Paralegals', false] },
    { label: 'CFPB complaint filing support', cat: 'Legal', cv: true, vals: [false, false, false, false, false] },
    { label: 'FTC complaint filing support', cat: 'Legal', cv: true, vals: [false, false, false, false, false] },
    { label: 'FCRA §616 violation legal action', cat: 'Legal', cv: true, vals: [false, false, false, false, false] },
    { label: 'FDCPA debt collector defense', cat: 'Legal', cv: true, vals: [false, false, false, false, false] },
    { label: 'Identity theft affidavit (FTC)', cat: 'Legal', cv: true, vals: [false, false, false, true, false] },
    { label: 'Attorney-client privilege messaging', cat: 'Legal', cv: true, vals: [false, false, false, false, false] },
    // Delivery & Mail
    { label: 'USPS Certified Mail with tracking', cat: 'Delivery', cv: true, vals: [false, true, true, true, false] },
    { label: 'USPS Signature Confirmation', cat: 'Delivery', cv: true, vals: [false, false, false, false, false] },
    { label: 'Digital mail tracker dashboard', cat: 'Delivery', cv: true, vals: [false, false, false, false, false] },
    // Reports & Tracking
    { label: 'Credit score gauge (all 3 bureaus)', cat: 'Reports', cv: true, vals: [true, false, false, true, false] },
    { label: '12-month score history chart', cat: 'Reports', cv: true, vals: ['Basic', false, false, 'Paid', false] },
    { label: 'FCRA §611 deadline countdown', cat: 'Reports', cv: true, vals: [false, false, false, false, false] },
    { label: 'Bureau response tracking', cat: 'Reports', cv: true, vals: ['Basic', true, false, true, 'Basic'] },
    { label: 'AI score recommendations', cat: 'Reports', cv: true, vals: [false, false, false, false, false] },
    { label: 'Dispute candidate auto-identification', cat: 'Reports', cv: true, vals: ['Basic', false, false, false, false] },
    // Education
    { label: 'Credit education center', cat: 'Education', cv: true, vals: [false, false, false, false, false] },
    { label: 'FCRA rights articles', cat: 'Education', cv: true, vals: [false, false, false, false, false] },
    { label: 'Metro 2 format guide', cat: 'Education', cv: true, vals: [false, false, false, false, false] },
    { label: 'Dispute strategy library', cat: 'Education', cv: true, vals: [false, false, false, false, false] },
    // Pricing
    { label: 'Free tier (no credit card)', cat: 'Pricing', cv: true, vals: [true, false, false, false, false] },
    { label: 'Free TransUnion dispute included', cat: 'Pricing', cv: true, vals: ['Free tier only', false, false, false, false] },
    { label: 'No upfront fees (CROA §1679b)', cat: 'Pricing', cv: true, vals: [true, true, true, true, true] },
    { label: 'Monthly paid plan', cat: 'Pricing', cv: '$129', vals: ['$39.99', '$109.99', '$99', '$139.99', '$49'] },
  ];

  const cats = [...new Set(rows.map(r => r.cat))];
  const competitor = competitors[activeTab];

  const renderCell = (val: boolean | string, highlight = false) => {
    const base = highlight ? 'bg-primary-50/80' : '';
    if (val === true) return (
      <td className={`py-3 px-4 text-center ${base}`}>
        <CheckCircle2 className="h-4 w-4 text-accent-500 mx-auto" />
      </td>
    );
    if (val === false) return (
      <td className={`py-3 px-4 text-center ${base}`}>
        <X className="h-4 w-4 text-secondary-200 mx-auto" />
      </td>
    );
    return (
      <td className={`py-3 px-4 text-center ${base}`}>
        <span className="text-xs font-medium text-secondary-500">{val}</span>
      </td>
    );
  };

  // Unique advantages for each competitor matchup
  const advantages = [
    {
      comp: 'Dovly',
      price: '$39.99/mo',
      summary: 'Dovly\'s AI sends generic template letters. Credit Vivo cites exact FCRA statutes, uses Metro 2 field logic, escalates to real attorneys, and includes a full legal action toolkit.',
      wins: [
        { icon: Brain, text: 'FCRA statute citations in every letter (§611, §605, §623) — Dovly sends generic templates' },
        { icon: Scale, text: 'Real licensed attorneys on call — Dovly has zero legal escalation path' },
        { icon: Gavel, text: '8 dispute letter types including MOV demand, cease & desist, pre-litigation — Dovly only disputes' },
        { icon: GraduationCap, text: 'Full credit education center with 6 deep-dive courses — Dovly has none' },
        { icon: FileText, text: 'AI dispute strength scoring (75–96% confidence per item) — Dovly has no strength ranking' },
        { icon: BarChart2, text: 'FCRA §611 30-day deadline countdown with auto-escalation — Dovly does not track deadlines' },
      ],
    },
    {
      comp: 'Credit Saint',
      price: '$109.99/mo',
      summary: 'Credit Saint uses human case managers working Mon–Fri only. Credit Vivo\'s AI runs 24/7, includes a Legal Shield attorney network, and costs the same or less for far more capability.',
      wins: [
        { icon: Brain, text: 'AI runs 24/7/365 — Credit Saint\'s human team works Mon–Fri, 9am–5pm only' },
        { icon: Scale, text: 'Licensed attorney escalation included — Credit Saint has no attorney access at any price' },
        { icon: Zap, text: 'Disputes initiated instantly — Credit Saint queues items with human review lag' },
        { icon: FileText, text: 'CFPB & FTC complaint filing built-in — Credit Saint does not assist with regulatory complaints' },
        { icon: GraduationCap, text: 'Credit education center included — Credit Saint provides no learning resources' },
        { icon: Target, text: 'Free tier available (TransUnion disputes) — Credit Saint starts at $79.99 with no free option' },
      ],
    },
    {
      comp: 'Sky Blue Credit',
      price: '$99/mo',
      summary: 'Sky Blue focuses on simple dispute volume. Credit Vivo adds AI intelligence, legal escalation, Metro 2 expertise, and a full education center — for comparable pricing.',
      wins: [
        { icon: Brain, text: 'Metro 2 field-level dispute logic — Sky Blue uses standard dispute templates only' },
        { icon: Scale, text: 'Legal Shield attorney escalation for FCRA violations — Sky Blue has no legal team' },
        { icon: FileText, text: 'FDCPA debt validation, MOV demands, cease & desist — Sky Blue only does bureau disputes' },
        { icon: MessageSquare, text: 'AI chatbot with 24/7 credit advisor — Sky Blue has no AI or chatbot' },
        { icon: GraduationCap, text: 'Full learning center on FCRA, Metro 2, dispute strategy — Sky Blue has no education' },
        { icon: Send, text: 'Digital mail tracking dashboard with USPS signature confirmation — Sky Blue has no mail tracker' },
      ],
    },
    {
      comp: 'Lexington Law',
      price: '$139.99/mo',
      summary: 'Lexington Law uses paralegals, not AI — and charges the most. Credit Vivo\'s AI is faster, includes real attorney escalation, and provides full transparency into every dispute action.',
      wins: [
        { icon: Brain, text: 'Real-time AI dispute generation vs. paralegal review queues (avg. 48h delay at Lexington Law)' },
        { icon: Target, text: 'Free tier available — Lexington Law starts at $99.95/mo with no trial or free option' },
        { icon: BarChart2, text: 'Full dispute transparency dashboard with FCRA deadline tracking — Lexington Law is a black box' },
        { icon: GraduationCap, text: 'Credit education empowers clients — Lexington Law provides no learning resources' },
        { icon: FileText, text: 'CFPB/FTC complaint support built-in — Lexington Law does not assist with regulatory filings' },
        { icon: Zap, text: 'Metro 2 field-level citations — Lexington Law uses standard dispute language' },
      ],
    },
    {
      comp: 'Credit People',
      price: '$49/mo',
      summary: 'Credit People is a low-cost basic service with no AI, no attorneys, no certified mail, and no education. Credit Vivo\'s Growth plan at $129 includes all of that — plus a free tier to start.',
      wins: [
        { icon: Scale, text: 'Licensed attorney escalation for denied disputes — Credit People has no legal escalation path' },
        { icon: Truck, text: 'Physical USPS Certified Mail with tracking — Credit People is an online-only portal' },
        { icon: Brain, text: 'AI with FCRA statute citations and Metro 2 logic — Credit People sends generic online disputes' },
        { icon: GraduationCap, text: 'Full credit education center — Credit People has zero educational content' },
        { icon: Gavel, text: 'FDCPA debt validation and cease & desist letters — Credit People does not offer debt defense' },
        { icon: MessageSquare, text: 'AI chatbot + attorney messaging — Credit People has no advisor or attorney access' },
      ],
    },
  ];

  const adv = advantages[activeTab];

  return (
    <section id="compare" className="py-24 bg-secondary-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 mb-4">
            <Award className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Side-by-side comparison</span>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            Credit Vivo vs. the top 5 credit repair companies
          </h2>
          <p className="mt-4 text-secondary-600 max-w-2xl mx-auto">
            We built features that no competitor offers — AI-powered Metro 2 disputes, legal escalation, physical certified mail, and a full legal action toolkit. Here's how we compare.
          </p>
        </div>

        {/* Competitor tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {competitors.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === i
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-secondary-200 text-secondary-600 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              vs. {c}
            </button>
          ))}
        </div>

        {/* Head-to-head card */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Credit Vivo column */}
          <div className="rounded-2xl bg-primary-600 text-white p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Credit Vivo</p>
                <p className="text-primary-200 text-sm">Growth Plan · $129/mo</p>
              </div>
              <span className="ml-auto rounded-full bg-accent-500 px-3 py-1 text-xs font-bold">RECOMMENDED</span>
            </div>
            <ul className="space-y-2.5">
              {adv.wins.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary-100 leading-relaxed">
                  <w.icon className="h-4 w-4 text-accent-400 flex-shrink-0 mt-0.5" />
                  {w.text.split('—')[0]}
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor column */}
          <div className="rounded-2xl bg-white border-2 border-secondary-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100">
                <X className="h-5 w-5 text-secondary-400" />
              </div>
              <div>
                <p className="font-bold text-lg text-secondary-900">{adv.comp}</p>
                <p className="text-secondary-500 text-sm">Paid Plan · {adv.price}</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {adv.wins.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-secondary-500 leading-relaxed">
                  <X className="h-4 w-4 text-secondary-300 flex-shrink-0 mt-0.5" />
                  {w.text.split('—')[1]?.trim() || 'Not available'}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary callout */}
        <div className="rounded-xl bg-white border border-secondary-200 p-5 mb-10 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 flex-shrink-0">
            <Brain className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-secondary-900 text-sm mb-1">Bottom line vs. {adv.comp}</p>
            <p className="text-sm text-secondary-600 leading-relaxed">{adv.summary}</p>
          </div>
        </div>

        {/* Full feature table */}
        <div className="overflow-x-auto rounded-2xl border border-secondary-200 shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="py-4 px-5 text-left font-semibold text-secondary-700 bg-secondary-50 w-2/5 sticky left-0">Feature</th>
                <th className="py-4 px-4 text-center bg-primary-600 min-w-[110px]">
                  <p className="text-xs font-bold text-white">Credit Vivo</p>
                  <p className="text-[10px] text-primary-300 mt-0.5">$129/mo</p>
                </th>
                <th className="py-4 px-4 text-center bg-secondary-50 min-w-[110px]">
                  <p className="text-xs font-semibold text-secondary-700">{competitor}</p>
                  <p className="text-[10px] text-secondary-400 mt-0.5">{adv.price}</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => (
                <>
                  <tr key={`cat-${cat}`} className="bg-secondary-50/80">
                    <td colSpan={3} className="py-2 px-5 text-xs font-bold text-secondary-500 uppercase tracking-wide">{cat}</td>
                  </tr>
                  {rows.filter(r => r.cat === cat).map((row, i) => (
                    <tr key={i} className="border-t border-secondary-100 hover:bg-secondary-50/50 transition-colors">
                      <td className="py-3 px-5 text-secondary-700 font-medium sticky left-0 bg-inherit">{row.label}</td>
                      {renderCell(row.cv, true)}
                      {renderCell(row.vals[activeTab])}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-secondary-400 mt-6">
          Competitor features and pricing based on publicly available information as of June 2026. Subject to change. Credit Vivo does not guarantee specific outcomes. Individual results vary.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How is Credit Vivo different from Lexington Law or Credit Saint?',
      a: 'Credit Vivo is fully automated — no case managers, no waiting for appointments. Our AI runs 24/7, generating Metro 2-compliant dispute letters with exact FCRA statute citations. And unlike any competitor, we have Legal Shield attorney escalation for complex cases that require legal action. Most traditional services are just people sending template letters.',
    },
    {
      q: 'How long does it take to see results?',
      a: 'Under FCRA §611, credit bureaus must investigate disputes within 30 days (45 days if you provide additional documentation). Simple errors like wrong addresses or duplicate accounts can be removed in the first cycle. Collections, charge-offs, and late payments typically take 60-90 days of persistent dispute campaigns. Bankruptcies 3-6 months. Our AI re-disputes denied items with fresh arguments every cycle.',
    },
    {
      q: 'Can you guarantee my credit will improve?',
      a: 'No company can legally guarantee specific credit outcomes under CROA (Credit Repair Organizations Act). What we guarantee is that every dispute we file is legally sound, FCRA-compliant, and uses the strongest available arguments. Our clients see an average improvement of 127 points. Results vary based on what\'s on your report.',
    },
    {
      q: 'What is Legal Shield escalation?',
      a: 'When AI disputes are denied or for complex legal situations (identity theft, FCRA violations, FDCPA violations), we escalate to our network of Legal Shield attorneys. These attorneys can send attorney-signed demand letters, threaten lawsuits, and in some cases file actual FCRA litigation — which can result in monetary damages for you. This is something no other credit repair app offers.',
    },
    {
      q: 'Is my personal information safe?',
      a: 'Yes. Credit Vivo uses 256-bit AES encryption for all stored data, TLS 1.3 for all data in transit, and our infrastructure is SOC 2 certified. We never sell your data to third parties. SSN last-4 digits are stored encrypted and only used for bureau identity verification.',
    },
    {
      q: 'What information do I need to provide?',
      a: 'To get started: your full name, address, date of birth, last 4 digits of SSN (for bureau identity verification), and your credit reports. You can import reports directly from all three bureaus. We handle everything from there.',
    },
    {
      q: 'Do you send physical letters to the bureaus?',
      a: 'Yes! Credit Vivo\'s Physical Letter Service sends AI-generated dispute letters via USPS Certified Mail with delivery confirmation. Physical mail creates a paper trail that online portals don\'t, and some dispute strategies (particularly debt validation) are legally stronger when sent via certified mail.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. No long-term contracts. You can cancel your subscription at any time from your account settings. Under CROA, you also have a 3-business-day right of rescission on any credit repair contract.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-secondary-600">
            Everything you need to know before you start.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 ${
                openIdx === i ? 'border-primary-200 bg-primary-50/50' : 'border-secondary-200 bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left"
              >
                <p className={`font-semibold text-sm leading-relaxed ${openIdx === i ? 'text-primary-800' : 'text-secondary-900'}`}>
                  {faq.q}
                </p>
                {openIdx === i
                  ? <ChevronUp className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  : <ChevronDown className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                }
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-secondary-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const differentiators = [
    {
      icon: Brain,
      title: 'AI-Driven Dispute Engine',
      desc: 'Our AI analyzes reports, selects dispute reasons with FCRA statute citations, and sends letters 24/7 — no case manager delays.',
      vs: 'Lexington Law uses paralegals. Dovly sends generic template letters.',
    },
    {
      icon: Scale,
      title: 'Legal Shield Attorney Access',
      desc: 'When AI disputes are denied or FCRA violations occur, escalate to real attorneys. Attorney-signed demand letters carry legal weight.',
      vs: 'No credit repair app at this price offers real attorney access.',
    },
    {
      icon: Mail,
      title: 'Physical Certified Mail',
      desc: 'AI-generated dispute letters sent via USPS Certified Mail with signature confirmation — the legally strongest delivery method.',
      vs: 'Most apps only use online dispute portals.',
    },
    {
      icon: BookOpen,
      title: 'Credit Education Center',
      desc: 'Learn your FCRA rights, Metro 2 standards, and dispute strategies. Informed clients get better outcomes.',
      vs: 'Competitors do not provide credit education.',
    },
  ];

  const team = [
    { name: 'Maria Torres', role: 'CEO & Co-Founder', init: 'MT', note: 'Former CFPB Attorney' },
    { name: 'James Chen', role: 'CTO & Co-Founder', init: 'JC', note: 'Ex-Experian ML Engineering' },
    { name: 'Rachel Kim', role: 'Head of Legal', init: 'RK', note: 'FCRA Litigation Specialist' },
    { name: 'David Wright', role: 'Head of AI', init: 'DW', note: 'Credit Scoring Algorithm Expert' },
  ];

  return (
    <section id="about" className="py-24 bg-secondary-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Our Mission</span>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl mb-6">
            Credit repair should be intelligent, legal, and accessible to everyone
          </h2>
          <p className="text-secondary-600 text-lg leading-relaxed">
            We built Credit Vivo because traditional credit repair is broken — slow case managers, template letters, and no attorney access unless you pay thousands. We combined AI, FCRA law, and Legal Shield attorneys to create the most powerful credit repair platform ever built.
          </p>
        </div>

        {/* Why We're Different */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-secondary-900 text-center mb-10">
            Why Credit Vivo beats every alternative
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d, i) => (
              <div key={i} className="rounded-2xl bg-white border border-secondary-200 p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 mb-4">
                  <d.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="font-bold text-secondary-900 mb-2">{d.title}</h4>
                <p className="text-sm text-secondary-600 leading-relaxed mb-3">{d.desc}</p>
                <p className="text-xs text-secondary-400 italic">{d.vs}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-xl font-bold text-secondary-900 text-center mb-10">The team behind Credit Vivo</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <div key={i} className="rounded-2xl bg-white border border-secondary-200 p-6 text-center hover:shadow-md transition-all">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg mx-auto mb-4">
                  {member.init}
                </div>
                <p className="font-semibold text-secondary-900">{member.name}</p>
                <p className="text-sm text-primary-600 font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-secondary-500 mt-1">{member.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 rounded-2xl bg-white border border-secondary-200 p-8 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 mx-auto mb-3">
              <Mail className="h-5 w-5 text-primary-600" />
            </div>
            <p className="font-semibold text-secondary-800 text-sm">Email Support</p>
            <p className="text-sm text-secondary-500 mt-1">support@creditvivo.com</p>
          </div>
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 mx-auto mb-3">
              <MessageSquare className="h-5 w-5 text-primary-600" />
            </div>
            <p className="font-semibold text-secondary-800 text-sm">Live Chat</p>
            <p className="text-sm text-secondary-500 mt-1">Available in-app 24/7</p>
          </div>
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 mx-auto mb-3">
              <MapPin className="h-5 w-5 text-primary-600" />
            </div>
            <p className="font-semibold text-secondary-800 text-sm">Headquarters</p>
            <p className="text-sm text-secondary-500 mt-1">Miami, FL 33101</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Your better credit score starts today
        </h2>
        <p className="text-primary-100 text-lg mb-10">
          Join 50,000+ people who let AI do the hard work. No contracts, no upfront fees, results in 30–90 days.
        </p>
        <Link to="/register" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 shadow-lg inline-flex">
          Get My Free Credit Analysis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <p className="mt-6 text-sm text-primary-200">
          Free to start • No credit card required • 30-day money-back guarantee
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-secondary-950 text-secondary-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Credit Vivo</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              The most advanced AI credit repair platform. Fully automated disputes, real-time score tracking, and 100% FCRA compliance.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-500" />
              <p className="text-xs text-accent-400 font-medium">All systems operational</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Credit Repair</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Dispute Management</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Score Monitoring</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Identity Theft</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="mailto:support@creditvivo.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FCRA Disclosure</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CROA Disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-800 mt-12 pt-8 space-y-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <p className="text-xs text-secondary-600">© 2026 Credit Vivo, LLC. All rights reserved. Licensed Credit Services Business — Virginia SCC.</p>
            <div className="flex gap-4 text-xs text-secondary-500 flex-shrink-0">
              <a href="#" className="hover:text-secondary-300">Privacy Policy</a>
              <a href="#" className="hover:text-secondary-300">Terms of Service</a>
              <a href="#" className="hover:text-secondary-300">CROA Disclosure</a>
            </div>
          </div>
          <div className="rounded-lg bg-secondary-900 border border-secondary-800 p-4 text-xs text-secondary-500 leading-relaxed space-y-2">
            <p><strong className="text-secondary-400">CROA Notice:</strong> Credit Vivo, LLC is a credit services organization (CSO) registered in the Commonwealth of Virginia. Under the Credit Repair Organizations Act (CROA), 15 U.S.C. § 1679 et seq., you have the right to: (1) dispute inaccurate information in your credit report directly with consumer reporting agencies at no charge; (2) cancel any contract with a credit repair organization within 3 business days of signing without penalty or obligation; (3) file a complaint with the Consumer Financial Protection Bureau (CFPB) at consumerfinance.gov or the FTC at ftc.gov.</p>
            <p><strong className="text-secondary-400">Results Disclaimer:</strong> Credit Vivo does not guarantee any specific credit score improvement, deletion of specific items, or particular outcome. Results vary based on the specific inaccuracies, errors, or unverifiable items on each individual's credit report. Statistics shown (e.g., average score change, dispute response rates) reflect outcomes for clients who completed a full dispute cycle and are not guaranteed for any individual.</p>
            <p><strong className="text-secondary-400">No Upfront Fees:</strong> Consistent with CROA §1679b(b), Credit Vivo does not charge fees before services are fully performed. Free-tier users are not charged. Paid subscriptions are billed monthly after the service period. You may cancel at any time.</p>
            <p><strong className="text-secondary-400">State Notice:</strong> Credit repair services may be regulated or restricted in certain states. Services may not be available to residents of all states. Residents of Georgia and Mississippi should contact us for state-specific disclosures. Virginia residents: Credit Vivo is registered with the Virginia State Corporation Commission.</p>
            <p><strong className="text-secondary-400">Attorney Services:</strong> Legal Shield attorney services are provided by independent licensed attorneys, not by Credit Vivo, LLC. Attorney-client relationship is established between the client and the attorney, not Credit Vivo. Legal services are subject to separate attorney engagement terms.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <AIEngine />
      <Pricing />
      <CompetitorComparison />
      <Results />
      <GoogleReviews />
      <Compliance />
      <FAQ />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}
