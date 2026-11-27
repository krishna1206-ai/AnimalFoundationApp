import type { FormType, SubmissionStatus } from '@/types';

export const colors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#E8F5E9',
  background: '#F5F7F6',
  card: '#FFFFFF',
  text: '#1C2421',
  textMuted: '#66736D',
  border: '#E1E6E3',
  danger: '#C62828',
  white: '#FFFFFF',
};

export const statusMeta: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#1565C0', bg: '#E3F2FD' },
  in_progress: { label: 'In progress', color: '#B26A00', bg: '#FFF3E0' },
  done: { label: 'Done', color: '#2E7D32', bg: '#E8F5E9' },
};

export const typeMeta: Record<FormType, { label: string; icon: 'paw' | 'mail'; color: string }> = {
  help: { label: 'Help request', icon: 'paw', color: '#D84315' },
  contact: { label: 'Contact', icon: 'mail', color: '#5E35B1' },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };
