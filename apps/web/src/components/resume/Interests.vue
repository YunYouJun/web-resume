<script lang="ts" setup>
import type { Other } from '~/types/base'

defineProps<{ interests: Other }>()
</script>

<template>
  <div v-if="interests" class="resume-interests">
    <base-title :icon="interests.icon" :title="interests.title" />
    <ul class="list-disc">
      <li v-for="(info, index) in interests.info" :key="index">
        {{ info }}
      </li>
    </ul>
  </div>
</template>
