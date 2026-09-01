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
const { t } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="app.onboardingOpen">
    <DialogPortal>
      <DialogOverlay class="app-dialog-overlay" />
      <DialogContent class="app-dialog-content">
        <header class="app-dialog-header">
          <DialogTitle class="app-dialog-title">
            {{ t('onboarding.title') }}
          </DialogTitle>
          <DialogDescription class="app-dialog-description">
            {{ t('onboarding.description') }}
          </DialogDescription>
        </header>
        <OnboardingSteps @selected="app.onboardingOpen = false" />
        <DialogClose class="command-button app-dialog-close" :aria-label="t('button.close')">
          <span i-ri-close-line aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
