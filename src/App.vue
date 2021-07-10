<template>
  <router-view />
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Web Resume',
  meta: [{ name: 'description', content: 'Web 简历' }],
})
</script>

<style lang="scss">
#app {
  font-family: Lato, "PingFang SC", "Microsoft YaHei", "Avenir", Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
