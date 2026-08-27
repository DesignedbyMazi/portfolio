import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njoyptksatbnlcywxltz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb3lwdGtzYXRibmxjeXd4bHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NjA2MDYsImV4cCI6MjEwMzQzNjYwNn0.hmPWbvnAMmc6QexDvTDHSy7W9HEKozkElQVPy18cEPo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
