import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** True when the Supabase keys are set (in .env locally, or in Vercel → Environment Variables). */
export const isBackendConfigured = Boolean(url && anonKey);

export const supabase = isBackendConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        // Keep the owner signed in between app launches (web uses localStorage by default).
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
