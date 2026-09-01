<script lang="ts" setup>
import { ToolbarButton, ToolbarRoot, ToolbarSeparator } from 'reka-ui'
import { useResumeCommands } from '~/commands'

const input = ref<{ load: () => Promise<boolean> }>()
const app = useAppStore()
const editor = useEditorStore()
const { execute } = useResumeCommands()
const { t } = useI18n()

async function loadDraft() {
  await input.value?.load()
}
</script>

<template>
  <form class="address-bar" @submit.prevent="loadDraft">
    <AddressBarInput ref="input" />
    <ToolbarRoot
      class="address-bar__actions"
      :aria-label="t('toolbar.primary_actions')"
    >
      <ToolbarButton
        type="submit"
        class="command-button command-button--quiet"
        :disabled="app.isResumeLoading"
      >
        <div :class="app.isResumeLoading ? 'i-ri-loader-4-line animate-spin' : 'i-ri-download-cloud-2-line'" aria-hidden="true" />
        <span>{{ app.isResumeLoading ? t('resume_source.loading') : t('command.load_resume') }}</span>
      </ToolbarButton>
      <ToolbarSeparator class="command-separator" />
      <ToolbarButton
        class="command-button command-button--quiet"
        type="button"
        :disabled="!app.curResume.url"
        @click="execute('resume.preview')"
      >
        <div i-ri-slideshow-4-line aria-hidden="true" />
        <span>{{ t('command.preview_resume') }}</span>
      </ToolbarButton>
      <ToolbarButton
        class="command-button command-button--primary"
        type="button"
        :disabled="!editor.resumeJson"
        @click="execute('resume.print')"
      >
        <div i-ri-printer-line aria-hidden="true" />
        <span>{{ t('command.export_pdf') }}</span>
      </ToolbarButton>
    </ToolbarRoot>
    <p v-if="app.resumeLoadError" class="address-bar__error" role="alert">
      {{ t('resume_source.error', { message: app.resumeLoadError }) }}
    </p>
  </form>
</template>

<style lang="scss" scoped>
.address-bar {
  position: relative;
  display: grid;
  flex: 1;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 8px;
  min-width: 0;
}

.address-bar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.address-bar__error {
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  max-width: min(560px, 90vw);
  border-radius: 8px;
  padding: 7px 10px;
  color: #b91c1c;
  background: #fef2f2;
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
}

@media (max-width: 1100px) {
  .command-button--quiet span {
    display: none;
  }
}
</style>
