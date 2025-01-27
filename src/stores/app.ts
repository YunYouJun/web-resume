import type { ResumeItem } from '~/types'
import { isClient } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getPreviewUrl, namespace, resumeExamples } from '~/utils'

export const useAppStore = defineStore('app', () => {
  const isPrinting = ref(false)
  const showToolbar = ref(true)

  // copy share
  const showCopiedDialog = ref(false)

  // resume is full screen
  const isFullscreen = ref(false)

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
    return getPreviewUrl(curResume.value.url)
  })

  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
  }

  // esc 退出全屏
  const { Escape } = useMagicKeys()
  watch(Escape, () => {
    if (isFullscreen.value)
      isFullscreen.value = false
  })

  return {
    isFullscreen,
    isPrinting,
    showToolbar,
    queryStr,
    showCopiedDialog,

    overrideResumeText,

    curResume,
    usedResumes,
    copiedResumeUrl,

    toggleFullscreen,
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
