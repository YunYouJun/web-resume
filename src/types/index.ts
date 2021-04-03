import { Contact, Education, Skill, Project, Other, Certificate } from './base'
import * as Resume from './config'

/**
 * 简历配置
 */
export interface ResumeInfo {
  /**
   * 姓名
   */
  name: string
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
  footer?: string
}
