<script lang="ts" setup>
import { useEditorStore } from '~/stores/editor'

const editorStore = useEditorStore()

const resumeText = ref(editorStore.resumeText)

onBeforeMount(async () => {
  // 若本地不存在，则设置默认值
  if (!editorStore.resumeText)
    await editorStore.reset()
})

const app = useAppStore()
const isFullscreen = toRef(app, 'isFullscreen')

// cache isFullscreen
let isFullscreenCache = false
watch(() => app.isPrinting, (val) => {
  if (val) {
    isFullscreenCache = app.isFullscreen
    app.isFullscreen = val
  }
  else {
    app.isFullscreen = isFullscreenCache
  }
})
</script>

<template>
  <div v-if="!isFullscreen" class="editor-page text-center" relative>
    <div
      class="<sm:flex-col" flex="~" text-left justify="center" items="center" :class="{
        'preview-container': !isFullscreen,
      }"
    >
      <div
        class="shadow h-full" relative overflow="hidden"
        :class="isFullscreen ? 'z-101' : 'z-99 resume-container w-1/2 lt-sm:(w-full h-1/2)'"
      >
        <div
          overflow="auto"
          :class="{
            'fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-black w-full': isFullscreen,
            'w-full h-full absolute': !isFullscreen,
          }"
        >
          <ResumeAll
            v-if="editorStore.resumeJson"
            class="resume min-w-500px"
            :resume="editorStore.resumeJson"
          />
        </div>

        <button
          v-if="!app.isPrinting"
          transition
          :class="isFullscreen ? 'fixed' : 'absolute'"
          top-2 right-2 p="2" op="60"
          hover="bg-gray text-white"
          rounded-full
          @click="app.toggleFullscreen"
        >
          <div v-if="!isFullscreen" i-ri-fullscreen-line />
          <div v-else i-ri-fullscreen-exit-line />
        </button>
      </div>
      <div v-show="!isFullscreen" class="editor-container w-1/2 h-full lt-sm:(w-full h-1/2)">
        <client-only>
          <MonacoEditor :text="resumeText" />
        </client-only>
      </div>
    </div>
  </div>

  <div v-else z-101 relative bg-white dark:bg-black>
    <div
      overflow="auto"
      class="bg-white dark:bg-black w-full"
    >
      <ResumeAll
        v-if="editorStore.resumeJson"
        class="resume min-w-500px"
        :resume="editorStore.resumeJson"
      />
    </div>

    <button
      v-if="!app.isPrinting"
      transition
      absolute
      top-2 right-2 p="2" op="60"
      hover="bg-gray text-white"
      rounded-full
      @click="app.toggleFullscreen"
    >
      <div i-ri-fullscreen-exit-line />
    </button>
  </div>
</template>

<style lang="scss">
.editor-page {
  overflow: hidden;
  height: calc(100vh - var(--top-nav-height) - var(--bottom-menu-height));
}

.preview-container {
  height: 100%;
  border: 1px solid var(--wr-c-border);
  padding: 0;
  overflow: hidden;
}

.resume-container,
.editor-container {
  flex-grow: 1;
  text-align: left;
}

.resume-container {
  border-right: 1px solid var(--wr-c-border);
}
</style>
