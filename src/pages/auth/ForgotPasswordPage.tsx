import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
    setIsLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 mb-6">
              <CheckCircle2 className="h-8 w-8 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900">Check your email</h2>
            <p className="mt-2 text-secondary-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-primary w-full mt-6">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex flex-col">
      <div className="p-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary-600 mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">Reset your password</h1>
            <p className="mt-2 text-secondary-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-error-50 border border-error-200 p-4">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

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

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
