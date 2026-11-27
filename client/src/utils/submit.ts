import { contact } from '@/data/site';
import { isBackendConfigured, supabase } from '@/lib/supabase';
import { openExternal } from '@/utils/open';

export type FormType = 'contact' | 'help';

/** Same shape the admin app uses for a request (see admin/src/types.ts and supabase/schema.sql). */
export interface ContactRequest {
  type: FormType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  location?: string;
}

/** 'saved' = stored in the database (shows up in the admin app); 'email' = handed to the email app. */
export type SubmitResult = 'saved' | 'email';

/**
 * Send a contact / help request to the admin app (Supabase `requests` table).
 * If the backend isn't configured yet, falls back to opening a pre-filled email.
 * Throws if the database rejects the request.
 */
export async function submitRequest(req: ContactRequest): Promise<SubmitResult> {
  if (isBackendConfigured && supabase) {
    const { error } = await supabase.from('requests').insert({
      type: req.type,
      name: req.name,
      email: req.email,
      phone: req.phone ?? null,
      subject: req.subject,
      message: req.message,
      location: req.location ?? null,
    });
    if (error) throw new Error(error.message);
    return 'saved';
  }

  const lines = [
    `Type: ${req.type === 'help' ? 'Help request' : 'Contact'}`,
    `Name: ${req.name}`,
    `Email: ${req.email}`,
    req.phone ? `Phone: ${req.phone}` : null,
    req.location ? `Location: ${req.location}` : null,
    '',
    req.message,
    '',
    '— Sent from the World Animal Foundation app',
  ].filter((l) => l !== null);
  const prefix = req.type === 'help' ? '[Help request] ' : '';
  await openExternal(
    `mailto:${contact.email}?subject=${encodeURIComponent(prefix + req.subject)}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`,
  );
  return 'email';
}
