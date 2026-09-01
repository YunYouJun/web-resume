import type { UserInfo } from 'web-resume/config'
import type { ResumeInfo, ResumeItem } from '~/types'

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

export const resumeExamples: ResumeItem[] = [
  {
    // name: t('noun.suzimiya'),
    title: '示例：涼宮ハルヒ',
    url: '/resume/suzumiya.resume.yml',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/public/resume/suzumiya.resume.yml',
  },
  {
    // name: `${t('noun.worker')}`,
    title: '示例：打工人',
    url: 'https://fastly.jsdelivr.net/gh/YunYouJun/web-resume/src/assets/resume/local.resume.yml',
    href: 'https://github.com/YunYouJun/web-resume/blob/main/src/assets/resume/local.resume.yml',
  },
]

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
export function getPreviewUrl(url: string, type: 'url' | 'route' = 'url') {
  const previewUrl = new URL('/', window.location.origin)
  previewUrl.searchParams.append('url', url)
  previewUrl.searchParams.append('mode', 'preview')

  switch (type) {
    case 'route':
      return previewUrl.pathname + previewUrl.search
    case 'url':
    default:
      return previewUrl.toString()
  }
}
