<template>
  <ToolBar />

  <main px="4" h="screen" flex="~ col" justify="center" items="center" pb="$bottom-menu-height">
    <router-view />
    <BaseFooter />
    <BottomMenu />
  </main>
</template>
