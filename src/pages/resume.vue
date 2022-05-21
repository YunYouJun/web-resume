<script setup lang="ts">
import yaml from 'js-yaml'
import { useRoute } from 'vue-router'
import type { ResumeInfo } from '../types'
import { useResume } from '~/composables/resume'
import { useEditorStore } from '~/stores/editor'

const editorStore = useEditorStore()

const resume = ref<ResumeInfo>()
const route = useRoute()

onBeforeMount(async () => {
  let text = editorStore.resumeText || ''
  if (route.query.url)
    text = await useResume(route.query.url as string)

  resume.value = yaml.load(text) as ResumeInfo
})
</script>

<template>
  <resume-all v-if="resume" :resume="resume" />
</template>

<route lang="yaml">
meta:
  layout: resume
</route>
