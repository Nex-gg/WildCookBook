import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName: string, country?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  verifyEmail: (otp: string) => Promise<{ error?: string }>;
  resendVerification: () => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (() => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, username: string, fullName: string, country?: string) {
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        return { error: 'Username already taken' };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          full_name: fullName,
          subscription_tier: 'free',
          country: country || null,
        });

      if (profileError) throw profileError;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabase.from('email_verifications').insert({
        user_id: authData.user.id,
        email,
        otp,
        expires_at: expiresAt,
      });

      return {};
    } catch (error: any) {
      return { error: error.message || 'Sign up failed' };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return {};
    } catch (error: any) {
      return { error: error.message || 'Sign in failed' };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  async function verifyEmail(otp: string) {
    try {
      if (!user) throw new Error('No user logged in');

      const { data: verification, error: fetchError } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!verification) throw new Error('No verification found');

      if (new Date(verification.expires_at) < new Date()) {
        throw new Error('Verification code expired');
      }

      if (verification.otp !== otp) {
        await supabase
          .from('email_verifications')
          .update({ attempts: verification.attempts + 1 })
          .eq('id', verification.id);
        throw new Error('Invalid verification code');
      }

      await supabase
        .from('email_verifications')
        .update({ verified: true })
        .eq('id', verification.id);

      return {};
    } catch (error: any) {
      return { error: error.message || 'Verification failed' };
    }
  }

  async function resendVerification() {
    try {
      if (!user) throw new Error('No user logged in');

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabase.from('email_verifications').insert({
        user_id: user.id,
        email: user.email!,
        otp,
        expires_at: expiresAt,
      });

      return {};
    } catch (error: any) {
      return { error: error.message || 'Resend failed' };
    }
  }

  async function refreshProfile() {
    if (user) {
      await loadProfile(user.id);
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, verifyEmail, resendVerification, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
