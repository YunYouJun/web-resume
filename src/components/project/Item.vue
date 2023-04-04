<script lang="ts" setup>
import type { ProjectSet } from '~/types/base'

const props = defineProps<{
  set: ProjectSet
}>()

/**
 * get repo star
 */
async function getRepoStars(repo: string) {
  const data = await fetch(`https://api.github.com/repos/${repo}`).then(res => res.json())
  return data.stargazers_count
}

const stars = ref(0)

onMounted(async () => {
  if (props.set.repo)
    stars.value = await getRepoStars(props.set.repo)
})
</script>

<template>
  <details
    :key="set.name"
    :open="set.open ?? true"
  >
    <summary>
      <iconify-icon :icon="set.logo" />
      <span class="project-name font-bold">
        {{ set.name }}
      </span>
      <span>
        {{ `，${set.type}` }}
      </span>
      <a v-if="set.repo" :href="`https://github.com/${set.repo}`" target="_blank" class="repo-star" m="l-2">
        <div class="inline-block align-sub" i-ri-github-line />
        <span v-if="stars" class="count">{{ stars }}</span>
      </a>
      <span class="float-right">
        {{ `${set.start} ~ ${set.end}` }}
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
              <img :src="keyword.logo" class="brand-favicon">
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
            <img :src="badge" :alt="name.toString()">
          </span>
        </template>
        <span v-html="set.summary" />
      </div>
      <ul v-if="set.highlights" class="list-disc mb-2">
        <li
          v-for="highlight in set.highlights"
          :key="highlight"
          v-html="highlight"
        />
        <!-- {{ highlight }} -->
      </ul>
    </div>
  </details>
  <hr class="mx-3">
</template>

<style lang="scss">
a.repo-star {
  color: var(--wr-c-text);

  .count {
    margin-left: 2px;
  }
}
</style>
