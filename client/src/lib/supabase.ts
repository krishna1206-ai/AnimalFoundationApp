import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** True when the Supabase keys are set (in .env locally, or in Vercel → Environment Variables). */
export const isBackendConfigured = Boolean(url && anonKey);

// The public client app never logs in; it only inserts contact / help requests.
export const supabase = isBackendConfigured
  ? createClient(url!, anonKey!, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;
