<script lang="ts" setup>
import { ToolbarButton, ToolbarRoot } from 'reka-ui'
import { useResumeCommands } from '~/commands'

const app = useAppStore()
const editor = useEditorStore()
const { execute } = useResumeCommands()
const { t } = useI18n()

const currentResumeLabel = computed(() => app.curResume.title || app.curResume.url || t('toolbar.current_resume'))

useEventListener('beforeprint', () => {
  app.isPrinting = true
})

useEventListener('afterprint', () => {
  app.isPrinting = false
})
</script>

<template>
  <nav
    v-if="!app.isPrinting && app.showToolbar"
    class="app-toolbar"
    :aria-label="t('toolbar.navigation')"
  >
    <div class="app-toolbar__desktop">
      <div class="app-toolbar__menubar-row">
        <RouterLink
          to="/"
          class="app-toolbar__brand"
          :aria-label="`Web Resume · ${t('button.home')}`"
        >
          <img src="/img/icons/web-resume-mark.svg" alt="">
          <span>Web Resume</span>
        </RouterLink>
        <span class="app-toolbar__brand-separator" aria-hidden="true" />
        <AppMenubar />
      </div>

      <div class="app-toolbar__actions-row">
        <AddressBar />
        <ToolbarRoot class="app-toolbar__utility" :aria-label="t('toolbar.utility_actions')">
          <ToolbarButton
            type="button"
            class="command-button command-button--quiet app-toolbar__command-trigger"
            @click="execute('app.commands')"
          >
            <span i-ri-search-line aria-hidden="true" />
            <span>{{ t('toolbar.open_commands') }}</span>
            <kbd>Mod ⇧ P</kbd>
          </ToolbarButton>
          <AppMoreMenu />
        </ToolbarRoot>
      </div>
    </div>

    <div class="app-toolbar__mobile">
      <RouterLink
        to="/"
        class="app-toolbar__mobile-brand"
        :aria-label="`Web Resume · ${t('button.home')}`"
      >
        <img src="/img/icons/web-resume-mark.svg" alt="">
      </RouterLink>
      <button
        type="button"
        class="app-toolbar__source"
        :aria-label="t('command.load_resume')"
        @click="execute('resume.load')"
      >
        <span>
          <small>{{ t('toolbar.current_resume') }}</small>
          <strong>{{ currentResumeLabel }}</strong>
        </span>
      </button>
      <ToolbarRoot class="app-toolbar__mobile-actions" :aria-label="t('toolbar.primary_actions')">
        <ToolbarButton
          type="button"
          class="command-button command-button--primary app-toolbar__export"
          :disabled="!editor.resumeJson"
          :aria-label="t('command.export_pdf')"
          @click="execute('resume.print')"
        >
          <span i-ri-printer-line aria-hidden="true" />
          <span>{{ t('command.export_pdf') }}</span>
        </ToolbarButton>
        <AppMoreMenu compact include-preview />
      </ToolbarRoot>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.app-toolbar {
  position: fixed;
  z-index: var(--top-nav-z-index);
  top: 0;
  right: 0;
  left: 0;
  min-height: var(--top-nav-height);
  border-bottom: 1px solid rgb(127 127 127 / 18%);
  padding: 6px 12px 8px;
  background: color-mix(in srgb, var(--wr-c-bg), transparent 4%);
  box-shadow: 0 6px 24px rgb(0 0 0 / 8%);
  backdrop-filter: blur(16px);
}

.app-toolbar__desktop {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(1500px, 100%);
  margin: 0 auto;
}

.app-toolbar__menubar-row,
.app-toolbar__actions-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.app-toolbar__menubar-row {
  gap: var(--wr-space-2);
  min-height: 32px;
  border-bottom: 1px solid rgb(127 127 127 / 12%);
  padding: 0 2px 5px;
}

.app-toolbar__brand {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: var(--wr-space-2);
  border-radius: 7px;
  padding: 0 var(--wr-space-2);
  color: inherit;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.01em;
  text-decoration: none;

  img {
    width: 22px;
    height: 22px;
    flex: 0 0 auto;
  }

  &:hover {
    background: rgb(127 127 127 / 10%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
    outline-offset: 2px;
  }
}

:global(.dark) .app-toolbar__brand img,
:global(.dark) .app-toolbar__mobile-brand img {
  filter: invert(1);
}

.app-toolbar__brand-separator {
  width: 1px;
  height: 18px;
  flex: 0 0 auto;
  background: rgb(127 127 127 / 20%);
}

.app-toolbar__actions-row {
  gap: var(--wr-toolbar-group-gap);
}

.app-toolbar__utility,
.app-toolbar__mobile-actions {
  display: flex;
  align-items: center;
  gap: var(--wr-toolbar-control-gap);
  flex-shrink: 0;
}

.app-toolbar__command-trigger kbd {
  border: 1px solid rgb(127 127 127 / 22%);
  border-radius: 5px;
  padding: 2px 5px;
  color: rgb(127 127 127);
  font-size: 10px;
}

.app-toolbar__mobile {
  display: none;
}

@media (max-width: 767px) {
  .app-toolbar {
    padding: 8px;
  }

  .app-toolbar__desktop {
    display: none;
  }

  .app-toolbar__mobile {
    display: flex;
    align-items: center;
    gap: var(--wr-toolbar-group-gap);
  }

  .app-toolbar__mobile-brand {
    display: inline-flex;
    width: var(--wr-control-size);
    height: var(--wr-control-size);
    align-items: center;
    justify-content: center;
    flex: 0 0 var(--wr-control-size);
    border-radius: var(--wr-control-radius);

    img {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background: rgb(127 127 127 / 10%);
    }

    &:focus-visible {
      outline: 2px solid var(--wr-c-link);
      outline-offset: 2px;
    }
  }

  .app-toolbar__source {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: var(--wr-control-size);
    align-items: center;
    border-radius: var(--wr-control-radius);
    padding: var(--wr-space-1) var(--wr-space-2);
    color: inherit;
    text-align: left;

    &:focus-visible {
      outline: 2px solid var(--wr-c-link);
      outline-offset: 2px;
    }

    > span {
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    small {
      color: rgb(127 127 127);
      font-size: 10px;
      font-weight: 400;
    }

    strong {
      overflow: hidden;
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .app-toolbar__export {
    padding: 0 var(--wr-control-padding-inline);
    font-size: 12px;
  }

  .command-separator {
    margin: 0;
  }
}

@media (min-width: 768px) and (max-width: 900px) {
  .app-toolbar__brand span {
    display: none;
  }

  .app-toolbar__command-trigger kbd {
    display: none;
  }
}

@media (max-width: 390px) {
  .app-toolbar__export span:last-child {
    display: none;
  }
}
</style>
