<script lang="ts" setup>
import type { ResumeItem } from '~/types'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { computed, ref } from 'vue'

import { fetchText } from '~/utils'

const app = useAppStore()
const editor = useEditorStore()

async function onEnterUrl() {
  if (app.curResume.url) {
    const text = await fetchText(app.curResume.url)
    editor.setResumeText(text)
  }
}

const selectedResume = ref(app.usedResumes[0])

function onChange(e: Event & {
  target: HTMLInputElement
}) {
  app.queryStr = e.target?.value
}

/**
 * @description 过滤后的简历列表
 */
const filteredResume = computed<ResumeItem[]>(() => {
  if (!app.queryStr)
    return app.usedResumes.slice(1)

  return [{ url: app.queryStr }].concat(app.usedResumes.filter((r) => {
    let inTitle = false

    const simpleQueryStr = app.queryStr.toLowerCase().replace(/\s+/g, '')

    if (r.title) {
      inTitle = r.title
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(simpleQueryStr)
    }

    return r.url
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(simpleQueryStr) || inTitle
  }))
})

function displayValue(resume: any) {
  if (resume && resume.url)
    return resume.url

  return app.curResume.url
}

/**
 * @description 监听简历选择
 */
watch(selectedResume, () => {
  app.setNewResume(selectedResume.value)
  editor.goToResume(selectedResume.value)
})
</script>

<template>
  <Combobox v-model="selectedResume">
    <div w="full" relative>
      <div
        class="relative w-full cursor-default overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
      >
        <ComboboxInput
          class="w-full border-none py-2 pl-9 pr-18 text-sm leading-5 focus:ring-0 outline-none focus:(border-blue-500 border-solid)) dark:border-gray-700"
          :display-value="displayValue"
          border-1px
          inline-flex justify="center" items="center"
          bg="gray-200 dark:warm-gray-800" rounded-full
          w="full"
          text="sm gray-700 dark:light-200"
          @change="onChange"
          @enter="onEnterUrl"
        />
        <ComboboxButton
          class="absolute inset-y-0 left-3 flex items-center pr-2"
        >
          <div
            i-ri-eye-line
            class="text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="app.queryStr = ''"
      >
        <ComboboxOptions
          z-999
          bg="white dark:gray-700"
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredResume.length === 0 && app.queryStr !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700 dark:white"
          >
            Nothing found.
          </div>

          <ComboboxOption
            v-for="resume in filteredResume"
            :key="resume.url"
            v-slot="{ selected, active }"
            as="template"
            :value="resume"
          >
            <li
              flex
              class="relative cursor-default select-none py-2 pl-4 pr-4"
              :class="{
                'bg-blue-600 text-white': active,
                'text-gray-900 dark:text-light-200': !active,
              }"
            >
              <span
                v-if="resume.title"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >{{ resume.title }}</span>
              <span v-if="resume.title" mx="2">-</span>
              <span class="block truncate" op="80">
                {{ resume.url }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-3 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-teal-600': !active }"
              >
                <div i-ri-check-line class="h-5 w-5" aria-hidden="true" />
              </span>

              <span
                v-if="active"
                class="absolute inset-y-0 right-8 p-1"
                :class="{ 'text-white': active }"
                inline-flex justify="center" items="center"
                op="80"
                cursor="pointer"
              >
                <div hover="bg-gray" rounded-full inline-flex justify="center" p="1" @click="app.removeResume(resume)">
                  <div i-ri-close-line aria-hidden="true" />
                </div>
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>
