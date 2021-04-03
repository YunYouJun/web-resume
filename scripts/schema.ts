import * as fs from 'fs'
import * as path from 'path'

import * as TJS from 'typescript-json-schema'
import logger from './logger'

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true
}

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
}

const program = TJS.getProgramFromFiles(
  [path.resolve('src/types/index.ts')],
  compilerOptions
)

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, 'ResumeInfo', settings)

// write
fs.writeFileSync('schema/resume.schema.json', JSON.stringify(schema, null, 2))
logger.success('Generate resume schema successfully!')
