<template>
  <div class="editor-page text-center">
    <!-- <h1 class="m-4">
      {{ t('editor.name') }}
    </h1> -->
    <div class="preview-container">
      <div class="resume-container">
        <ResumeAll v-if="resume" :resume="resume" />
      </div>
      <div class="editor-container">
        <MonacoEditor :text="resumeTxt" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useResume } from '~/logic/resume'

import yaml from 'js-yaml'
import type { ResumeInfo } from '~/types'

const { t } = useI18n()

const route = useRoute()
const resumeTxt = ref('')

onBeforeMount(async() => {
  const txt = await useResume(route.query.url as string)
  resumeTxt.value = txt
})

const updateResumeTxt = (value: string) => {
  resumeTxt.value = value
}

provide('updateResumeTxt', updateResumeTxt)
const resume = computed(() => {
  console.log(yaml.load(resumeTxt.value))
  return yaml.load(resumeTxt.value) as ResumeInfo
})
</script>

<style lang="scss">
.editor-page {
  overflow: hidden;
}

.preview-container {
  border: 1px solid var(--wr-border-color);
  padding: 0;
  overflow: hidden;
  height: 81vh;
}

.resume-container,
.editor-container {
  display: inline-block;
  width: 50%;
  height: 100%;
  text-align: left;
}

.resume-container {
  padding: 2rem;
  overflow-y: scroll;
  border-right: 1px solid var(--wr-border-color);
}
</style>
