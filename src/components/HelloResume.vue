<template>
  <div>
    <h1 class="text-6xl font-light leading-normal">{{ msg }}</h1>
    <small> 可以被打印成 A4 PDF 的简历</small>

    <form>
      <div class="p-3">
        <input
          v-model="resumeYaml"
          type="text"
          class="resume-input mx-auto block"
          placeholder="简历线上 Yaml 地址"
        />
      </div>
      <div>
        <button
          type="submit"
          class="resume-btn mt-3"
          @click="showResume(resumeYaml)"
        >
          查看简历
        </button>
      </div>
    </form>

    <div class="mt-5">示例</div>

    <div class="my-3">
      <button
        v-for="(link, i) in examples"
        :key="i"
        class="resume-btn m-2"
        @click="showResume(link.url)"
      >
        {{ link.name }}
      </button>
    </div>
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
      if (!url) {
        url = '/resume/2021.resume.yml'
      }

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
