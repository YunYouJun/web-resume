<template>
  <div id="editor-container" ref="container"></div>
</template>

<script lang="ts" setup>
import * as m from 'monaco-editor'
import { isDark } from '~/logic'

import { useEditorStore } from '~/stores/editor'

import setupMonaco from '~/monaco/setup'

import { isClient } from '~/utils'

// ref is too slow
let codeEditor: m.editor.IStandaloneCodeEditor

const editorStore = useEditorStore()
const container = ref<HTMLElement | null>()

async function start() {
  if (isClient) {
    // https://github.com/antfu/vite-ssg/issues/74
    // dynamic import
    // const { monaco } =
    const { monaco } = await setupMonaco()

    if (container.value && !codeEditor) {
      codeEditor = monaco.editor.create(container.value, {
        language: 'yaml',
        theme: isDark.value ? 'vs-dark' : 'vs',
        wordWrap: 'on',
        // for monaco-yaml, but has not been solved, see `src/monaco/setup.ts`
        // model: monaco.editor.createModel(
        //   editorStore.resumeText,
        //   'yaml',
        //   monaco.Uri.parse('resume.yml')
        // ),
        value: editorStore.resumeText,
      })

      // add resize for editor
      self.addEventListener('resize', () => {
        codeEditor.layout()
      })

      editorStore.setEditor(codeEditor)

      codeEditor.onDidChangeModelContent((event: any) => {
        editorStore.setResume(codeEditor.getValue())
      })
    }

    watch(isDark, (val) => {
      monaco.editor.setTheme(val ? 'vs-dark' : 'vs')
    })
  }
}

start()
</script>

<style>
#editor-container {
  width: 100%;
  height: 100%;
}
</style>
