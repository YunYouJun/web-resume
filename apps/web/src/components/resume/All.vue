<script lang="ts" setup>
import type { ResumeInfo, ResumeSection, ResumeTemplateId } from '~/types'

import ResumeCertificate from '~/components/resume/Certificate.vue'
import ResumeEducation from '~/components/resume/Education.vue'
import ResumeInterests from '~/components/resume/Interests.vue'
import ResumeLanguages from '~/components/resume/Languages.vue'
import ResumeOther from '~/components/resume/Other.vue'
import ResumeProject from '~/components/resume/Project.vue'
import ResumePublications from '~/components/resume/Publications.vue'
import ResumeReferences from '~/components/resume/References.vue'
import ResumeSkill from '~/components/resume/Skill.vue'
import ResumeVolunteer from '~/components/resume/Volunteer.vue'
import ResumeWork from '~/components/resume/Work.vue'

const props
  = defineProps<{
    editable?: boolean
    resume: ResumeInfo
    templateId?: ResumeTemplateId
  }>()

const emit = defineEmits<{
  reorder: [order: ResumeSection[]]
}>()

const app = useAppStore()
const resolvedTemplateId = computed(() => props.templateId || app.resumeTemplateId)

const resumeComponents: ResumeSection[] = [
  'education',
  'project',
  'certificate',
  'skill',
  'work',
  'volunteer',
  'publications',
  'languages',
  'interests',
  'references',
  'other',
]

const resumeMap: Record<string, any> = {
  education: ResumeEducation,
  project: ResumeProject,
  certificate: ResumeCertificate,
  skill: ResumeSkill,
  work: ResumeWork,
  volunteer: ResumeVolunteer,
  publications: ResumePublications,
  languages: ResumeLanguages,
  interests: ResumeInterests,
  references: ResumeReferences,
  other: ResumeOther,
}

const { resume } = toRefs(props)

const draggedSection = ref<ResumeSection>()
const dragOverSection = ref<ResumeSection>()

const compOrder = computed(() => {
  const order = Object.keys(props.resume).filter(type =>
    resumeComponents.includes(type as ResumeSection),
  )
  return order as ResumeSection[]
})

const resumeArr = computed(() => {
  const arr: {
    component: any
    props: any
    attr: ResumeSection
  }[] = []
  compOrder.value.forEach((type) => {
    arr.push({
      attr: type,
      component: resumeMap[type],
      props: resume.value[type],
    })
  })

  return arr
})

function moveSection(section: ResumeSection, offset: number) {
  const order = compOrder.value.slice()
  const from = order.indexOf(section)
  const to = from + offset
  if (from < 0 || to < 0 || to >= order.length)
    return

  order.splice(to, 0, ...order.splice(from, 1))
  emit('reorder', order)
}

function startDragging(event: DragEvent, section: ResumeSection) {
  draggedSection.value = section
  event.dataTransfer?.setData('text/plain', section)
  if (event.dataTransfer)
    event.dataTransfer.effectAllowed = 'move'
}

function dropSection(target: ResumeSection) {
  const source = draggedSection.value
  draggedSection.value = undefined
  dragOverSection.value = undefined
  if (!source || source === target)
    return

  const order = compOrder.value.slice()
  const from = order.indexOf(source)
  const to = order.indexOf(target)
  if (from < 0 || to < 0)
    return

  order.splice(to, 0, ...order.splice(from, 1))
  emit('reorder', order)
}

function finishDragging() {
  draggedSection.value = undefined
  dragOverSection.value = undefined
}
</script>

<template>
  <div
    v-if="Object.keys(props.resume).length"
    class="resume"
    :class="`resume--${resolvedTemplateId}`"
    :data-template="resolvedTemplateId"
    data-theme="default"
  >
    <div class="resume__identity">
      <resume-header :resume="resume" />
    </div>

    <div class="resume__content">
      <section
        v-for="(r, index) in resumeArr"
        :key="r.attr"
        class="resume-section mt-3"
        :class="{
          'resume-section--editable': editable,
          'resume-section--dragging': draggedSection === r.attr,
          'resume-section--drag-over': dragOverSection === r.attr,
        }"
        :aria-label="r.props?.title || r.attr"
        @dragenter.prevent="editable && (dragOverSection = r.attr)"
        @dragover.prevent
        @drop.prevent="editable && dropSection(r.attr)"
      >
        <div v-if="editable" class="resume-section__controls" data-html2canvas-ignore="true">
          <button
            type="button"
            class="resume-section__control resume-section__drag-handle"
            draggable="true"
            :aria-label="$t('resume_editor.drag_section', { title: r.props?.title || r.attr })"
            @dragstart.stop="startDragging($event, r.attr)"
            @dragend="finishDragging"
          >
            <span i-ri-drag-move-2-line aria-hidden="true" />
          </button>
          <button
            type="button"
            class="resume-section__control"
            :disabled="index === 0"
            :aria-label="$t('resume_editor.move_up', { title: r.props?.title || r.attr })"
            @click="moveSection(r.attr, -1)"
          >
            <span i-ri-arrow-up-line aria-hidden="true" />
          </button>
          <button
            type="button"
            class="resume-section__control"
            :disabled="index === resumeArr.length - 1"
            :aria-label="$t('resume_editor.move_down', { title: r.props?.title || r.attr })"
            @click="moveSection(r.attr, 1)"
          >
            <span i-ri-arrow-down-line aria-hidden="true" />
          </button>
        </div>

        <keep-alive>
          <Component
            :is="r.component"
            :[r.attr]="r.props"
          />
        </keep-alive>
      </section>

      <resume-footer v-if="resume.footer" :footer="resume.footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resume-section--editable {
  position: relative;
  border: 1px dashed transparent;
  border-radius: 6px;
  transition: border-color 0.15s ease, opacity 0.15s ease, background-color 0.15s ease;
}

.resume-section--editable:hover,
.resume-section--editable:focus-within,
.resume-section--drag-over {
  border-color: var(--resume-template-accent);
}

.resume-section--drag-over {
  background: color-mix(in srgb, var(--resume-template-accent), transparent 94%);
}

.resume-section--dragging {
  opacity: 0.45;
}

.resume-section__controls {
  position: absolute;
  z-index: 2;
  top: 2px;
  right: 2px;
  display: flex;
  overflow: hidden;
  border: 1px solid var(--resume-theme-divider);
  border-radius: 5px;
  background: var(--wr-c-resume-bg);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.resume-section--editable:hover .resume-section__controls,
.resume-section--editable:focus-within .resume-section__controls {
  opacity: 1;
}

.resume-section__control {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  color: var(--resume-theme-strong);
  background: transparent;
}

.resume-section__control:hover:not(:disabled),
.resume-section__control:focus-visible {
  color: var(--resume-theme-on-strong);
  background: var(--resume-template-accent);
}

.resume-section__control:focus-visible {
  outline: 2px solid var(--resume-template-accent);
  outline-offset: -2px;
}

.resume-section__control:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.resume-section__drag-handle {
  cursor: grab;
}

.resume-section__drag-handle:active {
  cursor: grabbing;
}

@media print {
  .resume-section--editable {
    border: 0;
  }

  .resume-section__controls {
    display: none;
  }
}
</style>
