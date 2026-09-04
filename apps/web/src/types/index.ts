import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export * from './cloud'
export * from './json-resume'
export * from './resume'
export * from './templates'
