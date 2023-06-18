import { acceptHMRUpdate, defineStore } from 'pinia'
import { namespace } from '~/utils'

export const useUserStore = defineStore('user', () => {
  const userInfo = useStorage(`${namespace}:user-info`, {
    name: '',
    phone: '',
    email: '',
  })

  return {
    userInfo,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
