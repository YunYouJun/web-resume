<script lang="ts" setup>
import type { ColorSchemePreference } from '~/composables'
import type { ResumeInfo, ResumeTemplateId } from '~/types'
import { colorScheme } from '~/composables'
import { resumeTemplates } from '~/data/resume-catalog'
import { appearanceOptions, defaultResumeAppearance, resolveResumeAppearance, resumePalettes } from '~/utils/resume-appearance'

const app = useAppStore()
const editor = useEditorStore()
const ResumeAll = defineAsyncComponent(() => import('~/components/resume/All.vue'))
const detailOptions = ['font', 'density', 'photo'] as const

function updateAppearance(key: keyof typeof appearanceOptions, value: string) {
  app.resumeAppearance = resolveResumeAppearance({ ...app.resumeAppearance, [key]: value })
}

function resetAppearance() {
  app.resumeAppearance = { ...defaultResumeAppearance }
}

const { locale, t } = useI18n()

const previewResume = computed<ResumeInfo>(() => editor.resumeJson || {
  basics: {
    name: t('settings.resume.sample_name'),
    label: t('settings.resume.sample_role'),
    avatar: '/img/resume-photo-placeholder.svg',
  },
  contact: {
    email: { icon: 'ri:mail-line', label: 'hello@example.com', href: 'mailto:hello@example.com' },
    phone: { icon: 'ri:phone-line', label: '138 0000 0000', href: 'tel:13800000000' },
    blog: { icon: 'ri:global-line', label: 'Portfolio', href: 'https://example.com' },
  },
  other: {
    icon: 'ri:lightbulb-line',
    title: t('settings.resume.sample_section'),
    info: [t('settings.resume.sample_line_one'), t('settings.resume.sample_line_two')],
  },
})

const themes: Array<{ icon: string, id: ColorSchemePreference }> = [
  { icon: 'i-ri-computer-line', id: 'system' },
  { icon: 'i-ri-sun-line', id: 'light' },
  { icon: 'i-ri-moon-line', id: 'dark' },
]

const selectedTemplate = computed({
  get: () => app.resumeTemplateId,
  set: (value: ResumeTemplateId) => {
    app.resumeTemplateId = value
  },
})

useHead({
  title: 'Settings · Web Resume',
  meta: [{
    name: 'description',
    content: 'Configure Web Resume appearance, language, template, and local profile preferences.',
  }],
})
</script>

