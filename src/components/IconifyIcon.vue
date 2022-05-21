<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    icon: string
  }>(),
  {
    icon: 'ri:question-mark',
  },
)
</script>

<template>
  <span class="icon-container">
    <span class="iconify" :data-icon="props.icon" />
  </span>
</template>

<style lang="scss">
.icon-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: -0.15rem;
}
</style>
