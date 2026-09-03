import type * as m from 'monaco-editor'
import type { Environment } from 'monaco-editor/esm/vs/editor/editor.api'

declare module '*.yml' {
  const data: any
  export default data
}

declare module '*.vue' {
  const component: DefineComponent<object, object, any>
  export default component
}

// with unplugin-vue-markdown, markdowns can be treat as Vue components
declare module '*.md' {
  const component: ComponentOptions
  export default component
}

declare global {
  interface YunLeFunHostBridge {
    inYunleApp?: boolean
  }

  interface Window {
    monaco: typeof m | undefined
    MonacoEnvironment: Environment
    ylf?: YunLeFunHostBridge
  }
}
