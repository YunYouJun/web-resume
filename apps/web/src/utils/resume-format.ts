import type {
  JsonResume,
  JsonResumeProject,
  JsonResumePublication,
  JsonResumeWork,
  ResumeFormat,
  ResumeInfo,
  ResumeMigrationWarning,
  ResumeSection,
  WebResumeExtension,
  WebResumeItemExtension,
  WebResumeSection,
} from '~/types'
import type { Contact, Other, ProjectSet } from '~/types/base'

import jsonResumeSchema from '@jsonresume/schema/schema.json'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import * as yaml from 'js-yaml'
import legacyResumeSchema from '~/assets/schema/resume-legacy.schema.json'
import { jsonResumeSectionKeys } from '~/types'

const JSON_RESUME_SCHEMA_URL = 'https://raw.githubusercontent.com/jsonresume/jsonresume.org/54eba4131801b6b32aa947ce8a4fbef526800a08/packages/schema/schema.json'

const legacyAjv = new Ajv({ allErrors: true, allowUnionTypes: true })
const jsonResumeAjv = new Ajv({ allErrors: true, strict: false })
const portableJsonResumeAjv = new Ajv({ allErrors: true, removeAdditional: 'all', strict: false })
addFormats(jsonResumeAjv)
addFormats(portableJsonResumeAjv)

const validateLegacyResume = legacyAjv.compile(legacyResumeSchema)
const validateJsonResume = jsonResumeAjv.compile(jsonResumeSchema)
const validatePortableJsonResume = portableJsonResumeAjv.compile(jsonResumeSchema)

export interface ResumeDocumentResult {
  errors: string[]
  format: ResumeFormat
  renderResume?: ResumeInfo
  valid: boolean
  warnings: ResumeMigrationWarning[]
}

export interface ResumeConversionResult {
  document: JsonResume
  warnings: ResumeMigrationWarning[]
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function validationErrors(errors: typeof validateLegacyResume.errors) {
  return (errors || []).map(error => `${error.instancePath || '/'} ${error.message || 'is invalid'}`)
}

export function detectResumeFormat(value: unknown): ResumeFormat {
  if (!isRecord(value))
    return 'unknown'

  if (
    (typeof value.$schema === 'string' && value.$schema.toLowerCase().includes('jsonresume'))
    || isRecord(value['x-web-resume'])
    || ['work', 'volunteer', 'education', 'awards', 'certificates', 'publications', 'skills', 'languages', 'interests', 'references', 'projects']
      .some(key => Array.isArray(value[key]))
  ) {
    return 'json-resume'
  }

  if (
    isRecord(value.contact)
    || ['education', 'project', 'certificate', 'skill', 'work', 'other'].some(key => isRecord(value[key]))
  ) {
    return 'legacy'
  }

  return isRecord(value.basics) ? 'json-resume' : 'unknown'
}

export function readResumeDocument(value: unknown): ResumeDocumentResult {
  const format = detectResumeFormat(value)
  if (format === 'unknown') {
    return {
      errors: ['Unable to detect a supported resume format.'],
      format,
      valid: false,
      warnings: [],
    }
  }

  if (format === 'legacy') {
    const valid = validateLegacyResume(value)
    return {
      errors: valid ? [] : validationErrors(validateLegacyResume.errors),
      format,
      renderResume: valid ? value as unknown as ResumeInfo : undefined,
      valid,
      warnings: [],
    }
  }

  const valid = validateJsonResume(value)
  const resume = value as JsonResume

  return {
    errors: valid ? [] : validationErrors(validateJsonResume.errors),
    format,
    renderResume: valid ? renderJsonResume(resume) : undefined,
    valid,
    warnings: [],
  }
}

/** Creates a canonical JSON Resume copy without Web Resume presentation data. */
export function createPortableJsonResume(value: unknown): JsonResume {
  if (detectResumeFormat(value) !== 'json-resume')
    throw new Error('Convert the document to JSON Resume before exporting a portable copy.')

  const portable = JSON.parse(JSON.stringify(value)) as JsonResume
  delete portable['x-web-resume']
  if (!validatePortableJsonResume(portable))
    throw new Error(validationErrors(validatePortableJsonResume.errors).join('\n'))
  return portable
}

function normalizeDate(
  value: string | number | undefined,
  path: string,
  warnings: ResumeMigrationWarning[],
  endDate = false,
) {
  if (value === undefined || value === '')
    return

  const text = String(value).trim()
  if (endDate && /^(?:present|current|now|至今)$/i.test(text))
    return
  if (/^[12]\d{3}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/.test(text))
    return text

  const chineseDate = text.match(/^([12]\d{3})\s*年(?:\s*(\d{1,2})\s*月)?$/)
  if (chineseDate) {
    const month = chineseDate[2]
    if (!month)
      return chineseDate[1]
    const numericMonth = Number(month)
    if (numericMonth >= 1 && numericMonth <= 12)
      return `${chineseDate[1]}-${String(numericMonth).padStart(2, '0')}`
  }

  warnings.push({
    code: 'invalid-date',
    message: `“${text}” cannot be represented as a JSON Resume date and was retained in x-web-resume.`,
    path,
  })
}

function compactObject<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>
}

