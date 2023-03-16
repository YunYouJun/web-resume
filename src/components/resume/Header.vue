<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = defineProps<{
  resume: ResumeInfo
}>()

const resume = toRef(props, 'resume')
const name = computed(() => {
  return props.resume.name || props.resume.basics.name
})
</script>

<template>
  <div v-if="resume">
    <div class="flex justify-between">
      <span class="font-normal text-center text-4xl">
        {{ name || 'Your Name' }}
      </span>
      <img v-if="resume.basics.avatar" :src="resume.basics.avatar" style="max-height: 3cm; max-width: 3cm;">
    </div>
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
