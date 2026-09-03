<script setup lang="ts">
import type {
  ResumeExampleCategory,
  ResumeExampleId,
  ResumeRouteSource,
  ResumeTemplateCategory,
} from '~/types'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import {
  defaultResumeExampleId,
  getResumeExample,
  resolveResumeExampleId,
  resumeExampleCatalog,
  resumeTemplates,
} from '~/data/resume-catalog'

type DataSelectionId = 'current' | ResumeExampleId
type TemplateCategoryFilter = 'all' | ResumeTemplateCategory

const app = useAppStore()
const editor = useEditorStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const dataGroups: ResumeExampleCategory[] = ['universal', 'career', 'student', 'creator', 'playful']
const templateCategories: TemplateCategoryFilter[] = ['all', 'universal', 'professional', 'creative']

function firstQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

const queryExampleId = resolveResumeExampleId(route.query.example)
const hasCurrentResume = computed(() => Boolean(editor.resumeJson && app.curResume.url))
const selectedDataId = ref<DataSelectionId>(queryExampleId || (hasCurrentResume.value ? 'current' : defaultResumeExampleId))
const selectedExample = computed(() => selectedDataId.value === 'current'
  ? undefined
  : getResumeExample(selectedDataId.value))
const selectedDataName = computed(() => selectedDataId.value === 'current'
  ? t('template_market.data_current')
  : t(selectedExample.value!.nameKey))
const selectedDataDescription = computed(() => selectedDataId.value === 'current'
  ? t('template_market.data_current_description')
  : t(selectedExample.value!.descriptionKey))
const selectedSource = computed<ResumeRouteSource>(() => selectedDataId.value === 'current'
  ? { type: 'current' }
  : { id: selectedDataId.value, type: 'example' })
const selectedResume = computed(() => selectedDataId.value === 'current' ? editor.resumeJson : undefined)
const selectedSourceUrl = computed(() => selectedDataId.value === 'current'
  ? app.curResume.url
  : selectedExample.value!.url)
const replacesCurrentData = computed(() => selectedDataId.value !== 'current'
  && (app.curResume.id !== selectedDataId.value || app.curResume.url !== selectedExample.value?.url))

const categoryFilter = computed<TemplateCategoryFilter>(() => {
  const value = firstQueryValue(route.query.category)
  return templateCategories.includes(value as TemplateCategoryFilter)
    ? value as TemplateCategoryFilter
    : 'all'
})
const filteredTemplates = computed(() => categoryFilter.value === 'all'
  ? resumeTemplates
  : resumeTemplates.filter(template => template.category === categoryFilter.value))

const replaceDialogOpen = ref(false)
const pendingRoute = ref('')
let routeSyncReady = false

function examplesForGroup(category: ResumeExampleCategory) {
  return resumeExampleCatalog.filter(example => example.category === category)
}

async function selectCategory(category: TemplateCategoryFilter) {
  const query = { ...route.query }
  if (category === 'all')
    delete query.category
  else
    query.category = category
  await router.replace({ query })
}

function requestPresetReplacement(nextRoute: string) {
  pendingRoute.value = nextRoute
  replaceDialogOpen.value = true
}

async function confirmPresetReplacement() {
  const nextRoute = pendingRoute.value
  replaceDialogOpen.value = false
  pendingRoute.value = ''
  if (nextRoute)
    await router.push(nextRoute)
}

watch(selectedDataId, async (id) => {
  if (!routeSyncReady)
    return

  const query = { ...route.query }
  delete query.url
  if (id === 'current')
    delete query.example
  else
    query.example = id
  await router.replace({ query })
})

onMounted(() => {
  if (!queryExampleId && hasCurrentResume.value)
    selectedDataId.value = 'current'
  routeSyncReady = true
})
</script>

