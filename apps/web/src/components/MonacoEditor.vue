<script lang="ts" setup>
import type * as m from 'monaco-editor'
import { isDark } from '~/composables'

import setupMonaco from '~/monaco/setup'

import { useEditorStore } from '~/stores/editor'

import { isClient } from '~/utils'

const editorStore = useEditorStore()
const container = ref<HTMLElement | null>()

async function start() {
  if (isClient) {
    const codeEditor = shallowRef<m.editor.IStandaloneCodeEditor | null>()

    // https://github.com/antfu/vite-ssg/issues/74
    // dynamic import
    // const { monaco } =
    const { monaco } = await setupMonaco()

    if (container.value && !editorStore.codeEditor) {
      codeEditor.value = monaco.editor.create(container.value, {
        language: 'yaml',
        theme: isDark.value ? 'vs-dark' : 'vs',
        wordWrap: 'on',
        // for monaco-yaml, but has not been solved, see `src/monaco/setup.ts`
        model: monaco.editor.createModel(
          editorStore.resumeText,
          'yaml',
          monaco.Uri.parse('resume.yml'),
        ),
        value: editorStore.resumeText,
      })

      // add resize for editor
      globalThis.addEventListener('resize', () => {
        codeEditor.value?.layout()
      })

      editorStore.setEditor(codeEditor.value)

      codeEditor.value!.onDidChangeModelContent((_event: any) => {
        if (codeEditor.value)
          editorStore.setResumeText(codeEditor.value.getValue())
      })
    }

    watch(isDark, (val) => {
      monaco.editor.setTheme(val ? 'vs-dark' : 'vs')
    })
  }
}

onMounted(() => {
  start()
})

onUnmounted(() => {
  editorStore.codeEditor?.getModel()?.dispose()
  editorStore.codeEditor?.dispose()
  editorStore.codeEditor = null
})
</script>

<template>
  <div id="editor-container" ref="container" />
</template>

<style>
#editor-container {
  width: 100%;
  height: 100%;
}
</style>
