import * as m from 'monaco-editor'
import type { Environment } from 'monaco-editor/esm/vs/editor/editor.api'

declare module '*.yml' {
  const data: any
  export default data
}

/* eslint-disable import/no-duplicates */
declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

// with vite-plugin-md, markdowns can be treat as Vue components
declare module '*.md' {
  const component: ComponentOptions
  export default component
}

/* eslint-enable import/no-duplicates */

declare interface Window {
  // extend the window
  monaco: typeof m | undefined
  MonacoEnvironment: Environment
}
