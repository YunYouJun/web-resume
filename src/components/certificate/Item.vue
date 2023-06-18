<script lang="ts" setup>
import type { CertificateHistory } from '~/types/base'

const props = defineProps<{
  history: CertificateHistory
}>()

const history = toRef(props, 'history')
</script>

<template>
  <li v-if="history">
    <span class="font-black text-kaiti">{{ history.name }}</span>
    <span v-if="history.place">
      <iconify-icon class="position-icon" icon="ri:map-pin-line" />
      {{ history.place }}
    </span>
    <span class="float-right" font="mono">{{ history.time }}</span>
  </li>
</template>
