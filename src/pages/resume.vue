<template>
  <div v-if="resume" class="resume">
    <resume-header :resume="resume" />
    <resume-education class="mt-3" :education="resume.education" />
    <resume-project class="mt-3" :project="resume.project" />
    <resume-certificate class="mt-3" :certificate="resume.certificate" />
    <resume-skill class="mt-3" :skill="resume.skill" />
    <resume-other class="mt-3" :other="resume.other" />
    <resume-footer v-if="resume.footer" :footer="resume.footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'
import { ResumeInfo } from '../types'
import yaml from 'js-yaml'
import { useRoute } from 'vue-router'
// method 1
// import resume from '~/assets/resume/2021.resume.yml'
// method 2
// online load yaml

export default defineComponent({
  setup() {
    const resume = ref<ResumeInfo>()

    onBeforeMount(async () => {
      const route = useRoute()
      const url = (route.query['url'] as string) || '/resume/2021.resume.yml'
      resume.value = (await fetch(url)
        .then((res) => {
          return res.text()
        })
        .then((data) => {
          return yaml.load(data)
        })) as ResumeInfo
    })
    return {
      resume,
    }
  },
})
</script>
