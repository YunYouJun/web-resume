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
import resume from '~/assets/resume/local.resume.yml'
onMounted(() => {
  console.log(resume)
})
</script>
