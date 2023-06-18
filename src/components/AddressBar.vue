<script lang="ts" setup>
const app = useAppStore()
const editor = useEditorStore()

const { t } = useI18n()
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
        <div i-ri-arrow-right-line />
      </button>

      <RouterLink class="input-bar-icon-btn" :to="`/resume?url=${app.curResume.url}`" :title="t('button.see_resume')">
        <div i-ri-slideshow-4-line />
      </RouterLink>

      <button
        class="input-bar-icon-btn"
        title="重置"
        @click="editor.reset()"
      >
        <div i-ri-eraser-line />
      </button>
    </div>
  </div>
</template>
