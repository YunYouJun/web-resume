import type {
  ResumeExampleDefinition,
  ResumeExampleId,
  ResumeRouteSource,
  ResumeTemplateDefinition,
  ResumeTemplateId,
} from '~/types/templates'
import { resumeExampleIds, resumeTemplateIds } from '~/types/templates'

export const defaultResumeTemplateId: ResumeTemplateId = 'classic'
export const defaultResumeExampleId: ResumeExampleId = 'neutral'

export const resumeTemplates: ResumeTemplateDefinition[] = [
  {
    category: 'universal',
    descriptionKey: 'template_market.templates.classic.description',
    id: 'classic',
    nameKey: 'template_market.templates.classic.name',
    tagKeys: [
      'template_market.tags.single_column',
      'template_market.tags.universal',
      'template_market.tags.ats_friendly',
    ],
  },
  {
    category: 'creative',
    descriptionKey: 'template_market.templates.sidebar.description',
    id: 'sidebar',
    nameKey: 'template_market.templates.sidebar.name',
    tagKeys: [
      'template_market.tags.two_column',
      'template_market.tags.distinctive',
      'template_market.tags.personalized',
    ],
  },
  {
    category: 'professional',
    descriptionKey: 'template_market.templates.compact.description',
    id: 'compact',
    nameKey: 'template_market.templates.compact.name',
    tagKeys: [
      'template_market.tags.single_page',
      'template_market.tags.dense',
      'template_market.tags.ats_friendly',
    ],
  },
]

export const resumeExampleCatalog: ResumeExampleDefinition[] = [
  {
    category: 'universal',
    descriptionKey: 'template_market.examples.neutral.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/neutral.resume.yml',
    id: 'neutral',
    nameKey: 'template_market.examples.neutral.name',
    tagKeys: [
      'template_market.tags.balanced',
      'template_market.tags.complete',
    ],
    title: '示例：通用演示数据',
    url: '/resume/neutral.resume.yml',
  },
  {
    category: 'career',
    descriptionKey: 'template_market.examples.engineer.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/engineer.resume.yml',
    id: 'engineer',
    nameKey: 'template_market.examples.engineer.name',
    tagKeys: [
      'template_market.tags.experienced',
      'template_market.tags.projects',
    ],
    title: '示例：软件工程师',
    url: '/resume/engineer.resume.yml',
  },
  {
    category: 'career',
    descriptionKey: 'template_market.examples.product.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/product.resume.yml',
    id: 'product',
    nameKey: 'template_market.examples.product.name',
    tagKeys: [
      'template_market.tags.product_strategy',
      'template_market.tags.metrics',
    ],
    title: '示例：产品经理',
    url: '/resume/product.resume.yml',
  },
  {
    category: 'student',
    descriptionKey: 'template_market.examples.graduate.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/graduate.resume.yml',
    id: 'graduate',
    nameKey: 'template_market.examples.graduate.name',
    tagKeys: [
      'template_market.tags.campus',
      'template_market.tags.projects',
    ],
    title: '示例：应届学生',
    url: '/resume/graduate.resume.yml',
  },
  {
    category: 'student',
    descriptionKey: 'template_market.examples.intern.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/intern.resume.yml',
    id: 'intern',
    nameKey: 'template_market.examples.intern.name',
    tagKeys: [
      'template_market.tags.internship',
      'template_market.tags.skills_first',
    ],
    title: '示例：实习申请者',
    url: '/resume/intern.resume.yml',
  },
  {
    category: 'creator',
    descriptionKey: 'template_market.examples.developer.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/developer.resume.yml',
    id: 'developer',
    nameKey: 'template_market.examples.developer.name',
    tagKeys: [
      'template_market.tags.open_source',
      'template_market.tags.projects',
    ],
    title: '示例：开源开发者',
    url: '/resume/developer.resume.yml',
  },
  {
    category: 'creator',
    descriptionKey: 'template_market.examples.designer.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/designer.resume.yml',
    id: 'designer',
    nameKey: 'template_market.examples.designer.name',
    tagKeys: [
      'template_market.tags.portfolio',
      'template_market.tags.visual_story',
    ],
    title: '示例：独立设计师',
    url: '/resume/designer.resume.yml',
  },
  {
    category: 'playful',
    descriptionKey: 'template_market.examples.personal.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/personal.resume.yml',
    id: 'personal',
    nameKey: 'template_market.examples.personal.name',
    tagKeys: [
      'template_market.tags.profile',
      'template_market.tags.interests',
    ],
    title: '示例：个人档案',
    url: '/resume/personal.resume.yml',
  },
  {
    category: 'playful',
    descriptionKey: 'template_market.examples.suzumiya.description',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/apps/web/public/resume/suzumiya.resume.yml',
    id: 'suzumiya',
    nameKey: 'template_market.examples.suzumiya.name',
    noticeKey: 'template_market.examples.suzumiya.notice',
    tagKeys: [
      'template_market.tags.complete',
      'template_market.tags.playful',
    ],
    title: '示例：涼宮ハルヒ',
    url: '/resume/suzumiya.resume.yml',
  },
]

export const resumeExamples = resumeExampleCatalog.map(example => ({
  href: example.href,
  id: example.id,
  title: example.title,
  url: example.url,
}))

export function resolveResumeTemplateId(value: unknown): ResumeTemplateId {
  const id = Array.isArray(value) ? value[0] : value
  return resumeTemplateIds.includes(id as ResumeTemplateId)
    ? id as ResumeTemplateId
    : defaultResumeTemplateId
}

export function resolveResumeExampleId(value: unknown): ResumeExampleId | undefined {
  const id = Array.isArray(value) ? value[0] : value
  return resumeExampleIds.includes(id as ResumeExampleId)
    ? id as ResumeExampleId
    : undefined
}

export function isResumeTemplateId(value: unknown): value is ResumeTemplateId {
  return resumeTemplateIds.includes(value as ResumeTemplateId)
}

export function getResumeTemplate(id: ResumeTemplateId) {
  return resumeTemplates.find(template => template.id === id)!
}

export function getResumeExample(id: ResumeExampleId) {
  return resumeExampleCatalog.find(example => example.id === id)!
}

export function getResumeRoute(
  templateId: ResumeTemplateId,
  source: ResumeRouteSource,
  mode?: 'preview',
) {
  const query = new URLSearchParams({ template: templateId })
  if (source.type === 'example')
    query.set('example', source.id)
  else if (source.type === 'url')
    query.set('url', source.url)
  if (mode)
    query.set('mode', mode)
  return `/?${query.toString()}`
}

export function getResumeRouteSource(resume: { id?: string, url: string }): ResumeRouteSource {
  const exampleId = resolveResumeExampleId(resume.id)
  const example = exampleId ? getResumeExample(exampleId) : undefined
  if (exampleId && example?.url === resume.url)
    return { id: exampleId, type: 'example' }
  return { type: 'url', url: resume.url }
}
