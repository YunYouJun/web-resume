import { UserModule } from '~/types'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

// 为 store state 声明类型
export interface State {
  count: number
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol('vuex')

const store = createStore<State>({
  state() {
    return {
      count: 0,
    }
  },
  mutations: {
    increment(state) {
      state.count++
    },
  },
})

export const install: UserModule = ({ app }) => {
  app.use(store, key)
}

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key)
}
