<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const props = defineProps<{ msg: string }>()

const { t } = useI18n()
</script>

<template>
  <div text="center">
    <h1 class="text-6xl font-light leading-normal">
      {{ props.msg }}
    </h1>
    <small text-base op="60">
      {{ t('home.description') }}</small>
  </div>
</template>
