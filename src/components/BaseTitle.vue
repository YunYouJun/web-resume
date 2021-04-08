<template>
  <div>
    <h2 class="text-2xl font-medium">
      <iconify-icon :icon="icon" class="title-icon" />
      {{ title }}
    </h2>
    <hr />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
  },
}
</script>

<style lang="scss">
.title-icon {
  width: 25px;
}
</style>
