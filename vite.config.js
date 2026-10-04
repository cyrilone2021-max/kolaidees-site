import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import {
  PAGES,
  LOCALES,
  findPage,
  translationsOf,
  validateRegistry,
} from './src/config/pages.js';

// Multi-page vanilla site — no framework, kept intentionally simple and
// evolutive. Pages are declared once in src/config/pages.js: each entry is
// automatically built, listed in sitemap.xml and given its canonical,
// og:url, og:locale and hreflang tags.

function requireSiteUrl(siteUrl) {
  if (!siteUrl) {
    throw new Error('VITE_SITE_URL is not set: cannot generate SEO URLs, sitemap.xml and robots.txt.');
  }
  return siteUrl.replace(/\/+$/, '');
}

// Injects canonical / og:url / og:locale(:alternate) / hreflang into each
// page from the registry, and fails the build if a page is missing from the
// registry or its <html lang> does not match the registry.
function seoHeadTags(siteUrl) {
  return {
    name: 'kolaidees-seo-head-tags',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const page = findPage(ctx.path);
      if (!page) {
        throw new Error(`${ctx.path} is not declared in src/config/pages.js`);
      }
      const htmlLang = (html.match(/<html[^>]*\blang="([^"]+)"/) || [])[1];
      if (htmlLang !== page.lang) {
        throw new Error(
          `${ctx.path}: <html lang="${htmlLang}"> does not match lang "${page.lang}" in src/config/pages.js`
        );
      }
      const base = requireSiteUrl(siteUrl);
      const translations = translationsOf(page);
      const tags = [
        { tag: 'link', attrs: { rel: 'canonical', href: `${base}${page.path}` } },
        { tag: 'meta', attrs: { property: 'og:url', content: `${base}${page.path}` } },
        { tag: 'meta', attrs: { property: 'og:locale', content: LOCALES[page.lang] } },
      ];
      for (const t of translations) {
        if (t !== page) {
          tags.push({ tag: 'meta', attrs: { property: 'og:locale:alternate', content: LOCALES[t.lang] } });
        }
      }
      if (translations.length > 1) {
        for (const t of translations) {
          tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: t.lang, href: `${base}${t.path}` } });
        }
      }
      return tags.map((t) => ({ ...t, injectTo: 'head' }));
    },
  };
}

// Generates dist/sitemap.xml and dist/robots.txt from VITE_SITE_URL and the
// page registry. The build fails if VITE_SITE_URL is missing.
function seoFiles(siteUrl) {
  return {
    name: 'kolaidees-seo-files',
    apply: 'build',
    generateBundle() {
      const base = requireSiteUrl(siteUrl);
      const urls = PAGES.map(
        (p) => `  <url>\n    <loc>${base}${p.path}</loc>\n  </url>\n`
      ).join('');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls +
          '</urlset>\n',
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  validateRegistry();
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [seoHeadTags(env.VITE_SITE_URL), seoFiles(env.VITE_SITE_URL)],
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          PAGES.map((p) => [p.name, resolve(__dirname, `.${p.path}index.html`)])
        ),
      },
    },
  };
});
