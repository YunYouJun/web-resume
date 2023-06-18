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
const isFullscreen = ref(false)

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// esc 退出全屏
const { Escape } = useMagicKeys()
watch(Escape, () => {
  if (isFullscreen.value)
    isFullscreen.value = false
})

// cache isFullscreen
let isFullscreenCache = false
watch(() => app.isPrinting, (val) => {
  if (val) {
    isFullscreenCache = isFullscreen.value
    isFullscreen.value = val
  }
  else {
    isFullscreen.value = isFullscreenCache
  }
})
</script>

<template>
  <div class="editor-page text-center">
    <!-- <h1 class="m-4">
      {{ t('editor.name') }}
    </h1> -->
    <div class="preview-container" grid="~ cols-2 <sm:cols-1">
      <div class="resume-container resume shadow w-full" relative>
        <div
          :class="{
            'fixed inset-0 z-100 bg-white dark:bg-black overflow-auto': isFullscreen,
          }"
        >
          <button
            v-if="!app.isPrinting"
            transition
            :class="isFullscreen ? 'fixed' : 'absolute'"
            top-2 right-2 p="2" op="60"
            hover="bg-gray text-white"
            rounded-full
            @click="toggleFullscreen"
          >
            <div v-if="!isFullscreen" i-ri-fullscreen-line />
            <div v-else i-ri-fullscreen-exit-line />
          </button>

          <ResumeAll
            v-if="editorStore.resumeJson"
            class="min-w-500px"
            :resume="editorStore.resumeJson"
          />
        </div>
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
  height: 100%;
  text-align: left;
}

.resume-container {
  padding: 2rem;
  overflow: auto;
  border-right: 1px solid var(--wr-c-border);
}
</style>
