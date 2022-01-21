<template>
  <div class="editor-page text-center">
    <!-- <h1 class="m-4">
      {{ t('editor.name') }}
    </h1>-->
    <div class="preview-container" grid="~ cols-2 gap-4 <sm:cols-1">
      <div class="resume-container resume shadow">
        <ResumeAll :resume="editorStore.resumeJson" />
      </div>
      <div class="editor-container">
        <client-only>
          <MonacoEditor :text="resumeText" />
        </client-only>
      </div>
    </div>
    <div>
      <a class="resume-btn mt-3" href="/resume" target="_blank">
        {{
          t('button.see_resume')
        }}
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useEditorStore } from '~/stores/editor'
import { useResume } from '~/logic/resume'

const editorStore = useEditorStore()

const { t } = useI18n()

const route = useRoute()
const resumeText = ref(editorStore.resumeText)

onBeforeMount(async() => {
  // 若本地不存在，则设置默认值
  if (!editorStore.resumeText) {
    const txt
      = `# ${t('editor.name')}\n${await useResume(route.query.url as string)}`
    editorStore.setResume(txt)
    editorStore.codeEditor?.setValue(txt)
  }
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
}

.resume-container,
.editor-container {
  height: 87vh;
  text-align: left;
}

.resume-container {
  padding: 2rem;
  overflow: scroll;
  border-right: 1px solid var(--wr-border-color);
}
</style>
