import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
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
        name: 'Web Resume',
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
      },
    }),
    ViteComponents({
      directoryAsNamespace: true,
    }),
    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: 'prose prose-sm m-auto text-left',
    }),
    yaml(),
  ],
})
