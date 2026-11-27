import { useEffect, useMemo } from 'react';

import { colors } from '@/constants/theme';
import { site } from '@/data/site';
import { renderDocument, type PageContent } from '@/utils/extract';

type ArticlePage = Extract<PageContent, { kind: 'article' }>;

// Inside the iframe: catch link clicks and hand them to the app instead of navigating.
const LINK_SCRIPT = `<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  e.preventDefault();
  parent.postMessage({ type: 'waf-link', url: a.href }, '*');
});
</script>`;

/** Web: render the extracted article in a sandboxed iframe. Link clicks go to `onLink`. */
export function ArticleView({ page, onLink }: { page: ArticlePage; onLink: (url: string) => void }) {
  const doc = useMemo(
    () =>
      renderDocument(page)
        .replace('<head>', `<head><base href="${site.url}/">`)
        .replace('</body>', `${LINK_SCRIPT}</body>`),
    [page],
  );

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'waf-link' && typeof e.data.url === 'string') onLink(e.data.url);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onLink]);

  return (
    <iframe
      title={page.title}
      srcDoc={doc}
      sandbox="allow-scripts"
      style={{ flex: 1, width: '100%', height: '100%', border: 0, background: colors.background }}
    />
  );
}
