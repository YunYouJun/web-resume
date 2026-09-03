<script lang="ts" setup>
import type { ResumeInfo } from '~/types'
import { sanitizeResumeHref } from '~/utils'

const props = defineProps<{ footer: ResumeInfo['footer'] }>()
const footer = toRef(props, 'footer')
</script>

<template>
  <div v-if="footer" class="text-center" mt="2">
    <a :href="sanitizeResumeHref(footer.link)" target="_blank" rel="noopener noreferrer">
      <small class="text-monospace">{{ footer.link }}</small>
    </a>
  </div>
</template>
