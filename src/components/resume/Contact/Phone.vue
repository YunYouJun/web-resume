<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = defineProps<{
  contact: ResumeInfo['contact']['phone']
}>()

const formattedLabel = computed(() => {
  const label = props.contact.label.toString()
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
    inline-flex
  >
    <iconify-icon :icon="contact.icon" />
    <span class="resume-contact-label" inline-flex>
      <template v-if="Array.isArray(formattedLabel)">
        <span v-for="label, i in formattedLabel" :key="i" ml="1">
          {{ label }}
        </span>
      </template>
      <template v-else>
        {{ formattedLabel }}
      </template>
    </span>
  </a>
</template>
