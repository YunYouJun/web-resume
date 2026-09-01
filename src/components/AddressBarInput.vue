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
  await load(resume)
})

defineExpose({ load })
</script>

<template>
  <Combobox v-model="selectedResume" nullable>
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
        <ComboboxOptions class="resume-source-input__options">
          <div
            v-if="filteredResume.length === 0"
            class="resume-source-input__empty"
          >
            {{ t('not-found') }}
          </div>

          <ComboboxOption
            v-for="resume in filteredResume"
            :key="resume.url"
            v-slot="{ active }"
            as="template"
            :value="resume"
          >
            <li
              class="resume-source-input__option"
              :class="{ 'is-active': active }"
            >
              <span class="resume-source-input__option-text">
                <strong v-if="resume.title">{{ resume.title }}</strong>
                <span>{{ resume.url }}</span>
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
  top: 4px;
  right: 4px;
}

.resume-source-input__options {
  position: absolute;
  z-index: var(--overlay-z-index);
  top: calc(100% + 6px);
  width: 100%;
  max-height: min(320px, 50vh);
  overflow-y: auto;
  border: 1px solid rgb(127 127 127 / 20%);
  border-radius: 12px;
  padding: 6px;
  background: var(--wr-c-bg);
  box-shadow: 0 16px 40px rgb(0 0 0 / 16%);
}

.resume-source-input__empty {
  padding: 14px;
  color: rgb(127 127 127);
}

.resume-source-input__option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  border-radius: 8px;
  padding: 7px 8px 7px 12px;
  cursor: pointer;

  &.is-active {
    color: white;
    background: var(--wr-c-link);
  }
}

.resume-source-input__option-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;

  span {
    overflow: hidden;
    font-size: 12px;
    opacity: 0.72;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
