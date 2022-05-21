<script lang="ts" setup>
import type { Certificate } from '~/types/base'

withDefaults(defineProps<{ certificate: Certificate | null }>(), {
  certificate: null,
})
</script>

<template>
  <div v-if="certificate">
    <base-title :icon="certificate.icon" :title="certificate.title" />
    <ul class="list-disc">
      <certificate-item
        v-for="(history, index) in certificate.histories"
        :key="index"
        :history="history"
      />
    </ul>
  </div>
</template>
