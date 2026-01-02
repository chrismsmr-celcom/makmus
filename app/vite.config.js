import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'MAKMUS - Média d\'Information',
        short_name: 'MAKMUS',
        description: 'Application de lecture d\'actualités MAKMUS',
        theme_color: '#111111',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://i.postimg.cc/x88LbhZp/2-20251224-213424-0001-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://i.postimg.cc/x88LbhZp/2-20251224-213424-0001-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.newsdata\.io\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'news-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 2
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  }
});
