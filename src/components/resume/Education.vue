<template>
  <div v-if="education">
    <base-title :icon="education.icon" :title="education.title" />
    <div>
      <div
        v-for="(edu, index) in education.histories"
        :key="index"
        class="mb-2"
      >
        <div>
          <img v-if="edu.logo" class="school-logo" :src="edu.logo" />
          <span class="mr-1" v-else-if="edu.icon">
            <iconify-icon :icon="edu.icon" />
          </span>
          <span>
            <strong>{{ edu.school }}</strong>
            <iconify-icon class="position-icon" icon="ri:map-pin-line" />
            {{ edu.city }}
          </span>
          <span class="float-right">
            {{ edu.start + ' ~ ' + edu.end }}
          </span>
        </div>
        <div>
          <span>{{ edu.studyType }}</span
          >， <span>{{ edu.area }}</span>
          <span v-if="edu.grade">，{{ edu.grade }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Education } from '../../types/base'
import IconifyIcon from '../IconifyIcon.vue'

export default defineComponent({
  components: { IconifyIcon },
  props: {
    education: Object as PropType<Education>,
  },
})
</script>

<style lang="scss">
.school-logo {
  width: 22px;
  padding-bottom: 3px;
  margin-right: 5px;
}

.position-icon {
  margin-left: 10px;
}
</style>
