import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { mockSubmissions } from '@/data/mockSubmissions';
import type { Submission, SubmissionStatus } from '@/types';

interface AppContextValue {
  isLoggedIn: boolean;
  ownerEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  submissions: Submission[];
  getSubmission: (id: string) => Submission | undefined;
  updateStatus: (id: string, status: SubmissionStatus) => void;
  updateNotes: (id: string, notes: string) => void;
  deleteSubmission: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);

  const value = useMemo<AppContextValue>(
    () => ({
      isLoggedIn: ownerEmail !== null,
      ownerEmail,
      // Frontend-only: accepts any non-empty email/password.
      // Real authentication comes with the backend.
      login: (email, password) => {
        if (!email.trim() || !password.trim()) return false;
        setOwnerEmail(email.trim());
        return true;
      },
      logout: () => setOwnerEmail(null),
      submissions,
      getSubmission: (id) => submissions.find((s) => s.id === id),
      updateStatus: (id, status) =>
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s))),
      updateNotes: (id, notes) =>
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s))),
      deleteSubmission: (id) => setSubmissions((prev) => prev.filter((s) => s.id !== id)),
    }),
    [ownerEmail, submissions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
