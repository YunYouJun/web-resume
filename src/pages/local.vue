<script setup lang="ts">
// @ts-expect-error yml
import localResume from '~/assets/resume/local.resume.yml'
const resume = ref(localResume)
</script>

<template>
  <div v-if="resume" class="resume">
    <resume-all :resume="resume" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: resume
</route>

