import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import ViteComponents from 'vite-plugin-components'
import VitePages from 'vite-plugin-pages'

import path from 'path'

import yaml from '@rollup/plugin-yaml'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue(),
    VitePages(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Resume',
        short_name: 'resume',
        theme_color: '#4DBA87',
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        display: 'standalone',
        background_color: '#000000',
      },
    }),
    ViteComponents({
      directoryAsNamespace: true,
    }),
    yaml(),
  ],
})
