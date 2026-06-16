import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const CreditReportsPage = lazy(() => import('./pages/dashboard/CreditReportsPage'));
const DisputesPage = lazy(() => import('./pages/dashboard/DisputesPage'));
const DocumentsPage = lazy(() => import('./pages/dashboard/DocumentsPage'));
const MessagesPage = lazy(() => import('./pages/dashboard/MessagesPage'));
const ProgressPage = lazy(() => import('./pages/dashboard/ProgressPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const LegalTeamPage = lazy(() => import('./pages/dashboard/LegalTeamPage'));
const LearningPage = lazy(() => import('./pages/dashboard/LearningPage'));
const MailingPage = lazy(() => import('./pages/dashboard/MailingPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ScanTestPage = lazy(() => import('./pages/ScanTestPage'));

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-sm text-secondary-500">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, requireOnboarding = true, requireAdmin = false }: {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireAdmin?: boolean;
}) {
  const { user, profile, clientData, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireOnboarding && profile?.role === 'client' && clientData && !clientData.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, clientData, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    if (profile?.role === 'client' && clientData && !clientData.onboarding_completed) {
      return <Navigate to="/onboarding" replace />;
    }
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
    if (profile?.role === 'attorney' || profile?.role === 'paralegal') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <PublicRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <LandingPage />
          </Suspense>
        </PublicRoute>
      } />

      <Route path="/login" element={
        <PublicRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <RegisterPage />
          </Suspense>
        </PublicRoute>
      } />

      <Route path="/forgot-password" element={
        <PublicRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPasswordPage />
          </Suspense>
        </PublicRoute>
      } />

      <Route path="/reset-password" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ResetPasswordPage />
        </Suspense>
      } />

      {/* Onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute requireOnboarding={false}>
          <Suspense fallback={<LoadingSpinner />}>
            <OnboardingPage />
          </Suspense>
        </ProtectedRoute>
      } />

      {/* Dashboard routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardLayout />
          </Suspense>
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        } />
        <Route path="credit-reports" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CreditReportsPage />
          </Suspense>
        } />
        <Route path="disputes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DisputesPage />
          </Suspense>
        } />
        <Route path="documents" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DocumentsPage />
          </Suspense>
        } />
        <Route path="messages" element={
          <Suspense fallback={<LoadingSpinner />}>
            <MessagesPage />
          </Suspense>
        } />
        <Route path="progress" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProgressPage />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        } />
        <Route path="legal-team" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LegalTeamPage />
          </Suspense>
        } />
        <Route path="learning" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LearningPage />
          </Suspense>
        } />
        <Route path="mailing" element={
          <Suspense fallback={<LoadingSpinner />}>
            <MailingPage />
          </Suspense>
        } />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />

      {/* Internal scan test — no auth required */}
      <Route path="/scan" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ScanTestPage />
        </Suspense>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
