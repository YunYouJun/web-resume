<template>
  <div>
    <h1 class="display-4">{{ msg }}</h1>
    <small> 可以被打印成 A4 PDF 的简历</small>

    <form>
      <div class="p-3">
        <input
          v-model="resumeYaml"
          type="text"
          class="form-control"
          placeholder="简历线上 Yaml 地址"
        />
      </div>
      <div>
        <button
          type="submit"
          class="btn btn-primary mb-3"
          @click="showResume(resumeYaml)"
        >
          查看简历
        </button>
      </div>
    </form>

    <div class="mt-5">示例</div>

    <ul class="nav justify-content-center my-3">
      <li class="nav-item" v-for="(link, i) in examples" :key="i">
        <button class="btn btn-light" @click="showResume(link.url)">
          {{ link.name }}
        </button>
      </li>
    </ul>
    <small class="mt-3 text-monospace">
      <a :href="homepage" title="Web Resume">https://resume.elpsy.cn</a>
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    msg: String,
    links: Object,
  },
  data() {
    return {
      homepage: 'https://resume.elpsy.cn',
      examples: [
        {
          name: '凉宫春日',
          url: '/resume/suzumiya.resume.yml',
        },
        {
          name: '打工人',
          url: '/resume/2021.resume.yml',
        },
      ],
      resumeYaml: '',
    }
  },
  methods: {
    showResume(url = '/resume/2021.resume.yml') {
      this.$router.push({
        path: 'resume',
        query: {
          url,
        },
      })
    },
  },
})
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
</style>
