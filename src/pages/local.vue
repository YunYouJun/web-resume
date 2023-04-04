<script setup lang="ts">
// @ts-expect-error yml
import localResume from '~/assets/resume/local.resume.yml'

const resume = ref(localResume)
</script>

<template>
  <resume-all v-if="resume" :resume="resume" />
</template>

<route lang="yaml">
meta:
  layout: resume
</route>
