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
import CertificateItem from '~/components/certificate/CertificateItem.vue'

export default defineComponent({
  components: { CertificateItem },
  props: {
    certificate: {
      type: Object as PropType<Certificate | null>,
      default: null,
    },
  },
})
</script>
