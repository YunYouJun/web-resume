// import { setDiagnosticsOptions } from 'monaco-yaml'
// import resumeSchema from '../resume.schema.json'

export const setup = async() => {
  // avoid vite-ssg navigator error
  if (window.monaco) {
    return {
      monaco: window.monaco,
    }
  }

  const monaco = await import('monaco-editor')
  window.monaco = monaco

  // const { setDiagnosticsOptions } = await import('monaco-yaml')

  await Promise.all([
    // load workers
    (async() => {
      const [
        { default: EditorWorker },
        // { default: JsonWorker },
        // { default: CssWorker },
        // { default: HtmlWorker },
        // { default: TsWorker },
        { default: YamlWorker },
      ] = await Promise.all(
        // vite static analysis
        // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
        [
          import('monaco-editor/esm/vs/editor/editor.worker?worker'),
          // import('monaco-editor/esm/vs/language/json/json.worker?worker'),
          // import('monaco-editor/esm/vs/language/css/css.worker?worker'),
          // import('monaco-editor/esm/vs/language/html/html.worker?worker'),
          // import('monaco-editor/esm/vs/language/typescript/ts.worker?worker'),
          import('monaco-yaml/lib/esm/yaml.worker?worker'),
        ],
      )

      // https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046
      window.MonacoEnvironment = {
        getWorker(_moduleId: string, label: string) {
          switch (label) {
            case 'editorWorkerService':
              return new EditorWorker()
            case 'yaml':
              return new YamlWorker()
            default:
              throw new Error(`Unknown label ${label}`)
          }
        },
      }
    })(),
  ])

  // debug yaml
  // console.debug(languages.yaml)

  // current is monaco-yaml@3.2.1
  // I can not solve error `Unpected usage at EditorSimpleWorker.loadForeignModule`, so i comment it.
  // https://github.com/vitejs/vite/issues/3820#issuecomment-863585040
  // I had submit a issue: https://github.com/remcohaszing/monaco-yaml/issues/115
  // setDiagnosticsOptions({
  //   enableSchemaRequest: true,
  //   hover: true,
  //   completion: true,
  //   validate: true,
  //   format: true,
  //   schemas: [
  //     {
  //       uri: 'https://raw.githubusercontent.com/YunYouJun/web-resume/main/public/schema/resume.schema.json',
  //       // uri: '/schema/resume.schema.json',
  //       fileMatch: ['*.yml', '*.yaml'],
  //     },
  //   ],
  // })

  if (getCurrentInstance())
    await new Promise<void>(resolve => onMounted(resolve))

  return { monaco }
}

export default setup
