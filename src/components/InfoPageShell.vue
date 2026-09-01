<script lang="ts" setup>
import pkg from '~/../package.json'

defineProps<{
  intro: string
  kicker: string
  title: string
  updated: string
}>()

const { t } = useI18n()
</script>

<template>
  <article class="info-page">
    <header class="info-page__hero">
      <RouterLink to="/" class="info-page__brand" :aria-label="`Web Resume · ${t('button.home')}`">
        <img src="/img/icons/web-resume-mark.svg" alt="">
        <span>Web Resume</span>
      </RouterLink>
      <p class="info-page__kicker">
        {{ kicker }}
      </p>
      <h1>{{ title }}</h1>
      <p class="info-page__intro">
        {{ intro }}
      </p>
      <p class="info-page__updated">
        {{ updated }}
      </p>
    </header>

    <div class="info-page__content">
      <slot />
    </div>

    <footer class="info-page__footer">
      <nav :aria-label="t('toolbar.utility_actions')">
        <RouterLink to="/support">
          {{ t('command.open_support') }}
        </RouterLink>
        <RouterLink to="/privacy">
          {{ t('command.open_privacy') }}
        </RouterLink>
        <a :href="pkg.repository.url" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </footer>
  </article>
</template>

<style lang="scss">
.info-page {
  width: min(860px, 100%);
  margin: 0 auto;
  padding: clamp(28px, 6vw, 64px) 24px 80px;
}

.info-page__hero {
  border-bottom: 1px solid rgb(127 127 127 / 20%);
  padding-bottom: 28px;
}

.info-page__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--wr-space-2);
  margin-bottom: 36px;
  color: inherit;
  font-weight: 700;
  text-decoration: none;

  img {
    width: 28px;
    height: 28px;
  }
}

.info-page__kicker {
  margin: 0 0 8px;
  color: var(--wr-c-link);
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.info-page h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 54px);
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.info-page__intro {
  max-width: 680px;
  margin: 18px 0 0;
  color: rgb(100 100 100);
  font-size: 17px;
  line-height: 1.7;
}

.dark .info-page__intro {
  color: rgb(175 175 175);
}

.info-page__updated {
  margin: 14px 0 0;
  color: rgb(127 127 127);
  font-size: 13px;
}

.info-page__content {
  padding: 12px 0 36px;

  section {
    padding-top: 28px;
  }

  h2 {
    margin: 0 0 12px;
    font-size: 22px;
    letter-spacing: -0.02em;
  }

  p,
  li {
    line-height: 1.75;
  }

  p {
    margin: 10px 0;
  }

  ul,
  ol {
    margin: 12px 0;
    padding-left: 1.4em;
  }

  li + li {
    margin-top: 8px;
  }

  a {
    color: var(--wr-c-link);
    text-underline-offset: 3px;
  }

  code {
    border-radius: 5px;
    padding: 2px 5px;
    background: rgb(127 127 127 / 12%);
  }
}

.info-page__callout {
  border: 1px solid color-mix(in srgb, var(--wr-c-link), transparent 72%);
  border-radius: 14px;
  padding: 16px 18px;
  background: color-mix(in srgb, var(--wr-c-link), transparent 94%);
}

.info-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wr-space-2);
  margin-top: 18px;

  a {
    min-height: var(--wr-control-size);
    align-items: center;
    border: 1px solid rgb(127 127 127 / 22%);
    border-radius: var(--wr-control-radius);
    padding: 10px 14px;
    color: inherit;
    font-weight: 700;
    text-decoration: none;
  }

  a:first-child {
    border-color: var(--wr-c-link);
    color: white;
    background: var(--wr-c-link);
  }
}

.info-page__footer {
  border-top: 1px solid rgb(127 127 127 / 20%);
  padding-top: 24px;

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--wr-space-3);
  }

  a {
    color: rgb(100 100 100);
    font-size: 13px;
  }
}

@media (max-width: 767px) {
  .info-page {
    padding: 28px 18px 56px;
  }

  .info-page__brand {
    margin-bottom: 28px;
  }
}
</style>
