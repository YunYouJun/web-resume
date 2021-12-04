<template>
  <github-corners :reverse="isDark" :url="pkg.repository.url" blank></github-corners>
  <div class="home mt-8 text-center">
    <p class="text-10xl">
      <i-ri-file-text-line class="inline-block" />
    </p>
    <HelloResume msg="Web Resume" />
  </div>
</template>

<script lang="ts" setup>
import pkg from '~/../package.json'
import { isDark } from '~/logic'
</script>

<style>
.resume-logo {
  width: 200px;
}
</style>
