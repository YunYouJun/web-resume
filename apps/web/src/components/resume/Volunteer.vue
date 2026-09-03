<script lang="ts" setup>
import type { Work } from '~/types/base'

defineProps<{ volunteer: Work }>()
</script>

<template>
  <div v-if="volunteer" class="resume-volunteer">
    <base-title :icon="volunteer.icon" :title="volunteer.title" />
    <WorkItem v-for="set in volunteer.sets" :key="set.name" :set="set" />
  </div>
</template>
