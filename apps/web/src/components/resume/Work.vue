<script lang="ts" setup>
import type { Project } from '~/types/base'

const props = defineProps<{ work: Project }>()
const { work } = toRefs(props)
</script>

<template>
  <div v-if="work" class="resume-work">
    <base-title :icon="work.icon" :title="work.title" />
    <WorkItem v-for="set in work.sets" :key="set.name" :set="set" />
  </div>
</template>

<style lang="scss">
.project-name {
  margin-left: 4px;
}
</style>
