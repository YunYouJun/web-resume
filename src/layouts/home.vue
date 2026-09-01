<template>
  <ToolBar />

  <main class="app-shell-content home-layout-main" px="4" h="screen" flex="~ col" justify="center" items="center" pb="$bottom-menu-height">
    <router-view />
    <BaseFooter />
    <BottomMenu />
  </main>
</template>

<style lang="scss" scoped>
.home-layout-main {
  padding-left: calc(var(--side-nav-width) + 1rem);
}

@media print {
  .home-layout-main {
    padding-left: 1rem;
  }
}
</style>
