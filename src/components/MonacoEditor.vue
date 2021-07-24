<template>
  <div id="editor-container" ref="container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, watchEffect } from 'vue'
import { isDark } from '~/logic'

// monaco
import * as m from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

let monaco: typeof m

const container = ref<HTMLElement | null>()
const editor = ref<m.editor.IStandaloneCodeEditor | null>()

const { text } = defineProps({
  text: String,
})

// @ts-ignore
// https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new JsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker()
    }
    return new EditorWorker()
  },
}

onMounted(async() => {
  // https://github.com/antfu/vite-ssg/issues/74
// dynamic import
  if (typeof window !== 'undefined') {
    monaco = await import('monaco-editor')
  }
  if (container.value) {
    console.log(text)
    editor.value = monaco.editor.create(container.value, {
      value: text,
      language: 'yaml',
      theme: isDark ? 'vs-dark' : 'vs',
      wordWrap: 'on',
    })
  }
})

watch(isDark, (val) => {
  monaco.editor.setTheme(val ? 'vs-dark' : 'vs')
})

// watchEffect(() => {
//   editor.value?.setValue(text || '')
// })

</script>

<style>
#editor-container {
  width: 100%;
  height: 100%;
}
</style>
