<template>
  <ToolBar class="fixed" />

  <main h="screen" flex="~ col" justify="center" items="center">
    <router-view />
    <BaseFooter />
    <BottomMenu />
  </main>
</template>
