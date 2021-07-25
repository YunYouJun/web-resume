<template>
  <div class="editor-page text-center">
    <h1 class="m-4">
      {{ t('editor.name') }}
    </h1>
    <div class="resume-container">
      <ResumeAll v-if="resume" :resume="resume" />
    </div>
    <div class="editor-container">
      <MonacoEditor :text="resumeTxt" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useResume } from '~/logic/resume'

import yaml from 'js-yaml'
import type { ResumeInfo } from '~/types'

const { t } = useI18n()

const route = useRoute()
const resumeTxt = ref('')
const resume = ref<ResumeInfo | null>()

onBeforeMount(async() => {
  const txt = await useResume(route.query.url as string)
  resumeTxt.value = txt

  resume.value = yaml.load(resumeTxt.value) as ResumeInfo
})
</script>

<style lang="scss">
.editor-page {
  overflow: hidden;
}

.resume-container, .editor-container {
  display: inline-block;
  width: 50%;
  height: 72vh;
  text-align: left;
}

.resume-container {
  padding: 2rem;
  border: 1px solid var(--wr-border-color);
  overflow-y: scroll;
}

</style>
