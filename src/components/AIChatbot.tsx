import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Bot, User, Sparkles, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: Date;
}

const SUGGESTIONS = [
  'How do I dispute a negative item?',
  'What is credit utilization?',
  'How long does credit repair take?',
  'What rights do I have under FCRA?',
  'How do I remove a collection account?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "I'm Viva, your Credit Vivo AI advisor. I can help you understand credit repair, FCRA rights, dispute strategies, and score improvement. What would you like to know?",
  dispute: "To dispute a negative item, Credit Vivo's AI automatically identifies the best strategy based on the error type. Under FCRA §611, bureaus must investigate within 30 days. Our system sends certified dispute letters to all three bureaus simultaneously with the strongest legal arguments. Go to the Disputes tab to start — our AI will select the optimal reason code for you.",
  utilization: "Credit utilization is the ratio of your credit card balances to your credit limits. It makes up 30% of your FICO score. The ideal utilization is under 10% per card and overall. For example, if you have a $1,000 limit and a $300 balance, your utilization is 30% — aim to get that to $100 (10%) for maximum score impact. Paying down balances is one of the fastest ways to boost your score.",
  'how long': "Credit repair timelines vary. Simple errors can be removed in 30-45 days. More complex items like collections or late payments typically take 60-90 days. Bankruptcies and judgments can take 3-6 months. Credit Vivo's AI continuously re-disputes denied items using new arguments, which accelerates results compared to manual repair services.",
  fcra: "Under the Fair Credit Reporting Act (FCRA), you have powerful rights: (1) The right to dispute inaccurate information — bureaus must investigate within 30 days. (2) The right to know what's in your file. (3) The right to sue for damages if your rights are violated — up to $1,000 per violation. (4) Negative items must be removed after 7 years (10 for bankruptcy). Credit Vivo uses these rights aggressively in every dispute.",
  collection: "Removing a collection account requires one of these strategies: (1) Debt validation letter — under FDCPA §809, collectors must validate the debt within 30 days. (2) Pay-for-delete negotiation — ask them to remove the account in exchange for payment. (3) Dispute inaccuracies — if any detail is wrong (amount, date, creditor), the entire account can be removed under FCRA §611. Credit Vivo's AI automatically selects the strongest approach for your specific collection.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('disput')) return AI_RESPONSES.dispute;
  if (lower.includes('utiliz') || lower.includes('utiliz') || lower.includes('balance')) return AI_RESPONSES.utilization;
  if (lower.includes('how long') || lower.includes('timeline') || lower.includes('take')) return AI_RESPONSES['how long'];
  if (lower.includes('fcra') || lower.includes('rights') || lower.includes('law')) return AI_RESPONSES.fcra;
  if (lower.includes('collection') || lower.includes('debt') || lower.includes('collector')) return AI_RESPONSES.collection;
  return "That's a great question about credit. Credit Vivo's AI analyzes your specific situation to give personalized recommendations. Generally, the most impactful steps are: (1) dispute all inaccurate items, (2) reduce utilization below 10%, (3) maintain on-time payments. Would you like me to go deeper on any of these?";
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: AI_RESPONSES.default,
      time: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      time: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const response = getAIResponse(text);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: response,
      time: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 text-white shadow-elevated hover:bg-primary-700 transition-all duration-200 hover:scale-105 active:scale-100 group"
        aria-label="Open AI Chat"
      >
        <div className="relative">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
          </span>
        </div>
        <span className="text-sm font-semibold">Ask Viva</span>
        <Sparkles className="h-3.5 w-3.5 text-accent-300" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-[360px] rounded-2xl shadow-elevated bg-white border border-secondary-200 flex flex-col overflow-hidden transition-all duration-200 ${
      minimized ? 'h-14' : 'h-[520px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-600 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 ring-2 ring-primary-400/50">
            <Bot className="h-4 w-4 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-accent-500 border-2 border-primary-600">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Viva — Credit AI</p>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
              <p className="text-[10px] text-primary-200">Always available</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 rounded-lg text-primary-200 hover:bg-primary-500 transition-colors"
            aria-label={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <ChevronDown className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-primary-200 hover:bg-primary-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-secondary-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                  msg.role === 'assistant' ? 'bg-primary-100' : 'bg-secondary-200'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot className="h-3.5 w-3.5 text-primary-600" />
                    : <User className="h-3.5 w-3.5 text-secondary-600" />
                  }
                </div>
                <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-white border border-secondary-200 text-secondary-800 rounded-tl-sm'
                      : 'bg-primary-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-secondary-400 mt-1 px-1">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <Bot className="h-3.5 w-3.5 text-primary-600" />
                </div>
                <div className="bg-white border border-secondary-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-secondary-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 border-t border-secondary-100 bg-white flex gap-2 overflow-x-auto scrollbar-none">
              {SUGGESTIONS.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="flex-shrink-0 text-[11px] font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-full px-3 py-1.5 transition-colors border border-primary-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-secondary-200 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about credit, disputes, FCRA..."
              className="flex-1 rounded-xl border border-secondary-200 bg-secondary-50 px-3.5 py-2 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white disabled:opacity-40 hover:bg-primary-700 transition-colors flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