<template>
  <div class="settings-page">
    <header class="settings-page__header">
      <p class="settings-page__kicker">
        Web Resume
      </p>
      <h1>{{ t('settings.title') }}</h1>
      <p>{{ t('settings.description') }}</p>
      <div class="settings-page__notice">
        <span i-ri-device-line aria-hidden="true" />
        <span>{{ t('settings.local_notice') }}</span>
      </div>
    </header>

    <div class="settings-page__sections">
      <section class="settings-card" aria-labelledby="settings-appearance-title">
        <div class="settings-card__heading">
          <span class="settings-card__icon" aria-hidden="true"><span i-ri-palette-line /></span>
          <div>
            <h2 id="settings-appearance-title">
              {{ t('settings.appearance.title') }}
            </h2>
            <p>{{ t('settings.appearance.description') }}</p>
          </div>
        </div>

        <div class="settings-field">
          <div class="settings-field__copy">
            <strong id="settings-theme-label">{{ t('settings.appearance.theme') }}</strong>
            <span id="settings-theme-description">{{ t('settings.appearance.theme_description') }}</span>
          </div>
          <div
            class="settings-segment"
            role="radiogroup"
            aria-labelledby="settings-theme-label"
            aria-describedby="settings-theme-description"
          >
            <label
              v-for="theme in themes"
              :key="theme.id"
              :class="{ 'settings-segment__option--selected': colorScheme === theme.id }"
              class="settings-segment__option"
            >
              <input v-model="colorScheme" type="radio" name="color-scheme" :value="theme.id">
              <span :class="theme.icon" aria-hidden="true" />
              <span>{{ t(`settings.themes.${theme.id}`) }}</span>
            </label>
          </div>
        </div>

        <div class="settings-field">
          <label class="settings-field__copy" for="settings-language">
            <strong>{{ t('settings.appearance.language') }}</strong>
            <span>{{ t('settings.appearance.language_description') }}</span>
          </label>
          <select id="settings-language" v-model="locale" class="wr-field-control settings-select">
            <option value="zh-CN">
              {{ t('settings.languages.zh_cn') }}
            </option>
            <option value="en">
              {{ t('settings.languages.en') }}
            </option>
          </select>
        </div>
      </section>

      <section class="settings-card" aria-labelledby="settings-resume-title">
        <div class="settings-card__heading">
          <span class="settings-card__icon" aria-hidden="true"><span i-ri-layout-4-line /></span>
          <div>
            <h2 id="settings-resume-title">
              {{ t('settings.resume.title') }}
            </h2>
            <p>{{ t('settings.resume.description') }}</p>
          </div>
        </div>

        <div class="settings-field">
          <label class="settings-field__copy" for="settings-template">
            <strong>{{ t('settings.resume.template') }}</strong>
            <span>{{ t('settings.resume.template_description') }}</span>
          </label>
          <select id="settings-template" v-model="selectedTemplate" class="wr-field-control settings-select">
            <option v-for="template in resumeTemplates" :key="template.id" :value="template.id">
              {{ t(template.nameKey) }}
            </option>
          </select>
        </div>
        <div class="settings-field">
          <div class="settings-field__copy">
            <strong id="settings-palette-label">{{ t('settings.resume.palette') }}</strong>
            <span>{{ t('settings.resume.palette_description') }}</span>
          </div>
          <div class="settings-palettes" role="radiogroup" aria-labelledby="settings-palette-label">
            <label v-for="palette in appearanceOptions.palette" :key="palette" class="settings-segment__option" :class="{ 'settings-segment__option--selected': app.resumeAppearance.palette === palette }">
              <input type="radio" name="resume-palette" :value="palette" :checked="app.resumeAppearance.palette === palette" @change="updateAppearance('palette', palette)">
              <span class="settings-palette-dot" :style="{ backgroundColor: resumePalettes[palette].accent }" aria-hidden="true" />
              <span>{{ t(`settings.resume.options.${palette}`) }}</span>
            </label>
          </div>
        </div>
        <div v-for="key in detailOptions" :key="key" class="settings-field">
          <label class="settings-field__copy" :for="`settings-resume-${key}`">
            <strong>{{ t(`settings.resume.${key}`) }}</strong>
          </label>
          <select :id="`settings-resume-${key}`" class="wr-field-control settings-select" :value="app.resumeAppearance[key]" @change="updateAppearance(key, ($event.target as HTMLSelectElement).value)">
            <option v-for="option in appearanceOptions[key]" :key="option" :value="option">
              {{ t(`settings.resume.options.${option}`) }}
            </option>
          </select>
        </div>
        <div class="settings-field">
          <p class="settings-field__copy">
            {{ t('settings.resume.sharing_notice') }}
          </p>
          <button type="button" class="command-button command-button--quiet" @click="resetAppearance">
            {{ t('settings.resume.reset') }}
          </button>
        </div>
        <div class="settings-resume-preview" role="region" :aria-label="t('settings.resume.preview')">
          <div class="settings-resume-preview__heading">
            <strong>{{ t('settings.resume.preview') }}</strong>
            <span>{{ t(editor.resumeJson ? 'settings.resume.current_preview' : 'settings.resume.sample_preview') }}</span>
          </div>
          <div class="settings-resume-preview__canvas" inert aria-hidden="true">
            <ResumeAll :resume="previewResume" :template-id="app.resumeTemplateId" />
          </div>
          <p>{{ t('settings.resume.photo_help') }}</p>
        </div>
      </section>

      <section class="settings-card" aria-labelledby="settings-privacy-title">
        <div class="settings-card__heading">
          <span class="settings-card__icon" aria-hidden="true"><span i-ri-shield-check-line /></span>
          <div>
            <h2 id="settings-privacy-title">
              {{ t('settings.privacy.title') }}
            </h2>
            <p>{{ t('settings.privacy.description') }}</p>
          </div>
        </div>

        <div class="settings-card__actions">
          <RouterLink class="command-button command-button--quiet" to="/user">
            <span i-ri-user-line aria-hidden="true" />
            <span>{{ t('settings.privacy.edit_profile') }}</span>
          </RouterLink>
          <RouterLink class="command-button command-button--quiet" to="/privacy">
            <span i-ri-shield-check-line aria-hidden="true" />
            <span>{{ t('settings.privacy.view_privacy') }}</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  width: min(920px, 100%);
  min-height: calc(100dvh - var(--top-nav-height) - var(--bottom-menu-height));
  margin: 0 auto;
  padding: clamp(28px, 5vw, 56px) 24px 80px;
}

