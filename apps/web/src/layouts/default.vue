<script lang="ts" setup>
const app = useAppStore()
</script>

<template>
  <ToolBar v-if="!app.isFullscreen" />

  <main
    :class="{
      'app-shell-content': !app.isFullscreen,
      'pt-$top-nav-height': !app.isPrinting && !app.isFullscreen,
      'pb-$bottom-menu-height': !app.isFullscreen,
    }"
  >
    <router-view />
  </main>

  <BottomMenu v-if="!app.isFullscreen" />
</template>
