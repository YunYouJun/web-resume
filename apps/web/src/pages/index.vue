<script setup lang="ts">
import * as yaml from 'js-yaml'
import {
  getResumeExample,
  isResumeTemplateId,
  resolveResumeExampleId,
  resolveResumeTemplateId,
} from '~/data/resume-catalog'
import { appearanceOptions, resolveResumeAppearance } from '~/utils/resume-appearance'
import { readResumeDocument } from '~/utils/resume-format'
import { readResumeContentLink } from '~/utils/resume-share'

// The empty start screen does not need the resume renderer or HTML sanitizer.
const ResumeAll = defineAsyncComponent(() => import('~/components/resume/All.vue'))

const app = useAppStore()
const editor = useEditorStore()
const route = useRoute()
const { t } = useI18n()

const sharedResume = computed(() => {
  try {
    const text = readResumeContentLink(route.hash)
    if (text === undefined)
      return undefined
    const result = readResumeDocument(yaml.load(text))
    if (!result.valid || !result.renderResume)
      throw new Error(result.errors[0] || 'Invalid resume')
    return { resume: result.renderResume, error: '' }
  }
  catch (error) {
    return { resume: undefined, error: error instanceof Error ? error.message : String(error) }
  }
})
const resume = computed(() => sharedResume.value ? sharedResume.value.resume : editor.resumeJson)
const isPreview = computed(() => sharedResume.value !== undefined || route.query.mode === 'preview')
const appearance = computed(() => {
  const hasAppearance = Object.keys(appearanceOptions).some(key => route.query[key] !== undefined)
  return resolveResumeAppearance(isPreview.value || hasAppearance ? route.query : app.resumeAppearance)
})
const templateId = computed(() => resolveResumeTemplateId(route.query.template || app.resumeTemplateId))

function firstQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

watch(templateId, (value) => {
  app.resumeTemplateId = value
}, { immediate: true })

async function loadRouteSource() {
  app.resumeLoadError = ''
  if (sharedResume.value)
    return

  if (route.query.example !== undefined) {
    const exampleId = resolveResumeExampleId(route.query.example)
    if (!exampleId) {
      app.resumeLoadError = t('template_market.errors.example_not_found')
      return
    }

    const example = getResumeExample(exampleId)
    if (app.curResume.id !== example.id || app.curResume.url !== example.url || !editor.resumeJson)
      await editor.goToResume(example)
    return
  }

  const url = firstQueryValue(route.query.url)
  if (typeof url === 'string' && url && (url !== app.curResume.url || !editor.resumeJson))
    await editor.goToResume({ url })
}

function notifyTemplateFallback() {
  const value = firstQueryValue(route.query.template)
  if (value !== undefined && !isResumeTemplateId(value)) {
    app.showToast({
      description: t('template_market.errors.template_fallback_description'),
      title: t('template_market.errors.template_fallback_title'),
    })
  }
}

onBeforeMount(async () => {
  if (isPreview.value) {
    app.showToolbar = false
    app.isFullscreen = true
  }

  await loadRouteSource()
})

onMounted(notifyTemplateFallback)

watch(() => [route.query.example, route.query.url, route.hash], loadRouteSource)
watch(() => route.query.template, notifyTemplateFallback)

onBeforeUnmount(() => {
  if (isPreview.value) {
    app.showToolbar = true
    app.isFullscreen = false
  }
})
</script>

<template>
  <div v-if="app.isResumeLoading" class="resume-load-state" role="status">
    <span i-ri-loader-4-line class="animate-spin" aria-hidden="true" />
    <span>{{ t('resume_source.loading') }}</span>
  </div>
  <div v-else-if="sharedResume?.error || app.resumeLoadError" class="resume-load-state resume-load-state--error" role="alert">
    <span i-ri-error-warning-line aria-hidden="true" />
    <div>
      <span>{{ t('resume_source.error', { message: sharedResume?.error || app.resumeLoadError }) }}</span>
      <RouterLink v-if="!isPreview" class="resume-load-state__link" to="/explore">
        {{ t('template_market.errors.return_to_templates') }}
      </RouterLink>
    </div>
  </div>
  <ResumeAll v-else-if="resume" :resume="resume" :template-id="templateId" :appearance="appearance" />
  <ResumeEmptyState v-else-if="!isPreview" />
</template>

<style lang="scss" scoped>
.resume-load-state {
  display: flex;
  min-height: calc(100dvh - var(--top-nav-height) - var(--bottom-menu-height));
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: rgb(100 100 100);
  text-align: center;
}

.resume-load-state--error {
  color: #b91c1c;
}

.resume-load-state--error > div {
  display: grid;
  gap: 10px;
}

.resume-load-state__link {
  color: var(--wr-c-link);
  text-underline-offset: 3px;
}
</style>
