<script lang="ts" setup>
const props = defineProps<{
  icon?: string
  title: string
}>()

const { icon, title } = toRefs(props)
</script>

<template>
  <div>
    <h2 class="text-2xl font-medium">
      <iconify-icon v-if="icon" :icon="icon" class="title-icon" />
      <span>
        {{ title }}
      </span>
    </h2>
    <hr>
  </div>
</template>

<style lang="scss">
.title-icon {
  width: 25px;
}
</style>
