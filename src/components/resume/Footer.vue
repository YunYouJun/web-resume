<template>
  <div v-if="footer" class="text-center">
    <a :href="footer.link" target="_blank">
      <small class="text-monospace">{{ footer.link }}</small>
    </a>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { ResumeInfo } from '~/types'

const { footer } = defineProps({
  footer: Object as PropType<ResumeInfo['footer']>,
})
</script>
