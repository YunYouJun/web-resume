<script lang="ts" setup>
import type { Project } from '~/types/base'

const props = defineProps<{ project: Project }>()
const { project } = toRefs(props)
</script>

<template>
  <div v-if="project" class="resume-projects">
    <base-title :icon="project.icon" :title="project.title" />
    <ProjectItem v-for="set in project.sets" :key="set.name" :set="set" />
  </div>
</template>

<style lang="scss">
.project-name {
  margin-left: 4px;
}
</style>
