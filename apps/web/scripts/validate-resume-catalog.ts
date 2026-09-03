import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

import * as yaml from 'js-yaml'
import {
  defaultResumeExampleId,
  defaultResumeTemplateId,
  resumeExampleCatalog,
  resumeTemplates,
} from '../src/data/resume-catalog'
import { loadResume } from './export-pdf'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition)
    throw new Error(message)
}

function getTranslation(messages: unknown, key: string) {
  return key.split('.').reduce<unknown>((value, segment) => {
    if (!value || typeof value !== 'object')
      return undefined
    return (value as Record<string, unknown>)[segment]
  }, messages)
}

function validateUniqueIds(items: { id: string }[], label: string) {
  const ids = items.map(item => item.id)
  assert(new Set(ids).size === ids.length, `${label} IDs must be unique`)
}

async function main() {
  validateUniqueIds(resumeTemplates, 'Template')
  validateUniqueIds(resumeExampleCatalog, 'Example')
  assert(resumeTemplates.some(template => template.id === defaultResumeTemplateId), 'Default template is missing')
  assert(resumeExampleCatalog.some(example => example.id === defaultResumeExampleId), 'Default example is missing')

  const localeFiles = ['locales/zh-CN.yml', 'locales/en.yml']
  const locales = await Promise.all(localeFiles.map(async file => ({
    file,
    messages: yaml.load(await readFile(resolve(file), 'utf8')),
  })))

  for (const item of [...resumeTemplates, ...resumeExampleCatalog]) {
    const keys = [item.nameKey, item.descriptionKey, ...item.tagKeys]
    if ('noticeKey' in item && item.noticeKey)
      keys.push(item.noticeKey)

    for (const { file, messages } of locales) {
      for (const key of keys)
        assert(typeof getTranslation(messages, key) === 'string', `${file} is missing ${key}`)
    }
  }

  for (const example of resumeExampleCatalog) {
    assert(example.url.startsWith('/resume/') && example.url.endsWith('.yml'), `Example ${example.id} must use a local /resume/*.yml URL`)
    await loadResume(resolve('public', example.url.slice(1)))
  }

  process.stdout.write(`Validated ${resumeTemplates.length} templates and ${resumeExampleCatalog.length} preset data files.\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
