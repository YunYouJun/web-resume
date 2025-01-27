<script lang="ts" setup>
import pkg from '~/../package.json'
</script>

<template>
  <div i-ri-file-text-line inline-block text-9xl />
  <HelloResume my="6" msg="Web Resume" />

  <RouterLink to="/editor" class="resume-btn text-3xl rounded-full" my="6" p="x-8 y-4">
    Get Started | 开始 →
  </RouterLink>
  <a
    class="resume-btn text-2xl" my="6"
    :href="pkg.repository.url"
    target="_blank"
    inline-flex justify="center" items="center"
  >
    <div i-ri-github-line />
    <span ml="2">GitHub</span>
  </a>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style>
.resume-logo {
  width: 200px;
}
</style>
