<script lang="ts" setup>
import { isDark, toggleDark } from '~/composables'

import pkg from '~/../package.json'
import 'vue-about-me/style.css'
import { useAppStore } from '~/stores/app'

const { t, availableLocales, locale } = useI18n()

function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const app = useAppStore()
const user = useUserStore()

useEventListener('beforeprint', () => {
  app.isPrinting = true
})
useEventListener('afterprint', () => {
  app.isPrinting = false
})

const showLocal = ref(import.meta.env.DEV || false)
</script>

<template>
  <nav
    fixed top-0 inset-x-0
    :class="(!app.isPrinting && app.showToolbar) ? 'opacity-100' : 'opacity-0'"
    class="z-100 rounded m-auto left-0 shadow-md transition hover:opacity-100"
    bg="light-200 dark:dark-200" p="2"
    flex="~" justify="center"
    w="full"
  >
    <button class="icon-btn" @click="app.showToolbar = !app.showToolbar">
      <div v-if="app.showToolbar" i-ri-pushpin-line text="orange" />
      <div v-else i-ri-pushpin-2-line />
    </button>

    <router-link v-if="showLocal" class="icon-btn" to="/local" :title="t('button.local')">
      <div i-ri-device-line />
    </router-link>

    <button class="icon-btn" @click="user.settings.overrideInfo = !user.settings.overrideInfo">
      <div v-if="user.settings.overrideInfo" i-ri-eye-line />
      <div v-else i-ri-eye-off-line />
    </button>

    <AddressBar />

    <a class="icon-btn" :title="t('button.toggle_dark')" @click="() => { toggleDark() }">
      <div v-if="isDark" i-ri-moon-line />
      <div v-else i-ri-sun-line />
    </a>

    <a
      class="icon-btn transform" :class="
        locale !== 'zh-CN' ? '-rotate-y-180' : ''
      " :title="t('button.toggle_langs')" @click="toggleLocales"
    >
      <div i-ri-translate />
    </a>

    <router-link class="icon-btn" to="/about" :title="t('button.about')">
      <div i-ri-file-info-line />
    </router-link>

    <a
      class="icon-btn"
      rel="noreferrer"
      :href="pkg.repository.url"
      target="_blank"
      title="GitHub"
    >
      <div i-ri-github-line />
    </a>
  </nav>
</template>

<style lang="scss">
.input-bar-icon-btn {
  @apply inline-flex justify-center items-center p-6px rounded-full bg-gray-200 dark:bg-warm-gray-800 dark:text-gray-200 hover:(dark:text-gray-200);

  div {
    display: inline-flex;
    width: 1em;
    height: 1em;
  }
}
</style>
