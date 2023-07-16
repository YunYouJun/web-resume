import * as fs from 'node:fs'
import * as path from 'node:path'

import * as TJS from 'typescript-json-schema'
import logger from './logger'

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
}

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
}

const program = TJS.getProgramFromFiles(
  [path.resolve('src/types/resume.ts')],
  compilerOptions,
)

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, 'ResumeInfo', settings)

const formattedSchema = `${JSON.stringify(schema, null, 2)}\n`
// write
fs.writeFileSync(
  'src/assets/schema/resume.schema.json',
  formattedSchema,
)
logger.success('Generate resume schema successfully!')
