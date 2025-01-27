<script lang="ts" setup>
import pkg from '~/../package.json'

// import { isDark, toggleDark } from '~/composables'
import { useAppStore } from '~/stores/app'
import 'vue-about-me/style.css'

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
</script>

<template>
  <nav
    fixed top-0 inset-x-0
    :class="(!app.isPrinting && app.showToolbar) ? 'opacity-100' : 'opacity-0'"
    class="rounded m-auto left-0 shadow-md transition hover:opacity-100"
    bg="light-200 dark:dark-200" p="2"
    flex="~" justify="center"
    w="full"
    z="$top-nav-z-index"
  >
    <button class="icon-btn" @click="app.showToolbar = !app.showToolbar">
      <div v-if="app.showToolbar" i-ri-pushpin-line text="orange" />
      <div v-else i-ri-pushpin-2-line />
    </button>

    <button class="icon-btn" @click="user.settings.overrideInfo = !user.settings.overrideInfo">
      <div v-if="user.settings.overrideInfo" i-ri-eye-line />
      <div v-else i-ri-eye-off-line />
    </button>

    <AddressBar />

    <!-- <a class="icon-btn" :title="t('button.toggle_dark')" @click="() => { toggleDark() }">
      <div v-if="isDark" i-ri-moon-line />
      <div v-else i-ri-sun-line />
    </a> -->

    <a
      class="icon-btn transform" :class="
        locale !== 'zh-CN' ? '-rotate-y-180' : ''
      " :title="t('button.toggle_langs')" @click="toggleLocales"
    >
      <div i-ri-translate />
    </a>

    <a
      class="icon-btn"
      rel="noreferrer"
      :href="pkg.repository.url"
      target="_blank"
      title="GitHub"
    >
      <div i-ri-github-line />
    </a>

    <a
      class="icon-btn"
      rel="noreferrer"
      :href="pkg.docs"
      target="_blank"
      title="关于"
    >
      <div i-ri-book-2-line />
    </a>
  </nav>
</template>
