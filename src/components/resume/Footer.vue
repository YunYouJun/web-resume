<template>
  <div v-if="footer" class="text-center">
    <a :href="footer.link" target="_blank">
      <small class="text-monospace">{{ footer.link }}</small>
    </a>
  </div>
</template>

<script lang="ts" setup>
import type { ResumeInfo } from '~/types'

const props = defineProps<{ footer: ResumeInfo['footer'] }>()
const footer = toRef(props, 'footer')
</script>
