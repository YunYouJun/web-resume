<script lang="ts" setup>
import type { ColorSchemePreference } from '~/composables'
import type { ResumeTemplateId } from '~/types'
import { colorScheme } from '~/composables'
import { resumeTemplates } from '~/data/resume-catalog'

const app = useAppStore()
const { locale, t } = useI18n()

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
          <select id="settings-language" v-model="locale" class="settings-select">
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
          <select id="settings-template" v-model="selectedTemplate" class="settings-select">
            <option v-for="template in resumeTemplates" :key="template.id" :value="template.id">
              {{ t(template.nameKey) }}
            </option>
          </select>
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
          <RouterLink class="settings-link" to="/user">
            <span i-ri-user-line aria-hidden="true" />
            <span>{{ t('settings.privacy.edit_profile') }}</span>
          </RouterLink>
          <RouterLink class="settings-link" to="/privacy">
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
    color: rgb(100 100 100);
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
  border-radius: 16px;
  background: var(--wr-c-bg);
  box-shadow: 0 10px 34px rgb(0 0 0 / 5%);
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
    color: rgb(110 110 110);
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
    color: rgb(110 110 110);
    font-size: 12px;
    line-height: 1.45;
  }
}

.settings-select {
  min-width: 180px;
  min-height: 40px;
  border: 1px solid rgb(127 127 127 / 25%);
  border-radius: var(--wr-control-radius);
  padding: 0 34px 0 11px;
  color: var(--wr-c-text);
  font: inherit;
  font-size: 13px;
  background: var(--wr-c-bg);

  &:focus-visible {
    border-color: var(--wr-c-link);
    outline: 2px solid color-mix(in srgb, var(--wr-c-link), transparent 55%);
    outline-offset: 1px;
  }
}

.settings-segment {
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  border-radius: 11px;
  padding: 3px;
  background: rgb(127 127 127 / 10%);
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
  background: var(--wr-c-bg);
  box-shadow: 0 1px 5px rgb(0 0 0 / 10%);
}

.settings-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wr-space-2);
  border-top: 1px solid rgb(127 127 127 / 14%);
  padding: 14px 20px 18px;
}

.settings-link {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 7px;
  border: 1px solid rgb(127 127 127 / 20%);
  border-radius: var(--wr-control-radius);
  padding: 0 11px;
  color: inherit;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;

  &:hover {
    background: rgb(127 127 127 / 9%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
    outline-offset: 2px;
  }
}

:global(.dark) .settings-page__header > p:not(.settings-page__kicker),
:global(.dark) .settings-card__heading p,
:global(.dark) .settings-field__copy span {
  color: rgb(175 175 175);
}

@media (max-width: 767px) {
  .settings-page {
    padding: 24px 14px 40px;
  }

  .settings-page__header {
    margin-bottom: 20px;
  }

  .settings-card {
    border-radius: 14px;
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

  .settings-link {
    min-height: 44px;
  }
}
</style>
