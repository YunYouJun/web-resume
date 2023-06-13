/**
 * 获取文本内容
 * @param url
 */
export async function fetchText(url: string) {
  const txt = await fetch(url).then(res => res.text())
  return txt
}

export const resumeExamples = computed(() => {
  return [
    {
      id: 'worker',
      // name: `${t('noun.worker')}`,
      url: 'https://fastly.jsdelivr.net/gh/YunYouJun/web-resume/src/assets/resume/local.resume.yml',
      href: 'https://github.com/YunYouJun/web-resume/blob/main/src/assets/resume/local.resume.yml',
    },
    {
      id: 'suzimiya',
      // name: t('noun.suzimiya'),
      url: '/resume/suzumiya.resume.yml',
      href: 'https://github.com/YunYouJun/web-resume/blob/main/public/resume/suzumiya.resume.yml',
    },
  ]
})
