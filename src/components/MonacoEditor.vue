<template>
  <div id="editor-container" ref="container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, inject } from 'vue'
import { isDark } from '~/logic'

// monaco
import * as m from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { sleep } from '~/utils'

let monaco: typeof m

const container = ref<HTMLElement | null>()

// ref is too slow
let editor: m.editor.IStandaloneCodeEditor

const props = defineProps({
  text: {
    type: String,
    default: '// 在线使用 yaml 编辑你的简历',
  },
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

const updateResumeTxt = inject('updateResumeTxt')

onMounted(async() => {
  // https://github.com/antfu/vite-ssg/issues/74
// dynamic import
  if (typeof window !== 'undefined') {
    monaco = await import('monaco-editor')
  }
  if (container.value) {
    editor = monaco.editor.create(container.value, {
      value: props.text,
      language: 'yaml',
      theme: isDark.value ? 'vs-dark' : 'vs',
      wordWrap: 'on',
    })

    const waitEditorLoad = async() => {
      if (!editor) {
        console.log('等待编辑器初始化...')
        await sleep(200)
        waitEditorLoad()
      }
    }

    await waitEditorLoad()
    console.log('monaco-editor 初始化完成')

    console.log('props.text', props.text)
    editor?.setValue(props.text || '')

    editor.onDidChangeModelContent((event) => {
      updateResumeTxt(editor.getValue())
    })
  }
})

watch(isDark, (val) => {
  monaco.editor.setTheme(val ? 'vs-dark' : 'vs')
})
</script>

<style>
#editor-container {
  width: 100%;
  height: 100%;
}
</style>