<template>
  <div class="template-market">
    <header class="template-market__intro">
      <div class="template-market__intro-copy">
        <h1>{{ t('template_market.title') }}</h1>
        <p>{{ t('template_market.description') }}</p>
      </div>

      <section class="template-market-data" aria-labelledby="template-market-data-label">
        <div class="template-market-data__control">
          <label id="template-market-data-label" class="template-market-data__label">
            {{ t('template_market.data_label') }}
          </label>
          <SelectRoot v-model="selectedDataId">
            <SelectTrigger class="template-market-data__trigger" :aria-label="t('template_market.data_select')">
              <SelectValue />
              <span i-ri-arrow-down-s-line aria-hidden="true" />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent class="template-market-data-select__content" position="popper" :side-offset="6">
                <SelectViewport class="template-market-data-select__viewport">
                  <SelectGroup v-if="hasCurrentResume">
                    <SelectItem class="template-market-data-select__item" value="current">
                      <SelectItemIndicator class="template-market-data-select__indicator">
                        <span i-ri-check-line aria-hidden="true" />
                      </SelectItemIndicator>
                      <SelectItemText>{{ t('template_market.data_current') }}</SelectItemText>
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup v-for="group in dataGroups" :key="group">
                    <SelectLabel class="template-market-data-select__label">
                      {{ t(`template_market.data_groups.${group}`) }}
                    </SelectLabel>
                    <SelectItem
                      v-for="example in examplesForGroup(group)"
                      :key="example.id"
                      class="template-market-data-select__item"
                      :value="example.id"
                    >
                      <SelectItemIndicator class="template-market-data-select__indicator">
                        <span i-ri-check-line aria-hidden="true" />
                      </SelectItemIndicator>
                      <SelectItemText>{{ t(example.nameKey) }}</SelectItemText>
                    </SelectItem>
                  </SelectGroup>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>

        <div class="template-market-data__summary">
          <div>
            <strong>{{ selectedDataName }}</strong>
            <span v-if="selectedExample?.noticeKey" class="template-market-data__notice">
              {{ t(selectedExample.noticeKey) }}
            </span>
          </div>
          <p>{{ selectedDataDescription }}</p>
          <ul v-if="selectedExample" class="template-market-data__tags" :aria-label="t('template_market.tags_label')">
            <li v-for="tagKey in selectedExample.tagKeys" :key="tagKey">
              {{ t(tagKey) }}
            </li>
          </ul>
          <a
            v-if="selectedExample?.href"
            class="template-market-data__yaml"
            :href="selectedExample.href"
            target="_blank"
            rel="noopener"
          >
            <span i-ri-code-s-slash-line aria-hidden="true" />
            {{ t('template_market.data_view_yaml') }}
          </a>
        </div>
      </section>
    </header>

    <section class="template-market__section" aria-labelledby="template-market-layouts">
      <div class="template-market__section-heading">
        <div>
          <h2 id="template-market-layouts">
            {{ t('template_market.layout_title') }}
          </h2>
          <p>{{ t('template_market.layout_description') }}</p>
        </div>
        <span>{{ t('template_market.item_count', { count: filteredTemplates.length }) }}</span>
      </div>

      <div class="template-market-categories" role="group" :aria-label="t('template_market.category_label')">
        <button
          v-for="category in templateCategories"
          :key="category"
          type="button"
          class="template-market-categories__item"
          :class="{ 'template-market-categories__item--active': categoryFilter === category }"
          :aria-pressed="categoryFilter === category"
          @click="selectCategory(category)"
        >
          {{ t(`template_market.categories.${category}`) }}
        </button>
      </div>

      <p class="sr-only" role="status" aria-live="polite">
        {{ t('template_market.result_status', { count: filteredTemplates.length }) }}
      </p>

      <div class="template-market__grid">
        <ResumeTemplate
          v-for="template in filteredTemplates"
          :key="template.id"
          :confirm-before-open="replacesCurrentData && editor.isResumeDirty"
          :resume="selectedResume"
          :source="selectedSource"
          :source-name="selectedDataName"
          :source-url="selectedSourceUrl"
          :template="template"
          @replace-requested="requestPresetReplacement"
        />
      </div>
    </section>
  </div>

  <AlertDialogRoot v-model:open="replaceDialogOpen">
    <AlertDialogPortal>
      <AlertDialogOverlay class="app-dialog-overlay" />
      <AlertDialogContent class="app-dialog-content template-market-replace-dialog">
        <header class="app-dialog-header">
          <AlertDialogTitle class="app-dialog-title">
            {{ t('template_market.replace_confirm.title') }}
          </AlertDialogTitle>
          <AlertDialogDescription class="app-dialog-description">
            {{ t('template_market.replace_confirm.description', { name: selectedDataName }) }}
          </AlertDialogDescription>
        </header>
        <div class="template-market-replace-dialog__actions">
          <AlertDialogCancel class="command-button command-button--quiet">
            {{ t('template_market.replace_confirm.cancel') }}
          </AlertDialogCancel>
          <AlertDialogAction class="command-button command-button--primary" @click="confirmPresetReplacement">
            {{ t('template_market.replace_confirm.confirm') }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style lang="scss" scoped>
.template-market {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 44px 32px 72px;
}

.template-market__intro {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr);
  align-items: start;
  gap: 48px;
  margin-bottom: 52px;
}

.template-market__intro-copy {
  padding-top: 6px;
}

