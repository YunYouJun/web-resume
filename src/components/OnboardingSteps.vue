<script lang="ts" setup>
import { useResumeCommands } from '~/commands'

const emit = defineEmits<{
  selected: []
}>()

const { execute } = useResumeCommands()
const { t } = useI18n()

const steps = computed(() => [
  {
    commandId: 'resume.load',
    description: t('onboarding.source_description'),
    icon: 'i-ri-link',
    title: t('onboarding.source_title'),
  },
  {
    commandId: 'resume.example:0',
    description: t('onboarding.example_description'),
    icon: 'i-ri-file-user-line',
    title: t('onboarding.example_title'),
  },
  {
    commandId: 'navigate.editor',
    description: t('onboarding.edit_description'),
    icon: 'i-ri-side-bar-line',
    title: t('onboarding.edit_title'),
  },
])

async function select(commandId: string) {
  emit('selected')
  await execute(commandId)
}
</script>

<template>
  <div class="onboarding-steps">
    <button
      v-for="step in steps"
      :key="step.commandId"
      type="button"
      class="onboarding-step"
      @click="select(step.commandId)"
    >
      <span class="onboarding-step__icon" aria-hidden="true">
        <span :class="step.icon" />
      </span>
      <span class="onboarding-step__content">
        <strong>{{ step.title }}</strong>
        <span>{{ step.description }}</span>
      </span>
      <span i-ri-arrow-right-s-line aria-hidden="true" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.onboarding-steps {
  display: grid;
  gap: 10px;
  margin-top: 20px;
}

.onboarding-step {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  border: 1px solid rgb(127 127 127 / 20%);
  border-radius: 14px;
  padding: 12px;
  color: inherit;
  text-align: left;
  background: var(--wr-c-bg-soft);
  cursor: pointer;

  &:hover {
    border-color: var(--wr-c-link);
    background: color-mix(in srgb, var(--wr-c-link), transparent 94%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
    outline-offset: 2px;
  }
}

.onboarding-step__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: var(--wr-c-link);
  background: color-mix(in srgb, var(--wr-c-link), transparent 88%);
}

.onboarding-step__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;

  span {
    color: rgb(127 127 127);
    font-size: 13px;
    line-height: 1.4;
  }
}
</style>
