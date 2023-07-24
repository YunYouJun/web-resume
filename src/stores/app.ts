import { isClient } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ResumeItem } from '~/types'
import { namespace, resumeExamples } from '~/utils'

export const useAppStore = defineStore('app', () => {
  const isPrinting = ref(false)
  const showToolbar = ref(true)

  // copy share
  const showCopiedDialog = ref(false)

  /**
   * 搜索关键字
   */
  const queryStr = ref('')

  const overrideResumeText = useStorage(`${namespace}:override-resume`, '')

  const usedResumes = useStorage<ResumeItem[]>(`${namespace}:used-resumes`, [{ url: '' }].concat(resumeExamples))
  const curResume = useStorage<ResumeItem>(`${namespace}:cur-resume`, resumeExamples[0])
  const copiedResumeUrl = computed(() => {
    if (!isClient)
      return ''
    return `${window.location.origin}/resume?url=${curResume.value.url}`
  })

  return {
    isPrinting,
    showToolbar,
    queryStr,
    showCopiedDialog,

    overrideResumeText,

    curResume,
    usedResumes,
    copiedResumeUrl,

    setNewResume(r: ResumeItem) {
      if (r.url) {
        if (!usedResumes.value.find(v => v.url === r.url))
          usedResumes.value.push(r)
      }
    },
    removeResume(r: ResumeItem) {
      const idx = usedResumes.value.findIndex(v => v.url === r.url)
      if (idx !== -1)
        usedResumes.value.splice(idx, 1)
    },
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
