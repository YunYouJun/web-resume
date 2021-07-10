<template>
  <div>
    <h2 class="text-2xl font-medium">
      <iconify-icon :icon="icon" class="title-icon" />
      {{ title }}
    </h2>
    <hr />
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'

const props = defineProps({
  icon: String,
  title: String,
})

const { icon, title } = toRefs(props)
</script>

<style lang="scss">
.title-icon {
  width: 25px;
}
</style>
