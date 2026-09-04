<script lang="ts" setup>
import { useCloudStore } from '~/stores/cloud'

const cloud = useCloudStore()
const user = useUserStore()
const { locale, t } = useI18n()

const confirmClear = ref(false)
const newResumeName = ref('')

function formatBytes(value = 0) {
  if (value < 1024)
    return `${value} B`
  if (value < 1024 * 1024)
    return `${(value / 1024).toFixed(1)} KB`
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(value?: number | null) {
  if (!value)
    return '—'
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

async function saveAsNew() {
  if (!newResumeName.value.trim())
    return
  await cloud.createDocument(newResumeName.value).catch(() => undefined)
  if (cloud.status !== 'error')
    newResumeName.value = ''
}

async function runCloudAction(action: () => Promise<unknown>) {
  await action().catch(() => undefined)
}
</script>

<template>
  <div class="profile-page">
    <header class="profile-page__header">
      <p>{{ t('cloud.kicker') }}</p>
      <h1>{{ t('cloud.page_title') }}</h1>
      <span>{{ t('cloud.page_description') }}</span>
    </header>

    <div class="profile-page__grid">
      <section class="profile-card profile-card--local">
        <div class="profile-card__heading">
          <div>
            <p>{{ t('cloud.local_badge') }}</p>
            <h2>{{ t('cloud.local_profile') }}</h2>
          </div>
          <button
            type="button"
            class="profile-switch"
            :aria-pressed="user.settings.overrideInfo"
            @click="user.settings.overrideInfo = !user.settings.overrideInfo"
          >
            <span v-if="user.settings.overrideInfo" i-ri-eye-line aria-hidden="true" />
            <span v-else i-ri-eye-off-line aria-hidden="true" />
            {{ user.settings.overrideInfo ? t('cloud.override_on') : t('cloud.override_off') }}
          </button>
        </div>
        <p class="profile-card__description">
          {{ t('cloud.local_description') }}
        </p>

        <div class="profile-fields">
          <label>
            <span>{{ t('cloud.name') }}</span>
            <input v-model="user.userInfo.name" autocomplete="name">
          </label>
          <label>
            <span>{{ t('cloud.phone') }}</span>
            <input v-model="user.userInfo.phone" type="tel" autocomplete="tel">
          </label>
          <label>
            <span>{{ t('cloud.email') }}</span>
            <input v-model="user.userInfo.email" type="email" autocomplete="email">
          </label>
        </div>

        <div class="profile-card__footer">
          <span v-if="!confirmClear">{{ t('cloud.local_only') }}</span>
          <span v-else>{{ t('cloud.clear_confirm') }}</span>
          <button v-if="!confirmClear" type="button" class="profile-link profile-link--danger" @click="confirmClear = true">
            {{ t('cloud.clear_device') }}
          </button>
          <span v-else class="profile-card__confirm-actions">
            <button type="button" class="profile-link" @click="confirmClear = false">{{ t('cloud.cancel') }}</button>
            <button type="button" class="profile-link profile-link--danger" @click="cloud.clearDeviceData">{{ t('cloud.confirm_clear') }}</button>
          </span>
        </div>
      </section>

      <section v-if="cloud.config.enabled" class="profile-card profile-card--cloud">
        <template v-if="!cloud.isAuthenticated">
          <div class="cloud-empty">
            <span class="cloud-empty__icon" i-ri-cloud-line aria-hidden="true" />
            <p>{{ t('cloud.drive_badge') }}</p>
            <h2>{{ t('cloud.login_title') }}</h2>
            <span>{{ t('cloud.login_description') }}</span>
            <button type="button" class="command-button command-button--primary" :disabled="cloud.status === 'loading'" @click="cloud.login">
              <span v-if="cloud.status === 'loading'" i-ri-loader-4-line animate-spin aria-hidden="true" />
              <span v-else i-ri-login-box-line aria-hidden="true" />
              {{ cloud.status === 'loading' ? t('cloud.connecting') : t('cloud.login') }}
            </button>
            <p v-if="cloud.errorMessage" class="cloud-error" role="alert">
              {{ cloud.errorMessage }}
            </p>
          </div>
        </template>

        <template v-else>
          <div class="profile-card__heading cloud-identity">
            <div>
              <p>{{ t('cloud.drive_badge') }}</p>
              <h2>{{ cloud.session?.user.name || cloud.session?.user.handle || t('cloud.account') }}</h2>
              <span>{{ cloud.session?.user.handle ? `@${cloud.session.user.handle}` : t('cloud.connected') }}</span>
            </div>
            <button type="button" class="profile-link" @click="runCloudAction(cloud.logout)">
              {{ t('cloud.logout') }}
            </button>
          </div>

          <div v-if="cloud.quota" class="cloud-quota">
            <div>
              <span>{{ t('cloud.storage') }}</span>
              <strong>{{ formatBytes(cloud.quota.usedBytes) }} / {{ formatBytes(cloud.quota.quotaBytes) }}</strong>
            </div>
            <progress :value="cloud.quota.usedBytes" :max="cloud.quota.quotaBytes" />
          </div>

          <form class="cloud-new" @submit.prevent="saveAsNew">
            <label for="cloud-resume-name">{{ t('cloud.first_save') }}</label>
            <div>
              <input id="cloud-resume-name" v-model="newResumeName" :placeholder="t('cloud.name_placeholder')" maxlength="140">
              <button type="submit" class="command-button command-button--primary" :disabled="!newResumeName.trim() || cloud.status === 'saving'">
                <span i-ri-save-3-line aria-hidden="true" />
                {{ t('cloud.save_new') }}
              </button>
            </div>
            <small>{{ t('cloud.autosave_help') }}</small>
          </form>

          <div class="cloud-list-heading">
            <h3>{{ t('cloud.resumes') }}</h3>
            <button type="button" class="profile-link" @click="runCloudAction(cloud.loadDocuments)">
              {{ t('cloud.refresh') }}
            </button>
          </div>
          <div v-if="cloud.documents.length" class="cloud-list">
            <article v-for="document in cloud.documents" :key="document._id" :class="{ 'cloud-document--active': cloud.activeBinding?.documentId === document._id }" class="cloud-document">
              <button type="button" class="cloud-document__main" @click="runCloudAction(() => cloud.openDocument(document._id))">
                <span i-ri-file-text-line aria-hidden="true" />
                <span>
                  <strong>{{ document.name }}</strong>
                  <small>{{ formatDate(document.updatedAt) }} · {{ document.validationStatus === 'valid' ? t('cloud.valid') : t('cloud.invalid_draft') }}</small>
                </span>
              </button>
              <button type="button" class="profile-link profile-link--danger" :aria-label="t('cloud.move_to_trash', { name: document.name })" @click="runCloudAction(() => cloud.trashDocument(document._id))">
                <span i-ri-delete-bin-line aria-hidden="true" />
              </button>
            </article>
          </div>
          <p v-else class="cloud-list-empty">
            {{ t('cloud.no_resumes') }}
          </p>

          <details v-if="cloud.trashedDocuments.length" class="cloud-trash">
            <summary>{{ t('cloud.trash', { count: cloud.trashedDocuments.length }) }}</summary>
            <article v-for="document in cloud.trashedDocuments" :key="document._id" class="cloud-document">
              <span class="cloud-document__main">
                <span i-ri-delete-bin-line aria-hidden="true" />
                <span>
                  <strong>{{ document.name }}</strong>
                  <small>{{ t('cloud.purge_after', { date: formatDate(document.purgeAfter) }) }}</small>
                </span>
              </span>
              <button type="button" class="profile-link" @click="runCloudAction(() => cloud.restoreDocument(document._id))">
                {{ t('cloud.restore') }}
              </button>
            </article>
          </details>

          <p v-if="cloud.status === 'saving'" class="cloud-status" role="status">
            <span i-ri-loader-4-line animate-spin aria-hidden="true" /> {{ t('cloud.saving') }}
          </p>
          <p v-else-if="cloud.lastSavedAt" class="cloud-status">
            <span i-ri-checkbox-circle-line aria-hidden="true" /> {{ t('cloud.saved_at', { date: formatDate(cloud.lastSavedAt) }) }}
          </p>
          <p v-if="cloud.errorMessage" class="cloud-error" role="alert">
            {{ cloud.errorMessage }}
          </p>
        </template>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 40px 24px 88px;
}

.profile-page__header {
  margin-bottom: 24px;

  p {
    margin: 0 0 6px;
    color: var(--wr-c-link);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(32px, 5vw, 48px);
    letter-spacing: -0.04em;
  }

  > span {
    display: block;
    max-width: 680px;
    margin-top: 10px;
    color: rgb(100 100 100);
    line-height: 1.6;
  }
}

.profile-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  align-items: start;
  gap: 18px;
}

