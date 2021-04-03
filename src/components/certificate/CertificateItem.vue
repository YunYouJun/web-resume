<template>
  <li>
    <span class="font-weight-bold text-kaiti">
      {{ history.name }}
    </span>
    <span>
      <iconify-icon class="position-icon" icon="ri:map-pin-line" />
      {{ history.place }}
    </span>
    <span class="float-right">
      {{ history.time }}
    </span>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    history: Object as PropType<History>,
  },
})
</script>
