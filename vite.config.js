import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Multi-page vanilla site — no framework, kept intentionally simple and
// evolutive: each real page below is a plain HTML entry point sharing
// CSS/JS from src/. Adding a page later means adding one more entry here.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projets: resolve(__dirname, 'projets/index.html'),
        projetOserLaDemenceArtistique: resolve(
          __dirname,
          'projets/oser-la-demence-artistique/index.html'
        ),
        aPropos: resolve(__dirname, 'a-propos/index.html'),
      },
    },
  },
});
