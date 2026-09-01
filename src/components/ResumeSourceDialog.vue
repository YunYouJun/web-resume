<script lang="ts" setup>
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

const app = useAppStore()
const input = ref<{ load: () => Promise<boolean> }>()
const { t } = useI18n()

async function load() {
  if (await input.value?.load())
    app.resumeSourceOpen = false
}
</script>

<template>
  <DialogRoot v-model:open="app.resumeSourceOpen">
    <DialogPortal>
      <DialogOverlay class="app-dialog-overlay" />
      <DialogContent class="app-dialog-content">
        <header class="app-dialog-header">
          <DialogTitle class="app-dialog-title">
            {{ t('resume_source.title') }}
          </DialogTitle>
          <DialogDescription class="app-dialog-description">
            {{ t('resume_source.description') }}
          </DialogDescription>
        </header>
        <form class="resume-source-dialog__form" @submit.prevent="load">
          <AddressBarInput ref="input" @loaded="app.resumeSourceOpen = false" />
          <button
            type="submit"
            class="command-button command-button--primary"
            :disabled="app.isResumeLoading"
          >
            <span :class="app.isResumeLoading ? 'i-ri-loader-4-line animate-spin' : 'i-ri-download-cloud-2-line'" aria-hidden="true" />
            {{ app.isResumeLoading ? t('resume_source.loading') : t('command.load_resume') }}
          </button>
        </form>
        <p v-if="app.resumeLoadError" class="resume-source-dialog__error" role="alert">
          {{ t('resume_source.error', { message: app.resumeLoadError }) }}
        </p>
        <DialogClose class="command-button app-dialog-close" :aria-label="t('button.close')">
          <span i-ri-close-line aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss" scoped>
.resume-source-dialog__form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  margin-top: 22px;
}

.resume-source-dialog__error {
  margin: 12px 0 0;
  border-radius: 9px;
  padding: 9px 11px;
  color: #b91c1c;
  background: #fef2f2;
}

@media (max-width: 520px) {
  .resume-source-dialog__form {
    grid-template-columns: 1fr;
  }
}
</style>
