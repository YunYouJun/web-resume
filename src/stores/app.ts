import type { ResumeItem } from '~/types'
import { isClient } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getPreviewUrl, namespace, resumeExamples } from '~/utils'

export const useAppStore = defineStore('app', () => {
  const isPrinting = ref(false)
  const showToolbar = ref(true)

  // resume is full screen
  const isFullscreen = ref(false)

  const commandPaletteOpen = ref(false)
  const resumeSourceOpen = ref(false)
  const onboardingOpen = ref(false)
  const isResumeLoading = ref(false)
  const resumeLoadError = ref('')

  const hasSeenPrintGuide = useStorage(`${namespace}:print-guide-seen`, false)
  const recentCommandIds = useStorage<string[]>(`${namespace}:recent-commands`, [])

  const toastOpen = ref(false)
  const toast = ref<{
    actionCommandId?: string
    actionLabel?: string
    description?: string
    title: string
  }>({ title: '' })

  const restoreSnapshot = ref<{
    resume: ResumeItem
    text: string
  }>()

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

  return {
    commandPaletteOpen,
    hasSeenPrintGuide,
    isResumeLoading,
    isFullscreen,
    isPrinting,
    onboardingOpen,
    recentCommandIds,
    restoreSnapshot,
    resumeLoadError,
    resumeSourceOpen,
    showToolbar,
    queryStr,
    toast,
    toastOpen,

    overrideResumeText,

    curResume,
    usedResumes,
    copiedResumeUrl,

    toggleFullscreen,
    recordCommand(id: string) {
      recentCommandIds.value = [id, ...recentCommandIds.value.filter(commandId => commandId !== id)].slice(0, 5)
    },
    showToast(nextToast: typeof toast.value) {
      toast.value = nextToast
      toastOpen.value = false
      nextTick(() => {
        toastOpen.value = true
      })
    },
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
