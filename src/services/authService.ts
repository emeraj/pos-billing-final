import { supabase } from '../config/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    return data.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    return data.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return {
        uid: user.id,
        email: user.email || '',
        displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        createdAt: user.created_at
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });

  return data.subscription.unsubscribe;
};
