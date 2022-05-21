<script lang="ts" setup>
import { isDark, toggleDark } from '~/composables'

import pkg from '~/../package.json'
import 'vue-about-me/style.css'

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const showToolbar = ref(true)

useEventListener('beforeprint', () => {
  showToolbar.value = false
})

const showLocal = ref(import.meta.env.DEV || false)
</script>

<template>
  <nav :class="showToolbar ? 'opacity-100' : 'opacity-0'" class="absolute left-0 shadow-md flex flex-col p-2 transition hover:opacity-100" bg="light-200 dark:dark-200">
    <button class="icon-btn" @click="showToolbar = false">
      <div i-ri-eye-off-line />
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