.profile-card {
  border: 1px solid rgb(127 127 127 / 20%);
  border-radius: 18px;
  padding: 22px;
  background: var(--wr-c-bg);
  box-shadow: 0 16px 50px rgb(0 0 0 / 6%);
}

.profile-card:only-child {
  width: min(640px, 100%);
  grid-column: 1 / -1;
}

.profile-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  p {
    margin: 0 0 4px;
    color: rgb(127 127 127);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-size: 22px;
  }

  span {
    color: rgb(127 127 127);
    font-size: 12px;
  }
}

.profile-card__description {
  margin: 12px 0 22px;
  color: rgb(100 100 100);
  font-size: 13px;
  line-height: 1.6;
}

.profile-switch,
.profile-link {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 6px;
  border: 0;
  border-radius: 8px;
  padding: 5px 8px;
  color: var(--wr-c-link);
  background: transparent;
  font: inherit;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: rgb(127 127 127 / 10%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
  }
}

.profile-switch {
  border: 1px solid rgb(127 127 127 / 18%);
  color: inherit;
}

.profile-link--danger {
  color: #dc2626;
}

.profile-fields {
  display: grid;
  gap: 15px;

  label > span {
    display: block;
    margin-bottom: 6px;
    color: rgb(100 100 100);
    font-size: 12px;
    font-weight: 700;
  }
}

