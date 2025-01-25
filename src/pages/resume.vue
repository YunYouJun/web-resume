<script setup lang="ts">
import type { ResumeInfo } from '../types'
import yaml from 'js-yaml'
import { useRoute } from 'vue-router'
import { useEditorStore } from '~/stores/editor'
import { fetchText } from '~/utils'

const editorStore = useEditorStore()

const resume = ref<ResumeInfo>()
const route = useRoute()

onBeforeMount(async () => {
  let text = editorStore.resumeText || ''
  if (route.query.url)
    text = await fetchText(route.query.url as string)

  resume.value = yaml.load(text) as ResumeInfo
})
</script>

<template>
  <resume-all v-if="resume" :resume="resume" />
</template>
