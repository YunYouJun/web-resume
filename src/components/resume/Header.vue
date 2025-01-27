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
      <div class="font-normal flex flex-col gap-2">
        <span class="text-4xl">{{ name || 'Your Name' }}</span>
        <small text-xs>{{ resume.basics.label }}</small>
      </div>
      <img :src="resume.basics.avatar" class="max-h-3cm max-w-3cm">
    </div>
    <h1 v-else class="font-normal text-center text-4xl">
      {{ name || 'Your Name' }}
      <br>
      <small text-xs>{{ resume.basics.label }}</small>
    </h1>
    <small class="flex justify-center mt-2 wr-basic-info text-xs">
      <span v-if="resume.basics.age">{{ resume.basics.age }}</span>
      <span v-if="resume.basics.sex">{{ resume.basics.sex }}</span>
      <span v-if="resume.basics.birth">{{ resume.basics.birth }}</span>
      <span v-if="resume.basics.location">{{ resume.basics.location }}</span>
    </small>
    <ul
      class="my-4 text-center list-none"
      flex="~ wrap"
      justify="center" items="center"
      text="0.9em"
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
          <div
            v-if="contact.icon.startsWith('i-')" inline-flex
            :class="contact.icon"
          />
          <iconify-icon v-else :icon="contact.icon" />

          <span inline-flex class="resume-contact-label" ml="1">
            {{ contact.label }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.wr-basic-info {
  line-height: 1;
  gap: 8px;

  span {
    padding-right: 8px;
    border-right: 1px solid rgba(0, 0, 0, 0.3);

    &:last-child {
      border-right: none;
    }
  }
}
</style>
