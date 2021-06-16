<template>
  <div>
    <h1 class="text-6xl font-light leading-normal">{{ msg }}</h1>
    <small> 可以被打印成 A4 PDF 的简历</small>

    <div class="mt-5">示例 YAML</div>

    <div class="my-3">
      <button
        v-for="(link, i) in examples"
        :key="i"
        :class="['resume-btn', 'm-3', link.url === resumeYaml ? 'active' : '']"
        @click="setResumeYaml(link.url)"
      >
        {{ link.name }}
      </button>
    </div>

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
        class="resume-btn m-3"
        @click="showResume(resumeYaml)"
      >
        查看简历
      </button>
      <a
        class="resume-btn m-3"
        :href="getGithub1sUrl(resumeYaml)"
        target="_blank"
        alt="查看"
      >
        查看 YAML
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
      resumeYaml: '',
    }
  },
  methods: {
    setResumeYaml(url: string) {
      this.resumeYaml = url
    },
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
