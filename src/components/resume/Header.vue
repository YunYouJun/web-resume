<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = withDefaults(defineProps<{
  resume: ResumeInfo
}>(), {
  resume: {
    name: 'Your Name',
    basics: {
      name: 'Your Name',
    },
  },
})

const resume = toRef(props, 'resume')
const name = computed(() => {
  return props.resume.name || props.resume.basics.name
})
</script>

<template>
  <div v-if="resume">
    <h1 class="font-normal text-center text-4xl">
      {{ name || 'Your Name' }}
    </h1>
    <small v-if="resume.basics" class="flex justify-center">
      <span class="mx-1">{{ resume.basics.sex }}</span>
      <span class="mx-1">{{ resume.basics.birth }}</span>
      <span class="mx-1">{{ resume.basics.location }}</span>
    </small>
    <ul class="my-4 block text-center list-none" style="padding-left: 0">
      <li
        v-for="contact in resume.contact"
        :key="contact.label"
        class="mx-3 inline-block"
      >
        <a
          class="text-decoration-none font-medium"
          :href="contact.href"
          target="_blank"
        >
          <iconify-icon :icon="contact.icon" />
          {{ contact.label }}
        </a>
      </li>
    </ul>
  </div>
</template>
