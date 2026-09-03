import type { ResumeInfo } from '~/types'

import { readFileSync } from 'node:fs'

import jsonResumeSample from '@jsonresume/schema/sample.resume.json'
import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

import {
  convertLegacyResume,
  createPortableJsonResume,
  detectResumeFormat,
  readResumeDocument,
  reorderJsonResumeSource,
} from './resume-format'

const legacyResume = yaml.load(readFileSync(new URL('./fixtures/legacy.resume.yml', import.meta.url), 'utf8')) as ResumeInfo

describe('resume format module', () => {
  it('detects legacy and JSON Resume documents', () => {
    expect(detectResumeFormat(legacyResume)).toBe('legacy')
    expect(detectResumeFormat({ basics: { name: 'Ada Lovelace' } })).toBe('json-resume')
    expect(detectResumeFormat({ education: [] })).toBe('json-resume')
    expect(detectResumeFormat('resume')).toBe('unknown')
  })

  it('converts a legacy resume into a valid JSON Resume document', () => {
    const conversion = convertLegacyResume(legacyResume)
    const result = readResumeDocument(conversion.document)

    expect(result.valid).toBe(true)
    expect(result.format).toBe('json-resume')
    expect(conversion.document.basics?.name).toBe('云游君')
    expect(conversion.document.education).toBeInstanceOf(Array)
    expect(conversion.document.projects).toBeInstanceOf(Array)
    expect(conversion.document['x-web-resume']?.sectionOrder).toEqual([
      'education',
      'projects',
      'skills',
      'awards',
      'other',
    ])
    expect(conversion.warnings.some(warning => warning.code === 'invalid-date')).toBe(true)
    expect(result.renderResume?.education?.title).toBe('教育背景')
    expect(result.renderResume?.project?.sets[0].keywords).toEqual(legacyResume.project?.sets[0].keywords)
    expect(result.renderResume?.certificate?.histories[0].time).toBe(legacyResume.certificate?.histories[0].time)
    expect(result.renderResume?.contact.blog.label).toBe(legacyResume.contact.blog.label)
  })

  it('retains unknown legacy fields by their original JSON Pointer paths', () => {
    const source = structuredClone(legacyResume) as ResumeInfo & Record<string, any>
    source.customTheme = 'midnight'
    Object.assign(source.contact.email, { verified: true })
    Object.assign(source.project!.sets[0], { client: { name: 'Example Client' } })

    const conversion = convertLegacyResume(source)
    const legacyFields = conversion.document['x-web-resume']?.legacyFields

    expect(legacyFields).toEqual({
      '/contact/email/verified': true,
      '/customTheme': 'midnight',
      '/project/sets/0/client': { name: 'Example Client' },
    })
    expect(conversion.warnings.filter(warning => warning.code === 'custom-field').map(warning => warning.path)).toEqual([
      '/contact/email/verified',
      '/project/sets/0/client',
      '/customTheme',
    ])
  })

  it('reports canonical schema errors without rejecting the format', () => {
    const result = readResumeDocument({
      basics: { name: 'Ada Lovelace' },
      work: [{ startDate: '2024 年 1 月' }],
    })

    expect(result.format).toBe('json-resume')
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('pattern')
  })

  it('loads the canonical JSON Resume sample through the render adapter', () => {
    const result = readResumeDocument(jsonResumeSample)

    expect(result.valid).toBe(true)
    expect(result.renderResume?.basics.name).toBe('Richard Hendriks')
    expect(result.renderResume?.work?.sets[0].name).toBe('Pied Piper')
    expect(result.renderResume?.volunteer?.sets[0].name).toBe('CoderDojo')
    expect(result.renderResume?.publications?.sets[0].name).toBe('Video compression for 3d media')
    expect(result.renderResume?.languages?.info[0]).toBe('English — Native speaker')
    expect(result.renderResume?.interests?.info[0]).toBe('Wildlife: Ferrets, Unicorns')
    expect(result.renderResume?.references?.info[0]).toContain('Erlich Bachman')
    expect(result.warnings).toEqual([])
  })

  it('creates a validated portable copy without presentation extensions', () => {
    const source = {
      'basics': { customAvatarShape: 'circle', name: 'Ada Lovelace' },
      'customSection': [{ content: 'Web Resume only' }],
      'x-web-resume': { sectionOrder: ['work'], version: 1 },
    }

    const portable = createPortableJsonResume(source)

    expect(portable).toEqual({ basics: { name: 'Ada Lovelace' } })
    expect(source).toHaveProperty('x-web-resume')
    expect(readResumeDocument(portable).valid).toBe(true)
  })

  it('persists drag order in x-web-resume without moving standard content', () => {
    const source = `# standard resume\nbasics:\n  name: Ada\neducation: []\nprojects:\n  - name: Engine\nx-web-resume:\n  version: 1\n  sectionOrder:\n    - education\n    - projects\n`

    const output = reorderJsonResumeSource(source, ['project', 'education'])
    const parsed = yaml.load(output) as Record<string, any>

    expect(parsed['x-web-resume'].sectionOrder).toEqual(['projects', 'education'])
    expect(output).toContain('# standard resume')
    expect(output.indexOf('education:')).toBeLessThan(output.indexOf('projects:'))
  })
})
