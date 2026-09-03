<script lang="ts" setup>
import type { Other } from '~/types/base'

defineProps<{ references: Other }>()
</script>

<template>
  <div v-if="references" class="resume-references">
    <base-title :icon="references.icon" :title="references.title" />
    <ul class="list-disc">
      <li v-for="(info, index) in references.info" :key="index">
        {{ info }}
      </li>
    </ul>
  </div>
</template>
