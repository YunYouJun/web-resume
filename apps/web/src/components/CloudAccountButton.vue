<script lang="ts" setup>
import { useCloudStore } from '~/stores/cloud'

const cloud = useCloudStore()
const { t } = useI18n()

const label = computed(() => cloud.session?.user.name || cloud.session?.user.handle || t('cloud.account'))
const safeAvatarUrl = computed(() => {
  const value = cloud.session?.user.avatarUrl
  if (!value)
    return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : undefined
  }
  catch {
    return undefined
  }
})
</script>

<template>
  <div v-if="cloud.config.enabled" class="cloud-account">
    <RouterLink
      v-if="cloud.isAuthenticated"
      to="/user"
      class="cloud-account__button"
      :aria-label="t('cloud.manage_account')"
    >
      <img v-if="safeAvatarUrl" :src="safeAvatarUrl" alt="" referrerpolicy="no-referrer">
      <span v-else i-ri-user-3-line aria-hidden="true" />
      <span class="cloud-account__label">{{ label }}</span>
      <span class="cloud-account__status" :class="`cloud-account__status--${cloud.status}`" aria-hidden="true" />
    </RouterLink>
    <button
      v-else
      type="button"
      class="cloud-account__button"
      :disabled="cloud.status === 'loading'"
      @click="cloud.login"
    >
      <span :class="cloud.status === 'loading' ? 'i-ri-loader-4-line animate-spin' : 'i-ri-user-3-line'" aria-hidden="true" />
      <span>{{ cloud.status === 'loading' ? t('cloud.connecting') : t('cloud.login') }}</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.cloud-account {
  margin-left: auto;
}

.cloud-account__button {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 7px;
  border: 1px solid rgb(127 127 127 / 18%);
  border-radius: 999px;
  padding: 3px 10px 3px 7px;
  color: inherit;
  background: var(--wr-c-bg);
  font: inherit;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;

  img,
  > span:first-child {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 18px;
  }

  > span:first-child {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgb(127 127 127 / 10%);
  }

  &:hover:not(:disabled) {
    background: rgb(127 127 127 / 10%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
}

.cloud-account__label {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cloud-account__status {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;

  &--saving,
  &--loading {
    background: #f59e0b;
  }

  &--error {
    background: #ef4444;
  }
}
</style>
