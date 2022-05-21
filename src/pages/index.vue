<script lang="ts" setup>
import pkg from '~/../package.json'
import { isDark } from '~/composables'

useHead({
  script: [{
    src: 'https://cdn.jsdelivr.net/npm/wc-github-corners@0.1.5',
    type: 'module',
  }],
})
</script>

<template>
  <github-corners :reverse="isDark || null" :url="pkg.repository.url" blank />
  <div class="home mt-8 text-center">
    <div i-ri-file-text-line inline-block text-9xl />
    <HelloResume msg="Web Resume" />
  </div>
</template>

<style>
.resume-logo {
  width: 200px;
}
</style>
