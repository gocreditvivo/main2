import { useState } from 'react';
import {
  BookOpen, ChevronRight, Clock, Search,
  TrendingUp, Shield, AlertTriangle, CreditCard, FileText,
  Scale, CheckCircle2, Brain, Award, Target, Sparkles
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ElementType;
  excerpt: string;
  content: string[];
  keyPoints: string[];
}

const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Your Credit Score: The 5 Factors',
    category: 'Credit Basics',
    readTime: 5,
    level: 'beginner',
    icon: TrendingUp,
    excerpt: 'Learn exactly how FICO calculates your score and which factors matter most.',
    content: [
      'Your FICO credit score is calculated from five key factors, each weighted differently. Understanding these weights helps you prioritize your improvement efforts.',
      'Payment History (35%) — The single most important factor. Even one 30-day late payment can drop your score by 60-110 points. On-time payments for 24+ months has the most positive impact.',
      'Credit Utilization (30%) — How much of your available revolving credit you\'re using. Keep each card under 10% for maximum points. If you have a $5,000 limit, stay under $500.',
      'Length of Credit History (15%) — The average age of all your accounts. Never close your oldest cards — even unused ones. Every new account lowers your average age.',
      'Credit Mix (10%) — Having both revolving credit (cards) and installment loans (auto, mortgage) shows lenders you can manage different debt types.',
      'New Credit (10%) — Each hard inquiry costs about 5-10 points and stays on your report for 2 years. Multiple inquiries within 14 days for the same loan type count as one.',
    ],
    keyPoints: [
      'Payment history is the #1 factor at 35%',
      'Keep utilization under 10% per card',
      'Never close your oldest credit card',
      'Hard inquiries affect scores for 2 years',
    ],
  },
  {
    id: '2',
    title: 'FCRA Rights: What You Can Demand from Bureaus',
    category: 'Legal Rights',
    readTime: 7,
    level: 'intermediate',
    icon: Scale,
    excerpt: 'The Fair Credit Reporting Act gives you powerful tools to fix your credit report.',
    content: [
      'The Fair Credit Reporting Act (FCRA) is federal law that governs how credit bureaus collect, store, and report your information. Most consumers don\'t realize how much power this law gives them.',
      'The Right to Dispute — Under FCRA §611, you can dispute any information you believe is inaccurate or incomplete. The bureau MUST investigate within 30 days (45 days if you send additional information). If they can\'t verify the item, it must be deleted.',
      'The Right to Validation — If a debt collector contacts you, under FDCPA §809 they must send written validation within 5 days. Once you dispute in writing, collection activity must stop until they validate.',
      '7-Year Rule (FCRA §605) — Most negative items must be removed 7 years from the date of first delinquency: late payments, collections, charge-offs, judgments, tax liens. Chapter 7 bankruptcy: 10 years. Chapter 13 bankruptcy: 7 years.',
      'Free Annual Reports — You are entitled to one free credit report per bureau per year at AnnualCreditReport.com. During disputes, you can request additional free reports.',
      'Damages — If a bureau or furnisher willfully violates the FCRA, you can sue for actual damages, statutory damages of $100-$1,000 per violation, punitive damages, and attorney fees.',
    ],
    keyPoints: [
      'Bureaus must investigate disputes within 30 days',
      'Unverified items must be deleted',
      'Most negatives fall off after 7 years',
      'FCRA violations can result in cash damages',
    ],
  },
  {
    id: '3',
    title: 'How to Remove Collections from Your Credit Report',
    category: 'Dispute Strategy',
    readTime: 8,
    level: 'intermediate',
    icon: AlertTriangle,
    excerpt: 'Multiple legal strategies exist to remove collection accounts — know which works best for your situation.',
    content: [
      'Collection accounts are among the most damaging items on a credit report. A single collection can drop your score 50-100 points. But you have several strategies to remove them.',
      'Strategy 1: Debt Validation — Under FDCPA §809, if you dispute the debt within 30 days of first contact, the collector must stop all collection activity and provide validation. If they can\'t validate, they must cease collection and can\'t report it.',
      'Strategy 2: Dispute Inaccuracies — Even small errors make a collection removable. Wrong balance amount, wrong date of first delinquency, wrong creditor name, account number errors — any inaccuracy under FCRA §611 requires removal if the collector can\'t correct and verify.',
      'Strategy 3: Pay-for-Delete — Negotiate with the collector: offer to pay in exchange for deleting the account from all three bureaus. Get the agreement in WRITING before paying. Not all collectors will agree, but many will for settled amounts.',
      'Strategy 4: Goodwill Letters — For one-time mistakes with otherwise good payment history, write a goodwill letter to the original creditor explaining the circumstances. This works best for late payments, not collections.',
      'Strategy 5: Statute of Limitations — Debts have a statute of limitations (varies by state, typically 3-6 years) after which collectors can\'t sue. Never make payments on zombie debt — it restarts the clock.',
    ],
    keyPoints: [
      'Always request debt validation before paying',
      'Any inaccuracy makes an account disputable',
      'Get pay-for-delete agreements in writing',
      'Paying old debt can restart the clock',
    ],
  },
  {
    id: '4',
    title: 'Credit Utilization: The Fastest Score Booster',
    category: 'Score Optimization',
    readTime: 4,
    level: 'beginner',
    icon: CreditCard,
    excerpt: 'Reducing your credit card balances is often the quickest way to boost your score.',
    content: [
      'Credit utilization — the ratio of your balances to your credit limits — makes up 30% of your FICO score. Unlike negative items that take months to remove, reducing utilization can boost your score within one billing cycle.',
      'The Golden Rule: Keep utilization under 10% on each individual card AND overall. If you have three cards with $1,000 limits each ($3,000 total), you should have no more than $100 on each card ($300 total).',
      'Individual vs. Total Utilization — FICO scores both your total utilization AND each individual card\'s utilization. A maxed-out card hurts you even if your total utilization is low.',
      'Rapid Rescore Technique — If you have a mortgage or auto loan coming up, pay down balances before the statement closing date (when balances are reported to bureaus). This can raise your score 20-40 points before the application.',
      'Credit Limit Increases — Another way to improve utilization without paying down debt: request credit limit increases. A jump from $1,000 to $2,000 limit on a card with $300 balance drops utilization from 30% to 15%.',
      'Authorized User Strategy — Being added as an authorized user on a family member\'s low-utilization card immediately adds their positive history to your report.',
    ],
    keyPoints: [
      'Below 10% utilization is the target',
      'Both individual and total utilization are scored',
      'Pay down before statement closing date',
      'Request credit limit increases annually',
    ],
  },
  {
    id: '5',
    title: 'Building Credit from Scratch: The Starter Playbook',
    category: 'Credit Building',
    readTime: 6,
    level: 'beginner',
    icon: Target,
    excerpt: 'No credit history? Here is the fastest path to a 700+ score.',
    content: [
      'Having no credit history is almost as damaging as bad credit — lenders have no data to assess risk. But with the right strategy, you can build a 700+ score in 12-18 months.',
      'Step 1: Secured Credit Card — A secured card requires a deposit (usually $200-$500) that becomes your credit limit. Use it for one small recurring charge (like Netflix), pay the full balance monthly. After 6-12 months of on-time payments, you\'ll have a positive history.',
      'Step 2: Credit Builder Loan — Offered by credit unions and online banks, credit builder loans report monthly payments to all three bureaus. You don\'t receive the money until the loan is paid off — it\'s designed purely to build credit.',
      'Step 3: Authorized User — Ask a parent, spouse, or trusted friend with good credit to add you as an authorized user on their oldest, lowest-utilization card. You get their entire history on that account added to your report.',
      'Step 4: Student or Retail Cards — If you\'re a student, student credit cards have lower approval requirements. Retail store cards are also easier to get but have high interest rates — always pay in full.',
      'Key Rules: Never miss a payment (set up autopay for at least the minimum), keep utilization under 10%, don\'t apply for more than 1-2 new cards per year, and keep accounts open even if you stop using them.',
    ],
    keyPoints: [
      'Secured cards are the best starting point',
      'Authorized user status adds instant history',
      'Credit builder loans help with no risk',
      '12-18 months to build a strong profile',
    ],
  },
  {
    id: '6',
    title: 'Metro 2 Format: How Bureaus Receive Your Data',
    category: 'Advanced Topics',
    readTime: 10,
    level: 'advanced',
    icon: FileText,
    excerpt: 'Understanding the CDIA Metro 2 data standard reveals powerful dispute leverage.',
    content: [
      'Metro 2 is the Consumer Data Industry Association (CDIA) standard format for how lenders and creditors report account information to the credit bureaus. Understanding Metro 2 gives you expert-level dispute leverage.',
      'Key Fields in Metro 2 — Every tradeline includes: Account Status Code (current, 30 days late, charged-off, etc.), Payment History Profile (24-month record of payment status), Date of First Delinquency (DOFD — critical for the 7-year removal date), Scheduled Monthly Payment Amount, and Compliance Condition Code.',
      'The DOFD Rule — FCRA §605(c) requires that the 7-year reporting clock starts from the Date of First Delinquency. Creditors sometimes manipulate this date to keep negatives on longer. If the DOFD is incorrect, the account must be removed.',
      'Compliance Condition Codes — Codes like XB (consumer disputes, investigation in progress), XC (completed investigation, consumer disagrees), and XR (account closed at consumer request) affect how bureaus process the data.',
      'Account Status Codes to Challenge — Status code "97" (unpaid charge-off) that appears on an account that has been settled is incorrect. A settled charge-off should show a $0 balance and "settled for less than full amount."',
      'Dispute Leverage — When a furnisher can\'t verify the Metro 2 data fields precisely as required by CDIA standards, the entire account must be corrected or deleted. Credit Vivo\'s AI knows these technical requirements and uses them in every dispute.',
    ],
    keyPoints: [
      'Metro 2 is the technical language of credit reporting',
      'DOFD determines the 7-year removal date',
      'Status codes must accurately reflect account history',
      'Technical Metro 2 errors are dispute-worthy',
    ],
  },
];

