import type { ResumeItem } from '~/types'

/**
 * 获取文本内容
 * @param url
 */
export async function fetchText(url: string) {
  const txt = await fetch(url).then(res => res.text())
  return txt
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
