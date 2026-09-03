import type { Other } from './base'

export const jsonResumeSectionKeys = [
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
] as const

export type JsonResumeSection = typeof jsonResumeSectionKeys[number]
export type WebResumeSection = JsonResumeSection | 'other'

interface JsonResumeEntry {
  [key: string]: unknown
}

export interface JsonResumeProfile extends JsonResumeEntry {
  network?: string
  url?: string
  username?: string
}

export interface JsonResumeBasics extends JsonResumeEntry {
  email?: string
  image?: string
  label?: string
  location?: {
    address?: string
    city?: string
    countryCode?: string
    postalCode?: string
    region?: string
    [key: string]: unknown
  }
  name?: string
  phone?: string
  profiles?: JsonResumeProfile[]
  summary?: string
  url?: string
}

export interface JsonResumeDatedEntry extends JsonResumeEntry {
  endDate?: string
  highlights?: string[]
  name?: string
  startDate?: string
  summary?: string
  url?: string
}

export interface JsonResumeWork extends JsonResumeDatedEntry {
  description?: string
  location?: string
  position?: string
}

export interface JsonResumeVolunteer extends JsonResumeDatedEntry {
  organization?: string
  position?: string
}

export interface JsonResumeProject extends JsonResumeDatedEntry {
  description?: string
  entity?: string
  keywords?: string[]
  roles?: string[]
  type?: string
}

export interface JsonResumeEducation extends JsonResumeEntry {
  area?: string
  courses?: string[]
  endDate?: string
  institution?: string
  score?: string
  startDate?: string
  studyType?: string
  url?: string
}

export interface JsonResumeSkill extends JsonResumeEntry {
  keywords?: string[]
  level?: string
  name?: string
}

export interface JsonResumePublication extends JsonResumeEntry {
  name?: string
  publisher?: string
  releaseDate?: string
  summary?: string
  url?: string
}

export interface WebResumeItemExtension {
  badges?: string[]
  city?: string
  end?: string
  icon?: string
  keywordDetails?: Array<{ icon?: string, logo?: string, name?: string } | string>
  logo?: string
  open?: boolean
  repo?: string
  start?: string
}

export interface WebResumeSectionExtension {
  icon?: string
  items?: WebResumeItemExtension[]
  title?: string
}

export interface WebResumeExtension {
  basics?: {
    age?: number | string
    birth?: string
    location?: string
    sex?: string
  }
  contacts?: Record<string, { icon?: string, label?: string }>
  footer?: { link: string }
  /** Legacy-only values keyed by their original JSON Pointer path. */
  legacyFields?: Record<string, unknown>
  other?: Other
  sectionOrder?: WebResumeSection[]
  sections?: Partial<Record<WebResumeSection, WebResumeSectionExtension>>
  version: 1
}

export interface JsonResumeDocument extends JsonResumeEntry {
  $schema?: string
  awards?: Array<{ awarder?: string, date?: string, summary?: string, title?: string, [key: string]: unknown }>
  basics?: JsonResumeBasics
  certificates?: Array<{ date?: string, issuer?: string, name?: string, url?: string, [key: string]: unknown }>
  education?: JsonResumeEducation[]
  interests?: Array<{ keywords?: string[], name?: string, [key: string]: unknown }>
  languages?: Array<{ fluency?: string, language?: string, [key: string]: unknown }>
  meta?: { canonical?: string, lastModified?: string, version?: string, [key: string]: unknown }
  publications?: JsonResumePublication[]
  projects?: JsonResumeProject[]
  references?: Array<{ name?: string, reference?: string, [key: string]: unknown }>
  skills?: JsonResumeSkill[]
  volunteer?: JsonResumeVolunteer[]
  work?: JsonResumeWork[]
}

export type JsonResume = JsonResumeDocument & {
  'x-web-resume'?: WebResumeExtension
}

export type ResumeFormat = 'json-resume' | 'legacy' | 'unknown'

export interface ResumeMigrationWarning {
  code: 'ambiguous-section' | 'comment-loss' | 'custom-field' | 'invalid-date' | 'location'
  message: string
  path: string
}
