<script lang="ts" setup>
import type { ResumeItem } from '~/types'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { resumeExamples } from '~/utils'

const emit = defineEmits<{
  loaded: []
}>()

const app = useAppStore()
const editor = useEditorStore()
const { t } = useI18n()

const draftUrl = ref(app.curResume.url)
const selectedResume = ref<ResumeItem | null>({ ...app.curResume })

function displayValue() {
  return draftUrl.value
}

function onInputChange(event: Event) {
  draftUrl.value = (event.target as HTMLInputElement).value
}

watch(() => app.curResume.url, (url) => {
  draftUrl.value = url
  if (selectedResume.value?.url !== url)
    selectedResume.value = { ...app.curResume }
})

const filteredResume = computed<ResumeItem[]>(() => {
  const query = draftUrl.value.trim().toLowerCase().replace(/\s+/g, '')
  if (!query)
    return app.usedResumes.filter(resume => resume.url)

  return app.usedResumes.filter((resume) => {
    const title = resume.title?.toLowerCase().replace(/\s+/g, '') || ''
    const url = resume.url.toLowerCase().replace(/\s+/g, '')
    return title.includes(query) || url.includes(query)
  })
})

async function load(resume: ResumeItem = { url: draftUrl.value }) {
  const loaded = await editor.goToResume(resume)
  if (loaded) {
    draftUrl.value = app.curResume.url
    emit('loaded')
  }
  return loaded
}

watch(selectedResume, async (resume) => {
  if (!resume)
    return
  draftUrl.value = resume.url
  if (resume.url !== app.curResume.url)
    await load(resume)
})

defineExpose({ load })
</script>

<template>
  <Combobox v-model="selectedResume" nullable by="url">
    <div class="resume-source-input">
      <ComboboxLabel class="sr-only">
        {{ t('resume_source.label') }}
      </ComboboxLabel>
      <div class="resume-source-input__field">
        <ComboboxInput
          class="resume-source-input__control"
          :display-value="displayValue"
          :placeholder="t('home.address_placeholder')"
          :aria-label="t('resume_source.label')"
          autocomplete="url"
          @change="onInputChange"
          @keydown.enter.prevent="load()"
        />
        <ComboboxButton
          class="resume-source-input__history"
          :aria-label="t('command.group.recent')"
        >
          <div i-ri-history-line aria-hidden="true" />
        </ComboboxButton>
      </div>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <ComboboxOptions
          class="resume-source-input__options"
          :aria-label="t('resume_source.recent_title')"
        >
          <li class="resume-source-input__header" role="presentation">
            <strong>{{ t('resume_source.recent_title') }}</strong>
            <span>{{ t('resume_source.recent_description') }}</span>
          </li>

          <li
            v-if="filteredResume.length === 0"
            class="resume-source-input__empty"
            role="presentation"
          >
            {{ t('not-found') }}
          </li>

          <ComboboxOption
            v-for="resume in filteredResume"
            :key="resume.url"
            v-slot="{ active, selected }"
            as="template"
            :value="resume"
          >
            <li
              class="resume-source-input__option"
              :class="{ 'is-active': active, 'is-selected': selected }"
            >
              <span class="resume-source-input__option-text">
                <strong>{{ resume.title || t('resume_source.untitled') }}</strong>
                <span :title="resume.url">{{ resume.url }}</span>
              </span>
              <span
                v-if="selected"
                class="resume-source-input__selected"
                aria-hidden="true"
              >
                <span i-ri-check-line />
              </span>
              <button
                v-if="!resumeExamples.some(example => example.url === resume.url)"
                type="button"
                class="resume-source-input__remove"
                :aria-label="`${t('command.remove_recent')}: ${resume.title || resume.url}`"
                @click.stop.prevent="app.removeResume(resume)"
              >
                <div i-ri-close-line aria-hidden="true" />
              </button>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<style lang="scss" scoped>
.resume-source-input {
  position: relative;
  width: 100%;
}

.resume-source-input__field {
  position: relative;
}

.resume-source-input__control {
  width: 100%;
  min-height: var(--wr-control-size);
  border: 1px solid transparent;
  border-radius: var(--wr-control-radius);
  padding: 0 44px 0 14px;
  color: var(--wr-c-text);
  background: var(--wr-c-bg-soft);
  outline: none;

  &:focus-visible {
    border-color: var(--wr-c-link);
    box-shadow: 0 0 0 3px rgb(0 120 231 / 18%);
  }
}

.resume-source-input__history,
.resume-source-input__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  border-radius: 9px;
}

.resume-source-input__history {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
}

.resume-source-input__options {
  position: absolute;
  z-index: var(--overlay-z-index);
  top: calc(100% + 6px);
  width: min(520px, 100%);
  max-height: min(320px, 50vh);
  overflow-y: auto;
  border: 1px solid rgb(127 127 127 / 20%);
  border-radius: 12px;
  padding: 5px;
  background: var(--wr-c-bg);
  box-shadow: 0 16px 40px rgb(0 0 0 / 16%);
}

.resume-source-input__header {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 8px;
  margin: 0 2px 4px;
  border-bottom: 1px solid rgb(127 127 127 / 14%);
  padding: 5px 8px 7px;

  strong {
    flex: 0 0 auto;
    font-size: 12px;
    font-weight: 700;
  }

  span {
    overflow: hidden;
    color: rgb(127 127 127);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.resume-source-input__empty {
  padding: 10px;
  color: rgb(127 127 127);
  font-size: 12px;
}

.resume-source-input__option {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  border-radius: 8px;
  padding: 4px 6px 4px 10px;
  cursor: pointer;

  &.is-active {
    background: rgb(127 127 127 / 10%);
  }

  &.is-selected {
    color: var(--wr-c-link);
    background: color-mix(in srgb, var(--wr-c-link), transparent 90%);
    box-shadow: inset 3px 0 0 var(--wr-c-link);
  }

  &.is-active.is-selected {
    background: color-mix(in srgb, var(--wr-c-link), transparent 84%);
  }
}

.resume-source-input__option-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;

  strong,
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.25;
  }

  span {
    font-size: 11px;
    line-height: 1.25;
    opacity: 0.72;
  }
}

.resume-source-input__selected {
  display: inline-flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  flex: 0 0 20px;
}
</style>
