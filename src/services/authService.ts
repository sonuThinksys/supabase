import { supabase } from '../supabase/client';

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<void> => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(error.message);
  }
};