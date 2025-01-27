<script setup lang="ts">
import type { TemplateItem } from '../types/templates'

const templates = ref<TemplateItem[]>([
  {
    type: 'job',
    id: 'job-minimal',
    name: '工作简历-极简风格',
    description: '极简风格的工作简历，样式参考自 billryan/resume',
    tags: ['work', 'minimal'],
  },
  {
    type: 'date',
    id: 'blind-date',
    name: '相亲简历',
    description: '相亲简历模板',
    tags: ['date'],
  },
])
</script>

<template>
  <div grid="~ md:cols-4 gap-4" class="p-4">
    <!-- <div></div> -->
    <ResumeTemplate v-for="template in templates" :key="template.id" :template="template" />
  </div>
</template>