interface LegacySchemaNode {
  $ref?: string
  additionalProperties?: boolean | LegacySchemaNode
  anyOf?: LegacySchemaNode[]
  items?: LegacySchemaNode
  properties?: Record<string, LegacySchemaNode>
  type?: string | string[]
}

function resolveLegacySchema(schema: LegacySchemaNode): LegacySchemaNode {
  if (!schema.$ref)
    return schema

  const definitionName = schema.$ref.match(/^#\/definitions\/(.+)$/)?.[1]
  return definitionName
    ? (legacyResumeSchema.definitions as Record<string, LegacySchemaNode>)[definitionName] || schema
    : schema
}

function matchesSchemaType(value: unknown, schema: LegacySchemaNode) {
  const resolved = resolveLegacySchema(schema)
  const types = Array.isArray(resolved.type) ? resolved.type : [resolved.type]
  return types.some(type => (
    (type === 'array' && Array.isArray(value))
    || (type === 'object' && isRecord(value))
    || (type === 'number' && typeof value === 'number')
    || (type === 'string' && typeof value === 'string')
  ))
}

function escapeJsonPointer(value: string) {
  return value.replace(/~/g, '~0').replace(/\//g, '~1')
}

function collectLegacyFields(
  value: unknown,
  inputSchema: LegacySchemaNode,
  path = '',
  fields: Record<string, unknown> = {},
) {
  let schema = resolveLegacySchema(inputSchema)
  if (schema.anyOf) {
    schema = resolveLegacySchema(schema.anyOf.find(candidate => matchesSchemaType(value, candidate)) || schema.anyOf[0])
  }

  if (Array.isArray(value) && schema.items) {
    value.forEach((item, index) => collectLegacyFields(item, schema.items!, `${path}/${index}`, fields))
    return fields
  }

  if (!isRecord(value))
    return fields

  Object.entries(value).forEach(([key, item]) => {
    const itemPath = `${path}/${escapeJsonPointer(key)}`
    const propertySchema = schema.properties?.[key]
    if (propertySchema) {
      collectLegacyFields(item, propertySchema, itemPath, fields)
      return
    }

    if (isRecord(schema.additionalProperties)) {
      collectLegacyFields(item, schema.additionalProperties, itemPath, fields)
      return
    }

    fields[itemPath] = item
  })
  return fields
}

function extensionItem(
  set: Partial<ProjectSet>,
  startDate: string | undefined,
  endDate: string | undefined,
): WebResumeItemExtension {
  const hasKeywordDetails = set.keywords?.some(keyword => typeof keyword !== 'string')
  return compactObject({
    badges: set.badges,
    end: set.end && !endDate ? set.end : undefined,
    keywordDetails: hasKeywordDetails ? set.keywords : undefined,
    logo: set.logo,
    open: set.open,
    repo: set.repo,
    start: set.start && !startDate ? set.start : undefined,
  }) as WebResumeItemExtension
}

function convertProjectSet(
  set: ProjectSet,
  path: string,
  warnings: ResumeMigrationWarning[],
): { extension: WebResumeItemExtension, project: JsonResumeProject } {
  const startDate = normalizeDate(set.start, `${path}/start`, warnings)
  const endDate = normalizeDate(set.end, `${path}/end`, warnings, true)
  const keywords = set.keywords?.map(keyword => typeof keyword === 'string' ? keyword : keyword.name).filter((keyword): keyword is string => Boolean(keyword))

  return {
    extension: extensionItem(set, startDate, endDate),
    project: compactObject({
      description: set.summary,
      endDate,
      highlights: set.highlights,
      keywords,
      name: set.name,
      startDate,
      type: set.type,
      url: set.url || (set.repo ? `https://github.com/${set.repo}` : undefined),
    }) as JsonResumeProject,
  }
}

function convertWorkSet(
  set: ProjectSet,
  path: string,
  warnings: ResumeMigrationWarning[],
): { extension: WebResumeItemExtension, work: JsonResumeWork } {
  const startDate = normalizeDate(set.start, `${path}/start`, warnings)
  const endDate = normalizeDate(set.end, `${path}/end`, warnings, true)

  return {
    extension: extensionItem(set, startDate, endDate),
    work: compactObject({
      endDate,
      highlights: set.highlights,
      name: set.name,
      position: set.type,
      startDate,
      summary: set.summary,
      url: set.url,
    }) as JsonResumeWork,
  }
}

export function convertLegacyResume(legacy: ResumeInfo): ResumeConversionResult {
  const warnings: ResumeMigrationWarning[] = []
  const legacyFields = collectLegacyFields(legacy, legacyResumeSchema as LegacySchemaNode)
  const extension: WebResumeExtension = {
    legacyFields: Object.keys(legacyFields).length ? legacyFields : undefined,
    sectionOrder: [],
    sections: {},
    version: 1,
  }
  Object.keys(legacyFields).forEach((path) => {
    warnings.push({
      code: 'custom-field',
      message: `The custom field at ${path} was retained in x-web-resume.legacyFields.`,
      path,
    })
  })
  const basics: JsonResume['basics'] = compactObject({
    email: legacy.contact.email?.label,
    image: legacy.basics.avatar,
    label: legacy.basics.label,
    name: legacy.basics.name || legacy.name,
    phone: legacy.contact.phone?.label,
    summary: legacy.basics.bio,
    url: legacy.contact.blog?.href,
  })

  if (legacy.basics.location) {
    extension.basics = { ...extension.basics, location: legacy.basics.location }
    warnings.push({
      code: 'location',
      message: 'The legacy location string was retained in x-web-resume because it cannot be split reliably.',
      path: '/basics/location',
    })
  }
  if (legacy.basics.age !== undefined || legacy.basics.birth || legacy.basics.sex) {
    extension.basics = compactObject({
      ...extension.basics,
      age: legacy.basics.age,
      birth: legacy.basics.birth,
      sex: legacy.basics.sex,
    })
  }

  const profiles = Object.entries(legacy.contact)
    .filter(([key]) => !['email', 'phone', 'blog'].includes(key))
    .map(([network, contact]) => compactObject({
      network,
      url: contact.href,
      username: contact.label,
    }))
  if (profiles.length) {
    basics.profiles = profiles
  }

  const contactExtensions = Object.fromEntries(Object.entries(legacy.contact)
    .filter(([key, contact]) => contact.icon || (key === 'blog' && contact.label !== contact.href))
    .map(([key, contact]) => [key, compactObject({
      icon: contact.icon,
      label: key === 'blog' && contact.label !== contact.href ? contact.label : undefined,
    })]))
  if (Object.keys(contactExtensions).length) {
    extension.contacts = contactExtensions
  }

  const document: JsonResume = {
    $schema: JSON_RESUME_SCHEMA_URL,
    basics,
  }

  if (legacy.education) {
    const items: WebResumeItemExtension[] = []
    document.education = legacy.education.histories.map((education, index) => {
      const startDate = normalizeDate(education.start, `/education/${index}/start`, warnings)
      const endDate = normalizeDate(education.end, `/education/${index}/end`, warnings, true)
      items.push(compactObject({
        city: education.city,
        end: education.end && !endDate ? education.end : undefined,
        icon: education.icon,
        logo: education.logo,
        start: education.start && !startDate ? education.start : undefined,
      }) as WebResumeItemExtension)
      return compactObject({
        area: education.area,
        endDate,
        institution: education.school,
        score: education.grade,
        startDate,
        studyType: education.studyType,
      })
    })
    extension.sections!.education = { icon: legacy.education.icon, items, title: legacy.education.title }
  }

  if (legacy.project) {
    const converted = legacy.project.sets.map((set, index) => convertProjectSet(set, `/project/${index}`, warnings))
    document.projects = converted.map(item => item.project)
    extension.sections!.projects = {
      icon: legacy.project.icon,
      items: converted.map(item => item.extension),
      title: legacy.project.title,
    }
    warnings.push({
      code: 'ambiguous-section',
      message: 'Legacy project entries were mapped to projects; review entries that actually describe employment.',
      path: '/project',
    })
  }

  if (legacy.work) {
    const converted = legacy.work.sets.map((set, index) => convertWorkSet(set, `/work/${index}`, warnings))
    document.work = converted.map(item => item.work)
    extension.sections!.work = {
      icon: legacy.work.icon,
      items: converted.map(item => item.extension),
      title: legacy.work.title,
    }
  }

  if (legacy.skill) {
    document.skills = legacy.skill.sets.map(set => compactObject({
      keywords: set.keywords.map(keyword => keyword.name).filter((keyword): keyword is string => keyword !== undefined),
      name: set.title,
    }))
    extension.sections!.skills = {
      icon: legacy.skill.icon,
      items: legacy.skill.sets.map(set => ({ keywordDetails: set.keywords })),
      title: legacy.skill.title,
    }
  }

  if (legacy.certificate) {
    document.awards = legacy.certificate.histories.map((history, index) => compactObject({
      awarder: history.place,
      date: normalizeDate(history.time, `/certificate/${index}/time`, warnings),
      title: history.name,
    }))
    extension.sections!.awards = {
      icon: legacy.certificate.icon,
      items: legacy.certificate.histories.map(history => ({
        start: normalizeDate(history.time, '', []) ? undefined : String(history.time),
      })),
      title: legacy.certificate.title,
    }
    warnings.push({
      code: 'ambiguous-section',
      message: 'Legacy certificate entries were mapped to awards; split certificates and publications manually where needed.',
      path: '/certificate',
    })
  }

  if (legacy.other)
    extension.other = legacy.other
  if (legacy.footer)
    extension.footer = legacy.footer

  const sectionMap: Partial<Record<keyof ResumeInfo, WebResumeSection>> = {
    certificate: 'awards',
    education: 'education',
    other: 'other',
    project: 'projects',
    skill: 'skills',
    work: 'work',
  }
  extension.sectionOrder = Object.keys(legacy)
    .map(key => sectionMap[key as keyof ResumeInfo])
    .filter((section): section is WebResumeSection => Boolean(section))

  document['x-web-resume'] = extension
  return { document, warnings }
}

function sectionExtension(resume: JsonResume, section: WebResumeSection) {
  return resume['x-web-resume']?.sections?.[section]
}

function renderProjectSet(
  item: JsonResumeProject,
  extension: WebResumeItemExtension | undefined,
): ProjectSet {
  return {
    badges: extension?.badges,
    end: extension?.end || item.endDate || '',
    highlights: item.highlights,
    keywords: extension?.keywordDetails || item.keywords,
    logo: extension?.logo || 'ri:folders-line',
    name: item.name || '',
    open: extension?.open,
    repo: extension?.repo,
    start: extension?.start || item.startDate || '',
    summary: item.description,
    type: item.type || item.roles?.join(', ') || '',
    url: item.url,
  }
}

function renderWorkSet(
  item: JsonResumeWork,
  extension: WebResumeItemExtension | undefined,
): ProjectSet {
  return {
    badges: extension?.badges,
    end: extension?.end || item.endDate || '',
    highlights: item.highlights,
    keywords: extension?.keywordDetails,
    logo: extension?.logo || 'ri:building-line',
    name: item.name || '',
    open: extension?.open,
    repo: extension?.repo,
    start: extension?.start || item.startDate || '',
    summary: item.summary,
    type: item.position || item.description || '',
    url: item.url,
  }
}

function renderPublicationSet(item: JsonResumePublication, extension: WebResumeItemExtension | undefined): ProjectSet {
  return {
    badges: extension?.badges,
    end: extension?.end || '',
    highlights: undefined,
    keywords: extension?.keywordDetails,
    logo: extension?.logo || 'ri:article-line',
    name: item.name || '',
    open: extension?.open,
    repo: extension?.repo,
    start: extension?.start || item.releaseDate || '',
    summary: item.summary,
    type: item.publisher || '',
    url: item.url,
  }
}

function listSection(title: string, icon: string, info: string[]): Other | undefined {
  return info.length ? { icon, info, title } : undefined
}

export function renderJsonResume(resume: JsonResume): ResumeInfo {
  const extension = resume['x-web-resume']
  const basics = resume.basics || {}
  const contacts: Record<string, { href: string, icon: string, label: string }> = {}
  if (basics.email) {
    contacts.email = {
      href: `mailto:${basics.email}`,
      icon: extension?.contacts?.email?.icon || 'ri:mail-line',
      label: basics.email,
    }
  }
  if (basics.phone) {
    contacts.phone = {
      href: `tel:${basics.phone}`,
      icon: extension?.contacts?.phone?.icon || 'ri:smartphone-line',
      label: basics.phone,
    }
  }
  if (basics.url) {
    contacts.blog = {
      href: basics.url,
      icon: extension?.contacts?.blog?.icon || 'ri:earth-line',
      label: extension?.contacts?.blog?.label || basics.url,
    }
  }
  basics.profiles?.forEach((profile, index) => {
    const key = profile.network?.toLowerCase() || `profile-${index + 1}`
    contacts[key] = {
      href: profile.url || '',
      icon: extension?.contacts?.[key]?.icon || 'ri:account-circle-line',
      label: profile.username || profile.network || profile.url || '',
    }
  })

  const available: Partial<Record<ResumeSection, ResumeInfo[keyof ResumeInfo]>> = {}
  if (resume.education?.length) {
    const section = sectionExtension(resume, 'education')
    available.education = {
      histories: resume.education.map((item, index) => ({
        area: item.area || '',
        city: section?.items?.[index]?.city || '',
        end: section?.items?.[index]?.end || item.endDate || '',
        grade: item.score || '',
        icon: section?.items?.[index]?.icon,
        logo: section?.items?.[index]?.logo,
        school: item.institution || '',
        start: section?.items?.[index]?.start || item.startDate || '',
        studyType: item.studyType || '',
      })),
      icon: section?.icon || 'ri:graduation-cap-line',
      title: section?.title || 'Education',
    }
  }
  if (resume.projects?.length) {
    const section = sectionExtension(resume, 'projects')
    available.project = {
      icon: section?.icon || 'ri:folders-line',
      sets: resume.projects.map((item, index) => renderProjectSet(item, section?.items?.[index])),
      title: section?.title || 'Projects',
    }
  }
  if (resume.work?.length) {
    const section = sectionExtension(resume, 'work')
    available.work = {
      icon: section?.icon || 'ri:building-line',
      sets: resume.work.map((item, index) => renderWorkSet(item, section?.items?.[index])),
      title: section?.title || 'Work',
    }
  }
  if (resume.volunteer?.length) {
    const section = sectionExtension(resume, 'volunteer')
    available.volunteer = {
      icon: section?.icon || 'ri:hand-heart-line',
      sets: resume.volunteer.map((item, index) => renderWorkSet({
        ...item,
        name: item.organization || item.name,
        position: item.position,
      }, section?.items?.[index])),
      title: section?.title || 'Volunteer',
    }
  }
  if (resume.publications?.length) {
    const section = sectionExtension(resume, 'publications')
    available.publications = {
      icon: section?.icon || 'ri:article-line',
      sets: resume.publications.map((item, index) => renderPublicationSet(item, section?.items?.[index])),
      title: section?.title || 'Publications',
    }
  }
  if (resume.skills?.length) {
    const section = sectionExtension(resume, 'skills')
    available.skill = {
      icon: section?.icon || 'ri:flask-line',
      sets: resume.skills.map((item, index) => ({
        keywords: section?.items?.[index]?.keywordDetails?.map(keyword => typeof keyword === 'string' ? { name: keyword } : keyword)
          || item.keywords?.map(name => ({ name }))
          || [],
        title: item.name || item.level || '',
      })),
      title: section?.title || 'Skills',
    }
  }

  const awardExtension = sectionExtension(resume, 'awards')
  const certificateExtension = sectionExtension(resume, 'certificates')
  const recognitions = [
    ...(resume.awards || []).map((item, index) => ({
      name: item.title || '',
      place: item.awarder,
      time: awardExtension?.items?.[index]?.start || item.date || '',
    })),
    ...(resume.certificates || []).map((item, index) => ({
      name: item.name || '',
      place: item.issuer,
      time: certificateExtension?.items?.[index]?.start || item.date || '',
    })),
  ]
  if (recognitions.length) {
    const section = sectionExtension(resume, resume.awards?.length ? 'awards' : 'certificates')
    available.certificate = {
      histories: recognitions,
      icon: section?.icon || 'ri:award-line',
      title: section?.title || 'Awards & Certificates',
    }
  }
  if (extension?.other)
    available.other = extension.other
  const languageSection = sectionExtension(resume, 'languages')
  available.languages = listSection(
    languageSection?.title || 'Languages',
    languageSection?.icon || 'ri:translate-2',
    (resume.languages || []).map(item => [item.language, item.fluency].filter(Boolean).join(' — ')),
  )
  const interestSection = sectionExtension(resume, 'interests')
  available.interests = listSection(
    interestSection?.title || 'Interests',
    interestSection?.icon || 'ri:heart-3-line',
    (resume.interests || []).map(item => [item.name, item.keywords?.join(', ')].filter(Boolean).join(': ')),
  )
  const referenceSection = sectionExtension(resume, 'references')
  available.references = listSection(
    referenceSection?.title || 'References',
    referenceSection?.icon || 'ri:double-quotes-l',
    (resume.references || []).map(item => [item.name, item.reference].filter(Boolean).join(': ')),
  )

  const standardToRender = {
    awards: 'certificate',
    certificates: 'certificate',
    education: 'education',
    interests: 'interests',
    languages: 'languages',
    other: 'other',
    publications: 'publications',
    projects: 'project',
    references: 'references',
    skills: 'skill',
    volunteer: 'volunteer',
    work: 'work',
  } as const
  const preferredOrder = extension?.sectionOrder || [...jsonResumeSectionKeys, 'other']
  const renderOrder = preferredOrder
    .map(section => standardToRender[section as keyof typeof standardToRender])
    .filter((section): section is keyof typeof available => Boolean(section))
  Object.keys(available).forEach((section) => {
    const key = section as keyof typeof available
    if (!renderOrder.includes(key))
      renderOrder.push(key)
  })

  const renderResume = {
    basics: {
      age: extension?.basics?.age,
      avatar: basics.image,
      bio: basics.summary,
      birth: extension?.basics?.birth,
      label: basics.label,
      location: extension?.basics?.location || [basics.location?.city, basics.location?.region, basics.location?.countryCode].filter(Boolean).join(', '),
      name: basics.name || '',
      sex: extension?.basics?.sex,
    },
    contact: contacts as Contact,
  } as ResumeInfo
  renderOrder.forEach((section) => {
    const value = available[section]
    if (value)
      Object.assign(renderResume, { [section]: value })
  })
  if (extension?.footer)
    renderResume.footer = extension.footer
  return renderResume
}

function canonicalSectionOrder(resume: JsonResume, order: ResumeSection[]) {
  const nextOrder: WebResumeSection[] = []
  order.forEach((section) => {
    if (section === 'certificate') {
      if (resume.awards?.length)
        nextOrder.push('awards')
      if (resume.certificates?.length)
        nextOrder.push('certificates')
      return
    }

    const mapped = {
      education: 'education',
      interests: 'interests',
      languages: 'languages',
      other: 'other',
      publications: 'publications',
      project: 'projects',
      references: 'references',
      skill: 'skills',
      volunteer: 'volunteer',
      work: 'work',
    }[section] as WebResumeSection | undefined
    if (mapped)
      nextOrder.push(mapped)
  })

  const existingOrder = resume['x-web-resume']?.sectionOrder || [
    ...jsonResumeSectionKeys.filter(section => Array.isArray(resume[section]) && resume[section]!.length),
    ...(resume['x-web-resume']?.other ? ['other' as const] : []),
  ]
  existingOrder.forEach((section) => {
    if (!nextOrder.includes(section))
      nextOrder.push(section)
  })
  return nextOrder
}

/** Updates only the display-order extension and leaves standard content untouched. */
export function reorderJsonResumeSource(
  source: string,
  order: ResumeSection[],
) {
  const parsed = yaml.load(source)
  if (detectResumeFormat(parsed) !== 'json-resume')
    return source

  const resume = parsed as JsonResume
  const sectionOrder = canonicalSectionOrder(resume, order)
  resume['x-web-resume'] = {
    ...resume['x-web-resume'],
    sectionOrder,
    version: 1,
  }

  if (source.trimStart().startsWith('{'))
    return `${JSON.stringify(resume, null, 2)}\n`

  const newline = source.includes('\r\n') ? '\r\n' : '\n'
  const lines = source.split(/\r?\n/)
  const extensionStart = lines.findIndex(line => /^x-web-resume:\s*$/.test(line))
  const orderLines = ['  sectionOrder:', ...sectionOrder.map(section => `    - ${section}`)]

  if (extensionStart < 0) {
    const suffix = source.endsWith('\n') ? '' : newline
    return `${source}${suffix}${newline}x-web-resume:${newline}  version: 1${newline}${orderLines.join(newline)}${newline}`
  }

  let extensionEnd = lines.length
  for (let index = extensionStart + 1; index < lines.length; index++) {
    if (/^[a-z_$][\w$-]*:/i.test(lines[index])) {
      extensionEnd = index
      break
    }
  }

  const sectionOrderStart = lines.findIndex((line, index) => (
    index > extensionStart && index < extensionEnd && /^\s{2}sectionOrder:\s*$/.test(line)
  ))
  if (sectionOrderStart < 0) {
    lines.splice(extensionStart + 1, 0, ...orderLines)
  }
  else {
    let sectionOrderEnd = sectionOrderStart + 1
    while (sectionOrderEnd < extensionEnd && (/^\s{4,}-\s/.test(lines[sectionOrderEnd]) || lines[sectionOrderEnd] === ''))
      sectionOrderEnd++
    lines.splice(sectionOrderStart, sectionOrderEnd - sectionOrderStart, ...orderLines)
  }
  return lines.join(newline)
}

export { JSON_RESUME_SCHEMA_URL }
