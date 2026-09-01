<script setup lang="ts">
import { useHead } from '@vueuse/head'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Web Resume',
  htmlAttrs: { lang: 'zh-CN' },
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
})
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
