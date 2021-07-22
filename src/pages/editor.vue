<template>
  <div class="home mt-8 text-center">
    Todo: 编辑器

    <div id="editor-container" ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useResume } from '~/logic/resume'

const resumeTxt = ref('')
const route = useRoute()

const container = ref<HTMLElement | null>()

onMounted(async() => {
  const txt = await useResume(route.query.url as string)
  resumeTxt.value = txt
  console.log(txt)
  if (container.value) {
    monaco.editor.create(container.value, {
      value: resumeTxt.value,
      language: 'yaml',
      theme: 'vs-dark',
      wordWrap: 'on',
    })
  }
})
</script>

<style>
#editor-container {
  width: 50%;
  height: 80vh;
  text-align: left;
}
</style>
