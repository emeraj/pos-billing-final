import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange, signUp, signIn, logOut, getUserProfile, UserProfile } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        // Load user profile
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      await signUp(email, password, displayName);
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setError(null);
    
    try {
      await logOut();
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    const message = error.message || '';

    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    } else if (message.includes('User already registered')) {
      return 'This email is already registered. Please sign in instead.';
    } else if (message.includes('Password should be at least')) {
      return 'Password is too weak. Please choose a stronger password.';
    } else if (message.includes('invalid email')) {
      return 'Please enter a valid email address.';
    } else if (message.includes('too many requests')) {
      return 'Too many failed attempts. Please try again later.';
    }

    return error.message || 'An error occurred. Please try again.';
  };

  return {
    user,
    userProfile,
    loading,
    authLoading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    clearError: () => setError(null)
  };
};