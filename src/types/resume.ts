import type { Certificate, Contact, Education, Other, Project, Skill } from './base'

export interface ResumeItem {
  id?: string
  title?: string
  /**
   * raw text url
   */
  url: string
  /**
   * raw href
   */
  href?: string
}

/**
 * 简历配置
 */
export interface ResumeInfo {
  name?: string

  basics: {
    /**
     * 姓名
     */
    name: string
    label?: string
    bio?: string
    sex?: string
    birth?: string
    location?: string
    avatar?: string
    /**
     * 年龄
     *
     * @example
     * 18
     */
    age?: number | string
  }

  /**
   * 联系方式
   */
  contact: Contact
  education?: Education
  skill?: Skill
  project?: Project
  certificate?: Certificate
  other?: Other
  /**
   * 页脚
   */
  footer?: {
    /**
     * 链接
     */
    link: string
  }
}
