import * as fs from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'

import jsonResumeSchema from '@jsonresume/schema/schema.json'
import consola from 'consola'

import * as TJS from 'typescript-json-schema'

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
}

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  skipLibCheck: true,
  strictNullChecks: true,
}

const __dirname = import.meta.dirname
const resumeTypeFile = path.resolve(__dirname, '../src/types/resume.ts')
const program = TJS.getProgramFromFiles(
  [
    resumeTypeFile,
  ],
  compilerOptions,
)

// We can either get the schema for one file and one type...
const legacySchema = TJS.generateSchema(program, 'ResumeInfo', settings)

const targetResumeSchemaFile = path.resolve(__dirname, '../src/assets/schema/resume.schema.json')
const targetLegacySchemaFiles = [
  path.resolve(__dirname, '../src/assets/schema/resume-legacy.schema.json'),
  path.resolve(__dirname, '../public/schema/resume-legacy.schema.json'),
]
const targetJsonResumeSchemaFile = path.resolve(__dirname, '../public/schema/json-resume.schema.json')

function rebaseDefinitions(schema: Record<string, any>, name: string) {
  const cloned = structuredClone(schema)
  delete cloned.$id
  delete cloned.$schema

  function visit(value: unknown) {
    if (!value || typeof value !== 'object')
      return
    Object.entries(value).forEach(([key, child]) => {
      if (key === '$ref' && typeof child === 'string' && child.startsWith('#/definitions/'))
        (value as Record<string, unknown>)[key] = child.replace('#/definitions/', `#/definitions/${name}/definitions/`)
      else
        visit(child)
    })
  }

  visit(cloned)
  return cloned
}

if (legacySchema === null) {
  consola.error('Generate schema failed!')
  process.exitCode = 1
}
else {
  const combinedSchema = {
    definitions: {
      jsonResume: rebaseDefinitions(jsonResumeSchema, 'jsonResume'),
      legacy: rebaseDefinitions(legacySchema, 'legacy'),
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
    anyOf: [
      { $ref: '#/definitions/jsonResume' },
      { $ref: '#/definitions/legacy' },
    ],
    description: 'Accepts JSON Resume documents and legacy web-resume YAML during the 0.4 migration period.',
    title: 'Web Resume document',
  }

  fs.writeFileSync(targetResumeSchemaFile, `${JSON.stringify(combinedSchema, null, 2)}\n`)
  targetLegacySchemaFiles.forEach(file => fs.writeFileSync(file, `${JSON.stringify(legacySchema, null, 2)}\n`))
  fs.writeFileSync(targetJsonResumeSchemaFile, `${JSON.stringify(jsonResumeSchema, null, 2)}\n`)
  consola.success('Generate schema successfully!')
}
