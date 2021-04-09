<template>
  <div class="text-center">
    <small class="text-monospace">{{ footer }}</small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    footer: String,
  },
})
</script>
