import type { Plugin } from 'vite'
import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

import Yaml from '@rollup/plugin-yaml'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
import Prism from 'markdown-it-prism'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import Markdown from 'unplugin-vue-markdown/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import generateSitemap from 'vite-ssg-sitemap'

const markdownWrapperClasses = 'markdown-body max-w-900px m-auto text-left px-4'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  resolve: {
    alias: {
      '~/': `${path.resolve(import.meta.dirname, 'src')}/`,
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        // Keep shared dependencies outside Monaco so the app shell stays lazy.
        onlyExplicitManualChunks: true,
        manualChunks: isSsrBuild
          ? undefined
          : (id) => {
              if (id.includes('vite/preload-helper'))
                return 'preload-helper'
              if (id.includes('/monaco-editor/'))
                return 'monaco'
            },
      },
    },
  },

  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return ['github-corners'].includes(tag)
          },
        },
      },
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/typed-router.d.ts',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/core',
        {
          '@unhead/vue': ['useHead'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      // allow auto load markdown components under `./src/components/`
      dirs: ['src/components'],
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      directoryAsNamespace: true,
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/unplugin/unplugin-vue-markdown
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'img/icons/apple-touch-icon-180x180.png',
        'img/icons/favicon-32x32.png',
        'img/icons/favicon.svg',
        'img/icons/safari-pinned-tab.svg',
        'img/icons/web-resume-mark.svg',
        'robots.txt',
      ],
      manifest: {
        id: '/',
        name: 'Web Resume',
        short_name: 'Web Resume',
        description: '从 YAML 生成、编辑并导出 PDF 简历。',
        lang: 'zh-CN',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        categories: ['productivity', 'utilities'],
        theme_color: '#f4f5ef',
        background_color: '#f4f5ef',
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: './img/icons/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache editor resources only after use, rather than on first visit.
        globIgnores: ['**/monaco-*.js', '**/monaco-*.css', '**/*worker*.js', '**/*Worker*.js', '**/*.map'],
        runtimeCaching: [{
          urlPattern: /\/assets\/.*(?:monaco-|worker|Worker).*\.(?:js|css)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'resume-editor-assets',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [200] },
          },
        }],
        navigateFallbackDenylist: [/^\/docs(?:\/|$)/],
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    Yaml({
      // avoid conflict with i18n yml
      exclude: 'locales/*.yml',
    }) as Plugin,

    // https://github.com/webfansplz/vite-plugin-vue-devtools
    VueDevTools(),
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    beastiesOptions: {
      reduceInlineStyles: false,
    },
    onFinished() {
      generateSitemap()
    },
  },

  optimizeDeps: {
    include: [
      'ajv',
      'js-yaml',
      'monaco-editor',
    ],
  },
}))
