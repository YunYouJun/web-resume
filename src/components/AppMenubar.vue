<script lang="ts" setup>
import type { ResumeCommand } from '~/commands'
import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarItemIndicator,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from 'reka-ui'
import { useResumeCommands } from '~/commands'

const { commands, execute, find } = useResumeCommands()
const { t } = useI18n()

const recentCommands = computed(() => commands.value.filter(command => command.id.startsWith('resume.recent:')))
const exampleCommands = computed(() => commands.value.filter(command => command.id.startsWith('resume.example:')))
const fileCommands = computed(() => ['resume.load', 'resume.restore-example', 'resume.share', 'resume.print'].map(find).filter(Boolean) as ResumeCommand[])
const viewCommands = computed(() => ['resume.preview', 'view.fullscreen'].map(find).filter(Boolean) as ResumeCommand[])
const helpCommands = computed(() => ['help.onboarding', 'help.docs', 'help.support', 'help.privacy', 'help.github', 'help.language'].map(find).filter(Boolean) as ResumeCommand[])
const overrideCommand = computed(() => find('view.override-info'))

function select(command: ResumeCommand) {
  void execute(command.id)
}
</script>

<template>
  <MenubarRoot class="app-menubar" :aria-label="t('toolbar.app_menu')">
    <MenubarMenu>
      <MenubarTrigger class="app-menubar__trigger">
        {{ t('command.file') }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent class="app-menu-content" :side-offset="8" align="start">
          <MenubarItem
            class="app-menu-item"
            :disabled="!fileCommands[0]?.enabled"
            @select="fileCommands[0] && select(fileCommands[0])"
          >
            <div :class="fileCommands[0]?.icon" aria-hidden="true" />
            <span>{{ fileCommands[0]?.label }}</span>
          </MenubarItem>

          <template v-if="recentCommands.length">
            <MenubarLabel class="app-menu-label">
              {{ t('command.group.recent') }}
            </MenubarLabel>
            <MenubarItem
              v-for="command in recentCommands"
              :key="command.id"
              class="app-menu-item"
              :disabled="!command.enabled"
              @select="select(command)"
            >
              <div :class="command.icon" aria-hidden="true" />
              <span class="app-menu-item__truncate">{{ command.label }}</span>
            </MenubarItem>
          </template>

          <MenubarLabel class="app-menu-label">
            {{ t('command.examples') }}
          </MenubarLabel>
          <MenubarItem
            v-for="command in exampleCommands"
            :key="command.id"
            class="app-menu-item"
            :disabled="!command.enabled"
            @select="select(command)"
          >
            <div :class="command.icon" aria-hidden="true" />
            <span>{{ command.label }}</span>
          </MenubarItem>

          <MenubarSeparator class="app-menu-separator" />
          <MenubarItem
            v-for="command in fileCommands.slice(1)"
            :key="command.id"
            class="app-menu-item"
            :disabled="!command.enabled"
            @select="select(command)"
          >
            <div :class="command.icon" aria-hidden="true" />
            <span>{{ command.label }}</span>
            <kbd v-if="command.shortcut" class="app-menu-shortcut">{{ command.shortcut }}</kbd>
          </MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger class="app-menubar__trigger">
        {{ t('command.view') }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent class="app-menu-content" :side-offset="8" align="start">
          <MenubarItem
            v-for="command in viewCommands"
            :key="command.id"
            class="app-menu-item"
            :disabled="!command.enabled"
            @select="select(command)"
          >
            <div :class="command.icon" aria-hidden="true" />
            <span>{{ command.label }}</span>
            <span v-if="!command.enabled && command.description" class="app-menu-hint">{{ command.description }}</span>
          </MenubarItem>
          <MenubarCheckboxItem
            v-if="overrideCommand"
            class="app-menu-item"
            :model-value="overrideCommand.checked"
            @select.prevent="select(overrideCommand)"
          >
            <div :class="overrideCommand.icon" aria-hidden="true" />
            <span>{{ overrideCommand.label }}</span>
            <MenubarItemIndicator class="app-menu-indicator">
              <div i-ri-check-line aria-hidden="true" />
            </MenubarItemIndicator>
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger class="app-menubar__trigger">
        {{ t('command.help') }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent class="app-menu-content" :side-offset="8" align="start">
          <MenubarItem
            v-for="command in helpCommands"
            :key="command.id"
            class="app-menu-item"
            :disabled="!command.enabled"
            @select="select(command)"
          >
            <div :class="command.icon" aria-hidden="true" />
            <span>{{ command.label }}</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>

<style lang="scss" scoped>
.app-menubar {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.app-menubar__trigger {
  min-height: 32px;
  border-radius: 7px;
  padding: 0 9px;
  font-size: 13px;

  &:hover,
  &[data-state='open'],
  &[data-highlighted] {
    background: rgb(127 127 127 / 12%);
  }

  &:focus-visible {
    outline: 2px solid var(--wr-c-link);
    outline-offset: 2px;
  }
}
</style>
