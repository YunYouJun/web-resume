<script setup lang="ts">
const app = useAppStore()
const editor = useEditorStore()
const route = useRoute()
const { t } = useI18n()

const resume = computed(() => editor.resumeJson)
const isPreview = computed(() => route.query.mode === 'preview')

onBeforeMount(async () => {
  if (isPreview.value) {
    app.showToolbar = false
    app.isFullscreen = true
  }

  const url = Array.isArray(route.query.url) ? route.query.url[0] : route.query.url
  if (url && url !== app.curResume.url)
    await editor.goToResume({ url })
  else if (url && !editor.resumeJson)
    await editor.goToResume({ url })
})

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
  <div v-else-if="app.resumeLoadError && isPreview" class="resume-load-state resume-load-state--error" role="alert">
    <span i-ri-error-warning-line aria-hidden="true" />
    <span>{{ t('resume_source.error', { message: app.resumeLoadError }) }}</span>
  </div>
  <ResumeAll v-else-if="resume" :resume="resume" />
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
</style>
