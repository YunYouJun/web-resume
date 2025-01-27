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
  if (route.query.url)
    text = await fetchText(route.query.url as string)

  resume.value = yaml.load(text) as ResumeInfo
})

onMounted(() => {
  app.curResume = {
    title: 'Local',
    url: 'https://raw.githubusercontent.com/YunYouJun/web-resume/main/src/assets/resume/local.resume.yml',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/src/assets/resume/local.resume.yml',
  }
})
</script>

<template>
  <resume-all v-if="resume" :resume="resume" />
</template>
