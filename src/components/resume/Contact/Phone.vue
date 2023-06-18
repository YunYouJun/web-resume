<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = defineProps<{
  contact: ResumeInfo['contact']['phone']
}>()

const formattedLabel = computed(() => {
  const label = props.contact.label
  if (label.length !== 11)
    return label

  return [
    label.slice(0, 3),
    label.slice(3, 7),
    label.slice(7, 11),
  ]
})
</script>

<template>
  <a
    class="text-decoration-none font-medium"
    :href="contact.href"
    target="_blank"
  >
    <iconify-icon :icon="contact.icon" />
    <span class="resume-contact-label">
      <span v-for="label, i in formattedLabel" :key="i" ml="1">
        {{ label }}
      </span>
    </span>
  </a>
</template>
