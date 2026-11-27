import { contact } from '@/data/site';
import { openExternal } from '@/utils/open';

export type FormType = 'contact' | 'help';

/** Same shape the admin app uses for a request (see animal-foundation-app/src/types.ts). */
export interface ContactRequest {
  type: FormType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  location?: string;
}

/**
 * Send a contact / help request.
 * For now this opens the user's email app, pre-filled and addressed to the foundation.
 * When the admin backend exists, replace the body of this function with an API call —
 * the form itself does not need to change.
 */
export async function submitRequest(req: ContactRequest) {
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
  const url =
    `mailto:${contact.email}` +
    `?subject=${encodeURIComponent(prefix + req.subject)}` +
    `&body=${encodeURIComponent(lines.join('\n'))}`;
  await openExternal(url);
}
