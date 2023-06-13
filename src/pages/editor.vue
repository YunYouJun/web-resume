<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useEditorStore } from '~/stores/editor'

const editorStore = useEditorStore()

const { t } = useI18n()

const resumeText = ref(editorStore.resumeText)

onBeforeMount(async () => {
  // 若本地不存在，则设置默认值
  if (!editorStore.resumeText)
    await editorStore.reset()
})
</script>

<template>
  <div class="editor-page text-center">
    <!-- <h1 class="m-4">
      {{ t('editor.name') }}
    </h1> -->
    <div class="preview-container" grid="~ cols-2 <sm:cols-1">
      <div class="resume-container resume shadow w-full">
        <ResumeAll v-if="editorStore.resumeJson" class="min-w-500px" :resume="editorStore.resumeJson" />
      </div>
      <div class="editor-container">
        <client-only>
          <MonacoEditor :text="resumeText" />
        </client-only>
      </div>
    </div>
    <div m="t-4" text="xs gray-800 dark:gray">
      注意：此处主要作示例体验与临时修改使用。如果您想要更好的编辑体验，您可以使用本地开发的方式。
    </div>
  </div>
</template>

<style lang="scss">
.editor-page {
  overflow: hidden;
}

.preview-container {
  border: 1px solid var(--wr-c-border);
  padding: 0;
  overflow: hidden;
}

.resume-container,
.editor-container {
  height: calc(100vh - 100px);
  text-align: left;
}

.resume-container {
  padding: 2rem;
  overflow: scroll;
  border-right: 1px solid var(--wr-c-border);
}
</style>
