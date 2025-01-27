<script setup lang="ts">
import type { ResumeInfo } from '../types'
import yaml from 'js-yaml'
// @ts-expect-error yml
import localResume from '~/assets/resume/local.resume.yml'
import { useAppStore } from '~/stores/app'
import { useEditorStore } from '~/stores/editor'
import { fetchText } from '~/utils'

const resume = ref<ResumeInfo>(localResume)
const route = useRoute()

const app = useAppStore()

const editorStore = useEditorStore()
onBeforeMount(async () => {
  let text = editorStore.resumeText || ''
  if (route.query.url) {
    text = await fetchText(route.query.url as string)
    resume.value = yaml.load(text) as ResumeInfo
  }
})

onMounted(() => {
  if (route.query.mode === 'preview') {
    app.showToolbar = false
    app.isFullscreen = true
  }
})
</script>

<template>
  <resume-all v-if="resume" :resume="resume" />
</template>
