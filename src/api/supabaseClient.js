import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Missing Supabase environment variables! Check Vercel settings.');
}

// Initialize the Supabase client for authentication and direct DB queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
