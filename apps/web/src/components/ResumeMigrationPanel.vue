<script lang="ts" setup>
import type { ResumeMigrationWarning } from '~/types'
import { AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle } from 'reka-ui'

const editor = useEditorStore()
const app = useAppStore()
const { t } = useI18n()

const isOpen = ref(false)
const warnings = ref<ResumeMigrationWarning[]>([])
const trigger = ref<HTMLButtonElement>()

async function reviewMigration() {
  warnings.value = editor.previewJsonResumeConversion()
  isOpen.value = true
}

async function close() {
  isOpen.value = false
  await nextTick()
  trigger.value?.focus()
}

function convert() {
  if (!editor.convertToJsonResume())
    return

  close()
  app.showToast({ title: t('resume_migration.converted') })
}
</script>

<template>
  <aside
    v-if="editor.resumeFormat === 'legacy'"
    class="resume-migration-banner"
    role="status"
  >
    <span i-ri-file-transfer-line aria-hidden="true" />
    <span>{{ t('resume_migration.legacy_detected') }}</span>
    <button ref="trigger" type="button" @click="reviewMigration">
      {{ t('resume_migration.review') }}
    </button>
  </aside>

  <AlertDialogRoot v-model:open="isOpen">
    <AlertDialogPortal>
      <AlertDialogOverlay class="app-dialog-overlay" />
      <AlertDialogContent class="app-dialog-content resume-migration-dialog" @close-auto-focus.prevent="trigger?.focus()">
        <header>
          <div>
            <p class="resume-migration-dialog__eyebrow">
              JSON Resume
            </p>
            <AlertDialogTitle class="app-dialog-title">
              {{ t('resume_migration.title') }}
            </AlertDialogTitle>
          </div>
          <button type="button" class="command-button" :aria-label="t('button.close')" @click="close">
            <span i-ri-close-line aria-hidden="true" />
          </button>
        </header>

        <AlertDialogDescription class="app-dialog-description">
          {{ t('resume_migration.description') }}
        </AlertDialogDescription>

        <div v-if="warnings.length" class="resume-migration-warnings">
          <strong>{{ t('resume_migration.warning_count', { count: warnings.length }) }}</strong>
          <ul>
            <li v-for="warning in warnings" :key="`${warning.code}:${warning.path}`">
              <code>{{ warning.path }}</code>
              <span>{{ warning.message }}</span>
            </li>
          </ul>
        </div>
        <p v-else class="resume-migration-safe">
          <span i-ri-checkbox-circle-line aria-hidden="true" />
          {{ t('resume_migration.no_warnings') }}
        </p>

        <footer>
          <button type="button" class="command-button command-button--quiet" @click="close">
            {{ t('resume_migration.cancel') }}
          </button>
          <button type="button" class="command-button command-button--primary" :disabled="!editor.codeEditor" @click="convert">
            {{ t('resume_migration.confirm') }}
          </button>
        </footer>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style lang="scss" scoped>
.resume-migration-banner {
  position: fixed;
  z-index: 100;
  right: 18px;
  bottom: calc(var(--bottom-menu-height) + 18px);
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--wr-c-border);
  border-radius: 999px;
  padding: 7px 8px 7px 12px;
  color: var(--wr-c-text);
  background: color-mix(in srgb, var(--wr-c-bg), transparent 5%);
  box-shadow: 0 8px 28px rgb(0 0 0 / 14%);
  backdrop-filter: blur(12px);
  font-size: 13px;

  button {
    border-radius: 999px;
    padding: 6px 10px;
    color: white;
    background: var(--wr-c-link);
  }
}

.resume-migration-dialog {
  header,
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  > p {
    margin: 14px 0;
    color: var(--wr-c-text);
    opacity: 0.78;
  }

  footer {
    justify-content: flex-end;
    margin-top: 20px;
  }
}

.resume-migration-dialog__eyebrow {
  margin: 0 0 3px;
  color: var(--wr-c-link);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.resume-migration-warnings {
  border-radius: 10px;
  padding: 14px;
  background: rgb(245 158 11 / 12%);

  ul {
    display: grid;
    gap: 10px;
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    gap: 2px;
  }

  code {
    color: #b45309;
    font-size: 12px;
  }
}

.resume-migration-safe {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #15803d !important;
}

@media (max-width: 640px) {
  .resume-migration-banner {
    right: 10px;
    bottom: calc(var(--bottom-menu-height) + 10px);
    left: 10px;
    justify-content: center;
  }

}

@media print {
  .resume-migration-banner {
    display: none;
  }
}
</style>
