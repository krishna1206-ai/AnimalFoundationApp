import { fetchPage } from '@/utils/extract';

const ALLOWED_HOST = 'worldanimalfoundation.org';

/**
 * GET /api/page?url=<website page>
 * Server-side fetch of a worldanimalfoundation.org page, so the web build isn't blocked by CORS.
 * Only the foundation's own site is allowed (this is not an open proxy).
 */
export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url') ?? '';

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return Response.json({ error: 'Invalid url' }, { status: 400 });
  }
  if (parsed.protocol !== 'https:' || parsed.hostname !== ALLOWED_HOST) {
    return Response.json({ error: 'Only worldanimalfoundation.org pages are allowed' }, { status: 403 });
  }

  try {
    const page = await fetchPage(parsed.toString());
    return Response.json(page, { headers: { 'Cache-Control': 'public, max-age=300' } });
  } catch {
    return Response.json({ error: 'Could not load page' }, { status: 502 });
  }
}
