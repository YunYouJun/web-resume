<script lang="ts" setup>
import type { Project } from '~/types/base'

defineProps<{ publications: Project }>()
</script>

<template>
  <div v-if="publications" class="resume-publications">
    <base-title :icon="publications.icon" :title="publications.title" />
    <ProjectItem v-for="set in publications.sets" :key="set.name" :set="set" />
  </div>
</template>
