import { site } from '@/data/site';

export interface ListItem {
  title: string;
  url: string;
  image?: string;
  date?: string;
  category?: string;
  excerpt?: string;
}

/** A downloaded website page: either a readable article/page, or a category list of articles. */
export type PageContent =
  | { kind: 'article'; title: string; image?: string; html: string }
  | { kind: 'list'; title: string; items: ListItem[]; nextUrl?: string };

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;|&#0?38;/g, '&')
    .replace(/&quot;|&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#0?39;|&#8217;|&#8216;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&hellip;|&#8230;/g, '…')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Find the element whose opening tag matches `openTag` and return
 * [start of opening tag, start of inner html, end of inner html, end of closing tag].
 * Handles nesting of the same tag name.
 */
function locate(html: string, openTag: RegExp, from = 0): [number, number, number, number] | null {
  const re = new RegExp(openTag.source, openTag.flags.includes('g') ? openTag.flags : openTag.flags + 'g');
  re.lastIndex = from;
  const m = re.exec(html);
  if (!m) return null;
  const tagName = /^<([a-z0-9]+)/i.exec(m[0])?.[1] ?? 'div';
  const innerStart = m.index + m[0].length;
  const scan = new RegExp(`<${tagName}\\b|</${tagName}\\s*>`, 'gi');
  scan.lastIndex = innerStart;
  let depth = 1;
  let t: RegExpExecArray | null;
  while ((t = scan.exec(html))) {
    depth += t[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return [m.index, innerStart, t.index, t.index + t[0].length];
  }
  return [m.index, innerStart, html.length, html.length];
}

const innerOf = (html: string, openTag: RegExp) => {
  const r = locate(html, openTag);
  return r ? html.slice(r[1], r[2]) : null;
};

/** Remove every element (with its children) whose opening tag matches `openTag`. */
function removeAll(html: string, openTag: RegExp): string {
  let out = html;
  for (let guard = 0; guard < 200; guard++) {
    const r = locate(out, openTag);
    if (!r) break;
    out = out.slice(0, r[0]) + out.slice(r[3]);
  }
  return out;
}

// Website chrome that must never appear inside the app: header, mobile menu (the "X"),
// search overlay, page banner + breadcrumb, footer, "load more", ads.
const CHROME: RegExp[] = [
  /<div[^>]*id="search"[^>]*>/i,
  /<div[^>]*class="[^"]*\bour-header\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bmobile-menu\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bheader-search\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bmain-menu\b[^"]*"[^>]*>/i,
  /<section[^>]*class="[^"]*\binner-banner\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bbreadcrumb-area\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bfooter-widjets-area\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bfooter-bottom\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\balm-[a-z-]+\b[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bcode-block\b[^"]*"[^>]*>/i,
  /<div[^>]*id="FreeStar[^"]*"[^>]*>/i,
  /<div[^>]*class="[^"]*\bsharedaddy\b[^"]*"[^>]*>/i,
  /<div[^>]*id="comments"[^>]*>/i,
];

/** Remove scripts, styles, ads and website chrome so only readable content is left. */
function clean(html: string): string {
  let out = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/<header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
    .replace(/<form\b[\s\S]*?<\/form>/gi, '')
    .replace(/<a[^>]*class="[^"]*\bskip-link\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
  for (const re of CHROME) out = removeAll(out, re);
  return out
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/\bclr-white\b/g, '');
}

/** Category / archive pages: turn each "blog-box" preview into a list item. */
function parseList(html: string): ListItem[] {
  const items: ListItem[] = [];
  let from = 0;
  for (let i = 0; i < 50; i++) {
    const r = locate(html, /<div[^>]*class="blog-box"[^>]*>/i, from);
    if (!r) break;
    from = r[3];
    const box = html.slice(r[1], r[2]).replace(/<!--[\s\S]*?-->/g, '');
    const titleA = /<h4[^>]*>\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(box);
    if (!titleA) continue;
    const cats = /class="archives_cate"[^>]*>([\s\S]*?)<\/span>/i.exec(box)?.[1] ?? '';
    const catNames = [...cats.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => decode(m[1]));
    items.push({
      url: titleA[1],
      title: decode(titleA[2]),
      image: /<img[^>]*\ssrc="([^"]+)"/i.exec(box)?.[1],
      date: /class="bpdate"[\s\S]*?<span>([^<]+)<\/span>/i.exec(box)?.[1]?.trim(),
      category: catNames.filter(Boolean).join(' · ') || undefined,
      excerpt: (() => {
        const p = /class="post-summary"[^>]*>([\s\S]*?)<\/div>/i.exec(box)?.[1];
        return p ? decode(p).replace(/\s*\[…\]\s*$/, '…') : undefined;
      })(),
    });
  }
  return items;
}

