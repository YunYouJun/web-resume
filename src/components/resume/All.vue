<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

import ResumeCertificate from '~/components/resume/Certificate.vue'
import ResumeEducation from '~/components/resume/Education.vue'
import ResumeOther from '~/components/resume/Other.vue'
import ResumeProject from '~/components/resume/Project.vue'
import ResumeSkill from '~/components/resume/Skill.vue'
import ResumeWork from '~/components/resume/Work.vue'

const props
  = defineProps<{
    resume: ResumeInfo
  }>()

const resumeComponents = [
  'education',
  'project',
  'certificate',
  'skill',
  'work',
  'other',
]

const resumeMap: Record<string, any> = {
  education: ResumeEducation,
  project: ResumeProject,
  certificate: ResumeCertificate,
  skill: ResumeSkill,
  work: ResumeWork,
  other: ResumeOther,
}

const { resume } = toRefs(props)

const compOrder = computed(() => {
  const order = Object.keys(props.resume).filter(type =>
    resumeComponents.includes(type),
  )
  return order as (keyof ResumeInfo)[]
})

const resumeArr = computed(() => {
  const arr: {
    component: any
    props: any
    attr: keyof ResumeInfo
  }[] = []
  compOrder.value.forEach((type) => {
    arr.push({
      attr: type,
      component: resumeMap[type],
      props: resume.value[type],
    })
  })

  return arr
})
</script>

<template>
  <div v-if="Object.keys(props.resume).length" class="resume">
    <resume-header :resume="resume" />

    <keep-alive>
      <Component
        :is="r.component"
        v-for="r in resumeArr"
        :key="r.attr" class="mt-3"
        :[r.attr]="r.props"
      />
    </keep-alive>

    <resume-footer v-if="resume.footer" :footer="resume.footer" />
  </div>
</template>
