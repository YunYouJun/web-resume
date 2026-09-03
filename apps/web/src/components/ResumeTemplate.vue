<script setup lang="ts">
import type { ResumeInfo, ResumeRouteSource, ResumeTemplateDefinition } from '~/types'

import { getResumeRoute } from '~/data/resume-catalog'

const props = defineProps<{
  confirmBeforeOpen?: boolean
  resume?: ResumeInfo
  source: ResumeRouteSource
  sourceName: string
  sourceUrl?: string
  template: ResumeTemplateDefinition
}>()

const emit = defineEmits<{
  replaceRequested: [route: string]
}>()

const { t } = useI18n()

const title = computed(() => t(props.template.nameKey))
const description = computed(() => t(props.template.descriptionKey))
const primaryAriaLabel = computed(() => t('template_market.actions.use_template_named', { name: title.value }))
const previewLabel = computed(() => t('template_market.preview_label', {
  data: props.sourceName,
  template: title.value,
}))
const resumeRoute = computed(() => getResumeRoute(props.template.id, props.source))
const cleanPreviewRoute = computed(() => getResumeRoute(props.template.id, props.source, 'preview'))

function onPrimaryClick(event: MouseEvent, navigate: (event?: MouseEvent) => void) {
  if (!props.confirmBeforeOpen || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    navigate(event)
    return
  }
  event.preventDefault()
  emit('replaceRequested', resumeRoute.value)
}
</script>

<template>
  <article class="resume-catalog-card" :aria-label="title">
    <ResumePreview
      :label="previewLabel"
      :resume="resume"
      :template-id="template.id"
      :url="sourceUrl"
    />

    <div class="resume-catalog-card__body">
      <div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>

      <ul class="resume-catalog-card__tags" :aria-label="t('template_market.tags_label')">
        <li v-for="tagKey in template.tagKeys" :key="tagKey">
          {{ t(tagKey) }}
        </li>
      </ul>

      <div class="resume-catalog-card__actions">
        <RouterLink v-slot="{ href, navigate }" :to="resumeRoute" custom>
          <a
            class="resume-catalog-card__action resume-catalog-card__action--primary"
            :href="href"
            :aria-label="primaryAriaLabel"
            @click="onPrimaryClick($event, navigate)"
          >
            <span>{{ t('template_market.actions.use_template') }}</span>
            <span i-ri-arrow-right-line aria-hidden="true" />
          </a>
        </RouterLink>

        <a
          class="resume-catalog-card__action resume-catalog-card__action--secondary"
          :href="cleanPreviewRoute"
          target="_blank"
          rel="noopener"
          :aria-label="t('template_market.actions.preview_named', { name: title })"
        >
          <span i-ri-eye-line aria-hidden="true" />
          <span>{{ t('template_market.actions.preview') }}</span>
        </a>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.resume-catalog-card {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  min-width: 0;
  border: 1px solid rgb(127 127 127 / 18%);
  border-radius: 16px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg);
  box-shadow: 0 8px 28px rgb(18 18 18 / 7%);
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.resume-catalog-card:hover,
.resume-catalog-card:focus-within {
  border-color: color-mix(in srgb, var(--wr-c-link), transparent 48%);
  box-shadow: 0 14px 36px rgb(18 18 18 / 12%);
  transform: translateY(-2px);
}

.resume-catalog-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.resume-catalog-card h3 {
  margin: 0 0 7px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
}

.resume-catalog-card p {
  margin: 0;
  color: color-mix(in srgb, var(--wr-c-text), transparent 34%);
  font-size: 13px;
  line-height: 1.65;
}

.resume-catalog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.resume-catalog-card__tags li {
  border: 1px solid rgb(127 127 127 / 18%);
  border-radius: 999px;
  padding: 4px 8px;
  color: color-mix(in srgb, var(--wr-c-text), transparent 24%);
  background: var(--wr-c-bg-soft);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
}

.resume-catalog-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.resume-catalog-card__action {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid transparent;
  border-radius: 11px;
  padding: 0 13px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 650;
  line-height: 1;
  transition: background-color 140ms ease, border-color 140ms ease;
}

.resume-catalog-card__action:focus-visible {
  outline: 2px solid var(--wr-c-link);
  outline-offset: 2px;
}

.resume-catalog-card__action--primary {
  flex: 1;
  color: white;
  background: var(--wr-c-link);
}

.resume-catalog-card__action--primary:hover {
  background: color-mix(in srgb, var(--wr-c-link), black 12%);
}

.resume-catalog-card__action--secondary {
  color: var(--wr-c-text);
  border-color: rgb(127 127 127 / 22%);
  background: transparent;
}

.resume-catalog-card__action--secondary:hover {
  background: rgb(127 127 127 / 9%);
}

@media (prefers-reduced-motion: reduce) {
  .resume-catalog-card,
  .resume-catalog-card__action {
    transition: none;
  }
}
</style>
