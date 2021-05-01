<template>
  <div>
    <h1 class="text-6xl font-light leading-normal">{{ msg }}</h1>
    <small> 可以被打印成 A4 PDF 的简历</small>

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
    <div class="my-3">
      <a
        v-for="(link, i) in examples"
        :key="i"
        class="resume-btn m-2"
        :href="getGithub1sUrl(link.url)"
        :alt="link.name"
        target="_blank"
      >
        「{{ link.name }}」YAML
      </a>
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
          name: '打工人 2021',
          url: '/resume/2021.resume.yml',
        },
      ],
      resumeYaml: '/resume/2021.resume.yml',
    }
  },
  methods: {
    getGithub1sUrl(url: string) {
      return 'https://github1s.com/YunYouJun/web-resume/blob/HEAD/public' + url
    },
    showResume(url: string) {
      this.$router.push({
        path: '/resume',
        query: {
          url,
        },
      })
    },
  },
})
</script>
