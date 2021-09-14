import { acceptHMRUpdate, defineStore } from 'pinia'

import * as m from 'monaco-editor'
import yaml from 'js-yaml'
import type { ResumeInfo } from '~/types'

export const namespace = 'web-resume'

export function setCache(key: string, value: string) {
  localStorage.setItem(`${namespace}-${key}`, value)
}

export function getCache(key: string) {
  return localStorage.getItem(`${namespace}-${key}`)
}

export const useEditorStore = defineStore('editor', () => {
  const editor = ref<m.editor.IStandaloneCodeEditor | null>()

  const resumeText = ref(getCache('text') || '')

  let resumeCached: ResumeInfo

  const resumeJson = computed(() => {
    try {
      resumeCached = yaml.load(resumeText.value) as ResumeInfo
    } catch (e) {
      console.log(e)
    }
    return resumeCached
  })

  function setResumeText(value: string) {
    resumeText.value = value
    setCache('text', value)
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
