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
    <div v-if="resume.basics.avatar" class="flex justify-between items-center">
      <span class="font-normal text-center text-4xl">
        {{ name || 'Your Name' }}
      </span>
      <img :src="resume.basics.avatar" class="max-h-3cm max-w-3cm ">
    </div>
    <h1 v-else class="font-normal text-center text-4xl">
      {{ name || 'Your Name' }}
    </h1>
    <small v-if="resume.basics" class="flex justify-center">
      <span class="mx-1">{{ resume.basics.sex }}</span>
      <span class="mx-1">{{ resume.basics.birth }}</span>
      <span class="mx-1">{{ resume.basics.location }}</span>
    </small>
    <ul
      class="my-6 text-center list-none"
      flex justify="center" items="center"
      text-0.9rem
    >
      <li
        v-for="(contact, key) in resume.contact"
        :key="contact.label"
        class="mx-3"
        inline-flex justify="center" items="center"
      >
        <ResumeContactPhone v-if="key === 'phone'" :contact="contact" />
        <a
          v-else
          class="text-decoration-none font-medium"
          :href="contact.href"
          target="_blank"
          inline-flex justify="center" items="center"
        >
          <div v-if="contact.icon.startsWith('i-')" inline-flex :class="contact.icon" />
          <iconify-icon v-else :icon="contact.icon" />

          <span inline-flex class="resume-contact-label" ml="1">
            {{ contact.label }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>
