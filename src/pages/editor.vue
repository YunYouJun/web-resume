<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useEditorStore } from '~/stores/editor'

import { useResume } from '~/composables/resume'

const editorStore = useEditorStore()

const { t } = useI18n()

const resumeText = ref(editorStore.resumeText)

async function resetResumeText() {
  const resumeExample = await useResume('/resume/suzumiya.resume.yml')

  const prefix = `# ${t('editor.name')}\n`
  const txt = prefix + resumeExample
  editorStore.codeEditor?.setValue(txt)
}

onBeforeMount(async () => {
  // 若本地不存在，则设置默认值
  if (!editorStore.resumeText)
    await resetResumeText()
})
</script>

<template>
  <div class="editor-page text-center">
    <!-- <h1 class="m-4">
      {{ t('editor.name') }}
    </h1> -->
    <div class="preview-container" grid="~ cols-2 <sm:cols-1">
      <div class="resume-container resume shadow w-full">
        <ResumeAll v-if="editorStore.resumeJson" class="min-w-500px" :resume="editorStore.resumeJson" />
      </div>
      <div class="editor-container">
        <client-only>
          <MonacoEditor :text="resumeText" />
        </client-only>
      </div>
    </div>
    <div m="t-2" text="sm gray-800 dark:gray">
      注意：此处主要作示例体验与临时修改使用。如果您想要更好的编辑体验，您可以使用本地开发的方式。
    </div>
    <div>
      <button class="resume-btn m-2" @click="resetResumeText">
        重置内容
      </button>
      <RouterLink class="resume-btn m-2" to="/resume">
        {{
          t('button.see_resume')
        }}
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss">
.editor-page {
  overflow: hidden;
}

.preview-container {
  border: 1px solid var(--wr-c-border);
  padding: 0;
  overflow: hidden;
}

.resume-container,
.editor-container {
  height: calc(100vh - 100px);
  text-align: left;
}

.resume-container {
  padding: 2rem;
  overflow: scroll;
  border-right: 1px solid var(--wr-c-border);
}
</style>
