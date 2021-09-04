<template>
  <div class="editor-page text-center">
    <!-- <h1 class="m-4">
      {{ t('editor.name') }}
    </h1> -->
    <div class="preview-container">
      <div class="resume-container resume">
        <ResumeAll :resume="editorStore.resumeJson" />
      </div>
      <div class="editor-container">
        <MonacoEditor :text="resumeText" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '~/stores/editor'

import { onBeforeMount, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useResume } from '~/logic/resume'

const editorStore = useEditorStore()

// const { t } = useI18n()

const route = useRoute()
const resumeText = ref(editorStore.resumeText)

onBeforeMount(async () => {
  const txt = await useResume(route.query.url as string)
  editorStore.setResume(txt)
  editorStore.editor?.setValue(txt)
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
