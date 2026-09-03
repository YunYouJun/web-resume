import type { UserModule } from './types'
import { ViteSSG } from 'vite-ssg'

import { routes } from 'vue-router/auto-routes'

import App from './App.vue'
import { setupLayouts } from './route-layouts'

import '@unocss/reset/tailwind.css'
// your custom styles here
import 'star-markdown-css/src/scss/theme/yun.scss'

import './styles/index.scss'

import 'uno.css'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts([...routes]),
    base: import.meta.env.BASE_URL,
    scrollBehavior(_to, _from, savedPosition) {
      return savedPosition ?? { left: 0, top: 0 }
    },
  },
  (ctx) => {
  // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
