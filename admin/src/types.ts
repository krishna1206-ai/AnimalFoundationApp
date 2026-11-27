export type FormType = 'help' | 'contact';

export type SubmissionStatus = 'new' | 'in_progress' | 'done';

export interface Submission {
  id: string;
  type: FormType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  location?: string;
  createdAt: string; // ISO date string
  status: SubmissionStatus;
  notes?: string;
}
