<script setup lang="ts">
import type { TemplateItem } from '../types/templates'

defineProps<{
  template: TemplateItem
}>()
</script>

<template>
  <div
    class="flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer transition w-full aspect-ratio-70/99 relative"
    bg="$wr-c-resume-bg"
  >
    <!-- <div></div> -->
    <iframe
      class="w-full h-full"
      frameborder="0"
      :src="template.previewUrl"
    />

    <div
      class="overlay-actions left-0 top-0 right-0 bottom-0 absolute z-1 flex items-center justify-center transition op-0"
      hover="op-100 bg-white/90 dark:bg-black/90"
    >
      <RouterLink :to="template.previewUrl || ''">
        <div class="i-ri-eye-fill text-4xl text-$ylf-c-primary" />
      </RouterLink>
    </div>
  </div>
</template>
