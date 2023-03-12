<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const props = defineProps<{ msg: string }>()

const { t } = useI18n()

const homepage = 'https://resume.elpsy.cn'
const examples = computed(() => {
  return [
    {
      id: 'worker',
      name: `${t('noun.worker')}`,
      url: 'https://fastly.jsdelivr.net/gh/YunYouJun/web-resume/src/assets/resume/local.resume.yml',
      href: 'https://github.com/YunYouJun/web-resume/blob/main/src/assets/resume/local.resume.yml',
    },
    {
      id: 'suzimiya',
      name: t('noun.suzimiya'),
      url: '/resume/suzumiya.resume.yml',
      href: 'https://github.com/YunYouJun/web-resume/blob/main/public/resume/suzumiya.resume.yml',
    },
  ]
})

const resumeYaml = ref('')

const curResume = ref('')

/**
 * 设置 yaml 链接
 */
function setResumeYaml(id: string) {
  curResume.value = id
  resumeYaml.value = examples.value.find(item => item.id === id)?.url ?? ''
}
</script>

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
        v-for="(item, i) in examples"
        :key="i"
        class="resume-btn m-3" :class="[item.url === resumeYaml ? 'active' : '']"
        @click="setResumeYaml(item.id)"
      >
        {{ item.name }}
      </button>
    </div>

    <div>
      <input
        v-model="resumeYaml"
        type="text"
        class="resume-input mx-auto block"
        :placeholder="t('home.address_placeholder')"
      >
    </div>
    <div class="p-3">
      <a
        class="resume-btn m-3"
        :class="!resumeYaml && 'disabled'"
        :href="examples.find(item => item.id === curResume)?.href"
        target="_blank"
      >{{ t('button.see_yaml') }}
      </a>
      <RouterLink class="resume-btn m-3" :to="`/resume?url=${resumeYaml}`">
        {{ t('button.see_resume') }}
      </RouterLink>
    </div>
    <small class="mt-3 text-monospace">
      <a :href="homepage" title="Web Resume">{{ homepage }}</a>
    </small>
  </div>
</template>
