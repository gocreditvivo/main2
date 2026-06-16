import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, User, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    const result = await signUp(email, password, fullName);

    if (result.error) {
      setError(result.error);
    } else if (result.needsVerification) {
      setNeedsVerification(true);
    } else {
      navigate('/onboarding');
    }
    setIsLoading(false);
  };

  if (needsVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 mb-6">
              <CheckCircle2 className="h-8 w-8 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900">Check your email</h2>
            <p className="mt-2 text-secondary-600">
              We've sent a verification link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-primary w-full mt-6">
              Continue to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex flex-col">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary-600 mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">Start Your Free Consultation</h1>
            <p className="mt-2 text-secondary-600">
              No upfront fees. Cancel anytime.
            </p>
          </div>

          <div className="card">
            <div className="rounded-lg bg-secondary-50 border border-secondary-200 p-4 mb-5 text-xs text-secondary-600 leading-relaxed">
              <p className="font-semibold text-secondary-800 mb-1">Consumer Notice Required by Federal Law (CROA)</p>
              You have the right to dispute inaccurate information directly with credit bureaus at no charge. Credit Vivo, LLC is a credit services organization (CSO) licensed in Virginia. You may cancel within 3 business days of signing without penalty.
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-error-50 border border-error-200 p-4">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="input-label">Full name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10"
                    placeholder="John Smith"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="input-label">Email address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="input-label">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10"
                    placeholder="Min. 8 characters"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="input-label">Confirm password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10"
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1 rounded border-secondary-300" required />
                <label htmlFor="terms" className="text-sm text-secondary-600">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                  ,{' '}
                  <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                  , and{' '}
                  <a href="#" className="text-primary-600 hover:underline">FCRA Disclosure</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating account...
                  </span>
                ) : (
                  'Create Free Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-secondary-500">
            Your information is protected by 256-bit encryption. We never share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
