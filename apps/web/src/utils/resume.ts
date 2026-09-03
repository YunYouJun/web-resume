import type { UserInfo } from 'web-resume/config'
import type { ResumeInfo, ResumeItem, ResumeSection, ResumeTemplateId } from '~/types'

import {
  defaultResumeTemplateId,
  getResumeRoute,
  getResumeRouteSource,
} from '~/data/resume-catalog'

export { resumeExamples } from '~/data/resume-catalog'

const resumeSectionKeys = new Set<ResumeSection>([
  'education',
  'project',
  'certificate',
  'skill',
  'work',
  'other',
])

const imageFileExtension = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)(?:[?#].*)?$/i

/**
 * Distinguishes image sources from Iconify names used by resume item logos.
 * SVG is handled as a regular image source, including relative and remote URLs.
 */
export function isImageLogo(logo: string) {
  const source = logo.trim()

  return /^(?:https?:)?\/\//i.test(source)
    || /^(?:data:image\/|blob:)/i.test(source)
    || /^\.{0,2}\//.test(source)
    || imageFileExtension.test(source)
}

/**
 * Reorders top-level resume sections without serializing the YAML again, so
 * comments and hand-written formatting remain intact.
 */
export function reorderResumeSectionBlocks(source: string, order: ResumeSection[]) {
  const topLevelKey = /^([a-z_][\w-]*):[^\r\n]*$/gim
  const matches = [...source.matchAll(topLevelKey)]
  const blocks = matches.map((match, index) => ({
    end: matches[index + 1]?.index ?? source.length,
    key: match[1],
    start: match.index,
  }))
  const sectionBlocks = blocks.filter(block => resumeSectionKeys.has(block.key as ResumeSection))

  if (sectionBlocks.length < 2)
    return source

  const byKey = new Map(sectionBlocks.map(block => [block.key as ResumeSection, source.slice(block.start, block.end)]))
  if (byKey.size !== sectionBlocks.length)
    return source

  const nextOrder = order.filter(section => byKey.has(section))
  for (const block of sectionBlocks) {
    const section = block.key as ResumeSection
    if (!nextOrder.includes(section))
      nextOrder.push(section)
  }

  let cursor = 0
  let result = ''
  sectionBlocks.forEach((slot, index) => {
    result += source.slice(cursor, slot.start)
    result += byKey.get(nextOrder[index])
    cursor = slot.end
  })
  result += source.slice(cursor)
  return result
}

/**
 * 获取文本内容
 * @param url
 */
export async function fetchText(url: string) {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`HTTP ${response.status}`)

  const text = await response.text()
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html') || /^\s*<!doctype html/i.test(text))
    throw new Error('The resume URL returned HTML instead of YAML')

  return text
}

/**
 * override sensitive info
 * @param resumeInfo
 * @param userInfo
 */
export function overrideResume(resumeInfo: ResumeInfo, userInfo: UserInfo) {
  if (resumeInfo && resumeInfo.contact && userInfo.name) {
    if (resumeInfo.basics.name)
      resumeInfo.basics.name = userInfo.name

    if (resumeInfo.contact.phone && userInfo.phone) {
      resumeInfo.contact.phone.label = userInfo.phone
      resumeInfo.contact.phone.href = `tel:${userInfo.phone}`
    }

    if (resumeInfo.contact.email && userInfo.email) {
      resumeInfo.contact.email.label = userInfo.email
      resumeInfo.contact.email.href = `mailto:${userInfo.email}`
    }
  }
  return resumeInfo
}

/**
 * 获取预览链接
 */
export function getPreviewUrl(source: ResumeItem | string, type: 'url' | 'route' = 'url', template: ResumeTemplateId = defaultResumeTemplateId) {
  const route = getResumeRoute(
    template,
    typeof source === 'string' ? { type: 'url', url: source } : getResumeRouteSource(source),
    'preview',
  )
  const previewUrl = new URL(route, window.location.origin)

  switch (type) {
    case 'route':
      return previewUrl.pathname + previewUrl.search
    case 'url':
    default:
      return previewUrl.toString()
  }
}
