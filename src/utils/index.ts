export const isClient = typeof window !== 'undefined'

/**
 * 是否为生产环境
 */
export const isProd = import.meta.env.PROD

/**
 * 休眠函数
 * @param ms
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

/**
 * 加载脚本
 * @param url 脚本链接
 * @returns
 */
export async function getScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      reject(Error('Script 加载失败'))
    }
    script.src = url
    document.body.appendChild(script)
  })
}
