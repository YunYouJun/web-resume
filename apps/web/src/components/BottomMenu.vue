<script lang="ts" setup>
const app = useAppStore()
const route = useRoute()
const { t } = useI18n()

const items = computed(() => [
  {
    activeIcon: 'i-ri-home-fill',
    icon: 'i-ri-home-line',
    label: t('button.home'),
    to: '/',
  },
  {
    activeIcon: 'i-ri-side-bar-fill',
    icon: 'i-ri-side-bar-line',
    label: t('button.editor'),
    to: '/editor',
  },
  {
    activeIcon: 'i-ri-compass-fill',
    icon: 'i-ri-compass-line',
    label: t('navigation.explore'),
    to: '/explore',
  },
  {
    activeIcon: 'i-ri-user-fill',
    icon: 'i-ri-user-line',
    label: t('navigation.profile'),
    to: '/user',
  },
])

const settingsItem = computed(() => ({
  activeIcon: 'i-ri-settings-3-fill',
  icon: 'i-ri-settings-3-line',
  label: t('navigation.settings'),
  to: '/settings',
}))
</script>

<template>
  <nav
    v-if="!app.isPrinting"
    class="bottom-menu"
    :aria-label="t('navigation.primary')"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      class="bottom-menu__item"
      :to="item.to"
      :aria-current="route.path === item.to ? 'page' : undefined"
    >
      <span :class="route.path === item.to ? item.activeIcon : item.icon" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </RouterLink>
    <RouterLink
      class="bottom-menu__item bottom-menu__settings"
      :to="settingsItem.to"
      :aria-current="route.path === settingsItem.to ? 'page' : undefined"
    >
      <span :class="route.path === settingsItem.to ? settingsItem.activeIcon : settingsItem.icon" aria-hidden="true" />
      <span>{{ settingsItem.label }}</span>
    </RouterLink>
  </nav>
</template>

<style lang="scss" scoped>
.bottom-menu {
  position: fixed;
  z-index: var(--bottom-menu-z-index);
  top: var(--top-nav-height);
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  width: var(--side-nav-width);
  flex-direction: column;
  border-right: 1px solid rgb(127 127 127 / 18%);
  padding: 12px 8px;
  background: color-mix(in srgb, var(--wr-c-bg), transparent 3%);
  box-shadow: 8px 0 24px rgb(0 0 0 / 6%);
  backdrop-filter: blur(16px);
}

.bottom-menu__settings {
  margin-top: auto;
}

.bottom-menu__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 58px;
  flex-direction: column;
  gap: 2px;
  border-radius: 10px;
  color: rgb(100 100 100);
  font-size: 11px;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;

  @media (hover: hover) {
    &:hover:not([aria-current='page']) {
      color: var(--wr-c-text);
      background: rgb(127 127 127 / 10%);
    }
  }

  > span:first-child {
    font-size: 20px;
  }

  &[aria-current='page'] {
    color: var(--wr-c-link);
    font-weight: 700;
    background: color-mix(in srgb, var(--wr-c-link), transparent 92%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
    outline-offset: -2px;
  }
}

@media (max-width: 767px) {
  .bottom-menu {
    top: auto;
    right: 0;
    display: grid;
    width: auto;
    height: var(--bottom-menu-height);
    grid-auto-rows: auto;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-content: normal;
    align-items: start;
    border-top: 1px solid rgb(127 127 127 / 18%);
    border-right: 0;
    padding: 5px max(8px, env(safe-area-inset-right)) env(safe-area-inset-bottom) max(8px, env(safe-area-inset-left));
    box-shadow: 0 -8px 24px rgb(0 0 0 / 8%);
  }

  .bottom-menu__settings {
    display: none;
  }

  .bottom-menu__item {
    min-width: 44px;
    min-height: 50px;
  }
}

@media print {
  .bottom-menu {
    display: none;
  }
}
</style>