const CATEGORIES = ['All', 'Credit Basics', 'Legal Rights', 'Dispute Strategy', 'Score Optimization', 'Credit Building', 'Advanced Topics'];

const LEVEL_META = {
  beginner: { label: 'Beginner', color: 'bg-accent-100 text-accent-700' },
  intermediate: { label: 'Intermediate', color: 'bg-primary-100 text-primary-700' },
  advanced: { label: 'Advanced', color: 'bg-warning-100 text-warning-700' },
};

export default function LearningPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filtered = ARTICLES.filter(a => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-sm text-secondary-500 hover:text-secondary-800 transition-colors mb-4"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Learning Center
          </button>

          <div className="rounded-2xl bg-white border border-secondary-200 shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white`}>
                  {selectedArticle.category}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_META[selectedArticle.level].color}`}>
                  {LEVEL_META[selectedArticle.level].label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">{selectedArticle.title}</h1>
              <div className="flex items-center gap-4 text-primary-200 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.readTime} min read
                </div>
                <div className="flex items-center gap-1.5">
                  <Brain className="h-4 w-4" />
                  AI-curated content
                </div>
              </div>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4">
                {selectedArticle.content.map((paragraph, i) => (
                  <p key={i} className={`leading-relaxed ${i === 0 ? 'text-base text-secondary-700 font-medium' : 'text-sm text-secondary-600'}`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Points Sidebar */}
              <div>
                <div className="rounded-xl bg-accent-50 border border-accent-200 p-5 sticky top-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-accent-600" />
                    <p className="font-semibold text-accent-800">Key Takeaways</p>
                  </div>
                  <ul className="space-y-3">
                    {selectedArticle.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-accent-800">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-xl bg-primary-50 border border-primary-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary-600" />
                    <p className="text-sm font-semibold text-primary-800">Apply This Knowledge</p>
                  </div>
                  <p className="text-xs text-primary-700 mb-3">
                    Credit Vivo's AI uses these exact principles when building your dispute strategy.
                  </p>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="w-full btn btn-primary text-sm py-2"
                  >
                    Go to Disputes
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Credit Learning Center</h1>
        <p className="mt-1 text-secondary-500 text-sm">
          Master credit repair, FCRA rights, and score optimization strategies.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: 'Guides', value: `${ARTICLES.length}` },
          { icon: Clock, label: 'Avg Read Time', value: '6 min' },
          { icon: Brain, label: 'Topics Covered', value: '6' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl bg-white border border-secondary-200 p-4 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 mx-auto mb-2">
              <s.icon className="h-5 w-5 text-primary-600" />
            </div>
            <p className="text-xl font-bold text-secondary-900">{s.value}</p>
            <p className="text-xs text-secondary-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-secondary-900 placeholder-secondary-400"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-secondary-200 text-secondary-600 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="text-left rounded-2xl bg-white border border-secondary-200 p-5 hover:border-primary-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 group-hover:bg-primary-600 transition-colors">
                <article.icon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_META[article.level].color}`}>
                {LEVEL_META[article.level].label}
              </span>
            </div>

            <h3 className="font-semibold text-secondary-900 text-sm leading-snug mb-2 group-hover:text-primary-700 transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-secondary-500 leading-relaxed mb-4">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-secondary-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime} min
                </div>
                <span className="text-secondary-300">•</span>
                <span>{article.category}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-secondary-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No articles found</p>
            <p className="text-sm mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* AI Tip Banner */}
      <div className="rounded-2xl bg-secondary-900 border border-secondary-800 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 flex-shrink-0">
            <Brain className="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-white mb-1">AI Learning Tip</p>
            <p className="text-sm text-secondary-400">
              Credit Vivo's AI automatically applies these strategies when building your dispute letters.
              The more you understand these principles, the better you can guide the AI toward your specific goals.
              Start with Credit Basics if you're new, or jump to Advanced Topics for expert leverage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

