import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User, Lock, Bell, CreditCard, Shield, FileText,
  Save, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    email_notifications: true,
    sms_notifications: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSaved(false);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="mt-1 text-secondary-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {saved && (
            <div className="mb-6 rounded-lg bg-success-50 border border-success-200 p-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success-600" />
              <p className="text-sm text-success-700">Changes saved successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-error-50 border border-error-200 p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-error-600" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 w-full bg-secondary-50 cursor-not-allowed"
                  />
                  <p className="input-hint">Contact support to change your email</p>
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 w-full"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Change Password</h2>
              <div className="space-y-6">
                <div>
                  <label className="input-label">Current Password</label>
                  <input
                    type="password"
                    value={formData.current_password}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="input-label">New Password</label>
                  <input
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                    className="mt-1 w-full"
                  />
                  <p className="input-hint">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="input-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="mt-1 w-full"
                  />
                </div>
                <button className="btn btn-primary">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="btn btn-secondary">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">Email Notifications</p>
                    <p className="text-sm text-secondary-600">Receive updates about your disputes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.email_notifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, email_notifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">SMS Notifications</p>
                    <p className="text-sm text-secondary-600">Get text alerts for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sms_notifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, sms_notifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Subscription Plan</h2>
              <div className="rounded-lg bg-primary-50 border border-primary-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-900">Professional Plan</p>
                    <p className="text-sm text-primary-700">$129/month</p>
                  </div>
                  <span className="badge badge-primary">Active</span>
                </div>
              </div>
              <div className="space-y-4">
                <button className="btn btn-secondary w-full">Change Plan</button>
                <button className="btn btn-ghost text-error-600 w-full">Cancel Subscription</button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Privacy & Data</h2>
              <div className="space-y-6">
                <div className="rounded-lg bg-secondary-50 p-4">
                  <p className="font-medium text-secondary-900">Data Export</p>
                  <p className="text-sm text-secondary-600 mt-1">
                    Download a copy of all your data
                  </p>
                  <button className="btn btn-secondary btn-sm mt-3">Export My Data</button>
                </div>
                <div className="rounded-lg bg-error-50 p-4">
                  <p className="font-medium text-error-900">Delete Account</p>
                  <p className="text-sm text-error-700 mt-1">
                    Permanently delete your account and all data
                  </p>
                  <button className="btn btn-danger btn-sm mt-3">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Legal Documents</h2>
              <div className="space-y-4">
                {[
                  'Terms of Service',
                  'Privacy Policy',
                  'FCRA Disclosure',
                  'CROA Disclosure',
                  'Representation Agreement',
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-secondary-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-900">{doc}</span>
                    </div>
                    <button className="btn btn-ghost btn-sm">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
