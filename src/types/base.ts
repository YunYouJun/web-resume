export interface BaseContact {
  href: string
  /**
   * 图标
   */
  icon: string
  /**
   * 显示的内容
   */
  label: string
}

/**
 * 联系方式
 */
export interface Contact {
  [key: string]: BaseContact
}

interface BaseItem {
  /**
   * 图标
   */
  icon: string
  /**
   * 标题
   */
  title: string
}

/**
 * 关键字
 */
interface Keyword {
  /**
   * 名称
   */
  name?: string
  /**
   * 图标
   */
  icon?: string
  /**
   * Logo
   */
  logo?: string
}

export interface CertificateHistory {
  /**
   * 名称
   */
  name: string
  /**
   * 地点
   */
  place: string
  /**
   * 时间
   */
  time: string | number
}

/**
 * 奖项
 */
export interface Certificate extends BaseItem {
  histories: CertificateHistory[]
}

export interface EducationHistory {
  school: string
  icon?: string
  /**
   * 学校 Logo
   */
  logo?: string
  /**
   * 开始时间
   */
  start: string
  /**
   * 结束时间
   */
  end: string
  /**
   * 成绩
   */
  grade: string
  /**
   * 专业类型
   */
  area: string
  /**
   * 类型
   */
  studyType: string
  /**
   * 城市
   */
  city: string
}

/**
 * 教育背景
 */
export interface Education extends BaseItem {
  histories: EducationHistory[]
}

/**
 * 其他
 */
export interface Other extends BaseItem {
  info: string[]
}

export interface ProjectSet {
  name: string
  logo: string
  /**
   * 是否展开
   */
  open?: boolean
  /**
   * 类型
   */
  type: string
  /**
   * 开始时间
   */
  start: string
  /**
   * 结束时间
   */
  end: string
  /**
   * 链接
   */
  url?: string
  /**
   * 简介
   */
  summary?: string
  keywords?: (Keyword | string)[]
  /**
   * 亮点
   */
  highlights?: string[]

  badges?: string[]
}

/**
 * 项目经历
 */
export interface Project extends BaseItem {
  sets: ProjectSet[]
}

export interface SkillSet {
  title: string
  keywords: Keyword[]
}

/**
 * 技能经验
 */
export interface Skill extends BaseItem {
  sets: SkillSet[]
}
