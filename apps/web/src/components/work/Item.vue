<script lang="ts" setup>
import type { ProjectSet } from '~/types/base'
import { sanitizeResumeHref, sanitizeResumeHtml, sanitizeResumeImageSource } from '~/utils'
import { isImageLogo } from '~/utils/resume'

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
      <img v-if="isImageLogo(set.logo) && sanitizeResumeImageSource(set.logo)" :src="sanitizeResumeImageSource(set.logo)" :alt="`${set.name} logo`" class="brand-favicon">
      <iconify-icon v-else :icon="set.logo" />
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
      <span class="float-right text-xs font-serif">
        {{ [set.start, set.end].filter(Boolean).join(set.start && set.end ? ' ~ ' : '') }}
      </span>
    </summary>
    <div class="project-content">
      <div v-if="set.keywords" class="resume-project-keywords" op="80" m="l-3 y-1">
        <span
          v-for="(keyword, index) in set.keywords" :key="index"
          border="1px solid black" rounded-full p="x-6px y-2px"
          text="xs"
          inline-flex justify="center" items="center"
          scale-92
        >
          <span v-if="typeof keyword === 'string'">
            {{ keyword }}
          </span>
          <span v-else>
            <span v-if="keyword.icon" mr="1">
              <iconify-icon :icon="keyword.icon" />
            </span>
            <span v-else-if="keyword.logo">
              <img :src="sanitizeResumeImageSource(keyword.logo)" class="brand-favicon">
            </span>
            <span>
              {{ keyword.name }}
            </span>
          </span>
        </span>
        <span class="float-right">
          <a class="text-decoration-none" :href="sanitizeResumeHref(set.url)" target="_blank" rel="noopener noreferrer">
            {{ set.url }}
          </a>
        </span>
      </div>

      <div class="ml-3 my-1">
        <template v-if="set.badges">
          <span v-for="(badge, name) in set.badges" :key="name" class="mr-1">
            <img :src="sanitizeResumeImageSource(badge)" :alt="name.toString()">
          </span>
        </template>
        <span v-html="sanitizeResumeHtml(set.summary)" />
      </div>
      <ul v-if="set.highlights" class="list-disc mb-2">
        <li
          v-for="highlight in set.highlights"
          :key="highlight"
          v-html="sanitizeResumeHtml(highlight)"
        />
        <!-- {{ highlight }} -->
      </ul>
    </div>
  </details>
  <hr last:hidden>
</template>

<style lang="scss">
a.repo-star {
  color: var(--wr-c-text);

  .count {
    margin-left: 2px;
  }
}
</style>
