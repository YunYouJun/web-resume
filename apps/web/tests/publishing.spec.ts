import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('shares edited Unicode YAML without publishing it or overwriting recipient storage', async ({ page, browser }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async (text: string) => { (window as any).__copiedLink = text },
    } })
  })
  await page.goto('/?example=neutral&template=sidebar')
  await page.getByRole('link', { name: '编辑器', exact: true }).click()
  await expect(page.locator('.monaco-editor')).toBeVisible()
  await page.evaluate(() => {
    window.monaco!.editor.getEditors()[0]!.setValue('basics:\n  name: 分享测试 👋\n  label: 当前编辑内容\n')
  })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('分享测试 👋')
  await page.getByRole('menuitem', { name: '文件', exact: true }).click()
  await page.getByRole('menuitem', { name: '复制当前内容链接', exact: true }).click()
  await expect.poll(() => page.evaluate(() => (window as any).__copiedLink)).toContain('#resume=')
  const link = await page.evaluate(() => (window as any).__copiedLink as string)
  const recipient = await browser.newContext()
  try {
    await recipient.addInitScript(() => localStorage.setItem('web-resume-text', 'basics:\n  name: Recipient draft\n'))
    const preview = await recipient.newPage()
    const errors: string[] = []
    preview.on('pageerror', error => errors.push(error.message))
    await preview.goto(link)
    await expect(preview.getByRole('heading', { level: 1 })).toContainText('分享测试 👋')
    await expect(preview.locator('.resume')).toHaveAttribute('data-template', 'sidebar')
    await expect(preview.getByRole('navigation', { name: '简历工具栏' })).toHaveCount(0)
    expect(await preview.evaluate(() => localStorage.getItem('web-resume-text'))).toContain('Recipient draft')
    const fragmentOnly = new URL(link)
    fragmentOnly.searchParams.delete('mode')
    await preview.goto(fragmentOnly.toString())
    await expect(preview.getByRole('heading', { level: 1 })).toContainText('分享测试 👋')
    await expect(preview.getByRole('navigation', { name: '简历工具栏' })).toHaveCount(0)
    await preview.goto(`${new URL(link).origin}/?mode=preview#resume=invalid!`)
    await expect(preview.getByRole('alert')).toContainText('Invalid resume share link')
    await expect(preview.locator('.resume')).toHaveCount(0)
    expect(errors).toEqual([])
  }
  finally {
    await recipient.close()
  }
})

for (const template of ['classic', 'compact', 'sidebar']) {
  test(`exports a script-free ${template} HTML resume that renders without the app`, async ({ page, browser }, testInfo) => {
    await page.goto(`/?example=neutral&template=${template}`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('林知行')
    if (template === 'compact') {
      await page.getByRole('link', { name: '编辑器', exact: true }).click()
      await expect(page.locator('.monaco-editor')).toBeVisible()
    }
    await page.getByRole('menuitem', { name: '文件', exact: true }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: '导出独立 HTML', exact: true }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('林知行.html')
    const html = await readFile((await download.path())!, 'utf8')
    expect(html).not.toMatch(/<script[\s>]/i)
    const standalone = await browser.newContext()
    try {
      await standalone.route('**/*', route => route.request().url() === 'https://standalone.example/index.html'
        ? route.fulfill({ body: html, contentType: 'text/html' })
        : route.abort())
      const exported = await standalone.newPage()
      const errors: string[] = []
      exported.on('pageerror', error => errors.push(error.message))
      await exported.goto('https://standalone.example/index.html')
      await expect(exported).toHaveTitle('林知行')
      await expect(exported.getByRole('heading', { level: 1 })).toContainText('林知行')
      await expect(exported.locator('.resume')).toHaveAttribute('data-template', template)
      await expect(exported.locator('button, script, iframe, nav')).toHaveCount(0)
      await expect(exported.locator('.resume')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await exported.screenshot({ path: testInfo.outputPath(`export-${template}.png`), fullPage: true })
      await exported.setViewportSize({ width: 390, height: 844 })
      expect(await exported.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      await expect(exported.getByRole('heading', { level: 1 })).toBeVisible()
      await exported.screenshot({ path: testInfo.outputPath(`export-${template}-mobile.png`), fullPage: true })
      expect(errors).toEqual([])
    }
    finally {
      await standalone.close()
    }
  })
}

test('keeps the resume heading and photo accessible with each template', async ({ page }) => {
  await page.route('**/photo.yml', route => route.fulfill({
    contentType: 'text/yaml',
    body: 'basics:\n  name: Photo Example\n  image: /img/icons/web-resume-app-icon.svg\n',
  }))
  for (const template of ['classic', 'compact', 'sidebar']) {
    await page.goto(`/?url=/photo.yml&template=${template}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Photo Example')
    const photo = page.getByRole('img', { name: 'Photo Example' })
    await expect(photo).toBeVisible()
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
    await expect(page.locator('.resume')).toHaveAttribute('data-template', template)
  }
})

test('waits for lazy Monaco startup before allowing an undoable conversion', async ({ page }) => {
  const legacy = await readFile(new URL('../src/utils/fixtures/legacy.resume.yml', import.meta.url), 'utf8')
  await page.route('**/legacy-delayed.yml', route => route.fulfill({ body: legacy, contentType: 'text/yaml' }))
  let release!: () => void
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/assets/monaco-*.js', async (route) => {
    await ready
    await route.continue()
  })
  try {
    await page.goto('/?url=%2Flegacy-delayed.yml')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('云游君')
    await page.getByRole('link', { name: '编辑器', exact: true }).click()
    await page.getByRole('button', { name: '检查并转换', exact: true }).click()
    const confirm = page.getByRole('button', { name: '转换并写回编辑器', exact: true })
    await expect(confirm).toBeDisabled()
    release()
    await expect(confirm).toBeEnabled()
    await confirm.click()
    await expect(page.getByText('当前使用旧版数据格式', { exact: true })).toHaveCount(0)
    await page.evaluate(() => window.monaco!.editor.getEditors()[0]!.trigger('test', 'undo', null))
    await expect(page.getByText('当前使用旧版数据格式', { exact: true })).toBeVisible()
  }
  finally {
    release()
  }
})
