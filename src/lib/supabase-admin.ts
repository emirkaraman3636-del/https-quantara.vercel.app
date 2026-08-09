import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// This client uses the Service Role key and bypasses Row Level Security (RLS).
// NEVER import this in a client component.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
