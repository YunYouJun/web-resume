<script setup lang="ts">
import {
  getResumeExample,
  isResumeTemplateId,
  resolveResumeExampleId,
  resolveResumeTemplateId,
} from '~/data/resume-catalog'

const app = useAppStore()
const editor = useEditorStore()
const route = useRoute()
const { t } = useI18n()

const resume = computed(() => editor.resumeJson)
const isPreview = computed(() => route.query.mode === 'preview')
const templateId = computed(() => resolveResumeTemplateId(route.query.template || app.resumeTemplateId))

function firstQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

watch(templateId, (value) => {
  app.resumeTemplateId = value
}, { immediate: true })

async function loadRouteSource() {
  app.resumeLoadError = ''

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

watch(() => [route.query.example, route.query.url], loadRouteSource)
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
  <div v-else-if="app.resumeLoadError" class="resume-load-state resume-load-state--error" role="alert">
    <span i-ri-error-warning-line aria-hidden="true" />
    <div>
      <span>{{ t('resume_source.error', { message: app.resumeLoadError }) }}</span>
      <RouterLink v-if="!isPreview" class="resume-load-state__link" to="/explore">
        {{ t('template_market.errors.return_to_templates') }}
      </RouterLink>
    </div>
  </div>
  <ResumeAll v-else-if="resume" :resume="resume" :template-id="templateId" />
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
