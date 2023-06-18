<script lang="ts" setup>
const app = useAppStore()
const editor = useEditorStore()

const { t } = useI18n()
</script>

<template>
  <div class="inline-flex" flex="grow" px="1" relative>
    <AddressBarInput />
    <!-- <input
      v-model="app.resumeUrl"
      border-1px
      class="outline-none focus:(border-blue-500 border-solid)) dark:border-gray-700"
      inline-flex justify="center" items="center"
      bg="gray-200 dark:warm-gray-800" rounded-full
      w="full"
      text="sm gray-700 dark:light-200"
      px="4"
      @keyup.enter="onEnterUrl"
    > -->
    <div absolute top-0 bottom-0 right-4 flex justify="center" items="center">
      <button
        class="input-bar-icon-btn"
        title="重置"
        @click="editor.goToResumeUrl(app.queryStr)"
      >
        <div i-ri-arrow-right-line />
      </button>

      <RouterLink class="input-bar-icon-btn" :to="`/resume?url=${app.resumeUrl}`" :title="t('button.see_resume')">
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
