import type { ResumeItem } from './resume'

export const resumeTemplateIds = ['classic', 'sidebar', 'compact'] as const
export const resumeExampleIds = [
  'neutral',
  'engineer',
  'product',
  'graduate',
  'intern',
  'developer',
  'designer',
  'personal',
  'suzumiya',
] as const
export const resumeTemplateCategories = ['universal', 'professional', 'creative'] as const
export const resumeExampleCategories = ['universal', 'career', 'student', 'creator', 'playful'] as const

export type ResumeTemplateId = typeof resumeTemplateIds[number]
export type ResumeExampleId = typeof resumeExampleIds[number]
export type ResumeTemplateCategory = typeof resumeTemplateCategories[number]
export type ResumeExampleCategory = typeof resumeExampleCategories[number]

export type ResumeRouteSource
  = | { type: 'current' }
    | { id: ResumeExampleId, type: 'example' }
    | { type: 'url', url: string }

export interface ResumeTemplateDefinition {
  category: ResumeTemplateCategory
  descriptionKey: string
  id: ResumeTemplateId
  nameKey: string
  tagKeys: string[]
}

export interface ResumeExampleDefinition extends ResumeItem {
  category: ResumeExampleCategory
  descriptionKey: string
  id: ResumeExampleId
  nameKey: string
  noticeKey?: string
  tagKeys: string[]
}
