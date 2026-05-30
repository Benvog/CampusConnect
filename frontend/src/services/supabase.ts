import { createClient } from '@supabase/supabase-js';

// Get these from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API base URL for backend calls
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
