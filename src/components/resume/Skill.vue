<template>
  <div v-if="skill">
    <base-title :icon="skill.icon" :title="skill.title" />
    <div>
      <ul>
        <li v-for="(sets, index) in skill.sets" :key="index">
          {{ sets.title }}：
          <span v-for="set in sets.keywords" :key="set.name">
            <iconify-icon v-if="set.icon" :icon="set.icon" />
            <img v-if="set.logo" :src="set.logo" class="brand-favicon" />
            {{ set.name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Skill } from '../../types/base'

export default defineComponent({
  props: {
    skill: Object as PropType<Skill>,
  },
})
</script>
