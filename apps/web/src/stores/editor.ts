import type * as m from 'monaco-editor'

import type { ResumeFormat, ResumeInfo, ResumeItem, ResumeMigrationWarning, ResumeSection } from '~/types'

import * as yaml from 'js-yaml'
import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { fetchText, isClient, namespace, overrideResume, reorderResumeSectionBlocks, resumeExamples } from '~/utils'
import { convertLegacyResume, readResumeDocument, reorderJsonResumeSource } from '~/utils/resume-format'

import { useAppStore } from './app'

export const useEditorStore = defineStore('editor', () => {
  const { t } = useI18n()
  const user = useUserStore()
  const app = useAppStore()

  // must shallow to avoid stuck
  const codeEditor = shallowRef<m.editor.IStandaloneCodeEditor | null>()

  const resumeText = skipHydrate(useStorage(`${namespace}-text`, ''))
  const loadedResumeText = skipHydrate(useStorage(`${namespace}:loaded-resume-text`, ''))
  const isResumeDirty = computed(() => Boolean(resumeText.value && resumeText.value !== loadedResumeText.value))
  const resumeFormat = ref<ResumeFormat>('unknown')
  const resumeWarnings = ref<ResumeMigrationWarning[]>([])
  const resumeValidationErrors = ref<string[]>([])

  let resumeCached: ResumeInfo | undefined

  const resumeJson = computed(() => {
    try {
      const document = yaml.load(resumeText.value)
      const result = readResumeDocument(document)
      resumeFormat.value = result.format
      resumeWarnings.value = result.warnings
      resumeValidationErrors.value = result.errors
      resumeCached = result.renderResume

      if (result.valid) {
        clearErrorMessage()
      }
      else if (result.errors[0]) {
        setErrorMessage(1, 1, result.errors[0])
      }
    }
    catch (e: any) {
      resumeCached = undefined
      resumeFormat.value = 'unknown'
      resumeWarnings.value = []
      resumeValidationErrors.value = [e instanceof Error ? e.message : String(e)]
      if (e) {
        setErrorMessage(
          (e.mark?.line ?? 0) + 1,
          (e.mark?.column ?? 0) + 1,
          e.reason || e.message || String(e),
        )
      }
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

  function setResumeBaseline(value: string) {
    loadedResumeText.value = value
  }

  function setEditor(value: m.editor.IStandaloneCodeEditor) {
    codeEditor.value = value
  }

  function replaceEditorText(value: string, source: string) {
    if (value === resumeText.value)
      return false

    const model = codeEditor.value?.getModel()
    if (model) {
      codeEditor.value?.pushUndoStop()
      codeEditor.value?.executeEdits(source, [{
        forceMoveMarkers: true,
        range: model.getFullModelRange(),
        text: value,
      }])
      codeEditor.value?.pushUndoStop()
    }
    else {
      setResumeText(value)
    }
    return true
  }

  function reorderSections(order: ResumeSection[]) {
    const nextText = resumeFormat.value === 'json-resume'
      ? reorderJsonResumeSource(resumeText.value, order)
      : reorderResumeSectionBlocks(resumeText.value, order)
    replaceEditorText(nextText, 'resume-section-reorder')
  }

  function prepareJsonResumeConversion() {
    const document = yaml.load(resumeText.value)
    const result = readResumeDocument(document)
    if (!result.valid || result.format !== 'legacy' || !result.renderResume)
      return

    const conversion = convertLegacyResume(result.renderResume)
    const warnings = conversion.warnings.slice()
    if (/^\s*#/m.test(resumeText.value)) {
      warnings.push({
        code: 'comment-loss',
        message: 'YAML comments are not carried into the converted document.',
        path: '/',
      })
    }
    return { ...conversion, warnings }
  }

  function previewJsonResumeConversion() {
    return prepareJsonResumeConversion()?.warnings || []
  }

  function convertToJsonResume() {
    const conversion = prepareJsonResumeConversion()
    if (!conversion)
      return false

    const { document, warnings } = conversion
    resumeWarnings.value = warnings
    const nextText = `# JSON Resume compatible document\n${yaml.dump(document, {
      lineWidth: 120,
      noRefs: true,
    })}`
    return replaceEditorText(nextText, 'convert-json-resume')
  }

  return {
    codeEditor,

    resumeText,
    resumeJson,
    resumeFormat,
    isResumeDirty,
    loadedResumeText,
    resumeValidationErrors,
    resumeWarnings,

    setEditor,
    setResumeBaseline,
    setResumeText,
    convertToJsonResume,
    previewJsonResumeConversion,
    reorderSections,

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
        this.setResumeBaseline(text)
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
