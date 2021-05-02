<template>
  <github-corner :url="url" color="#70b7fd" />
  <div class="home mt-10 text-center">
    <img
      class="mx-auto resume-logo"
      alt="Resume logo"
      src="/img/icons/favicon.svg"
    />
    <HelloResume msg="Welcome to Web Resume" />
  </div>
  <vue-about-me :copyright="copyright" />
</template>

<script>
import HelloResume from '~/components/HelloResume.vue'
import pkg from '../../package.json'
import VueAboutMe from 'vue-about-me/sfc'

export default {
  name: 'home',
  components: {
    HelloResume,
    VueAboutMe,
  },
  data() {
    return {
      copyright: {
        name: 'Web Resume',
        repo: pkg.name,
        author: pkg.author.name,
        logo: 'ri:file-text-line',
        link: 'https://github.com/YunYouJun/web-resume',
        color: 'black',
      },
      url: pkg.repository.url,
    }
  },
}
</script>

<style>
.resume-logo {
  width: 200px;
}
</style>
