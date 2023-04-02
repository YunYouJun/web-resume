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

useEventListener('beforeprint', () => {
  app.showToolbar = false
})
useEventListener('afterprint', () => {
  app.showToolbar = true
})

const showLocal = ref(import.meta.env.DEV || false)
</script>

<template>
  <nav
    :class="app.showToolbar ? 'opacity-100' : 'opacity-0'"
    class="z-10 fixed rounded m-auto left-0 shadow-md transition hover:opacity-100"
    bg="light-200 dark:dark-200" p="2"
    flex="~ col" justify="center"
  >
    <button class="icon-btn" @click="app.showToolbar = !app.showToolbar">
      <div v-if="app.showToolbar" i-ri-pushpin-line text="orange" />
      <div v-else i-ri-pushpin-2-line />
    </button>

    <router-link v-if="showLocal" class="icon-btn" to="/local" :title="t('button.local')">
      <div i-ri-device-line />
    </router-link>

    <router-link class="icon-btn" to="/" :title="t('button.home')">
      <div i-ri-home-2-line />
    </router-link>

    <router-link class="icon-btn" to="/editor" :title="t('button.editor')">
      <div i-ri-side-bar-line />
    </router-link>

    <a class="icon-btn" :title="t('button.toggle_dark')" @click="() => { toggleDark() }">
      <div v-if="isDark" i-ri-moon-line />
      <div v-else i-ri-sun-line />
    </a>

    <a class="icon-btn" :title="t('button.toggle_langs')" @click="toggleLocales">
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
