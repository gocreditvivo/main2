import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Users, FileText, TrendingUp, Clock, CheckCircle2, AlertTriangle,
  MessageSquare, DollarSign, Calendar
} from 'lucide-react';

interface Client {
  id: string;
  user_id: string;
  client_status: string;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
}

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeDisputes: 0,
    pendingReview: 0,
    monthlyRevenue: 0,
  });
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load client count
      const { count: clientCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Load active disputes
      const { count: disputeCount } = await supabase
        .from('disputes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'in_review']);

      // Load pending attorney review
      const { count: reviewCount } = await supabase
        .from('disputes')
        .select('*', { count: 'exact', head: true })
        .eq('reviewed_by_attorney', false)
        .neq('status', 'draft');

      // Load recent clients with profiles
      const { data: clients } = await supabase
        .from('clients')
        .select('id, user_id, client_status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Get profiles for clients
      if (clients && clients.length > 0) {
        const userIds = clients.map(c => c.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        const clientsWithProfiles = clients.map(client => ({
          ...client,
          profiles: profiles?.find(p => p.id === client.user_id) || null,
        }));

        setRecentClients(clientsWithProfiles);
      }

      setStats({
        totalClients: clientCount || 0,
        activeDisputes: disputeCount || 0,
        pendingReview: reviewCount || 0,
        monthlyRevenue: 12900, // Placeholder
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-secondary-900">Admin Dashboard</h1>
              <span className="badge badge-primary capitalize">{profile?.role}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600">Total Clients</p>
              <Users className="h-5 w-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.totalClients}</p>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600">Active Disputes</p>
              <AlertTriangle className="h-5 w-5 text-warning-500" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.activeDisputes}</p>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600">Pending Review</p>
              <Clock className="h-5 w-5 text-error-500" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.pendingReview}</p>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600">Monthly Revenue</p>
              <DollarSign className="h-5 w-5 text-success-500" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mt-2">${stats.monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Recent Clients</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : recentClients.length === 0 ? (
            <p className="text-center text-secondary-500 py-8">No clients yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {recentClients.map((client) => (
                    <tr key={client.id} className="hover:bg-secondary-50">
                      <td className="px-4 py-4 font-medium text-secondary-900">
                        {client.profiles?.full_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 text-secondary-600">
                        {client.profiles?.email || 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge ${
                          client.client_status === 'active' ? 'badge-success' :
                          client.client_status === 'paused' ? 'badge-warning' : 'badge-secondary'
                        }`}>
                          {client.client_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-secondary-600">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Pending Tasks</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-secondary-600">
                <Clock className="h-4 w-4 text-warning-500" />
                {stats.pendingReview} disputes awaiting review
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-600">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                3 unread client messages
              </li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">FCRA Compliance</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Response deadlines this week</span>
                <span className="font-medium text-secondary-900">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Extensions needed</span>
                <span className="font-medium text-warning-600">2</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Success Metrics</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Items deleted this month</span>
                <span className="font-medium text-success-600">47</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Average score increase</span>
                <span className="font-medium text-success-600">+89 pts</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
