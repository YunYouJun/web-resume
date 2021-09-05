<template>
  <div v-if="resume" class="resume">
    <resume-all :resume="resume" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: resume
</route>

<script setup lang="ts">
import localResume from '~/assets/resume/local.resume.yml'
const resume = ref(localResume)
</script>
