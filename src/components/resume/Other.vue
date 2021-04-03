<template>
  <div v-if="other">
    <base-title :icon="other.icon" :title="other.title" />
    <ul>
      <li v-for="(info, index) in other.info" :key="index">
        {{ info }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Other } from '../../types/base'

export default defineComponent({
  props: {
    other: Object as PropType<Other>,
  },
})
</script>
