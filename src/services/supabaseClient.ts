import { createClient } from '@supabase/supabase-js';

// Environment Variables for Supabase Managed Cloud PostgreSQL Backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseConfig {
  isConfigured: boolean;
  url: string;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your-supabase-project')
  );
};

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    isConfigured: isSupabaseConfigured(),
    url: supabaseUrl
  };
};
