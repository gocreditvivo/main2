import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield, LayoutDashboard, FileText, AlertTriangle, FolderOpen,
  MessageSquare, TrendingUp, Settings, LogOut, Menu, X, Bell,
  ChevronDown, Brain, Scale, BookOpen, Mail
} from 'lucide-react';
import { useState } from 'react';
import AIChatbot from '../AIChatbot';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true, highlight: false },
  { to: '/dashboard/credit-reports', label: 'Credit Reports', icon: FileText, highlight: false },
  { to: '/dashboard/disputes', label: 'Disputes', icon: AlertTriangle, highlight: false },
  { to: '/dashboard/legal-team', label: 'Legal Shield', icon: Scale, highlight: true },
  { to: '/dashboard/mailing', label: 'Mail Letters', icon: Mail, highlight: false },
  { to: '/dashboard/learning', label: 'Learning Center', icon: BookOpen, highlight: false },
  { to: '/dashboard/documents', label: 'Documents', icon: FolderOpen, highlight: false },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare, highlight: false },
  { to: '/dashboard/progress', label: 'Progress', icon: TrendingUp, highlight: false },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, highlight: false },
];

export default function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-secondary-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary-950 transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-white">Credit</span>
                <span className="text-primary-400 font-bold text-base"> Vivo</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-secondary-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* AI Engine Status */}
          <div className="mx-3 mt-3 rounded-lg bg-secondary-800/60 border border-secondary-700 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-500/20">
                <Brain className="h-4 w-4 text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">AI Engine</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                  <p className="text-xs text-accent-400">Active & Monitoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => {
                  if (isActive) return 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-primary-600 text-white';
                  if (item.highlight) return 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-warning-300 hover:bg-warning-500/10 hover:text-warning-200 transition-colors border border-warning-500/20 my-0.5';
                  return 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-400 hover:bg-secondary-800 hover:text-white transition-colors';
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" style={{ width: '1.1rem', height: '1.1rem' }} />
                <span className="flex-1">{item.label}</span>
                {item.highlight && (
                  <span className="text-[9px] font-bold bg-warning-500/30 text-warning-300 rounded px-1">ATY</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-secondary-800">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary-800 transition-colors mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white font-semibold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-secondary-500 truncate">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm text-secondary-400 hover:bg-secondary-800 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-15" style={{ height: '3.75rem' }}>
            <button
              className="lg:hidden p-2 -ml-2 text-secondary-500 hover:text-secondary-900 rounded-lg hover:bg-secondary-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
                <span className="text-xs font-semibold text-accent-700">AI Monitoring Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 text-secondary-500 hover:text-secondary-900 rounded-lg hover:bg-secondary-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-error-500 border-2 border-white" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white font-semibold text-xs">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-secondary-700">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-secondary-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-elevated ring-1 ring-secondary-200 z-20">
                      <div className="px-4 py-2.5 border-b border-secondary-100">
                        <p className="text-sm font-semibold text-secondary-900">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-secondary-500">{profile?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
