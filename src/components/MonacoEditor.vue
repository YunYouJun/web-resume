<template>
  <div id="editor-container" ref="container"></div>
</template>

<script lang="ts" setup>
import { isDark } from '~/logic'

import { useEditorStore } from '~/stores/editor'

import * as m from 'monaco-editor'
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
    const { editor, Uri } = await setupMonaco()

    if (container.value && !codeEditor) {
      codeEditor = editor.create(container.value, {
        language: 'yaml',
        theme: isDark.value ? 'vs-dark' : 'vs',
        wordWrap: 'on',
        model: editor.createModel(
          editorStore.resumeText,
          'yaml',
          Uri.parse('resume.yml')
        ),
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
      editor.setTheme(val ? 'vs-dark' : 'vs')
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