/** Turn already-downloaded website HTML into app content. */
export function parsePage(html: string): PageContent {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1];
  const ogTitle = /<meta property="og:title" content="([^"]*)"/i.exec(html)?.[1];
  const ogImage = /<meta property="og:image" content="([^"]*)"/i.exec(html)?.[1];
  const title = decode(h1 ?? ogTitle ?? site.name);

  // 1) Category pages (Dogs, Statistics, Animal Abuse…): list of article previews.
  if (/class="blog-box"/.test(html)) {
    const items = parseList(html);
    if (items.length) {
      const next = /<a[^>]*class="next page-numbers"[^>]*href="([^"]+)"/i.exec(html)?.[1];
      return { kind: 'list', title, items, nextUrl: next };
    }
  }

  // 2) Articles (.post-content-single) and normal pages (.page-content); else the page minus chrome.
  const body =
    innerOf(html, /<div[^>]*class="post-content-single"[^>]*>/i) ??
    innerOf(html, /<div[^>]*class="page-content"[^>]*>/i) ??
    innerOf(html, /<body\b[^>]*>/i) ??
    '';

  const content = clean(body).replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, ''); // heading is shown separately
  return { kind: 'article', title, image: ogImage, html: content };
}

/** Download a website page and pull out what the app should show. */
export async function fetchPage(url: string): Promise<PageContent> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parsePage(await res.text());
}

/** Wrap extracted article content in a styled HTML document matching the app's green theme. */
export function renderDocument(page: Extract<PageContent, { kind: 'article' }>): string {
  const img = page.image ? `<img class="hero" src="${page.image}" alt="" />` : '';
  return `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  * { box-sizing: border-box; }
  body { margin: 0 auto; max-width: 760px; padding: 16px 16px 40px;
         font-family: -apple-system, Roboto, "Segoe UI", sans-serif;
         color: #1C2421; background: #F5F7F6; font-size: 16px; line-height: 1.65; }
  /* Website text that was white-on-image becomes readable dark text */
  body * { color: inherit; }
  h1.title { font-size: 24px; line-height: 1.3; margin: 4px 0 14px; font-weight: 800; }
  img { max-width: 100%; height: auto; border-radius: 10px; }
  img.hero { width: 100%; margin-bottom: 16px; }
  h2 { font-size: 21px; line-height: 1.35; margin: 28px 0 8px; color: #1B5E20; }
  h3 { font-size: 18px; margin: 22px 0 6px; }
  h4 { font-size: 16px; margin: 18px 0 6px; }
  p { margin: 0 0 14px; }
  a, a * { color: #2E7D32; font-weight: 600; text-decoration: none; }
  ul, ol { padding-left: 22px; margin: 0 0 14px; }
  li { margin-bottom: 6px; }
  blockquote { margin: 16px 0; padding: 12px 14px; background: #E8F5E9; border-left: 4px solid #2E7D32;
               border-radius: 8px; }
  table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; margin: 12px 0;
          font-size: 14px; background: #fff; }
  th, td { border: 1px solid #E1E6E3; padding: 8px; text-align: left; vertical-align: top; }
  th { background: #E8F5E9; }
  figure { margin: 16px 0; } figcaption { font-size: 13px; color: #66736D; }
  .commonpostlink, .bread-more, .breadcrumb, .header-search, .mobile-menu, .our-header { display: none !important; }
</style></head><body>
<h1 class="title">${page.title.replace(/</g, '&lt;')}</h1>
${img}
${page.html}
</body></html>`;
}
