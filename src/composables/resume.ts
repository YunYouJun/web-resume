/**
 * 获取简历文本内容
 * @param url
 */
export async function useResume(url: string) {
  const txt = await fetch(url).then(res => res.text())
  return txt
}
