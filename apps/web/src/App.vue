<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { isClient, useStorage } from '@vueuse/core'
import { isDark } from '~/composables'
import { namespace } from '~/utils'

type SupportedLocale = 'en' | 'zh-CN'

const { availableLocales, locale } = useI18n()
const storedLocale = useStorage<SupportedLocale>(`${namespace}:locale`, 'zh-CN')

watch(storedLocale, (value) => {
  if (availableLocales.includes(value) && locale.value !== value)
    locale.value = value
}, { immediate: true })

watch(locale, (value) => {
  if (value === 'en' || value === 'zh-CN')
    storedLocale.value = value
}, { immediate: true })

if (isClient) {
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
  })
}

// https://unhead.unjs.io/
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead(computed(() => ({
  title: 'Web Resume',
  htmlAttrs: { lang: locale.value },
  meta: [
    { name: 'application-name', content: 'Web Resume' },
    { name: 'description', content: '从 YAML 生成、编辑并导出 PDF 简历。' },
    { property: 'og:title', content: 'Web Resume' },
    { property: 'og:description', content: '从 YAML 生成、编辑并导出 PDF 简历。' },
    { property: 'og:type', content: 'website' },
  ],
  script: [{
    // iconify icon cdn
    src: 'https://code.iconify.design/2/2.1.2/iconify.min.js',
  }],
})))
</script>

<template>
  <router-view />
  <AppCommandPalette />
  <ResumeSourceDialog />
  <OnboardingDialog />
  <AppToasts />
</template>

<style lang="scss">
#app {
  font-family: Lato, "PingFang SC", "Microsoft YaHei", "Avenir", Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
