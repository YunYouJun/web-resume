import type * as m from 'monaco-editor'

import type { ResumeInfo, ResumeItem } from '~/types'

import Ajv from 'ajv'
import yaml from 'js-yaml'
import { acceptHMRUpdate, defineStore } from 'pinia'
import resumeSchema from '~/assets/schema/resume.schema.json'
import { fetchText, isClient, namespace, overrideResume, resumeExamples } from '~/utils'

import { useAppStore } from './app'

const ajv = new Ajv({ allowUnionTypes: true })
const validate = ajv.compile(resumeSchema)

export const useEditorStore = defineStore('editor', () => {
  const { t } = useI18n()
  const user = useUserStore()
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

    if (!resumeCached)
      return

    if (!user.settings.overrideInfo)
      return resumeCached
    else
      return overrideResume(resumeCached, user.userInfo)
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

    async goToResume(resume: ResumeItem) {
      const url = resume.url.trim()
      if (!url)
        return false

      app.isResumeLoading = true
      app.resumeLoadError = ''

      try {
        const resumeText = await fetchText(url)
        const nextResume = { ...resume, url }
        const prefix = `# ${t('editor.name')}\n`
        const text = prefix + resumeText

        app.curResume = nextResume
        app.setNewResume(nextResume)
        this.setResumeText(text)
        codeEditor.value?.setValue(text)
        return true
      }
      catch (error) {
        app.resumeLoadError = error instanceof Error ? error.message : String(error)
        return false
      }
      finally {
        app.isResumeLoading = false
      }
    },

    async reset() {
      return this.goToResume(resumeExamples[0])
    },
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
