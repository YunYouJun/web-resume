declare module '@rollup/plugin-yaml'

/* eslint-disable import/no-duplicates */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// with vite-plugin-md, markdowns can be treat as Vue components
declare module '*.md' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

/* eslint-enable import/no-duplicates */

declare interface Window {
  // extend the window
}
