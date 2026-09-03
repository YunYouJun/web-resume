import type { ResumeItem, ResumeTemplateId } from '~/types'
import { isClient } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { defaultResumeTemplateId, resolveResumeTemplateId } from '~/data/resume-catalog'
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

  const hasSeenPrintGuide = skipHydrate(useStorage(`${namespace}:print-guide-seen`, false))
  const recentCommandIds = skipHydrate(useStorage<string[]>(`${namespace}:recent-commands`, []))

  const toastOpen = ref(false)
  const toast = ref<{
    actionCommandId?: string
    actionLabel?: string
    description?: string
    title: string
  }>({ title: '' })

  const restoreSnapshot = ref<{
    baseline: string
    resume: ResumeItem
    text: string
  }>()

  /**
   * 搜索关键字
   */
  const queryStr = ref('')

  const overrideResumeText = skipHydrate(useStorage(`${namespace}:override-resume`, ''))
  const resumeTemplateId = skipHydrate(useStorage<ResumeTemplateId>(`${namespace}:resume-template`, defaultResumeTemplateId))
  resumeTemplateId.value = resolveResumeTemplateId(resumeTemplateId.value)

  const usedResumes = skipHydrate(useStorage<ResumeItem[]>(`${namespace}:used-resumes`, [{ url: '' }].concat(resumeExamples)))
  resumeExamples.forEach((example) => {
    if (!usedResumes.value.some(resume => resume.url === example.url))
      usedResumes.value.push(example)
  })
  const curResume = skipHydrate(useStorage<ResumeItem>(`${namespace}:cur-resume`, resumeExamples[0]))
  const copiedResumeUrl = computed(() => {
    if (!isClient)
      return ''
    return getPreviewUrl(curResume.value, 'url', resumeTemplateId.value)
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
    resumeTemplateId,

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
        if (!usedResumes.value.some(v => v.url === r.url))
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
