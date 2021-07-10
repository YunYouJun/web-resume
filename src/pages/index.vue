<template>
  <github-corner :url="pkg.repository.url" color="#70b7fd" />
  <div class="home mt-8 text-center">
    <p class="text-10xl">
      <i-ri-file-text-line class="inline-block" />
    </p>
    <HelloResume msg="Web Resume" />
  </div>
</template>

<script lang="ts" setup>
import pkg from '~/../package.json'
</script>

<style>
.resume-logo {
  width: 200px;
}
</style>
