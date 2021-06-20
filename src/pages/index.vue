<template>
  <github-corner :url="url" color="#70b7fd" />
  <div class="home mt-10 text-center">
    <img
      class="mx-auto resume-logo"
      alt="Resume logo"
      src="/img/icons/favicon.svg"
    />
    <HelloResume msg="Welcome to Web Resume" />
    <vue-about-me :copyright="copyright"></vue-about-me>
  </div>
</template>

<script lang="ts" setup>
import HelloResume from '~/components/HelloResume.vue'
import pkg from '../../package.json'
import { ref } from 'vue'

// @ts-ignore
import VueAboutMe from '../../node_modules/vue-about-me/dist/vue-about-me.es.js'
import 'vue-about-me/style'

const copyright = {
  name: 'Web Resume',
  repo: pkg.name,
  author: pkg.author.name,
}

const url = ref(pkg.repository.url)
</script>

<style>
.resume-logo {
  width: 200px;
}
</style>
