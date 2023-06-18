import { acceptHMRUpdate, defineStore } from 'pinia'

import type * as m from 'monaco-editor'

import yaml from 'js-yaml'
import Ajv from 'ajv'
import { useAppStore } from './app'
import type { ResumeInfo } from '~/types'
import { fetchText, isClient, namespace } from '~/utils'

import resumeSchema from '~/../public/schema/resume.schema.json'

const ajv = new Ajv()
const validate = ajv.compile(resumeSchema)

export const useEditorStore = defineStore('editor', () => {
  const { t } = useI18n()
  const app = useAppStore()

  // must shallow to avoid stuck
  const codeEditor = shallowRef<m.editor.IStandaloneCodeEditor | null>()

  const resumeText = useStorage(`${namespace}-text`, '')

  let resumeCached: ResumeInfo | undefined

  const resumeJson = computed(() => {
    try {
      resumeCached = yaml.load(resumeText.value) as ResumeInfo
      const valid = validate(resumeCached)

      if (!valid)
        resumeCached = undefined
      else
        clearErrorMessage()
    }
    catch (e: any) {
      if (e)
        setErrorMessage(e.mark.line + 1, e.mark.column + 1, e.reason)
    }
    return resumeCached
  })

  // helper
  async function clearErrorMessage() {
    const editorModel = codeEditor.value?.getModel()
    if (editorModel && isClient) {
      const { editor } = await import('monaco-editor')
      editor.setModelMarkers(editorModel, 'yaml', [])
    }
  }

  async function setErrorMessage(
    line: number,
    column: number,
    message: string,
  ) {
    const editorModel = codeEditor.value?.getModel()
    if (editorModel && isClient) {
      const { editor, MarkerSeverity } = await import('monaco-editor')
      editor.setModelMarkers(editorModel, 'yaml', [
        {
          startLineNumber: line,
          endLineNumber: line,
          startColumn: column,
          endColumn: editorModel.getLineContent(line).length + 1,
          severity: MarkerSeverity.Error,
          message,
        },
      ])
    }
  }

  function setResumeText(value: string) {
    resumeText.value = value
  }

  function setEditor(value: m.editor.IStandaloneCodeEditor) {
    codeEditor.value = value
  }

  return {
    codeEditor,

    resumeText,
    resumeJson,

    setEditor,
    setResumeText,

    async goToResumeUrl(url: string) {
      app.resumeUrl = url

      alert(app.resumeUrl)

      const resumeExample = await fetchText(app.resumeUrl)
      const prefix = `# ${t('editor.name')}\n`
      const txt = prefix + resumeExample
      codeEditor.value?.setValue(txt)
    },

    async reset() {
      this.goToResumeUrl('/resume/suzumiya.resume.yml')
    },
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
