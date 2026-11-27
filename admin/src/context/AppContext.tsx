import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { mockSubmissions } from '@/data/mockSubmissions';
import { isBackendConfigured, supabase } from '@/lib/supabase';
import type { Submission, SubmissionStatus } from '@/types';

interface AppContextValue {
  /** false until the saved login session has been checked */
  ready: boolean;
  /** true when running without Supabase keys (sample data, any login) */
  demoMode: boolean;
  isLoggedIn: boolean;
  ownerEmail: string | null;
  login: (email: string, password: string) => Promise<string | null>; // returns an error message or null
  logout: () => Promise<void>;
  submissions: Submission[];
  loading: boolean;
  refresh: () => Promise<void>;
  getSubmission: (id: string) => Submission | undefined;
  updateStatus: (id: string, status: SubmissionStatus) => void;
  updateNotes: (id: string, notes: string) => void;
  deleteSubmission: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

interface RequestRow {
  id: string;
  type: Submission['type'];
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  location: string | null;
  status: SubmissionStatus;
  notes: string | null;
  created_at: string;
}

const fromRow = (r: RequestRow): Submission => ({
  id: r.id,
  type: r.type,
  name: r.name,
  email: r.email,
  phone: r.phone ?? undefined,
  subject: r.subject,
  message: r.message,
  location: r.location ?? undefined,
  status: r.status,
  notes: r.notes ?? undefined,
  createdAt: r.created_at,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const demoMode = !isBackendConfigured;
  const [ready, setReady] = useState(demoMode);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>(demoMode ? mockSubmissions : []);
  const [loading, setLoading] = useState(false);

  // Only users listed in the `admins` table are allowed in.
  const acceptSession = useCallback(async (email: string | null | undefined, userId?: string) => {
    if (!supabase || !userId) {
      setOwnerEmail(null);
      return null;
    }
    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error || !data) {
      await supabase.auth.signOut();
      setOwnerEmail(null);
      return 'This account is not an admin.';
    }
    setOwnerEmail(email ?? 'Owner');
    return null;
  }, []);

  // Restore a saved session when the app opens.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (u) await acceptSession(u.email, u.id);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setOwnerEmail(null);
    });
    return () => sub.subscription.unsubscribe();
  }, [acceptSession]);

  const refresh = useCallback(async () => {
    if (!supabase || !ownerEmail) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSubmissions((data as RequestRow[]).map(fromRow));
    setLoading(false);
  }, [ownerEmail]);

  // Load requests after login, and listen for changes live (new requests appear instantly).
  useEffect(() => {
    if (!supabase || !ownerEmail) {
      if (!demoMode) setSubmissions([]);
      return;
    }
    refresh();
    const channel = supabase
      .channel('requests-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const s = fromRow(payload.new as RequestRow);
          setSubmissions((prev) => (prev.some((p) => p.id === s.id) ? prev : [s, ...prev]));
        } else if (payload.eventType === 'UPDATE') {
          const s = fromRow(payload.new as RequestRow);
          setSubmissions((prev) => prev.map((p) => (p.id === s.id ? s : p)));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id?: string }).id;
          if (id) setSubmissions((prev) => prev.filter((p) => p.id !== id));
        }
      })
      .subscribe();
    return () => {
      supabase?.removeChannel(channel);
    };
  }, [ownerEmail, demoMode, refresh]);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      demoMode,
      isLoggedIn: ownerEmail !== null,
      ownerEmail,
      login: async (email, password) => {
        if (!email.trim() || !password) return 'Please enter your email and password.';
        if (!supabase) {
          // Demo mode: no backend configured yet, any login works with sample data.
          setOwnerEmail(email.trim());
          return null;
        }
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error || !data.user) return 'Wrong email or password.';
        return acceptSession(data.user.email, data.user.id);
      },
      logout: async () => {
        if (supabase) await supabase.auth.signOut();
        setOwnerEmail(null);
      },
      submissions,
      loading,
      refresh,
      getSubmission: (id) => submissions.find((s) => s.id === id),
      // Optimistic updates: change the screen immediately, then save to the database.
      updateStatus: (id, status) => {
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
        supabase
          ?.from('requests')
          .update({ status })
          .eq('id', id)
          .then(({ error }) => {
            if (error) refresh();
          });
      },
      updateNotes: (id, notes) => {
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s)));
        supabase
          ?.from('requests')
          .update({ notes })
          .eq('id', id)
          .then(({ error }) => {
            if (error) refresh();
          });
      },
      deleteSubmission: (id) => {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        supabase
          ?.from('requests')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) refresh();
          });
      },
    }),
    [ready, demoMode, ownerEmail, submissions, loading, refresh, acceptSession],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
