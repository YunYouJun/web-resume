<template>
  <ToolBar />

  <main h="screen" flex="~ col" justify="center" items="center" pb="$bottom-menu-height">
    <router-view />
    <BaseFooter />
    <BottomMenu />
  </main>
</template>
