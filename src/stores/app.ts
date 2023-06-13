import { acceptHMRUpdate, defineStore } from 'pinia'
import { namespace } from '~/utils'

export const useAppStore = defineStore('app', () => {
  const showToolbar = ref(true)
  const resumeUrl = useStorage(`${namespace}-url`, '/resume/suzumiya.resume.yml')

  return {
    showToolbar,

    resumeUrl,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
