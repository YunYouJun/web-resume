<template>
  <div v-if="project">
    <base-title :icon="project.icon" :title="project.title" />
    <details
      v-for="set in project.sets"
      :key="set.name"
      :open="set.open ?? true"
    >
      <summary>
        <iconify-icon :icon="set.logo" />
        <span class="project-name font-weight-bold">
          {{ set.name }}
        </span>
        <span>
          {{ '，' + set.type }}
        </span>
        <span class="float-right">
          {{ set.start + ' ~ ' + set.end }}
        </span>
      </summary>
      <div class="project-content">
        <div v-if="set.keywords" class="ml-3">
          <span v-for="(keyword, index) in set.keywords" :key="index">
            <span v-if="typeof keyword === 'string'">
              {{ keyword }}
            </span>
            <template v-else>
              <span v-if="keyword.icon">
                <iconify-icon :icon="keyword.icon" />
                {{ keyword.name }}
              </span>
              <span v-else-if="keyword.logo">
                <img :src="keyword.logo" class="brand-favicon" />
                {{ keyword.name }}
              </span>
            </template>
            <span
              v-if="set.keywords && index !== set.keywords.length - 1"
            >,
            </span>
          </span>
          <span class="float-right">
            <a class="text-decoration-none" :href="set.url" target="_blank">
              {{ set.url }}
            </a>
          </span>
        </div>

        <div class="ml-3 my-1">
          <template v-if="set.badges">
            <span v-for="(badge, name) in set.badges" :key="name" class="mr-1">
              <img :src="badge" :alt="name" />
            </span>
          </template>
          <span v-html="set.summary"></span>
        </div>
        <ul v-if="set.highlights" class="list-disc mb-2">
          <li
            v-for="highlight in set.highlights"
            :key="highlight"
            v-html="highlight"
          ></li>
          <!-- {{ highlight }} -->
        </ul>
        <hr class="mx-3" />
      </div>
    </details>
  </div>
</template>

<script lang="ts" setup>
import type { Project } from '~/types/base'

const props = defineProps<{ project: Project }>()
const { project } = toRefs(props)
</script>

<style lang="scss">
.project-name {
  margin-left: 4px;
}
</style>
