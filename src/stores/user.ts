import { acceptHMRUpdate, defineStore } from 'pinia'
import { namespace } from '~/utils'

export const useUserStore = defineStore('user', () => {
  const userInfo = useStorage(`${namespace}:user-info`, {
    name: '',
    phone: '',
    email: '',
  })

  const settings = useStorage(`${namespace}:settings`, {
    /**
     * 覆盖敏感信息（如：姓名、电话、邮箱）
     */
    overrideInfo: true,
  })

  return {
    userInfo,
    settings,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
