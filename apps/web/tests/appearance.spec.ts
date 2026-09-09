import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

// Keep the PWA from bypassing the network fixtures in this appearance test.
test.use({ serviceWorkers: 'block' })

const customized = { palette: 'forest', font: 'serif', density: 'dense', photo: 'circle' }

test('customizes appearance, persists it, shares it and exports the same styles', async ({ page, context, browser, browserName }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async (text: string) => { (window as any).__copiedLink = text },
    } })
  })
  await context.route(/^https:\/\/api\.(iconify\.design|simplesvg\.com|unisvg\.com)\//, (route) => {
    const url = new URL(route.request().url())
    const icons = Object.fromEntries((url.searchParams.get('icons')?.split(',') || []).map(name => [name, { body: '<path d="M2 2h12v12H2z"/>' }]))
    return route.fulfill({ json: { prefix: url.pathname.slice(1).replace('.json', ''), icons, width: 16, height: 16 }, headers: { 'Access-Control-Allow-Origin': '*' } })
  })
  await page.goto('/?example=neutral')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林知行')
  const yamlBefore = await page.evaluate(() => localStorage.getItem('web-resume-text'))
  await page.goto('/settings')
  await expect(page).toHaveTitle(/Settings/)
  await page.getByRole('combobox', { name: /默认模板/ }).selectOption('sidebar')
  await page.getByRole('radio', { name: '森林绿', exact: true }).check()
  await page.getByRole('combobox', { name: '简历字体', exact: true }).selectOption('serif')
  await page.getByRole('combobox', { name: '内容间距', exact: true }).selectOption('dense')
  await page.getByRole('combobox', { name: '照片形状', exact: true }).selectOption('circle')
  const preview = page.getByRole('region', { name: '简历外观预览' }).locator('.resume')
  await expect(preview).toHaveAttribute('data-theme', 'forest')
  await expect(preview).toHaveAttribute('data-font', 'serif')
  await expect(preview).toHaveAttribute('data-density', 'dense')
  await expect(preview).toHaveCSS('--resume-theme-accent', '#166448')
  await page.reload()
  await expect(page.getByRole('radio', { name: '森林绿', exact: true })).toBeChecked()
  await expect(page.getByRole('combobox', { name: '照片形状', exact: true })).toHaveValue('circle')
  expect(await page.evaluate(() => localStorage.getItem('web-resume-text'))).toBe(yamlBefore)
  await page.goto('/')
  await expect(page.locator('.resume')).toHaveAttribute('data-theme', 'forest')

  const popupPromise = context.waitForEvent('page')
  await page.getByRole('button', { name: '打开纯净预览', exact: true }).click()
  const popup = await popupPromise
  await expect(popup.locator('.resume')).toHaveAttribute('data-theme', 'forest')
  await expect(popup).toHaveURL(/palette=forest/)
  await popup.close()

  await page.getByRole('menuitem', { name: '文件', exact: true }).click()
  await page.getByRole('menuitem', { name: '复制当前内容链接', exact: true }).click()
  const link = await page.evaluate(() => (window as any).__copiedLink as string)
  expect(link).toContain('photo=circle')
  const recipient = await browser.newContext()
  try {
    await recipient.addInitScript(() => localStorage.setItem('web-resume:resume-appearance', JSON.stringify({ palette: 'plum', font: 'sans', density: 'comfortable', photo: 'rounded' })))
    const shared = await recipient.newPage()
    await shared.goto(link)
    for (const [key, value] of Object.entries(customized))
      await expect(shared.locator('.resume')).toHaveAttribute(`data-${key === 'palette' ? 'theme' : key}`, value)
    expect(await shared.evaluate(() => JSON.parse(localStorage.getItem('web-resume:resume-appearance')!).palette)).toBe('plum')
    await shared.goto(`${new URL(link).origin}/?mode=preview&example=neutral&palette=invalid&font=invalid&photo=invalid`)
    await expect(shared.locator('.resume')).toHaveAttribute('data-theme', 'blue')
    await expect(shared.locator('.resume')).toHaveAttribute('data-photo', 'square')
  }
  finally {
    await recipient.close()
  }

  await page.getByRole('menuitem', { name: '文件', exact: true }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('menuitem', { name: '导出独立 HTML', exact: true }).click()
  const download = await downloadPromise
  const html = await readFile((await download.path())!, 'utf8')
  const exportContext = await browser.newContext({ serviceWorkers: 'block' })
  try {
    const exported = await exportContext.newPage()
    await exported.route('https://appearance.example/index.html', route => route.fulfill({ body: html, contentType: 'text/html' }))
    await exported.goto('https://appearance.example/index.html')
    await expect(exported.locator('.resume')).toHaveCSS('--resume-theme-accent', '#166448')
    await expect(exported.locator('.resume')).toHaveAttribute('data-font', 'serif')
    await exported.emulateMedia({ media: 'print' })
    await expect(exported.locator('.resume')).toHaveCSS('print-color-adjust', 'exact')
    if (browserName === 'chromium') {
      const pdf = await exported.pdf({ format: 'A4', printBackground: true })
      expect(pdf.byteLength).toBeGreaterThan(10_000)
    }
  }
  finally {
    await exportContext.close()
  }
  expect(errors).toEqual([])
})

test('previews photo shapes and resets styles with accessible mobile controls', async ({ page, browserName }) => {
  await page.goto('/settings')
  const section = page.getByRole('region', { name: '简历默认值' })
  const preview = page.getByRole('region', { name: '简历外观预览' })
  const photo = preview.locator('.resume-photo')
  await expect(photo).toBeVisible()
  for (const [shape, radius] of [['square', '0px'], ['rounded', '14px'], ['circle', '50%']]) {
    await page.getByRole('combobox', { name: '照片形状', exact: true }).selectOption(shape)
    await expect(photo).toHaveCSS('border-radius', radius)
  }
  await page.getByRole('radio', { name: '梅子紫', exact: true }).check()
  await preview.screenshot({ path: `/tmp/resume-appearance-${browserName}-desktop.png` })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('radio', { name: '深色', exact: true }).check()
  await expect(page.locator('html')).toHaveClass(/dark/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  for (const control of await section.locator('.settings-field select, .settings-field button, .settings-palettes .settings-segment__option').all())
    expect((await control.boundingBox())!.height, await control.evaluate(el => el.outerHTML)).toBeGreaterThanOrEqual(44)
  await preview.screenshot({ path: `/tmp/resume-appearance-${browserName}-mobile.png` })
  await page.getByRole('button', { name: '重置配色与样式', exact: true }).click()
  await expect(page.getByRole('radio', { name: '经典蓝', exact: true })).toBeChecked()
  await expect(photo).toHaveCSS('border-radius', '0px')
  await expect(page.locator('vite-error-overlay')).toHaveCount(0)
})
