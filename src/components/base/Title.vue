<script lang="ts" setup>
const props = defineProps({
  icon: String,
  title: String,
})

const { icon, title } = toRefs(props)
</script>

<template>
  <div>
    <h2 class="text-2xl font-medium">
      <iconify-icon :icon="icon" class="title-icon" />
      {{ title }}
    </h2>
    <hr>
  </div>
</template>

<style lang="scss">
.title-icon {
  width: 25px;
}
</style>
