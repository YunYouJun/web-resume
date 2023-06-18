<script lang="ts" setup>
const app = useAppStore()
</script>

<template>
  <ToolBar />

  <main
    :class="{
      'pt-$top-nav-height': !app.isPrinting,
    }"
    pb="$bottom-menu-height"
  >
    <router-view />
  </main>

  <BottomMenu />
</template>
