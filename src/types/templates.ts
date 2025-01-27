/**
 * 简历模板类型
 */

export interface TemplateItem {
  /**
   * 模板类型
   *
   * - job: 求职简历模板
   * - date: 相亲简历模板
   */
  type: 'job' | 'date'
  /**
   * 模板 ID
   */
  id: string
  /**
   * 模板名称
   */
  name: string
  /**
   * 模板描述
   */
  description?: string
  /**
   * 标签
   */
  tags?: string[]
}
