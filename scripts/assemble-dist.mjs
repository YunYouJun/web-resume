import { access, cp, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const webDist = resolve(repositoryRoot, 'apps/web/dist')
const docsDist = resolve(repositoryRoot, 'docs/.vitepress/dist')
const output = resolve(repositoryRoot, 'dist')

await Promise.all([
  access(resolve(webDist, 'index.html')),
  access(resolve(docsDist, 'index.html')),
])

await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })
await cp(webDist, output, { recursive: true })
await cp(docsDist, resolve(output, 'docs'), { recursive: true })

process.stdout.write(`Combined web and documentation builds in ${output}\n`)
