import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import { mkdir, readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, resolve, sep } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import { chromium } from '@playwright/test'
import * as yaml from 'js-yaml'
import { build } from 'vite'
import { resumeTemplateIds } from '../src/types/templates'
import { readResumeDocument } from '../src/utils/resume-format'

type ResumeTemplateId = typeof resumeTemplateIds[number]

const workingDirectory = resolve(process.cwd(), process.env.WEB_RESUME_CWD || '.')

interface ExportOptions {
  build: boolean
  input: string
  output: string
  scale: number
  template: ResumeTemplateId
}

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.yml': 'text/yaml; charset=utf-8',
}

const HELP = `Export a web-resume YAML file or URL to PDF.

Usage:
  pnpm export:pdf -- --input <path-or-url> [--output resume.pdf] [--template classic] [--scale 1]

Options:
  -i, --input   Local YAML path or HTTP(S) URL (required)
  -o, --output  PDF output path (default: resume.pdf)
      --scale   Print scale from 0.1 to 2 (default: 1)
      --template  Resume layout: classic, sidebar, or compact (default: classic)
      --no-build  Use the existing dist directory
  -h, --help    Show this help

Access-protected URLs:
  Set CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET in the environment.
`

export function parseArgs(argv: string[]): ExportOptions | undefined {
  let input = ''
  let output = 'resume.pdf'
  let scale = 1
  let shouldBuild = true
  let template: ResumeTemplateId = 'classic'

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const value = argv[index + 1]

    if (arg === '--')
      continue
    if (arg === '--help' || arg === '-h')
      return
    if (arg === '--input' || arg === '-i') {
      if (!value)
        throw new Error(`${arg} requires a value`)
      input = value
      index += 1
    }
    else if (arg === '--output' || arg === '-o') {
      if (!value)
        throw new Error(`${arg} requires a value`)
      output = value
      index += 1
    }
    else if (arg === '--scale') {
      if (!value)
        throw new Error('--scale requires a value')
      scale = Number(value)
      index += 1
    }
    else if (arg === '--template') {
      if (!value)
        throw new Error('--template requires a value')
      if (!resumeTemplateIds.includes(value as ResumeTemplateId))
        throw new Error(`--template must be one of: ${resumeTemplateIds.join(', ')}`)
      template = value as ResumeTemplateId
      index += 1
    }
    else if (arg === '--no-build') {
      shouldBuild = false
    }
    else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  if (!input)
    throw new Error('--input is required')
  if (!Number.isFinite(scale) || scale < 0.1 || scale > 2)
    throw new Error('--scale must be between 0.1 and 2')

  return {
    build: shouldBuild,
    input,
    output: resolve(workingDirectory, output),
    scale,
    template,
  }
}

function accessHeaders() {
  const clientId = process.env.CF_ACCESS_CLIENT_ID
  const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET

  if (Boolean(clientId) !== Boolean(clientSecret))
    throw new Error('Set both CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET')
  if (!clientId || !clientSecret)
    return undefined

  return {
    'CF-Access-Client-Id': clientId,
    'CF-Access-Client-Secret': clientSecret,
  }
}

export async function loadResume(input: string) {
  let text: string

  if (/^https?:\/\//i.test(input)) {
    const originalUrl = new URL(input)
    let currentUrl = originalUrl
    let response: Response | undefined

    for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
      response = await fetch(currentUrl, {
        headers: accessHeaders(),
        redirect: 'manual',
        signal: AbortSignal.timeout(30_000),
      })

      if (response.status < 300 || response.status >= 400)
        break

      const location = response.headers.get('location')
      if (!location)
        throw new Error(`Resume URL redirected without a location (HTTP ${response.status})`)

      const nextUrl = new URL(location, currentUrl)
      if (nextUrl.origin !== originalUrl.origin) {
        throw new Error('Resume URL redirected outside its origin. Check the URL or Cloudflare Access service token policy.')
      }
      await response.body?.cancel()
      currentUrl = nextUrl
    }

    if (!response)
      throw new Error('Failed to fetch resume')
    if (response.status >= 300 && response.status < 400)
      throw new Error('Resume URL exceeded 5 same-origin redirects')
    if (!response.ok)
      throw new Error(`Failed to fetch resume: HTTP ${response.status}`)

    const contentType = response.headers.get('content-type') || ''
    text = await response.text()
    if (contentType.includes('text/html') || /^\s*<!doctype html/i.test(text)) {
      throw new Error('Resume URL returned HTML. Check the URL or Cloudflare Access service token policy.')
    }
  }
  else {
    text = await readFile(resolve(workingDirectory, input), 'utf8')
  }

  const resume = yaml.load(text)
  const result = readResumeDocument(resume)

  if (!result.valid)
    throw new Error(`Resume YAML does not match the schema: ${result.errors.join('; ')}`)

  return text
}

async function startServer(resumeText: string) {
  const distDir = resolve(import.meta.dirname, '../dist')
  await stat(resolve(distDir, 'index.html')).catch(() => {
    throw new Error('dist/index.html is missing. Run pnpm build first.')
  })

  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1')
      if (requestUrl.pathname === '/__resume.yml') {
        response.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': MIME_TYPES['.yml'],
        })
        response.end(resumeText)
        return
      }

      const pathname = requestUrl.pathname === '/' ? '/index.html' : decodeURIComponent(requestUrl.pathname)
      let filePath = resolve(distDir, `.${pathname}`)
      if (!filePath.startsWith(`${distDir}${sep}`)) {
        response.writeHead(403).end()
        return
      }

      const file = await readFile(filePath).catch(async () => {
        filePath = resolve(distDir, 'index.html')
        return readFile(filePath)
      })
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream',
      })
      response.end(file)
    }
    catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end(error instanceof Error ? error.message : String(error))
    }
  })

  await new Promise<void>((resolvePromise, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolvePromise)
  })

  const { port } = server.address() as AddressInfo
  return { server, url: `http://127.0.0.1:${port}` }
}

async function closeServer(server: Server) {
  await new Promise<void>((resolvePromise, reject) => {
    server.close(error => error ? reject(error) : resolvePromise())
    server.closeAllConnections()
  })
}

export async function exportPdf(options: ExportOptions) {
  const resumeText = await loadResume(options.input)

  if (options.build)
    await build({ root: resolve(import.meta.dirname, '..') })

  const { server, url } = await startServer(resumeText)
  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL,
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
    headless: true,
  }).catch(async (error) => {
    await closeServer(server)
    throw error
  })

  try {
    const page = await browser.newPage()
    const resumeUrl = `${url}/?url=${encodeURIComponent('/__resume.yml')}&mode=preview&template=${options.template}`
    await page.goto(resumeUrl, { waitUntil: 'domcontentloaded' })
    await page.locator('main h1').waitFor({ state: 'visible' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    await page.emulateMedia({ media: 'print' })

    await mkdir(dirname(options.output), { recursive: true })
    await page.pdf({
      format: 'A4',
      path: options.output,
      preferCSSPageSize: true,
      printBackground: true,
      scale: options.scale,
    })
  }
  finally {
    await browser.close()
    await closeServer(server)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!options) {
    process.stdout.write(HELP)
    return
  }

  await exportPdf(options)
  process.stdout.write(`PDF exported to ${options.output}\n`)
}

const entryUrl = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : ''
if (import.meta.url === entryUrl) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
