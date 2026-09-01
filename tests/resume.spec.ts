import type { Page } from '@playwright/test'
import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'

const execFileAsync = promisify(execFile)
const resumeUrl = '/resume/suzumiya.resume.yml?source=shared-link'

async function openResume(page: Page, url = resumeUrl) {
  await page.goto(`/?url=${encodeURIComponent(url)}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
}

test('guides a first-time visitor through loading an example', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('region', { name: '三步开始制作简历' })).toBeVisible()
  await expect(page.getByRole('button', { name: '导出 PDF' })).toBeDisabled()

  await page.getByRole('button', { name: /试用示例/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
  await expect(page.getByRole('button', { name: '导出 PDF' })).toBeEnabled()
})

test('loads the URL currently typed in the address bar on Enter', async ({ page }) => {
  await openResume(page)
  const typedUrl = '/resume/suzumiya.resume.yml?source=typed-entry'
  const input = page.getByRole('combobox', { name: '简历 YAML 地址' })

  await input.fill(typedUrl)
  await input.press('Enter')

  await expect(input).toHaveValue(typedUrl)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
})

test('keeps a shared resume URL in the toolbar and clean preview', async ({ page, context }) => {
  await openResume(page)

  await expect(page.getByRole('combobox', { name: '简历 YAML 地址' })).toHaveValue(resumeUrl)

  const previewPagePromise = context.waitForEvent('page')
  await page.getByRole('button', { name: '打开纯净预览' }).click()
  const previewPage = await previewPagePromise
  await previewPage.waitForLoadState()

  await expect(previewPage).toHaveURL(new RegExp(`url=${encodeURIComponent(resumeUrl)}.*mode=preview`))
  await expect(previewPage.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
  await expect(previewPage.getByRole('navigation')).toHaveCount(0)
})

test('supports Menubar, Toolbar, command search, and guarded shortcuts', async ({ page }) => {
  await openResume(page)

  const menubarBox = await page.getByRole('menubar').boundingBox()
  const addressBarBox = await page.getByRole('combobox', { name: '简历 YAML 地址' }).boundingBox()
  expect(menubarBox).not.toBeNull()
  expect(addressBarBox).not.toBeNull()
  expect(menubarBox!.y + menubarBox!.height).toBeLessThan(addressBarBox!.y)

  const fileMenu = page.getByRole('menuitem', { name: '文件', exact: true })
  const viewMenu = page.getByRole('menuitem', { name: '视图', exact: true })
  await fileMenu.focus()
  await fileMenu.press('ArrowRight')
  await expect(viewMenu).toBeFocused()

  const loadButton = page.getByRole('button', { name: '加载简历' })
  await loadButton.focus()
  await loadButton.press('ArrowRight')
  await expect(page.getByRole('button', { name: '打开纯净预览' })).toBeFocused()

  await loadButton.focus()
  await page.keyboard.press('Control+Shift+P')
  const palette = page.getByRole('dialog', { name: '搜索命令' })
  await expect(palette).toBeVisible()

  const commandSearch = page.getByRole('combobox', { name: '搜索命令' })
  await commandSearch.fill('语言')
  await expect(page.getByRole('option', { name: '切换语言' })).toBeVisible()
  await commandSearch.press('Escape')
  await expect(palette).toBeHidden()
  await expect(loadButton).toBeFocused()

  const sourceInput = page.getByRole('combobox', { name: '简历 YAML 地址' })
  await sourceInput.focus()
  await page.keyboard.press('Control+K')
  await expect(palette).toBeHidden()

  await page.keyboard.press('F1')
  await expect(palette).toBeVisible()
})

test('shows the print guide and then opens the print flow', async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => window.dispatchEvent(new Event('beforeprint'))
  })
  await openResume(page)

  await page.getByRole('button', { name: '导出 PDF' }).click()
  await expect(page.getByText('即将打开打印窗口', { exact: true })).toBeVisible()
  await expect(page.getByRole('navigation', { name: '简历工具栏' })).toHaveCount(0, { timeout: 3_000 })
})

test('fits mobile widths, exposes More commands, and switches at the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await openResume(page)

  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 })
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)

    const touchTargets = await page.locator('.app-toolbar__mobile button, .bottom-menu__item').evaluateAll(elements => (
      elements.filter(element => element.getClientRects().length).map((element) => {
        const rect = element.getBoundingClientRect()
        return { height: rect.height, width: rect.width }
      })
    ))
    expect(touchTargets.every(rect => rect.height >= 44 && rect.width >= 44)).toBe(true)
  }

  await expect(page.getByRole('menubar')).toBeHidden()
  await page.getByRole('button', { name: '更多' }).click()
  await expect(page.getByRole('menuitem', { name: /搜索命令/ })).toBeVisible()
  await page.getByRole('menuitem', { name: /搜索命令/ }).click()
  const palette = page.getByRole('dialog', { name: '搜索命令' })
  await expect(palette).toBeVisible()
  await expect(palette).toHaveCSS('width', '375px')
  await page.getByRole('combobox', { name: '搜索命令' }).press('Escape')

  const homeLink = page.getByRole('link', { name: '首页' })
  await expect(homeLink).toHaveAttribute('aria-current', 'page')

  // Leave room for engines that reserve scrollbar width inside the CSS viewport.
  await page.setViewportSize({ width: 800, height: 900 })
  await expect(page.getByRole('menubar')).toBeVisible()
  const sideNavBox = await page.getByRole('navigation', { name: '主导航' }).boundingBox()
  const editorLinkBox = await page.getByRole('link', { name: '编辑器' }).boundingBox()
  const homeLinkBox = await homeLink.boundingBox()
  expect(sideNavBox).not.toBeNull()
  expect(homeLinkBox).not.toBeNull()
  expect(editorLinkBox).not.toBeNull()
  expect(sideNavBox!.x).toBe(0)
  expect(sideNavBox!.y).toBe(104)
  expect(sideNavBox!.width).toBe(76)
  expect(homeLinkBox!.x).toBe(editorLinkBox!.x)
  expect(homeLinkBox!.y).toBeLessThan(editorLinkBox!.y)
  await expect(page.locator('main')).toHaveCSS('padding-left', '76px')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  )
})

test('keeps the desktop side navigation clear of the home layout', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 })
  await page.goto('/about')

  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible()
  await expect(page.locator('main')).toHaveCSS('padding-left', '92px')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  )
})

test('keeps F1 in Monaco and closes overlays before fullscreen', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The Monaco shortcut regression runs once')

  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/editor')

  const monacoInput = page.locator('.monaco-editor textarea')
  await expect(monacoInput).toBeVisible()
  await page.locator('.monaco-editor .view-lines').click({ position: { x: 80, y: 20 } })
  await page.keyboard.press('F1')
  await expect(page.locator('.quick-input-widget')).toBeVisible()
  await expect(page.locator('.command-palette')).toHaveCount(0)
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: '全屏编辑' }).click()
  const exitFullscreen = page.getByRole('button', { name: '退出全屏' })
  await expect(exitFullscreen).toBeVisible()
  await exitFullscreen.press('Control+Shift+P')
  const palette = page.getByRole('dialog', { name: '搜索命令' })
  await expect(palette).toBeVisible()
  await page.getByRole('combobox', { name: '搜索命令' }).press('Escape')
  await expect(palette).toBeHidden()
  await expect(page.getByRole('navigation', { name: '简历工具栏' })).toHaveCount(0)

  await exitFullscreen.press('Escape')
  await expect(page.getByRole('navigation', { name: '简历工具栏' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  )
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
