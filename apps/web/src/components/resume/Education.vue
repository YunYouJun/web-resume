<script lang="ts" setup>
import type { Education } from '~/types/base'
import { sanitizeResumeImageSource } from '~/utils'
import IconifyIcon from '../IconifyIcon.vue'

withDefaults(defineProps<{
  education?: Education | null
}>(), {
  education: null,
})
</script>

<template>
  <div v-if="education">
    <base-title :icon="education.icon" :title="education.title" />
    <div
      v-for="(edu, index) in education.histories"
      :key="index"
      class="ml-2 mb-2"
    >
      <div>
        <img v-if="sanitizeResumeImageSource(edu.logo)" class="school-logo" :src="sanitizeResumeImageSource(edu.logo)">
        <span v-else-if="edu.icon" class="mr-1">
          <IconifyIcon :icon="edu.icon" />
        </span>
        <span>
          <strong>{{ edu.school }}</strong>
          <IconifyIcon class="position-icon" icon="ri:map-pin-line" />
          {{ edu.city }}
        </span>
        <span class="float-right">
          {{ `${edu.start} ~ ${edu.end}` }}
        </span>
      </div>
      <div mt-0.5 text-sm>
        <span>{{ edu.studyType }}</span>， <span>{{ edu.area }}</span>
        <span v-if="edu.grade">，{{ edu.grade }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.school-logo {
  display: inline;
  width: 22px;
  padding-bottom: 3px;
  margin-right: 5px;
}

.position-icon {
  margin-left: 10px;
}
</style>
