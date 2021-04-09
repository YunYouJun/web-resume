<template>
  <div>
    <h1 class="font-normal text-center text-4xl">{{ resume.name }}</h1>
    <small class="flex justify-center">
      <span class="mx-1">{{ resume.info.sex }}</span>
      <span class="mx-1">{{ resume.info.birth }}</span>
      <span class="mx-1">{{ resume.info.location }}</span>
    </small>
    <ul class="my-4 block text-center list-none" style="padding-left: 0">
      <li
        class="mx-3 inline-block"
        v-for="contact in resume.contact"
        :key="contact.label"
      >
        <a class="text-decoration-none" :href="contact.href" target="_blank">
          <iconify-icon :icon="contact.icon" />
          {{ contact.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ResumeInfo } from '../../types'
import IconifyIcon from '../IconifyIcon.vue'

export default defineComponent({
  components: { IconifyIcon },
  props: {
    resume: Object as PropType<ResumeInfo>,
  },
})
</script>
