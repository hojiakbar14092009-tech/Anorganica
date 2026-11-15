import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // never reload under a student mid-lesson; UpdateBanner asks first
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Anorganica',
        short_name: 'Anorganica',
        description: '8–9-sinf noorganik kimyo atlasi',
        lang: 'uz',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        background_color: '#f4f3f0',
        theme_color: '#f4f3f0',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // All lesson JSON chunks are small JS chunks → precached, so every lesson works offline after first load.
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        // The 3D engine (~250 KB gz) is not precached: it is cached on first use, bounded, and lessons fall back to text facts offline.
        globIgnores: ['**/MoleculeScene-*.js'],
        runtimeCaching: [{ urlPattern: /\/assets\/MoleculeScene-.*\.js$/, handler: 'CacheFirst', options: { cacheName: 'scenes', expiration: { maxEntries: 3 } } }],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: { environment: 'node', include: ['src/tests/**/*.test.ts'] },
});