.settings-page__header {
  margin-bottom: 28px;

  h1 {
    margin: 0;
    font-size: clamp(32px, 5vw, 48px);
    letter-spacing: -0.04em;
    line-height: 1.1;
  }

  > p:not(.settings-page__kicker) {
    margin: 12px 0 0;
    color: var(--wr-c-text-muted);
    font-size: 16px;
  }
}

.settings-page__kicker {
  margin: 0 0 8px;
  color: var(--wr-c-link);
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.settings-page__notice {
  display: inline-flex;
  align-items: center;
  gap: var(--wr-space-2);
  margin-top: 18px;
  border-radius: 10px;
  padding: 9px 11px;
  color: color-mix(in srgb, var(--wr-c-link), var(--wr-c-text) 32%);
  font-size: 12px;
  background: color-mix(in srgb, var(--wr-c-link), transparent 93%);
}

.settings-page__sections {
  display: grid;
  gap: 16px;
}

.settings-card {
  overflow: hidden;
  border: 1px solid rgb(127 127 127 / 20%);
  border-radius: var(--wr-radius-surface);
  background: var(--wr-c-bg);
  box-shadow: var(--wr-shadow-surface);
}

.settings-card__heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;

  h2 {
    margin: 1px 0 0;
    font-size: 18px;
    letter-spacing: -0.02em;
  }

  p {
    margin: 5px 0 0;
    color: var(--wr-c-text-muted);
    font-size: 13px;
    line-height: 1.5;
  }
}

.settings-card__icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 10px;
  color: var(--wr-c-link);
  font-size: 18px;
  background: color-mix(in srgb, var(--wr-c-link), transparent 91%);
}

.settings-field {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid rgb(127 127 127 / 14%);
  padding: 14px 20px;
}

.settings-field__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 14px;
  }

  span {
    color: var(--wr-c-text-muted);
    font-size: 12px;
    line-height: 1.45;
  }
}

.settings-select {
  appearance: none;
  min-height: 44px;
  padding-right: 32px;
  background-image: linear-gradient(45deg, transparent 50%, var(--wr-c-text-muted) 50%), linear-gradient(135deg, var(--wr-c-text-muted) 50%, transparent 50%);
  background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  width: auto;
  min-width: 180px;
}

.settings-segment {
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  border-radius: 11px;
  padding: 3px;
  background: var(--wr-c-hover);
}

.settings-segment__option {
  position: relative;
  display: inline-flex;
  min-width: 94px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 12px;
  cursor: pointer;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  &:has(input:focus-visible) {
    outline: 2px solid var(--wr-c-link);
    outline-offset: 1px;
  }
}

.settings-segment__option--selected {
  color: var(--wr-c-link);
  background: var(--wr-c-selected);
  box-shadow: 0 1px 5px rgb(0 0 0 / 10%);
}

.settings-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wr-space-2);
  border-top: 1px solid rgb(127 127 127 / 14%);
  padding: 14px 20px 18px;
}

@media (max-width: 767px) {
  .settings-page {
    padding: 24px 14px 40px;
  }

  .settings-page__header {
    margin-bottom: 20px;
  }

  .settings-card {
    border-radius: var(--wr-radius-surface);
  }

  .settings-card__heading {
    padding: 17px 16px;
  }

  .settings-field {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
  }

  .settings-select {
    width: 100%;
    min-height: 44px;
  }

  .settings-segment {
    width: 100%;
  }

  .settings-segment__option {
    min-width: 0;
    min-height: 44px;
    padding: 0 6px;
  }

  .settings-card__actions {
    padding: 14px 16px 17px;
  }
}
.settings-field > .command-button {
  min-height: 44px;
  flex-shrink: 0;
}

.settings-palettes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;

  .settings-segment__option { min-width: 74px; min-height: 44px; }
}

.settings-palette-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.settings-resume-preview {
  border-top: 1px solid rgb(127 127 127 / 24%);
  padding: 20px;
  background: var(--wr-c-hover);

  > p { margin: 12px 0 0; color: var(--wr-c-text-muted); font-size: 12px; }
}

.settings-resume-preview__heading {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;

  span { font-size: 12px; color: var(--wr-c-text-muted); }
}

.settings-resume-preview__canvas {
  max-height: 480px;
  overflow: auto;
  border: 1px solid rgb(127 127 127 / 24%);
  border-radius: 8px;
  background: white;
  color: #1d1d1f;

  :deep(.resume) { --wr-c-resume-bg: white; }
}

@media (max-width: 767px) {
  .settings-palettes { grid-template-columns: repeat(2, 1fr); }
  .settings-resume-preview { padding: 16px; }
}
</style>
