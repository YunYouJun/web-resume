<template>
  <github-corner :url="url" color="#70b7fd" />
  <div class="home mt-5 text-center">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloResume msg="Welcome to Web Resume" />
  </div>
</template>

<script>
import HelloResume from '~/components/HelloResume.vue'
import pkg from '../../package.json'

export default {
  name: 'home',
  components: {
    HelloResume,
  },
  data() {
    return {
      url: pkg.repository.url,
    }
  },
}
</script>