.template-market__intro h1 {
  margin: 0 0 12px;
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 760;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.template-market__intro p,
.template-market__section-heading p {
  margin: 0;
  color: color-mix(in srgb, var(--wr-c-text), transparent 36%);
  line-height: 1.7;
}

.template-market__intro-copy p {
  max-width: 590px;
  font-size: 15px;
}

.template-market-data {
  border: 1px solid rgb(127 127 127 / 18%);
  border-radius: 18px;
  padding: 18px;
  background: var(--wr-c-bg-soft);
  box-shadow: 0 10px 32px rgb(18 18 18 / 6%);
}

.template-market-data__control {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.template-market-data__label {
  font-size: 12px;
  font-weight: 700;
}

.template-market-data__trigger {
  display: flex;
  min-width: 0;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid rgb(127 127 127 / 24%);
  border-radius: 11px;
  padding: 0 12px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg);
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.template-market-data__trigger:focus-visible {
  outline: 2px solid var(--wr-c-link);
  outline-offset: 2px;
}

.template-market-data__summary {
  position: relative;
  margin-top: 14px;
  border-top: 1px solid rgb(127 127 127 / 15%);
  padding-top: 14px;
  padding-right: 96px;
}

.template-market-data__summary > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.template-market-data__summary strong {
  font-size: 14px;
}

.template-market-data__summary p {
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.55;
}

.template-market-data__notice {
  border-radius: 999px;
  padding: 3px 7px;
  color: #8a4b08;
  background: #fff4d6;
  font-size: 10px;
  font-weight: 700;
}

.template-market-data__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.template-market-data__tags li {
  border-radius: 999px;
  padding: 3px 7px;
  color: color-mix(in srgb, var(--wr-c-text), transparent 26%);
  background: rgb(127 127 127 / 11%);
  font-size: 10px;
  font-weight: 650;
}

.template-market-data__yaml {
  position: absolute;
  top: 11px;
  right: 0;
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 6px;
  border-radius: 9px;
  padding: 0 9px;
  color: var(--wr-c-link);
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.template-market-data__yaml:hover {
  background: rgb(127 127 127 / 10%);
}

.template-market__section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.template-market__section-heading h2 {
  margin: 0 0 6px;
  font-size: 23px;
  line-height: 1.25;
}

.template-market__section-heading p {
  max-width: 620px;
  font-size: 13px;
}

.template-market__section-heading > span {
  flex: none;
  color: color-mix(in srgb, var(--wr-c-text), transparent 48%);
  font-size: 12px;
}

.template-market-categories {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  margin-bottom: 22px;
  padding: 2px;
  scrollbar-width: none;
}

.template-market-categories::-webkit-scrollbar {
  display: none;
}

.template-market-categories__item {
  min-width: 56px;
  min-height: 36px;
  flex: 0 0 auto;
  border: 1px solid rgb(127 127 127 / 18%);
  border-radius: 999px;
  padding: 0 14px;
  color: color-mix(in srgb, var(--wr-c-text), transparent 20%);
  background: var(--wr-c-bg);
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.template-market-categories__item:hover {
  background: rgb(127 127 127 / 9%);
}

.template-market-categories__item:focus-visible {
  outline: 2px solid var(--wr-c-link);
  outline-offset: 2px;
}

.template-market-categories__item--active {
  border-color: var(--wr-c-link);
  color: white;
  background: var(--wr-c-link);
}

.template-market-categories__item--active:hover {
  background: color-mix(in srgb, var(--wr-c-link), black 10%);
}

.template-market__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

:global(.template-market-data-select__content) {
  z-index: var(--overlay-z-index);
  width: var(--reka-select-trigger-width);
  min-width: 240px;
  max-height: min(430px, var(--reka-select-content-available-height));
  overflow: hidden;
  border: 1px solid rgb(127 127 127 / 22%);
  border-radius: 12px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg);
  box-shadow: 0 18px 50px rgb(0 0 0 / 20%);
}

:global(.template-market-data-select__viewport) {
  padding: 6px;
}

:global(.template-market-data-select__label) {
  padding: 8px 10px 4px;
  color: rgb(127 127 127);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

:global(.template-market-data-select__item) {
  position: relative;
  display: flex;
  min-height: 40px;
  align-items: center;
  border-radius: 8px;
  padding: 7px 10px 7px 34px;
  outline: none;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

:global(.template-market-data-select__item[data-highlighted]) {
  color: white;
  background: var(--wr-c-link);
}

:global(.template-market-data-select__indicator) {
  position: absolute;
  left: 10px;
  display: inline-flex;
}

.template-market-replace-dialog {
  width: min(480px, calc(100vw - 28px));
}

.template-market-replace-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 22px;
}

@media (max-width: 900px) {
  .template-market__intro {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .template-market__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .template-market {
    padding: 28px 16px calc(36px + env(safe-area-inset-bottom));
  }

  .template-market__intro {
    gap: 24px;
    margin-bottom: 40px;
  }

  .template-market__intro h1 {
    font-size: 31px;
  }

  .template-market-data {
    border-radius: 15px;
    padding: 14px;
  }

  .template-market-data__control {
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .template-market-data__summary {
    padding-right: 0;
    padding-bottom: 40px;
  }

  .template-market-data__yaml {
    top: auto;
    right: auto;
    bottom: 0;
    left: -7px;
    min-height: 40px;
  }

  .template-market__section-heading {
    align-items: flex-start;
  }

  .template-market__section-heading > span {
    padding-top: 7px;
  }

  .template-market-categories {
    margin-right: -16px;
    margin-left: -16px;
    padding-right: 16px;
    padding-left: 16px;
    scroll-padding-inline: 16px;
  }

  .template-market-categories__item {
    min-height: 44px;
  }

  .template-market__grid {
    grid-template-columns: 1fr;
  }

  .template-market-replace-dialog__actions {
    flex-direction: column-reverse;
  }

  .template-market-replace-dialog__actions > * {
    width: 100%;
  }
}
</style>
