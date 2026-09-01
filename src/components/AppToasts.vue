<script lang="ts" setup>
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { useResumeCommands } from '~/commands'

const app = useAppStore()
const { execute } = useResumeCommands()
const { t } = useI18n()

async function runAction() {
  if (app.toast.actionCommandId)
    await execute(app.toast.actionCommandId)
  app.toastOpen = false
}
</script>

<template>
  <ToastProvider :duration="5000" :label="t('toast.notification')">
    <ToastRoot v-model:open="app.toastOpen" class="app-toast">
      <div class="app-toast__copy">
        <ToastTitle class="app-toast__title">
          {{ app.toast.title }}
        </ToastTitle>
        <ToastDescription v-if="app.toast.description" class="app-toast__description">
          {{ app.toast.description }}
        </ToastDescription>
      </div>
      <ToastAction
        v-if="app.toast.actionLabel"
        class="app-toast__action"
        alt-text="Undo"
        @click="runAction"
      >
        {{ app.toast.actionLabel }}
      </ToastAction>
      <ToastClose class="app-toast__close" :aria-label="t('button.close')">
        <span i-ri-close-line aria-hidden="true" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport class="app-toast-viewport" />
  </ToastProvider>
</template>

<style lang="scss">
.app-toast-viewport {
  position: fixed;
  z-index: calc(var(--overlay-z-index) + 20);
  right: 16px;
  bottom: calc(var(--bottom-menu-height) + 16px);
  display: flex;
  width: min(390px, calc(100vw - 32px));
  max-height: 100dvh;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
}

.app-toast {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 10px;
  border: 1px solid rgb(127 127 127 / 22%);
  border-radius: 14px;
  padding: 13px 14px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg);
  box-shadow: 0 18px 50px rgb(0 0 0 / 20%);
}

.app-toast__copy {
  min-width: 0;
}

.app-toast__title {
  font-weight: 700;
}

.app-toast__description {
  margin-top: 3px;
  color: rgb(127 127 127);
  font-size: 13px;
}

.app-toast__action {
  min-height: 36px;
  border-radius: 8px;
  padding: 0 10px;
  color: var(--wr-c-link);
  font-weight: 700;
}

.app-toast__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

@media (max-width: 767px) {
  .app-toast-viewport {
    right: 12px;
    bottom: calc(var(--bottom-menu-height) + 12px);
    width: calc(100vw - 24px);
  }
}

@media print {
  .app-toast-viewport {
    display: none;
  }
}
</style>
