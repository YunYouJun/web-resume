<script lang="ts" setup>
const app = useAppStore()
</script>

<template>
  <ToolBar v-show="!app.isFullscreen" />

  <main
    :class="{
      'pt-$top-nav-height': !app.isPrinting && !app.isFullscreen,
      'pb-$bottom-menu-height': !app.isFullscreen,
    }"
  >
    <router-view />
  </main>

  <BottomMenu v-show="!app.isFullscreen" />
</template>
