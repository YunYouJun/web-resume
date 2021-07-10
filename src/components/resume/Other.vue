<template>
  <div v-if="other">
    <base-title :icon="other.icon" :title="other.title" />
    <ul class="list-disc">
      <li v-for="(info, index) in other.info" :key="index">
        {{ info }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Other } from '~/types/base'

export default defineComponent({
  props: {
    other: {
      type: Object as PropType<Other | null>,
      default: null,
    },
  },
})
</script>