.profile-fields input,
.cloud-new input {
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  border: 1px solid rgb(127 127 127 / 24%);
  border-radius: 10px;
  padding: 8px 11px;
  color: inherit;
  background: var(--wr-c-bg-soft);
  font: inherit;

  &:focus {
    border-color: var(--wr-c-link);
    outline: 2px solid color-mix(in srgb, var(--wr-c-link), transparent 72%);
  }
}

.profile-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  border-top: 1px solid rgb(127 127 127 / 14%);
  padding-top: 14px;
  color: rgb(127 127 127);
  font-size: 12px;
}

.profile-card__confirm-actions {
  display: inline-flex;
  flex: 0 0 auto;
}

.cloud-empty {
  display: flex;
  min-height: 390px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  p {
    margin: 12px 0 5px;
    color: var(--wr-c-link);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-size: 24px;
  }

  > span:not(.cloud-empty__icon) {
    max-width: 420px;
    margin: 10px 0 22px;
    color: rgb(100 100 100);
    font-size: 13px;
    line-height: 1.6;
  }
}

.cloud-empty__icon {
  display: inline-flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: var(--wr-c-link);
  background: color-mix(in srgb, var(--wr-c-link), transparent 91%);
  font-size: 30px;
}

.cloud-quota {
  margin: 20px 0;
  border-radius: 12px;
  padding: 12px 14px;
  background: var(--wr-c-bg-soft);

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
  }

  progress {
    width: 100%;
    height: 7px;
    accent-color: var(--wr-c-link);
  }
}

.cloud-new {
  border: 1px solid rgb(127 127 127 / 16%);
  border-radius: 14px;
  padding: 14px;

  > label {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    font-weight: 700;
  }

  > div {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }

  small {
    display: block;
    margin-top: 8px;
    color: rgb(127 127 127);
    line-height: 1.5;
  }
}

.cloud-list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 7px;

  h3 {
    margin: 0;
    font-size: 14px;
  }
}

.cloud-list {
  display: grid;
  gap: 6px;
}

.cloud-document {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  border-radius: 11px;
  padding: 4px;

  &:hover,
  &--active {
    background: rgb(127 127 127 / 9%);
  }
}

.cloud-document__main {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 10px;
  border: 0;
  padding: 7px;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;

  > span:first-child {
    flex: 0 0 auto;
    color: var(--wr-c-link);
    font-size: 20px;
  }

  > span:last-child {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }

  strong,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 13px;
  }

  small {
    margin-top: 2px;
    color: rgb(127 127 127);
    font-size: 11px;
  }
}

.cloud-list-empty,
.cloud-status,
.cloud-error {
  color: rgb(127 127 127);
  font-size: 12px;
}

.cloud-trash {
  margin-top: 15px;
  border-top: 1px solid rgb(127 127 127 / 14%);
  padding-top: 12px;

  summary {
    color: rgb(100 100 100);
    font-size: 12px;
    cursor: pointer;
  }
}

.cloud-error {
  color: #dc2626;
}

@media (max-width: 900px) {
  .profile-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .profile-page {
    padding: 24px 14px 48px;
  }

  .profile-card {
    border-radius: 15px;
    padding: 17px;
  }

  .cloud-new > div {
    grid-template-columns: 1fr;
  }
}
</style>
