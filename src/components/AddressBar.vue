<script lang="ts" setup>
import { getPreviewUrl } from '~/utils'

const app = useAppStore()
const editor = useEditorStore()

const { t } = useI18n()

const { copy, copied } = useClipboard({ source: app.copiedResumeUrl })

async function shareResume() {
  await copy()
  if (copied.value)
    app.showCopiedDialog = true
}
</script>

<template>
  <div class="inline-flex" flex="grow" px="1" relative>
    <AddressBarInput />
    <div absolute top-0 bottom-0 right-4 flex justify="center" items="center">
      <button
        class="input-bar-icon-btn"
        title="预览"
        @click="editor.goToResume(app.curResume)"
      >
        <div i-ri-arrow-right-line hover:i-ri-arrow-right-fill />
      </button>

      <a
        class="input-bar-icon-btn"
        :href="getPreviewUrl(app.curResume.url)"
        :title="t('button.see_resume')"
        target="_blank"
      >
        <div i-ri-slideshow-4-line hover:i-ri-slideshow-4-fill />
      </a>

      <button
        class="input-bar-icon-btn"
        title="重置"
        @click="editor.reset()"
      >
        <div i-ri-eraser-line hover:i-ri-eraser-fill />
      </button>

      <button class="input-bar-icon-btn" title="分享" @click="shareResume">
        <div i-ri-share-forward-line hover:i-ri-share-forward-fill />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.input-bar-icon-btn {
  @apply inline-flex justify-center items-center p-6px rounded-full bg-gray-200 dark:bg-warm-gray-800 dark:text-gray-200 hover:(dark:text-gray-200);

  div {
    display: inline-flex;
  }
}
</style>
