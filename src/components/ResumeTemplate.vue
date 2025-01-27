<script setup lang="ts">
import type { TemplateItem } from '../types/templates'

defineProps<{
  template: TemplateItem
}>()
</script>

<template>
  <div flex="~ col" class="shadow-lg hover:shadow-xl transition w-full" bg="$wr-c-resume-bg">
    <div
      class="flex items-center justify-center  cursor-pointer transition w-full aspect-ratio-70/99 relative"
    >
      <!-- <div></div> -->
      <iframe
        class="w-full h-full"
        frameborder="0"
        :src="`/?template=${template.id}&mode=preview`"
      />

      <RouterLink
        class="overlay-actions left-0 top-0 right-0 bottom-0 absolute z-1 flex items-center justify-center transition op-0"
        hover="op-100 bg-white/90 dark:bg-black/90"
        :to="`/?template=${template.id}`"
      >
        <div class="i-ri-eye-fill text-4xl text-$ylf-c-primary" />
      </RouterLink>
    </div>

    <div flex="~ col gap-2" class="p-2 items-center justify-center border-t">
      <div class="font-bold">
        {{ template.name }}
      </div>
      <div class="text-xs op-60">
        {{ template.description }}
      </div>
    </div>
  </div>
</template>
