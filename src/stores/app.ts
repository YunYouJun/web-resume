import { acceptHMRUpdate, defineStore } from 'pinia'
import { namespace } from '~/utils'

export const useAppStore = defineStore('app', () => {
  const showToolbar = ref(true)
  const resumeUrl = useStorage(`${namespace}-url`, '/resume/suzumiya.resume.yml')

  /**
   * 搜索关键字
   */
  const queryStr = ref('')

  const overrideResumeText = useStorage(`${namespace}:override-resume`, '')

  return {
    showToolbar,
    queryStr,

    resumeUrl,
    overrideResumeText,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
