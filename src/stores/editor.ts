import { acceptHMRUpdate, defineStore } from 'pinia'

import * as m from 'monaco-editor'
import yaml from 'js-yaml'
import type { ResumeInfo } from '~/types'

export const useEditorStore = defineStore('editor', () => {
  const editor = ref<m.editor.IStandaloneCodeEditor | null>()

  const resumeText = ref('# 在线使用 yaml 编辑你的简历')
  const resumeJson = computed(
    () => (yaml.load(resumeText.value) as ResumeInfo) || {}
  )

  function setResumeText(value: string) {
    resumeText.value = value
  }

  function setResume(value: string) {
    setResumeText(value)
  }

  function setEditor(value: m.editor.IStandaloneCodeEditor) {
    editor.value = value
  }

  return {
    editor,
    resumeText,
    resumeJson,
    setEditor,
    setResume,
    setResumeText,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
}
