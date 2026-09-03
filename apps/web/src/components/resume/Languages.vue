<script lang="ts" setup>
import type { Other } from '~/types/base'

defineProps<{ languages: Other }>()
</script>

<template>
  <div v-if="languages" class="resume-languages">
    <base-title :icon="languages.icon" :title="languages.title" />
    <ul class="list-disc">
      <li v-for="(info, index) in languages.info" :key="index">
        {{ info }}
      </li>
    </ul>
  </div>
</template>
