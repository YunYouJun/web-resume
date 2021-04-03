<template>
  <div>
    <base-title :icon="certificate.icon" :title="certificate.title" />
    <ul>
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
import { Certificate } from '../../types/base'
import CertificateItem from '../certificate/CertificateItem.vue'
export default defineComponent({
  components: { CertificateItem },
  props: {
    certificate: Object as PropType<Certificate>,
  },
})
</script>
