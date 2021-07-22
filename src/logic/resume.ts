/**
 * 获取简历文本内容
 * @param url
 */
export async function useResume(url: string) {
  if (!url) {
    url = '/resume/2021.resume.yml'
  }
  const txt = await fetch(url).then((res) => {
    return res.text()
  })
  return txt
}
