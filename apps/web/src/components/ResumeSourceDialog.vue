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
import { useCloudStore } from '~/stores/cloud'

const app = useAppStore()
const cloud = useCloudStore()
const input = ref<{ load: () => Promise<boolean> }>()
const { t } = useI18n()

async function load() {
  if (await input.value?.load())
    app.resumeSourceOpen = false
}

async function openCloudResume(documentId: string) {
  try {
    await cloud.openDocument(documentId)
    app.resumeSourceOpen = false
  }
  catch {
    // The cloud store exposes the error in the dialog and account page.
  }
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
        <p v-if="cloud.errorMessage" class="resume-source-dialog__error" role="alert">
          {{ cloud.errorMessage }}
        </p>
        <section v-if="cloud.isAuthenticated && cloud.documents.length" class="resume-source-dialog__cloud">
          <header>
            <strong>{{ t('cloud.resumes') }}</strong>
            <span>{{ t('resume_source.cloud_description') }}</span>
          </header>
          <button v-for="document in cloud.documents.slice(0, 6)" :key="document._id" type="button" @click="openCloudResume(document._id)">
            <span i-ri-cloud-line aria-hidden="true" />
            <span>{{ document.name }}</span>
            <small>{{ document.validationStatus === 'valid' ? t('cloud.valid') : t('cloud.invalid_draft') }}</small>
          </button>
        </section>
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

.resume-source-dialog__cloud {
  margin-top: 18px;
  border-top: 1px solid rgb(127 127 127 / 16%);
  padding-top: 14px;

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 7px;
  }

  header span,
  button small {
    color: rgb(127 127 127);
    font-size: 11px;
  }

  button {
    display: grid;
    width: 100%;
    min-height: 40px;
    grid-template-columns: 22px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 9px;
    padding: 6px 8px;
    color: inherit;
    background: transparent;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: rgb(127 127 127 / 10%);
    }
  }
}

@media (max-width: 520px) {
  .resume-source-dialog__form {
    grid-template-columns: 1fr;
  }
}
</style>
