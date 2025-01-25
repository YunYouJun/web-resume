import * as fs from 'node:fs'
import * as path from 'node:path'

import consola from 'consola'

import * as TJS from 'typescript-json-schema'

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
}

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
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
const schema = TJS.generateSchema(program, 'ResumeInfo', settings)

const targetResumeSchemaFile = path.resolve(__dirname, '../src/assets/schema/resume.schema.json')
const formattedSchema = `${JSON.stringify(schema, null, 2)}\n`

// write
fs.writeFileSync(
  targetResumeSchemaFile,
  formattedSchema,
)

if (schema === null) {
  consola.error('Generate schema failed!')
}
else {
  consola.success('Generate schema successfully!')
}
