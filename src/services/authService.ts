import { supabase } from '../supabase/client';

const getFriendlyAuthError = (message: string, status?: number): string => {
  if (status === 504 || status === 503 || status === 502) {
    return 'Server is temporarily unavailable. Please try again later.';
  }
  if (status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Incorrect email or password.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('timeout')) {
    return 'Network error. Please check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
};

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(getFriendlyAuthError(error.message, error.status));
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<void> => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(getFriendlyAuthError(error.message, error.status));
  }
};