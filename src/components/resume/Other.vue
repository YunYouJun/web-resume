<script lang="ts" setup>
import type { Other } from '~/types/base'

withDefaults(defineProps<{ other: Other | null }>(), {
  other: null,
})
</script>

<template>
  <div v-if="other">
    <base-title :icon="other.icon" :title="other.title" />
    <ul class="list-disc">
      <li v-for="(info, index) in other.info" :key="index">
        {{ info }}
      </li>
    </ul>
  </div>
</template>
