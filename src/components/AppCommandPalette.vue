<script lang="ts" setup>
import type { CommandGroup, ResumeCommand } from '~/commands'
import {
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxViewport,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { useResumeCommands } from '~/commands'

interface CommandSection {
  commands: ResumeCommand[]
  id: CommandGroup | 'recent'
  label: string
}

const app = useAppStore()
const editor = useEditorStore()
const { commands, execute, find } = useResumeCommands()
const { t } = useI18n()

const query = ref('')
let returnFocus: HTMLElement | null = null

const groupOrder: CommandGroup[] = ['start', 'edit', 'view', 'output', 'help']

function searchableText(command: ResumeCommand) {
  return [command.label, command.description, ...command.keywords].filter(Boolean).join(' ').toLocaleLowerCase()
}

const paletteCommands = computed(() => commands.value.filter(command => command.palette !== false))
const sections = computed<CommandSection[]>(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()
  const matching = normalizedQuery
    ? paletteCommands.value.filter(command => searchableText(command).includes(normalizedQuery))
    : paletteCommands.value

  const recent = normalizedQuery
    ? []
    : app.recentCommandIds
        .map(find)
        .filter((command): command is ResumeCommand => Boolean(command?.palette !== false))

  const recentIds = new Set(recent.map(command => command.id))
  const grouped = groupOrder.map((group): CommandSection => ({
    commands: matching.filter(command => command.group === group && !recentIds.has(command.id)),
    id: group,
    label: t(`command.group.${group}`),
  })).filter(section => section.commands.length)

  if (!recent.length)
    return grouped

  return [{
    commands: recent,
    id: 'recent',
    label: t('command.group.recent'),
  }, ...grouped]
})

watch(() => app.commandPaletteOpen, (open) => {
  if (open) {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    query.value = ''
  }
})

async function run(command: ResumeCommand) {
  await execute(command.id)
}

function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  returnFocus?.focus()
  returnFocus = null
}

function closeFromCombobox(event: Event) {
  event.preventDefault()
  app.commandPaletteOpen = false
}

function isTextTarget(target: EventTarget | null) {
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || (target instanceof HTMLElement && target.isContentEditable)
}

function openPalette(event: KeyboardEvent) {
  event.preventDefault()
  app.commandPaletteOpen = true
}

function onGlobalKeydown(event: KeyboardEvent) {
  if (event.isComposing)
    return

  const key = event.key.toLocaleLowerCase()
  const mod = event.metaKey || event.ctrlKey

  if (mod && event.shiftKey && key === 'p') {
    openPalette(event)
    return
  }

  if (mod && !event.shiftKey && key === 'k') {
    if (!isTextTarget(event.target) && !editor.codeEditor?.hasTextFocus())
      openPalette(event)
    return
  }

  if (event.key === 'F1') {
    if (!editor.codeEditor?.hasTextFocus())
      openPalette(event)
    return
  }

  if (event.key === 'Escape' && !event.defaultPrevented) {
    if (app.commandPaletteOpen || app.resumeSourceOpen || app.onboardingOpen)
      return
    if (app.isFullscreen)
      app.isFullscreen = false
  }
}

useEventListener('keydown', onGlobalKeydown)
</script>

<template>
  <DialogRoot v-model:open="app.commandPaletteOpen">
    <DialogPortal>
      <DialogOverlay class="app-dialog-overlay" />
      <DialogContent
        class="command-palette"
        @close-auto-focus="onCloseAutoFocus"
      >
        <DialogTitle class="sr-only">
          {{ t('command.open_commands') }}
        </DialogTitle>
        <DialogDescription class="sr-only">
          {{ t('command.search_placeholder') }}
        </DialogDescription>

        <ComboboxRoot :open="true" :ignore-filter="true">
          <div class="command-palette__search">
            <span i-ri-search-line aria-hidden="true" />
            <ComboboxInput
              v-model="query"
              auto-focus
              class="command-palette__input"
              :placeholder="t('command.search_placeholder')"
              :aria-label="t('command.search_label')"
            />
            <kbd>Esc</kbd>
          </div>
          <ComboboxContent
            class="command-palette__content"
            position="inline"
            @escape-key-down="closeFromCombobox"
          >
            <ComboboxViewport class="command-palette__viewport">
              <ComboboxGroup v-for="section in sections" :key="section.id">
                <ComboboxLabel class="command-palette__group-label">
                  {{ section.label }}
                </ComboboxLabel>
                <ComboboxItem
                  v-for="command in section.commands"
                  :key="command.id"
                  class="command-palette__item"
                  :disabled="!command.enabled"
                  :text-value="searchableText(command)"
                  :value="command.id"
                  @select.prevent="run(command)"
                >
                  <span class="command-palette__item-icon" aria-hidden="true">
                    <span :class="command.icon" />
                  </span>
                  <span class="command-palette__item-copy">
                    <span>{{ command.label }}</span>
                    <small v-if="command.description">{{ command.description }}</small>
                  </span>
                  <kbd v-if="command.shortcut">{{ command.shortcut }}</kbd>
                </ComboboxItem>
              </ComboboxGroup>
              <p v-if="sections.length === 0" class="command-palette__empty">
                {{ t('command.no_results') }}
              </p>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>

        <DialogClose class="sr-only">
          {{ t('button.close') }}
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.command-palette {
  position: fixed;
  z-index: calc(var(--overlay-z-index) + 1);
  top: min(18vh, 150px);
  left: 50%;
  width: min(680px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid rgb(127 127 127 / 24%);
  border-radius: 18px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg);
  box-shadow: 0 28px 90px rgb(0 0 0 / 32%);
  transform: translateX(-50%);
}

.command-palette__search {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  border-bottom: 1px solid rgb(127 127 127 / 18%);
  padding: 0 16px;

  > [aria-hidden='true'] {
    color: rgb(127 127 127);
    font-size: 20px;
  }

  kbd {
    border: 1px solid rgb(127 127 127 / 20%);
    border-radius: 6px;
    padding: 3px 6px;
    color: rgb(127 127 127);
    font-size: 11px;
  }
}

.command-palette__input {
  width: 100%;
  height: 56px;
  border: 0;
  color: inherit;
  font: inherit;
  font-size: 16px;
  background: transparent;
  outline: none;
}

.command-palette__content {
  position: static;
  outline: none;
}

.command-palette__viewport {
  max-height: min(62dvh, 520px);
  overflow-y: auto;
  padding: 8px;
}

.command-palette__group-label {
  display: block;
  padding: 10px 10px 6px;
  color: rgb(127 127 127);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.command-palette__item {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 50px;
  border-radius: 10px;
  padding: 6px 10px;
  outline: none;
  cursor: pointer;

  &[data-highlighted] {
    color: white;
    background: var(--wr-c-link);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.42;
  }

  kbd {
    font-size: 11px;
    opacity: 0.68;
  }
}

.command-palette__item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgb(127 127 127 / 10%);
}

.command-palette__item-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;

  small {
    margin-top: 2px;
    overflow: hidden;
    font-size: 11px;
    opacity: 0.65;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.command-palette__empty {
  margin: 0;
  padding: 36px 12px;
  color: rgb(127 127 127);
  text-align: center;
}

@media (max-width: 767px) {
  .command-palette {
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 92dvh;
    border-radius: 20px 20px 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    transform: none;
  }

  .command-palette__viewport {
    max-height: calc(82dvh - 58px - env(safe-area-inset-bottom));
  }
}
</style>
