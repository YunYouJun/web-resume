<script lang="ts" setup>
import type { ResumeCommand } from '~/commands'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ToolbarButton,
} from 'reka-ui'
import { useResumeCommands } from '~/commands'

const props = withDefaults(defineProps<{
  compact?: boolean
  includePreview?: boolean
}>(), {
  compact: false,
  includePreview: false,
})

const { execute, find } = useResumeCommands()
const { t } = useI18n()

const commands = computed(() => [
  ...(props.includePreview ? ['resume.preview'] : []),
  'app.commands',
  'resume.share',
  'resume.restore-example',
  'help.onboarding',
  'help.docs',
  'help.support',
  'help.privacy',
  'help.language',
].map(find).filter(Boolean) as ResumeCommand[])
const helpStartIndex = computed(() => props.includePreview ? 4 : 3)
const overrideCommand = computed(() => find('view.override-info'))

function select(command: ResumeCommand) {
  void execute(command.id)
}
</script>

<template>
  <DropdownMenuRoot>
    <ToolbarButton as-child>
      <DropdownMenuTrigger class="command-button command-button--quiet">
        <div i-ri-more-2-fill aria-hidden="true" />
        <span :class="{ 'sr-only': props.compact }">{{ t('toolbar.more') }}</span>
      </DropdownMenuTrigger>
    </ToolbarButton>
    <DropdownMenuPortal>
      <DropdownMenuContent class="app-menu-content" :side-offset="8" align="end">
        <template v-for="(command, index) in commands" :key="command.id">
          <DropdownMenuSeparator v-if="index === helpStartIndex" class="app-menu-separator" />
          <DropdownMenuItem
            class="app-menu-item"
            :disabled="!command.enabled"
            @select="select(command)"
          >
            <div :class="command.icon" aria-hidden="true" />
            <span>{{ command.label }}</span>
            <kbd v-if="command.shortcut" class="app-menu-shortcut">{{ command.shortcut }}</kbd>
          </DropdownMenuItem>
        </template>
        <DropdownMenuCheckboxItem
          v-if="overrideCommand"
          class="app-menu-item"
          :model-value="overrideCommand.checked"
          @select.prevent="select(overrideCommand)"
        >
          <div :class="overrideCommand.icon" aria-hidden="true" />
          <span>{{ overrideCommand.label }}</span>
          <DropdownMenuItemIndicator class="app-menu-indicator">
            <div i-ri-check-line aria-hidden="true" />
          </DropdownMenuItemIndicator>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
