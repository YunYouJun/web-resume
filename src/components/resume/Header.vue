<template>
  <div>
    <h1 class="name text-center text-4xl">{{ resume.name }}</h1>
    <small class="flex justify-center">
      <span class="mx-1">{{ resume.info.sex }}</span>
      <span class="mx-1">{{ resume.info.birth }}</span>
      <span class="mx-1">{{ resume.info.location }}</span>
    </small>
    <ul class="my-4 flex justify-center list-none">
      <li
        class="mx-2 inline"
        v-for="contact in resume.contact"
        :key="contact.label"
      >
        <a
          class="nav-link text-decoration-none"
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

<script>
import { defineComponent } from 'vue'
import IconifyIcon from '../IconifyIcon.vue'

export default defineComponent({
  components: { IconifyIcon },
  props: {
    resume: Object,
  },
})
</script>

<style lang="scss">
.name {
  font-weight: 400;
}
</style>
