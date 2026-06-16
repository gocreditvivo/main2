import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'client' | 'attorney' | 'paralegal' | 'admin' | 'super_admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  preferences: Record<string, unknown>;
}

interface ClientData {
  id: string;
  user_id: string;
  ssn_last4: string | null;
  date_of_birth: string | null;
  current_address: string | null;
  client_status: 'prospect' | 'active' | 'paused' | 'cancelled' | 'completed';
  onboarding_completed: boolean;
  consent_signed_at: string | null;
  terms_accepted_at: string | null;
  privacy_policy_accepted_at: string | null;
  fcra_disclosure_accepted_at: string | null;
  state_of_residence: string | null;
  assigned_attorney_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  clientData: ClientData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null; needsVerification?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user?.email || '',
              role: 'client',
              full_name: user?.user_metadata?.full_name || null,
            })
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          throw profileError;
        }
      } else {
        setProfile(profileData);
      }

      if (profileData?.role === 'client' || (profileData === null && user?.user_metadata?.role !== 'attorney')) {
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (clientError && clientError.code !== 'PGRST116') {
          console.error('Error fetching client data:', clientError);
        } else if (!clientError && client) {
          setClientData(client);
        }
      }
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchUserData(currentSession.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_IN' && newSession?.user) {
        await fetchUserData(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setClientData(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (signInError) {
        const errorMessage = signInError.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : signInError.message;
        return { error: errorMessage };
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      return { error: message };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName || null,
            role: 'client',
          },
        },
      });

      if (signUpError) {
        return { error: signUpError.message };
      }

      if (!data.session && data.user && !data.user.email_confirmed_at) {
        return { error: null, needsVerification: true };
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: email.toLowerCase().trim(),
          full_name: fullName || null,
          role: 'client',
        });

        if (profileError && profileError.code !== '23505') {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null, needsVerification: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      return { error: message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setClientData(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (resetError) {
        return { error: resetError.message };
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      return { error: message };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        return { error: updateError.message };
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password update failed';
      return { error: message };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    clientData,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
