import { Contact, Education, Skill, Project, Other, Certificate } from './base'

/**
 * 简历配置
 */
export interface ResumeInfo {
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
  }

  /**
   * 联系方式
   */
  contact: Contact
  education: Education
  skill: Skill
  project: Project
  other: Other
  certificate: Certificate
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
