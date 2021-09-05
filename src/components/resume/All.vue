<template>
  <div v-if="props.resume">
    <resume-header :resume="resume" />
    <resume-education class="mt-3" :education="resume.education" />
    <resume-project class="mt-3" :project="resume.project" />
    <resume-certificate class="mt-3" :certificate="resume.certificate" />
    <resume-skill class="mt-3" :skill="resume.skill" />
    <resume-other class="mt-3" :other="resume.other" />
    <resume-footer v-if="resume.footer" :footer="resume.footer" />
  </div>
</template>

<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = withDefaults(
  defineProps<{
    resume: ResumeInfo
  }>(),
  {}
)
</script>
