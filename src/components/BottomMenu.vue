<script lang="ts" setup>
import type { BottomMenuItem } from '@yunlefun/vue-components'
import { ref } from 'vue'

const { t } = useI18n()

const items = computed<BottomMenuItem[]>(() => {
  return [
    {
      icon: 'i-ri-home-line',
      activeIcon: 'i-ri-home-fill',
      title: t('button.home'),
      to: '/',
    },
    {
      icon: 'i-ri-side-bar-line',
      activeIcon: 'i-ri-side-bar-fill',
      title: t('button.editor'),
      to: '/editor',
    },
    {
      icon: 'i-ri-compass-line',
      activeIcon: 'i-ri-compass-fill',
      title: '发现',
      to: '/explore',
    },
    {
      icon: 'i-ri-user-line',
      activeIcon: 'i-ri-user-fill',
      title: '我的',
      to: '/user',
    },
  ]
})

const router = useRouter()
const active = ref(router.currentRoute.value.path)
function onClick(item: BottomMenuItem) {
  active.value = item.to || ''
  if (active.value)
    router.push(active.value)
}

const app = useAppStore()
</script>

<template>
  <YlfBottomMenu v-if="!app.isPrinting" fixed inset-x-0 bottom-0 shadow-2xl>
    <YlfBottomMenuItem
      v-for="item in items"
      :key="item.to"
      :item="item"
      :active="active === item.to"
      @click="onClick"
    />
  </YlfBottomMenu>
</template>
