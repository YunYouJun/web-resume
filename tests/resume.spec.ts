import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'

const execFileAsync = promisify(execFile)

const resumeUrl = '/resume/suzumiya.resume.yml?source=shared-link'

test('keeps a shared resume URL in the toolbar and preview link', async ({ page, context }) => {
  await page.goto(`/?url=${encodeURIComponent(resumeUrl)}`)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
  await expect(page.getByRole('combobox')).toHaveValue(resumeUrl)

  const previewLink = page.getByRole('link', { name: '预览简历' })
  await expect(previewLink).toHaveAttribute('href', new RegExp(`url=${encodeURIComponent(resumeUrl)}`))

  const previewPagePromise = context.waitForEvent('page')
  await previewLink.click()
  const previewPage = await previewPagePromise
  await previewPage.waitForLoadState()

  await expect(previewPage).toHaveURL(new RegExp(`url=${encodeURIComponent(resumeUrl)}.*mode=preview`))
  await expect(previewPage.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
  await expect(previewPage.getByRole('navigation')).toHaveCount(0)
})

test('offers an export PDF action that opens the print flow', async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => window.dispatchEvent(new Event('beforeprint'))
  })
  await page.goto(`/?url=${encodeURIComponent(resumeUrl)}`)

  const toolbar = page.locator('nav').first()
  await expect(toolbar).toHaveClass(/opacity-100/)
  await page.getByRole('button', { name: '导出 PDF' }).click()
  await expect(toolbar).toHaveClass(/opacity-0/)
})

test('exports a resume through the CLI', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium', 'The PDF CLI uses Chromium')

  const output = testInfo.outputPath('resume.pdf')
  await execFileAsync('pnpm', [
    'exec',
    'tsx',
    'scripts/export-pdf.ts',
    '--',
    '--input',
    'public/resume/suzumiya.resume.yml',
    '--output',
    output,
    '--no-build',
  ], { cwd: process.cwd() })

  const pdf = await readFile(output)
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  expect(pdf.byteLength).toBeGreaterThan(10_000)
})

test('rejects invalid resume YAML before rendering', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium', 'The CLI smoke tests run once')

  const input = testInfo.outputPath('invalid.yml')
  const output = testInfo.outputPath('invalid.pdf')
  await writeFile(input, 'basics:\n  name: 42\n')

  await expect(execFileAsync('pnpm', [
    'exec',
    'tsx',
    'scripts/export-pdf.ts',
    '--',
    '--input',
    input,
    '--output',
    output,
    '--no-build',
  ], { cwd: process.cwd() })).rejects.toMatchObject({
    stderr: expect.stringContaining('Resume YAML does not match the schema'),
  })
})
