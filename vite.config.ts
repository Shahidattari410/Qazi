import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
        manifest: {
          id: '/',
          name: 'دار القضاء و رجسٹریشن نکاح پورٹل',
          short_name: 'قاضی پورٹل',
          description: 'باضابطہ عائلی و شرعی نکاح رجسٹریشن، 25 کالم فارم دوم، خلع، طلاق اور مکمل آف لائن دفتری نظام',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          dir: 'rtl',
          lang: 'ur',
          theme_color: '#087443',
          background_color: '#087443',
          icons: [
            {
              src: '/pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.cdnfonts\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdnfonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'jsdelivr-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
