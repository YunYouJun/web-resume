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
import { ref, onBeforeMount } from 'vue'
import type { ResumeInfo } from '../types'
import yaml from 'js-yaml'
import { useRoute } from 'vue-router'
import { useResume } from '~/logic/resume'
// method 1
// import resume from '~/assets/resume/2021.resume.yml'
// method 2
// online load yaml

const resume = ref<ResumeInfo>()
const route = useRoute()

onBeforeMount(async() => {
  const txt = await useResume(route.query.url as string)
  resume.value = yaml.load(txt) as ResumeInfo
})
</script>
