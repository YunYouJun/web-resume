<script setup lang="ts">
import { VueAboutMe } from 'vue-about-me'
import pkg from '~/../package.json'

import { isDark } from '~/composables'
import 'vue-about-me/style.css'

const copyright = {
  name: 'Web Resume',
  repo: pkg.name,
  author: pkg.author.name,
}
</script>

<template>
  <VueAboutMe :is-dark="isDark" :copyright="copyright" />
</template>
