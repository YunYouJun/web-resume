<template>
  <li v-if="history">
    <span class="font-weight-bold text-kaiti">{{ history.name }}</span>
    <span>
      <iconify-icon class="position-icon" icon="ri:map-pin-line" />
      {{ history.place }}
    </span>
    <span class="float-right">{{ history.time }}</span>
  </li>
</template>

<script lang="ts" setup>
import type { CertificateHistory } from '~/types/base'

const props = defineProps<{
  history: CertificateHistory
}>()

const history = toRef(props, 'history')
</script>
