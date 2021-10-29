<template>
  <div>
    <h1 class="text-6xl font-light leading-normal">
      {{ props.msg }}
    </h1>
    <small>{{ t('home.description') }}</small>

    <div class="mt-5">
      {{ t('noun.example') }} YAML
    </div>

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

    <div>
      <input
        v-model="resumeYaml"
        type="text"
        class="resume-input mx-auto block"
        :placeholder="t('home.address_placeholder')"
      />
    </div>
    <div class="p-3">
      <a
        class="resume-btn m-3"
        :href="`https://github.com/YunYouJun/web-resume/blob/main/public${resumeYaml}`"
        target="_blank"
      >{{ t('button.see_yaml') }}
      </a>
      <a
        class="resume-btn m-3"
        :href="`/resume?url=${resumeYaml}`"
        target="_blank"
      >{{ t('button.see_resume') }}
      </a>
    </div>
    <small class="mt-3 text-monospace">
      <a :href="homepage" title="Web Resume">{{ homepage }}</a>
    </small>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ msg: string }>()

const homepage = 'https://resume.elpsy.cn'
const examples = computed(() => {
  return [
    {
      name: `${t('noun.worker')} 2021`,
      url: '/resume/2021.resume.yml',
    },
    {
      name: t('noun.suzimiya'),
      url: '/resume/suzumiya.resume.yml',
    },
  ]
})

const resumeYaml = ref('')

/**
 * 设置 yaml 链接
 */
function setResumeYaml(url: string) {
  resumeYaml.value = url
}
</script>
