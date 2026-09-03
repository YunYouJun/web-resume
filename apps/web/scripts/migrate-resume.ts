import type { ResumeInfo, ResumeMigrationWarning } from '../src/types'

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

import consola from 'consola'
import * as yaml from 'js-yaml'

import { convertLegacyResume, readResumeDocument } from '../src/utils/resume-format'

const workingDirectory = resolve(process.cwd(), process.env.WEB_RESUME_CWD || '.')

interface Options {
  check: boolean
  input: string
  output?: string
}

function parseArgs(argv: string[]): Options {
  const options: Options = { check: false, input: '' }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--check') {
      options.check = true
    }
    else if (argument === '--input') {
      options.input = argv[++index] || ''
    }
    else if (argument === '--output') {
      options.output = argv[++index]
    }
  }

  if (!options.input)
    throw new Error('Missing --input <resume.yml>.')
  if (!options.check && !options.output)
    throw new Error('Provide --output <resume.yml>, or use --check for a read-only check.')
  return options
}

function printWarnings(warnings: ResumeMigrationWarning[]) {
  warnings.forEach(warning => consola.warn(`${warning.path}: ${warning.message}`))
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const inputPath = resolve(workingDirectory, options.input)
  const source = await readFile(inputPath, 'utf8')
  const document = yaml.load(source)
  const result = readResumeDocument(document)

  if (!result.valid)
    throw new Error(result.errors.join('\n'))

  if (result.format === 'json-resume') {
    printWarnings(result.warnings)
    consola.success(`${inputPath} already uses the JSON Resume structure.`)
    if (options.output)
      await writeFile(resolve(workingDirectory, options.output), source)
    return
  }

  const conversion = convertLegacyResume(document as ResumeInfo)
  const warnings = conversion.warnings.slice()
  if (/^\s*#/m.test(source)) {
    warnings.push({
      code: 'comment-loss',
      message: 'YAML comments are not carried into the converted document.',
      path: '/',
    })
  }
  printWarnings(warnings)

  if (options.check) {
    consola.info(`${inputPath} uses the legacy format and can be migrated with ${warnings.length} warning(s).`)
    process.exitCode = 1
    return
  }

  const outputPath = resolve(workingDirectory, options.output!)
  const output = `# JSON Resume compatible document\n${yaml.dump(conversion.document, {
    lineWidth: 120,
    noRefs: true,
  })}`
  await writeFile(outputPath, output)
  consola.success(`Migrated resume written to ${outputPath}.`)
}

main().catch((error) => {
  consola.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
