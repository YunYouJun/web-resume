<script lang="ts" setup>
import { useEditorStore } from '~/stores/editor'

const editorStore = useEditorStore()

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
  --top-nav-height: 52px;
  --bottom-menu-height: 60px;

  height: calc(100vh - var(--top-nav-height) - var(--bottom-menu-height) - 2px);
  text-align: left;
}

.resume-container {
  padding: 2rem;
  overflow: scroll;
  border-right: 1px solid var(--wr-c-border);
}
</style>
