<template>
  <div v-if="props.resume">
    <resume-header :resume="resume" />

    <keep-alive>
      <template v-for="(type, i) in compOrder" :key="i">
        <component :is="resumeMap[type]" class="mt-3" :[type]="resume[type]" />
      </template>
    </keep-alive>

    <resume-footer v-if="resume.footer" :footer="resume.footer" />
  </div>
</template>

<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

import ResumeEducation from '~/components/resume/Education.vue'
import ResumeProject from '~/components/resume/Project.vue'
import ResumeCertificate from '~/components/resume/Certificate.vue'
import ResumeSkill from '~/components/resume/Skill.vue'
import ResumeOther from '~/components/resume/Other.vue'

const resumeComponents = [
  'education',
  'project',
  'certificate',
  'skill',
  'other',
]

const resumeMap = {
  education: ResumeEducation,
  project: ResumeProject,
  certificate: ResumeCertificate,
  skill: ResumeSkill,
  other: ResumeOther,
}

const props = withDefaults(
  defineProps<{
    resume: ResumeInfo
  }>(),
  {},
)

const { resume } = toRefs(props)

const compOrder = computed(() => {
  const order = Object.keys(props.resume).filter(type =>
    resumeComponents.includes(type),
  )
  return order
})
</script>
