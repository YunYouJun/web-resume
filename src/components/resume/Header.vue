<template>
  <div v-if="resume">
    <h1 class="font-normal text-center text-4xl">
      {{ resume.name }}
    </h1>
    <small v-if="resume.info" class="flex justify-center">
      <span class="mx-1">{{ resume.info.sex }}</span>
      <span class="mx-1">{{ resume.info.birth }}</span>
      <span class="mx-1">{{ resume.info.location }}</span>
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

<script lang="ts" setup>
import { watch } from 'vue'
import type { PropType } from 'vue'
import type { ResumeInfo } from '~/types'

const { resume } = defineProps({
  resume: {
    type: Object as PropType<ResumeInfo | null>,
    default: null,
  },
})

watch(
  () => resume,
  (val) => {
    console.log('watch', val)
  },
)
</script>
