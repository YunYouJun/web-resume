<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isDark, toggleDark } from '~/logic'

// @ts-ignore
import pkg from '~/../package.json'
import VueAboutMe from 'vue-about-me'
import 'vue-about-me/style.css'

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const copyright = {
  name: 'Web Resume',
  repo: pkg.name,
  author: pkg.author.name,
}
</script>

<template>
  <nav class="text-center text-xl mt-6">
    <router-link class="icon-btn mx-2" to="/" :title="t('button.home')">
      <i-ri-home-2-line />
    </router-link>

    <router-link class="icon-btn mx-2" to="/editor" :title="t('button.editor')">
      <i-ri-side-bar-line />
    </router-link>

    <a class="icon-btn mx-2" :title="t('button.toggle_dark')" @click="()=>{toggleDark()}">
      <i-ri-moon-line v-if="isDark" />
      <i-ri-sun-line v-else />
    </a>

    <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales">
      <i-ri-translate />
    </a>

    <router-link class="icon-btn mx-2" to="/about" :title="t('button.about')">
      <i-ri-file-info-line />
    </router-link>

    <a
      class="icon-btn mx-2"
      rel="noreferrer"
      :href="pkg.repository.url"
      target="_blank"
      title="GitHub"
    >
      <i-ri-github-line />
    </a>
  </nav>
  <vue-about-me :is-dark="isDark" :copyright="copyright"></vue-about-me>
</template>
