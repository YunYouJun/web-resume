<script setup lang="ts">
import type { ResumeInfo, ResumeTemplateId } from '~/types'

import * as yaml from 'js-yaml'
import { fetchText } from '~/utils'
import { readResumeDocument } from '~/utils/resume-format'

const props = defineProps<{
  label: string
  resume?: ResumeInfo
  templateId: ResumeTemplateId
  url?: string
}>()

const fetchedResume = shallowRef<ResumeInfo>()
const failed = ref(false)
const previewResume = computed(() => props.resume || fetchedResume.value)

const previewCache = new Map<string, Promise<ResumeInfo>>()

async function loadPreview() {
  failed.value = false
  if (props.resume) {
    fetchedResume.value = undefined
    return
  }
  if (!props.url) {
    failed.value = true
    return
  }

  try {
    let request = previewCache.get(props.url)
    if (!request) {
      request = fetchText(props.url).then((text) => {
        const result = readResumeDocument(yaml.load(text))
        if (!result.valid || !result.renderResume?.basics.name)
          throw new Error('Invalid resume preview')
        return result.renderResume
      })
      previewCache.set(props.url, request)
    }
    fetchedResume.value = await request
  }
  catch {
    previewCache.delete(props.url)
    failed.value = true
  }
}

onMounted(loadPreview)
watch(() => [props.resume, props.url], loadPreview)
</script>

<template>
  <div class="resume-preview" role="img" :aria-label="label">
    <div v-if="failed" class="resume-preview__state">
      <span i-ri-file-warning-line aria-hidden="true" />
    </div>
    <div v-else-if="!previewResume" class="resume-preview__state" aria-hidden="true">
      <span i-ri-loader-4-line class="animate-spin" />
    </div>
    <div v-else class="resume-preview__document" aria-hidden="true" inert>
      <ResumeAll :resume="previewResume" :template-id="templateId" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resume-preview {
  --wr-c-link: #0078e7;
  --wr-c-resume-bg: white;
  --wr-c-text: #121212;

  position: relative;
  overflow: hidden;
  height: 248px;
  color: #121212;
  background: #eef1f4;
  contain: layout paint;
}

.resume-preview::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 46px;
  background: linear-gradient(transparent, rgb(238 241 244 / 92%));
  content: '';
  pointer-events: none;
}

.resume-preview__document {
  position: absolute;
  top: 14px;
  left: 50%;
  width: 720px;
  min-height: 1018px;
  border-radius: 2px;
  background: white;
  box-shadow: 0 8px 22px rgb(18 18 18 / 14%);
  transform: translateX(-50%) scale(0.39);
  transform-origin: top center;
}

.resume-preview__state {
  display: grid;
  height: 100%;
  place-items: center;
  color: rgb(18 18 18 / 45%);
  font-size: 24px;
}

@media (max-width: 420px) {
  .resume-preview {
    height: 220px;
  }
}
</style>
