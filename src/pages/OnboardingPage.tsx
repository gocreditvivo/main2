import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Shield, User, MapPin, FileText, CheckCircle2, ArrowRight, ArrowLeft,
  Calendar, Phone, Building, CreditCard, AlertCircle
} from 'lucide-react';

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'address', title: 'Address', icon: MapPin },
  { id: 'consent', title: 'Legal Consent', icon: FileText },
  { id: 'complete', title: 'Complete', icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, clientData, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    ssn_last4: '',
    current_address: '',
    city: '',
    state: '',
    zip: '',
    employment_status: '',
    annual_income: '',
    credit_monitoring_service: '',
  });

  const [consents, setConsents] = useState({
    terms_of_service: false,
    privacy_policy: false,
    fcra_disclosure: false,
    croa_disclosure: false,
    electronic_signature_consent: false,
    credit_pull_authorization: false,
  });

  useEffect(() => {
    if (clientData?.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [clientData, navigate]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateConsent = (field: keyof typeof consents, value: boolean) => {
    setConsents(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create or update client record
      const clientRecord = {
        user_id: user.id,
        ssn_last4: formData.ssn_last4,
        date_of_birth: formData.date_of_birth || null,
        current_address: `${formData.current_address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        employment_status: formData.employment_status || null,
        annual_income: formData.annual_income ? parseInt(formData.annual_income) : null,
        credit_monitoring_service: formData.credit_monitoring_service || null,
        state_of_residence: formData.state,
        onboarding_completed: true,
        consent_signed_at: new Date().toISOString(),
        consent_ip_address: '0.0.0.0', // Would capture real IP in production
        terms_accepted_at: consents.terms_of_service ? new Date().toISOString() : null,
        privacy_policy_accepted_at: consents.privacy_policy ? new Date().toISOString() : null,
        fcra_disclosure_accepted_at: consents.fcra_disclosure ? new Date().toISOString() : null,
        client_status: 'active',
      };

      const { error: clientError } = await supabase
        .from('clients')
        .upsert(clientRecord, { onConflict: 'user_id' });

      if (clientError) throw clientError;

      // Record consent records
      const consentRecords = Object.entries(consents)
        .filter(([, agreed]) => agreed)
        .map(([type]) => ({
          client_id: user.id,
          consent_type: type,
          version: '1.0',
          signed_at: new Date().toISOString(),
          ip_address: '0.0.0.0',
        }));

      if (consentRecords.length > 0) {
        const { error: consentError } = await supabase
          .from('consent_records')
          .insert(consentRecords);

        if (consentError) throw consentError;
      }

      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900">Personal Information</h2>
        <p className="mt-2 text-secondary-600">Let's start with some basic details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="input-label">Full Legal Name *</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => updateFormData('full_name', e.target.value)}
            className="mt-1 w-full"
            placeholder="John Smith"
            required
          />
        </div>

        <div>
          <label className="input-label">Phone Number *</label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="w-full pl-10"
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>

        <div>
          <label className="input-label">Date of Birth *</label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => updateFormData('date_of_birth', e.target.value)}
              className="w-full pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="input-label">Last 4 digits of SSN *</label>
          <div className="relative mt-1">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              maxLength={4}
              value={formData.ssn_last4}
              onChange={(e) => updateFormData('ssn_last4', e.target.value.replace(/\D/g, ''))}
              className="w-full pl-10"
              placeholder="1234"
              required
            />
          </div>
          <p className="input-hint">Used for identity verification only. Encrypted and secure.</p>
        </div>

        <div>
          <label className="input-label">Employment Status</label>
          <select
            value={formData.employment_status}
            onChange={(e) => updateFormData('employment_status', e.target.value)}
            className="mt-1 w-full"
          >
            <option value="">Select...</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!formData.full_name || !formData.phone || !formData.date_of_birth || !formData.ssn_last4}
          className="btn btn-primary"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900">Your Address</h2>
        <p className="mt-2 text-secondary-600">Required for credit bureau verification</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="input-label">Street Address *</label>
          <div className="relative mt-1">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              value={formData.current_address}
              onChange={(e) => updateFormData('current_address', e.target.value)}
              className="w-full pl-10"
              placeholder="123 Main Street"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="input-label">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              className="mt-1 w-full"
              placeholder="Los Angeles"
              required
            />
          </div>

          <div>
            <label className="input-label">State *</label>
            <select
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              className="mt-1 w-full"
              required
            >
              <option value="">Select...</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="WA">Washington</option>
            </select>
          </div>

          <div>
            <label className="input-label">ZIP Code *</label>
            <input
              type="text"
              maxLength={5}
              value={formData.zip}
              onChange={(e) => updateFormData('zip', e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full"
              placeholder="90210"
              required
            />
          </div>
        </div>

        <div>
          <label className="input-label">Annual Income (Optional)</label>
          <div className="relative mt-1">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              value={formData.annual_income}
              onChange={(e) => updateFormData('annual_income', e.target.value.replace(/\D/g, ''))}
              className="w-full pl-10"
              placeholder="75000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="btn btn-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.current_address || !formData.city || !formData.state || !formData.zip}
          className="btn btn-primary"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900">Legal Agreements & Disclosures</h2>
        <p className="mt-2 text-secondary-600">Required by the Credit Repair Organizations Act (CROA)</p>
      </div>

      {/* CROA Required Disclosure Box */}
      <div className="rounded-xl bg-primary-50 border-2 border-primary-200 p-5 space-y-3">
        <p className="text-sm font-bold text-primary-900 uppercase tracking-wide">Consumer Rights Notice — Required by Federal Law (CROA)</p>
        <p className="text-sm text-primary-800 leading-relaxed">
          <strong>You have the right to dispute inaccurate information in your credit report yourself, directly with the credit reporting agencies (Equifax, Experian, TransUnion) at no charge.</strong> You are not required to use a credit repair organization to improve your credit.
        </p>
        <p className="text-sm text-primary-800 leading-relaxed">
          Under the Credit Repair Organizations Act (15 U.S.C. § 1679 et seq.), you have the right to cancel this agreement within <strong>3 business days</strong> of signing without any penalty or obligation. To cancel, contact us at support@creditvivo.com.
        </p>
        <p className="text-sm text-primary-800 leading-relaxed">
          Credit Vivo, LLC does not charge fees before services are fully performed. We cannot guarantee any specific credit score outcome. Results vary based on the contents of your individual credit report.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            key: 'terms_of_service',
            title: 'Terms of Service',
            desc: 'I have read and agree to the Terms of Service and conditions of use.',
          },
          {
            key: 'privacy_policy',
            title: 'Privacy Policy',
            desc: 'I have read and understand how Credit Vivo collects, uses, and protects my personal information.',
          },
          {
            key: 'fcra_disclosure',
            title: 'FCRA Consumer Rights Disclosure',
            desc: 'I have received and understand the Fair Credit Reporting Act disclosure, including my right to dispute inaccurate information directly with credit bureaus at no charge.',
          },
          {
            key: 'croa_disclosure',
            title: 'CROA Disclosure & 3-Day Right of Cancellation',
            desc: 'I have received the Credit Repair Organizations Act disclosure. I understand I may cancel this agreement within 3 business days without penalty by contacting support@creditvivo.com.',
          },
          {
            key: 'electronic_signature_consent',
            title: 'Electronic Signature Consent',
            desc: 'I consent to use electronic signatures and electronic records for all documents, disclosures, and agreements related to my Credit Vivo account.',
          },
          {
            key: 'credit_pull_authorization',
            title: 'Credit Report Authorization',
            desc: 'I authorize Credit Vivo, LLC to access and analyze my credit reports from Equifax, Experian, and/or TransUnion for the purpose of identifying and disputing inaccurate or unverifiable information.',
          },
        ].map((item) => (
          <div key={item.key} className="rounded-lg border border-secondary-200 bg-white p-4 hover:border-primary-300 transition-colors">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents[item.key as keyof typeof consents]}
                onChange={(e) => updateConsent(item.key as keyof typeof consents, e.target.checked)}
                className="mt-1 rounded border-secondary-300 text-primary-600"
              />
              <div>
                <p className="font-semibold text-secondary-900 text-sm">{item.title}</p>
                <p className="text-sm text-secondary-600 mt-0.5">{item.desc}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-warning-50 border border-warning-200 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0" />
          <p className="text-sm text-warning-800">
            By checking all boxes and proceeding, you acknowledge receipt of all required CROA and FCRA disclosures and agree to the terms above. This constitutes your electronic signature on a legally binding credit services agreement dated {new Date().toLocaleDateString()}.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="btn btn-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!Object.values(consents).every(Boolean)}
          className="btn btn-primary"
        >
          I Agree — Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6 text-center">
      <div className="py-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-accent-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900">You're All Set!</h2>
        <p className="mt-2 text-secondary-600">
          Your account is ready. Let's start improving your credit.
        </p>
      </div>

      <div className="rounded-lg bg-primary-50 border border-primary-200 p-6 text-left">
        <h3 className="font-semibold text-primary-900 mb-3">What happens next?</h3>
        <ol className="space-y-2 text-sm text-primary-800">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            Import your credit reports from all three bureaus
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            Our AI scans your reports and identifies potentially disputable items
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            We generate FCRA-compliant dispute letters and submit on your behalf
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            Monitor your progress and score improvements
          </li>
        </ol>
      </div>

      {error && (
        <div className="rounded-lg bg-error-50 border border-error-200 p-4 text-left">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn btn-primary btn-lg w-full"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Setting up your account...
          </span>
        ) : (
          <>
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderAddress();
      case 2:
        return renderConsent();
      case 3:
        return renderComplete();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 mb-4">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Welcome to Credit Vivo</h1>
          <p className="mt-1 text-secondary-600">Complete your setup to get started</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    index < currentStep
                      ? 'bg-accent-500 text-white'
                      : index === currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-200 text-secondary-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium ${
                  index <= currentStep ? 'text-secondary-900' : 'text-secondary-400'
                }`}>
                  {step.title}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-full top-5 h-0.5 w-full bg-secondary-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="card">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
