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
      <div>
        <div class="ml-3">
          <span v-for="(keyword, index) in set.keywords" :key="index">
            <img src="" />
            <span v-if="keyword.icon">
              <iconify-icon :icon="keyword.icon" />
              {{ keyword.name }}
            </span>
            <span v-else-if="keyword.logo">
              <img :src="keyword.logo" class="brand-favicon" />
              {{ keyword.name }}
            </span>
            <span v-else>
              {{ keyword }}
            </span>
            <span v-if="index !== set.keywords.length - 1">, </span>
          </span>
          <span class="float-right">
            <a class="text-decoration-none" :href="set.url" target="_blank">
              {{ set.url }}
            </a>
          </span>
        </div>

        <div class="ml-3 my-1">
          <template v-if="set.badges">
            <span class="mr-1" v-for="(badge, name) in set.badges" :key="name">
              <img :src="badge" :alt="name" />
            </span>
          </template>
          <span v-html="set.summary"></span>
        </div>
        <ul class="mb-2">
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

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Keyword {
  icon: string
  logo: string
  name: string
}

interface Badge {}

interface ProjectSet {
  logo: string
  url: string
  badges: Badge[]
  summary: string
  name: string
  type: string
  keywords: Keyword[]
  highlights: string[]
  start: string
  end: string
}

interface Project {
  icon: string
  title: string
  sets: ProjectSet[]
}

export default defineComponent({
  props: {
    project: Object as PropType<Project>,
  },
})
</script>

<style lang="scss">
.project-name {
  margin-left: 4px;
}
</style>
