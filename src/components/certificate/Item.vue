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
import type { PropType } from 'vue'
import type { CertificateHistory } from '~/types/base'

const { history } = defineProps({
  history: Object as PropType<CertificateHistory>,
})
</script>
