<template>
  <h1 class="font-normal text-center text-4xl">
    {{ resume.name || resume.basics.name }}
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
</template>

<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = defineProps<{
  resume: ResumeInfo
}>()

const resume = toRef(props, 'resume')
</script>
