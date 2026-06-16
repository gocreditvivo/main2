import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Mail, MapPin, Package, CheckCircle2, Clock, Send,
  Printer, FileText, Shield, AlertCircle, ChevronRight,
  Building, Hash, Truck, Eye
} from 'lucide-react';

type LetterStatus = 'draft' | 'queued' | 'printed' | 'mailed' | 'delivered';

interface MailedLetter {
  id: string;
  recipient: string;
  bureau: string;
  type: string;
  address: string;
  status: LetterStatus;
  tracking: string;
  created_at: string;
  estimated_delivery: string;
}

const STATUS_META: Record<LetterStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'bg-secondary-100 text-secondary-700', icon: FileText },
  queued: { label: 'Queued for Print', color: 'bg-warning-100 text-warning-700', icon: Clock },
  printed: { label: 'Printed', color: 'bg-primary-100 text-primary-700', icon: Printer },
  mailed: { label: 'Mailed', color: 'bg-accent-100 text-accent-700', icon: Send },
  delivered: { label: 'Delivered', color: 'bg-success-100 text-success-700', icon: CheckCircle2 },
};

const BUREAU_ADDRESSES = {
  equifax: {
    label: 'Equifax',
    address: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374-0256',
    color: 'bg-red-50 border-red-200 text-red-700',
  },
  experian: {
    label: 'Experian',
    address: 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  transunion: {
    label: 'TransUnion',
    address: 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
    color: 'bg-green-50 border-green-200 text-green-700',
  },
};

const LETTER_TYPES = [
  { id: 'dispute', label: 'Credit Dispute Letter', desc: 'FCRA §611 investigation demand', icon: AlertCircle },
  { id: 'validation', label: 'Debt Validation Letter', desc: 'FDCPA §809 validation request', icon: Shield },
  { id: 'goodwill', label: 'Goodwill Adjustment', desc: 'Request for late payment removal', icon: CheckCircle2 },
  { id: 'opt_out', label: 'Opt-Out of Prescreened Offers', desc: 'Remove from marketing lists', icon: Mail },
];

// Mock mailed letters for display
const MOCK_LETTERS: MailedLetter[] = [
  {
    id: 'L-001',
    recipient: 'Equifax',
    bureau: 'equifax',
    type: 'Credit Dispute Letter',
    address: 'P.O. Box 740256, Atlanta, GA 30374',
    status: 'delivered',
    tracking: '9400111899223456789012',
    created_at: '2026-06-01',
    estimated_delivery: '2026-06-05',
  },
  {
    id: 'L-002',
    recipient: 'TransUnion',
    bureau: 'transunion',
    type: 'Debt Validation Letter',
    address: 'P.O. Box 2000, Chester, PA 19016',
    status: 'mailed',
    tracking: '9400111899223456789013',
    created_at: '2026-06-10',
    estimated_delivery: '2026-06-14',
  },
  {
    id: 'L-003',
    recipient: 'Experian',
    bureau: 'experian',
    type: 'Credit Dispute Letter',
    address: 'P.O. Box 4500, Allen, TX 75013',
    status: 'queued',
    tracking: '',
    created_at: '2026-06-13',
    estimated_delivery: '2026-06-18',
  },
];

export default function MailingPage() {
  const { clientData } = useAuth();
  const [step, setStep] = useState<'list' | 'compose'>('list');
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);
  const [letterType, setLetterType] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [letters] = useState<MailedLetter[]>(MOCK_LETTERS);

  const toggleBureau = (key: string) => {
    setSelectedBureaus(prev =>
      prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]
    );
  };

  const handleSend = async () => {
    if (!selectedBureaus.length || !letterType) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setStep('list');
      setSelectedBureaus([]);
      setLetterType('');
    }, 2500);
  };

  const StatusBadge = ({ status }: { status: LetterStatus }) => {
    const meta = STATUS_META[status];
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
        <meta.icon className="h-3 w-3" />
        {meta.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Physical Letter Service</h1>
          <p className="mt-1 text-secondary-500 text-sm">
            AI-generated dispute letters mailed via USPS Certified Mail with delivery confirmation.
          </p>
        </div>
        {step === 'list' && (
          <button
            onClick={() => setStep('compose')}
            className="btn btn-primary flex-shrink-0"
          >
            <Mail className="h-4 w-4" />
            Send New Letter
          </button>
        )}
      </div>

      {/* Trust Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Shield, label: 'USPS Certified', sub: 'With signature' },
          { icon: Truck, label: '3-5 Day Delivery', sub: 'First class mail' },
          { icon: Hash, label: 'Tracking Included', sub: 'Full visibility' },
          { icon: FileText, label: 'FCRA Compliant', sub: 'Legal language' },
        ].map((item, i) => (
          <div key={i} className="rounded-xl bg-white border border-secondary-200 p-3 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 mx-auto mb-2">
              <item.icon className="h-4 w-4 text-primary-600" />
            </div>
            <p className="text-xs font-semibold text-secondary-800">{item.label}</p>
            <p className="text-[10px] text-secondary-500">{item.sub}</p>
          </div>
        ))}
      </div>

      {step === 'compose' ? (
        <div className="rounded-2xl bg-white border border-secondary-200 shadow-sm p-6 space-y-6">
          {success ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 mb-4">
                <CheckCircle2 className="h-9 w-9 text-accent-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">Letters Queued for Mailing!</h2>
              <p className="mt-2 text-secondary-500 text-sm max-w-sm">
                Your certified dispute letters will be printed and mailed within 1 business day. You'll receive tracking numbers by email.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setStep('list')} className="text-sm text-secondary-500 hover:text-secondary-800 flex items-center gap-1">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back
                </button>
              </div>

              <h2 className="text-base font-semibold text-secondary-900">Compose & Send Letters</h2>

              {/* Step 1: Letter Type */}
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-3">1. Select Letter Type</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {LETTER_TYPES.map(lt => (
                    <button
                      key={lt.id}
                      onClick={() => setLetterType(lt.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        letterType === lt.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                        letterType === lt.id ? 'bg-primary-500' : 'bg-secondary-100'
                      }`}>
                        <lt.icon className={`h-4.5 w-4.5 ${letterType === lt.id ? 'text-white' : 'text-secondary-500'}`}
                          style={{ width: '1.1rem', height: '1.1rem' }} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${letterType === lt.id ? 'text-primary-800' : 'text-secondary-800'}`}>
                          {lt.label}
                        </p>
                        <p className="text-xs text-secondary-500">{lt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Recipients */}
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-3">2. Select Recipients</p>
                <div className="space-y-3">
                  {Object.entries(BUREAU_ADDRESSES).map(([key, bureau]) => (
                    <button
                      key={key}
                      onClick={() => toggleBureau(key)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedBureaus.includes(key)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors ${
                        selectedBureaus.includes(key)
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-secondary-300'
                      }`}>
                        {selectedBureaus.includes(key) && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${selectedBureaus.includes(key) ? 'text-primary-800' : 'text-secondary-800'}`}>
                          {bureau.label}
                        </p>
                        <p className="text-xs text-secondary-500 mt-0.5 whitespace-pre-line">{bureau.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview & Send */}
              <div className="rounded-xl bg-secondary-50 border border-secondary-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-800">
                    {selectedBureaus.length} bureau{selectedBureaus.length !== 1 ? 's' : ''} selected
                    {letterType && ` — ${LETTER_TYPES.find(l => l.id === letterType)?.label}`}
                  </p>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    Sent via USPS Certified Mail with tracking. Avg. 3-5 business days.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="btn btn-secondary text-sm flex items-center gap-1.5"
                    disabled={!letterType}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!selectedBureaus.length || !letterType || isSubmitting}
                    className="btn btn-primary text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Letters
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Letter History */
        <div className="rounded-2xl bg-white border border-secondary-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-secondary-900">Letter History</h2>
            <span className="text-xs text-secondary-500">{letters.length} letters sent</span>
          </div>

          {letters.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="h-14 w-14 text-secondary-200 mx-auto mb-3" />
              <p className="text-secondary-500 font-medium">No letters sent yet</p>
              <p className="text-sm text-secondary-400 mt-1">Send your first certified dispute letter above</p>
            </div>
          ) : (
            <div className="divide-y divide-secondary-100">
              {letters.map(letter => (
                <div key={letter.id} className="px-6 py-4 hover:bg-secondary-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100 flex-shrink-0">
                        <Building className="h-5 w-5 text-secondary-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-secondary-900 text-sm">{letter.type}</p>
                          <span className="text-secondary-400 text-xs">to</span>
                          <span className="text-sm font-medium text-secondary-700">{letter.recipient}</span>
                        </div>
                        <p className="text-xs text-secondary-500 mt-0.5">{letter.address}</p>
                        {letter.tracking && (
                          <p className="text-xs text-primary-600 mt-1 font-mono">
                            Tracking: {letter.tracking}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StatusBadge status={letter.status} />
                      <p className="text-xs text-secondary-400">
                        Est. delivery: {new Date(letter.estimated_delivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Letter Preview Modal */}
      {previewOpen && letterType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-secondary-900 border-b border-secondary-800">
              <p className="font-semibold text-white">Letter Preview</p>
              <button onClick={() => setPreviewOpen(false)} className="text-secondary-400 hover:text-white">
                <ChevronRight className="h-5 w-5 rotate-90" />
              </button>
            </div>
            <div className="p-6 font-mono text-xs text-secondary-700 space-y-3 max-h-96 overflow-y-auto bg-secondary-50">
              <p>[YOUR NAME]</p>
              <p>[YOUR ADDRESS]</p>
              <p>{new Date().toLocaleDateString()}</p>
              <p className="pt-2">Credit Bureau Dispute Department<br />
                {selectedBureaus.length > 0
                  ? Object.entries(BUREAU_ADDRESSES).filter(([k]) => selectedBureaus.includes(k)).map(([, b]) => b.address.replace(/\n/g, ', ')).join('\n')
                  : '[BUREAU ADDRESS]'}
              </p>
              <p className="pt-2">RE: Dispute of Inaccurate Credit Information<br />
                SSN Last 4: XXXX | DOB: XX/XX/XXXX
              </p>
              <p className="pt-2">To Whom It May Concern:</p>
              <p>I am writing pursuant to the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report. Under Section 611 of the FCRA (15 U.S.C. § 1681i), I have the right to dispute incomplete or inaccurate information.</p>
              <p>I have identified the following items that I believe to be inaccurate or incomplete and request that you investigate and correct or remove these items within 30 days as required by law...</p>
              <p>[DISPUTE ITEMS LISTED HERE — AUTO-POPULATED BY AI]</p>
              <p className="pt-2">Please investigate this matter and provide written results of your investigation. If the disputed information cannot be verified, please delete it from my credit report.</p>
              <p className="pt-2">Sincerely,<br />[YOUR SIGNATURE]</p>
            </div>
            <div className="px-6 py-4 border-t border-secondary-200 bg-white flex justify-end gap-3">
              <button onClick={() => setPreviewOpen(false)} className="btn btn-secondary text-sm">Close</button>
              <button onClick={() => { setPreviewOpen(false); handleSend(); }} className="btn btn-primary text-sm">
                Send This Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
