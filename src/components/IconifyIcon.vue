<template>
  <span class="icon-container">
    <span class="iconify" :data-icon="icon"></span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    icon: String,
  },
})
</script>

<style lang="scss">
.icon-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: -0.15rem;
}
</style>
