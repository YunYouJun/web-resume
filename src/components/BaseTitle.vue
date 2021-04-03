<template>
  <div>
    <h4>
      <iconify-icon :icon="icon" class="title-icon" />
      {{ title }}
    </h4>
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
