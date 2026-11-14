import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // The tablet is the only device: a lone installed copy must not sit on a stale build.
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['icons/*.png'],
      workbox: {
        // The app shell and everything the first screen needs, so a cold offline launch renders
        // the map (FR-8). The second pattern is the audio directory: `public/audio/` is empty in
        // this track, and the later Chatterbox clips are precached by adding files alone.
        globPatterns: [
          '**/*.{js,css,html,webmanifest,png,svg,ico,json,woff2}',
          '**/*.{mp3,m4a,ogg}',
        ],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Code Block',
        short_name: 'Code Block',
        theme_color: '#f6c445',
        background_color: '#fdf8ef',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
