<script lang="ts" setup>
import type { ResumeMigrationWarning } from '~/types'

const editor = useEditorStore()
const app = useAppStore()
const { t } = useI18n()

const isOpen = ref(false)
const warnings = ref<ResumeMigrationWarning[]>([])
const dialog = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()

async function reviewMigration() {
  warnings.value = editor.previewJsonResumeConversion()
  isOpen.value = true
  await nextTick()
  dialog.value?.focus()
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

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="resume-migration-overlay"
      role="presentation"
      @click.self="close"
      @keydown.esc="close"
    >
      <section
        ref="dialog"
        class="resume-migration-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="resume-migration-title"
        tabindex="-1"
      >
        <header>
          <div>
            <p class="resume-migration-dialog__eyebrow">
              JSON Resume
            </p>
            <h2 id="resume-migration-title">
              {{ t('resume_migration.title') }}
            </h2>
          </div>
          <button type="button" class="resume-migration-dialog__close" :aria-label="t('button.close')" @click="close">
            <span i-ri-close-line aria-hidden="true" />
          </button>
        </header>

        <p>{{ t('resume_migration.description') }}</p>

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
          <button type="button" class="resume-migration-button resume-migration-button--secondary" @click="close">
            {{ t('resume_migration.cancel') }}
          </button>
          <button type="button" class="resume-migration-button resume-migration-button--primary" @click="convert">
            {{ t('resume_migration.confirm') }}
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
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

.resume-migration-overlay {
  position: fixed;
  z-index: 300;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(0 0 0 / 48%);
}

.resume-migration-dialog {
  width: min(620px, 100%);
  max-height: min(720px, calc(100dvh - 40px));
  overflow: auto;
  border: 1px solid var(--wr-c-border);
  border-radius: 16px;
  padding: 24px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg);
  box-shadow: 0 22px 70px rgb(0 0 0 / 24%);

  header,
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  h2 {
    margin: 0;
    font-size: 22px;
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

.resume-migration-dialog__close {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: var(--wr-c-bg-soft);
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

.resume-migration-button {
  min-height: 40px;
  border-radius: 8px;
  padding: 0 15px;
  font-weight: 600;
}

.resume-migration-button--secondary {
  border: 1px solid var(--wr-c-border);
}

.resume-migration-button--primary {
  color: white;
  background: var(--wr-c-link);
}

@media (max-width: 640px) {
  .resume-migration-banner {
    right: 10px;
    bottom: calc(var(--bottom-menu-height) + 10px);
    left: 10px;
    justify-content: center;
  }

  .resume-migration-dialog {
    padding: 18px;
  }
}

@media print {
  .resume-migration-banner,
  .resume-migration-overlay {
    display: none;
  }
}
</style>
