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

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Certificate } from '~/types/base'

export default defineComponent({
  props: {
    certificate: {
      type: Object as PropType<Certificate | null>,
      default: null,
    },
  },
})
</script>
