<script lang="ts" setup>
import type { Skill } from '~/types/base'

const props = defineProps<{ skill: Skill }>()
const { skill } = toRefs(props)
</script>

<template>
  <div v-if="skill">
    <base-title :icon="skill.icon" :title="skill.title" />
    <div>
      <ul>
        <li v-for="(sets, index) in skill.sets" :key="index">
          <span v-if="sets.title">{{ sets.title }}：</span>
          <span v-for="set in sets.keywords" :key="set.name">
            <iconify-icon v-if="set.icon" :icon="set.icon" />
            <img v-if="set.logo" :src="set.logo" class="brand-favicon">
            {{ set.name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
