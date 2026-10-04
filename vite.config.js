import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

// Multi-page vanilla site — no framework, kept intentionally simple and
// evolutive: each real page below is a plain HTML entry point sharing
// CSS/JS from src/. Adding a page later means adding one more entry here —
// it is then automatically built AND listed in the generated sitemap.xml.
const PAGES = [
  { name: 'main', path: '/' },
  { name: 'projets', path: '/projets/' },
  {
    name: 'projetOserLaDemenceArtistique',
    path: '/projets/oser-la-demence-artistique/',
  },
  { name: 'daringArtisticMadness', path: '/daring-artistic-madness/' },
  { name: 'aPropos', path: '/a-propos/' },
];

// Generates dist/sitemap.xml and dist/robots.txt at build time from
// VITE_SITE_URL (set in .env.production), so the official public URL has a
// single source. The build fails if VITE_SITE_URL is missing, rather than
// publishing a sitemap with wrong or relative URLs.
function seoFiles(siteUrl) {
  return {
    name: 'kolaidees-seo-files',
    apply: 'build',
    generateBundle() {
      if (!siteUrl) {
        this.error('VITE_SITE_URL is not set: cannot generate sitemap.xml and robots.txt.');
      }
      const base = siteUrl.replace(/\/+$/, '');
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
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [seoFiles(env.VITE_SITE_URL)],
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          PAGES.map((p) => [p.name, resolve(__dirname, `.${p.path}index.html`)])
        ),
      },
    },
  };
});
