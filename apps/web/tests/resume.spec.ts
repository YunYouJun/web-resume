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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林知行')
  await expect(page.getByRole('button', { name: '导出 PDF' })).toBeEnabled()
})

test('reorders resume sections from the visual editor and updates YAML', async ({ page }) => {
  await page.goto('/?example=neutral')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林知行')
  await page.getByRole('link', { name: '编辑器' }).click()

  const sections = page.locator('.resume-container .resume-section')
  await expect(sections.first()).toContainText('教育背景')

  await sections.first().hover()
  await page.getByRole('button', { name: '下移“教育背景”' }).click()

  await expect(sections.first()).toContainText('代表经历')
  await expect.poll(() => page.evaluate(() => {
    const text = localStorage.getItem('web-resume-text') || ''
    return text.indexOf('    - projects') < text.indexOf('    - education')
  })).toBe(true)

  const dragHandle = page.getByRole('button', { name: '拖拽“代表经历”调整位置' })
  await expect(dragHandle).toHaveAttribute('draggable', 'true')
  await dragHandle.dragTo(sections.nth(1))

  await expect(sections.first()).toContainText('教育背景')
  await expect.poll(() => page.evaluate(() => {
    const text = localStorage.getItem('web-resume-text') || ''
    return text.indexOf('    - education') < text.indexOf('    - projects')
  })).toBe(true)
})

test('reviews, converts, and undoes a legacy resume migration', async ({ page }) => {
  const legacyResume = await readFile(new URL('../src/utils/fixtures/legacy.resume.yml', import.meta.url), 'utf8')
  await page.route('**/legacy-test.resume.yml', route => route.fulfill({ body: legacyResume, contentType: 'text/yaml' }))
  await page.goto(`/?url=${encodeURIComponent('/legacy-test.resume.yml')}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('云游君')
  await page.getByRole('link', { name: '编辑器' }).click()

  const migrationStatus = page.getByText('当前使用旧版数据格式', { exact: true })
  await expect(migrationStatus).toBeVisible()
  await page.getByRole('button', { name: '检查并转换' }).click()

  const dialog = page.getByRole('alertdialog', { name: '转换为标准结构' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/项需要检查/)).toBeVisible()
  await dialog.getByRole('button', { name: '转换并写回编辑器' }).click()

  await expect(migrationStatus).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('云游君')
  await expect.poll(() => page.evaluate(() => {
    const text = localStorage.getItem('web-resume-text') || ''
    return text.includes('x-web-resume:') && text.includes('projects:') && !text.includes('\nproject:')
  })).toBe(true)

  await page.locator('.monaco-editor').click()
  await page.keyboard.press('Control+Z')
  await expect(migrationStatus).toBeVisible()
})

test('downloads a portable JSON Resume without Web Resume extensions', async ({ page }) => {
  await page.goto('/?example=neutral')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林知行')

  await page.getByRole('menuitem', { name: '文件', exact: true }).click()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: '导出标准 JSON Resume' }).click(),
  ])
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const portable = JSON.parse(await readFile(downloadPath!, 'utf8'))

  expect(download.suggestedFilename()).toBe('林知行.resume.json')
  expect(portable.basics.name).toBe('林知行')
  expect(portable).not.toHaveProperty('x-web-resume')
})

test('compares and filters templates with one shared preset data source', async ({ context, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/explore')

  const templateSection = page.getByRole('region', { name: '筛选模板' })
  await expect(templateSection).toBeVisible()
  await expect(templateSection.getByRole('article')).toHaveCount(3)
  await expect(page.getByRole('region', { name: '学习示例' })).toHaveCount(0)
  await expect(page.locator('iframe')).toHaveCount(0)

  const dataSelect = page.getByRole('combobox', { name: '选择预览数据' })
  await expect(dataSelect).toContainText('通用演示数据')
  await expect(page.locator('.resume-preview .resume h1')).toHaveCount(3)
  await expect(page.locator('.resume-preview .resume h1')).toContainText(['林知行', '林知行', '林知行'])

  await dataSelect.click()
  await page.getByRole('option', { name: '应届学生' }).click()
  await expect(dataSelect).toContainText('应届学生')
  await expect(page).toHaveURL(/example=graduate/)
  await expect(page.locator('.resume-preview .resume h1')).toContainText(['林夏', '林夏', '林夏'])
  await expect(page.locator('.resume-preview .resume-projects')).toHaveCount(3)
  await expect(page.locator('.resume-preview .resume-projects')).toContainText([
    '校园无障碍地图',
    '校园无障碍地图',
    '校园无障碍地图',
  ])

  await page.getByRole('button', { name: '专业', exact: true }).click()
  await expect(page).toHaveURL(/category=professional/)
  await expect(templateSection.getByRole('article')).toHaveCount(1)
  await expect(templateSection.getByRole('article')).toContainText('紧凑单页')
  await page.getByRole('button', { name: '全部', exact: true }).click()
  await expect(templateSection.getByRole('article')).toHaveCount(3)

  const sidebarTemplate = templateSection.getByRole('link', { name: '使用专业侧栏模板' })
  await expect(sidebarTemplate).toHaveAttribute('href', /template=sidebar/)
  await expect(sidebarTemplate).toHaveAttribute('href', /example=graduate/)
  await sidebarTemplate.click()

  await expect(page).toHaveURL(/template=sidebar/)
  await expect(page).toHaveURL(/example=graduate/)
  await expect(page.locator('.resume')).toHaveAttribute('data-template', 'sidebar')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林夏')

  const previewPagePromise = context.waitForEvent('page')
  await page.getByRole('button', { name: '打开纯净预览' }).click()
  const previewPage = await previewPagePromise
  await previewPage.waitForLoadState()
  await expect(previewPage).toHaveURL(/template=sidebar/)
  await expect(previewPage).toHaveURL(/example=graduate/)
  await expect(previewPage.locator('.resume')).toHaveAttribute('data-template', 'sidebar')
  await previewPage.close()

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/explore')
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)

  const cardActions = await page.locator('.resume-catalog-card__action').evaluateAll(elements => (
    elements.filter(element => element.getClientRects().length).map((element) => {
      const rect = element.getBoundingClientRect()
      return { height: rect.height, width: rect.width }
    })
  ))
  expect(cardActions.length).toBeGreaterThan(0)
  expect(cardActions.every(rect => rect.height >= 44 && rect.width >= 44)).toBe(true)
  await expect(page.getByRole('combobox', { name: '选择预览数据' })).toHaveCSS('min-height', '44px')
  await expect(page.getByRole('button', { name: '全部', exact: true })).toHaveCSS('min-height', '44px')
})

test('recovers safely from invalid preset and template links', async ({ page }) => {
  await page.goto('/?example=missing&url=%2Fresume%2Fsuzumiya.resume.yml')
  await expect(page.locator('.resume-load-state--error')).toContainText('找不到链接指定的预置数据')
  await expect(page.getByRole('heading', { level: 1, name: '凉宫春日' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: '返回模板库' })).toBeVisible()

  await page.goto('/?example=graduate&template=missing')
  await expect(page.locator('.resume')).toHaveAttribute('data-template', 'classic')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林夏')
  await expect(page.getByText('已使用默认模板', { exact: true })).toBeVisible()
})

test('asks before a preset replaces edited resume data', async ({ page }) => {
  await page.goto('/?example=neutral')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('林知行')
  await page.evaluate(() => {
    const text = localStorage.getItem('web-resume-text') || ''
    localStorage.setItem('web-resume-text', `${text}\n# edited in browser`)
  })

  await page.goto('/explore?example=engineer')
  await page.getByRole('link', { name: '使用清晰经典模板' }).click()
  const confirmation = page.getByRole('alertdialog', { name: '使用预置数据？' })
  await expect(confirmation).toBeVisible()
  await confirmation.getByRole('button', { name: '保留当前简历' }).click()
  await expect(page).toHaveURL(/\/explore/)

  await page.getByRole('link', { name: '使用清晰经典模板' }).click()
  await confirmation.getByRole('button', { name: '使用预置数据' }).click()
  await expect(page).toHaveURL(/example=engineer/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('陈一川')
})

test('uses a neutral interface mark and warm app icon surface', async ({ page }) => {
  const mark = await readFile('public/img/icons/web-resume-mark.svg', 'utf8')
  const appIcon = await readFile('public/img/icons/web-resume-app-icon.svg', 'utf8')

  expect(mark).toContain('#1d1d1f')
  expect(mark).not.toContain('#0078e7')
  expect(appIcon).toContain('#f4f5ef')
  expect(appIcon).toContain('#0078e7')
  expect(appIcon).not.toContain('linearGradient')

  await page.goto('/')
  await expect(page.locator('.resume-empty-state__mark')).toHaveCSS('background-color', 'rgb(244, 245, 239)')
  await expect(page.getByRole('button', { name: '导出 PDF' })).toHaveCSS('background-color', 'rgba(127, 127, 127, 0.12)')
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

test('keeps recent resumes above the desktop navigation and centers the history trigger', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await openResume(page)

  const sourceField = page.locator('.resume-source-input__field')
  const historyTrigger = page.locator('.resume-source-input__history')
  const sourceBox = await sourceField.boundingBox()
  const triggerBox = await historyTrigger.boundingBox()

  expect(sourceBox).not.toBeNull()
  expect(triggerBox).not.toBeNull()
  expect.soft(triggerBox!.y + triggerBox!.height / 2).toBeCloseTo(sourceBox!.y + sourceBox!.height / 2, 1)

  await historyTrigger.click()
  const options = page.locator('.resume-source-input__options')
  await expect(options).toBeVisible()
  await expect(options.getByText('最近使用', { exact: true })).toBeVisible()
  await expect(options.getByText('快速切换已加载过的简历', { exact: true })).toBeVisible()
  await expect(options.getByText('未命名简历', { exact: true })).toBeVisible()
  const optionsBox = await options.boundingBox()
  expect(optionsBox).not.toBeNull()
  expect(optionsBox!.width).toBeLessThanOrEqual(520.5)
  const optionBox = await options.locator('.resume-source-input__option').first().boundingBox()
  expect(optionBox).not.toBeNull()
  expect(optionBox!.height).toBe(44)
  await expect(options.locator('.resume-source-input__option').first()).toHaveAttribute('aria-selected', 'true')
  await expect(options.locator('.resume-source-input__selected')).toBeVisible()
  expect.soft(await page.evaluate(({ x, y }) => {
    return Boolean(document.elementFromPoint(x, y)?.closest('.resume-source-input__options'))
  }, { x: optionsBox!.x + 8, y: optionsBox!.y + 8 })).toBe(true)

  const input = page.getByRole('combobox', { name: '简历 YAML 地址' })
  await input.fill('')
  const example = options.getByRole('option', { name: /示例：涼宮ハルヒ/ })
  await expect(example).toBeVisible()
  await example.click()
  await expect(input).toHaveValue('/resume/suzumiya.resume.yml')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('凉宫春日')
})

test('supports Menubar, Toolbar, command search, and guarded shortcuts', async ({ page }) => {
  await openResume(page)

  const menubarBox = await page.getByRole('menubar').boundingBox()
  const brandLink = page.getByRole('link', { name: 'Web Resume · 首页' })
  const brandBox = await brandLink.boundingBox()
  const addressBarBox = await page.getByRole('combobox', { name: '简历 YAML 地址' }).boundingBox()
  expect(menubarBox).not.toBeNull()
  expect(brandBox).not.toBeNull()
  expect(addressBarBox).not.toBeNull()
  expect(brandBox!.x + brandBox!.width).toBeLessThan(menubarBox!.x)
  expect(menubarBox!.y + menubarBox!.height).toBeLessThan(addressBarBox!.y)

  await brandLink.click()
  await expect(page).toHaveURL('/')

  const fileMenu = page.getByRole('menuitem', { name: '文件', exact: true })
  const viewMenu = page.getByRole('menuitem', { name: '视图', exact: true })
  await fileMenu.focus()
  await fileMenu.press('ArrowRight')
  await expect(viewMenu).toBeFocused()
  await viewMenu.press('Enter')
  await page.getByRole('menuitemradio', { name: '使用专业侧栏模板' }).click()
  await expect(page.locator('.resume')).toHaveAttribute('data-template', 'sidebar')
  await expect(page).toHaveURL(/template=sidebar/)

  const loadButton = page.getByRole('button', { name: '加载简历' })
  await loadButton.focus()
  await loadButton.press('ArrowRight')
  await expect(page.getByRole('button', { name: '打开纯净预览' })).toBeFocused()

  await loadButton.focus()
  await page.keyboard.press('Control+Shift+P')
  const palette = page.getByRole('dialog', { name: '搜索命令' })
  await expect(palette).toBeVisible()

  const commandSearch = page.getByRole('combobox', { name: '搜索命令' })
  await commandSearch.fill('紧凑单页')
  await page.getByRole('option', { name: '使用紧凑单页模板' }).click()
  await expect(page.locator('.resume')).toHaveAttribute('data-template', 'compact')

  await loadButton.focus()
  await page.keyboard.press('Control+Shift+P')
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

test('guides YunLeFun app users to export in the system browser', async ({ page }) => {
  await page.addInitScript(() => {
    let copiedUrl = ''
    Object.defineProperty(window, 'ylf', {
      configurable: true,
      value: { inYunleApp: true },
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copiedUrl = value
        },
      },
    })
    Object.defineProperty(window, '__getCopiedUrl', {
      configurable: true,
      value: () => copiedUrl,
    })
    window.print = () => {
      throw new Error('window.print should not run inside YunLeFun')
    }
  })
  await openResume(page)

  await page.getByRole('button', { name: '导出 PDF' }).click()

  await expect(page.getByText('请在系统浏览器中导出', { exact: true })).toBeVisible()
  await expect(page.getByText('导出链接已复制。请从右上角“更多”选择“系统浏览器打开”，粘贴链接后再次导出。', { exact: true })).toBeVisible()
  const copiedUrl = await page.evaluate(() => (window as typeof window & { __getCopiedUrl: () => string }).__getCopiedUrl())
  expect(copiedUrl).toContain(`url=${encodeURIComponent(resumeUrl)}`)
  await expect(page.getByRole('navigation', { name: '简历工具栏' })).toBeVisible()
})

test('publishes accessible privacy and support routes', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { level: 1, name: '隐私政策' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: '我们处理哪些数据' })).toBeVisible()

  await page.getByRole('link', { name: '帮助与支持' }).last().click()
  await expect(page).toHaveURL('/support')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(page.getByRole('heading', { level: 1, name: '帮助与支持' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'GitHub Issues' })).toBeVisible()
})

test('exposes persistent settings across desktop, keyboard, and mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')

  const settingsLink = page.getByRole('link', { name: '设置', exact: true })
  await expect(settingsLink).toBeVisible()
  const sideNavBox = await page.getByRole('navigation', { name: '主导航' }).boundingBox()
  const settingsBox = await settingsLink.boundingBox()
  expect(sideNavBox).not.toBeNull()
  expect(settingsBox).not.toBeNull()
  expect(settingsBox!.y + settingsBox!.height).toBeLessThanOrEqual(sideNavBox!.y + sideNavBox!.height - 8)
  expect(settingsBox!.y).toBeGreaterThan(sideNavBox!.y + sideNavBox!.height / 2)

  await page.getByRole('menuitem', { name: '文件', exact: true }).click()
  await expect(page.getByRole('menuitem', { name: /打开设置/ })).toBeVisible()
  await page.keyboard.press('Escape')

  await page.keyboard.press('Control+Shift+P')
  await page.getByRole('combobox', { name: '搜索命令' }).fill('设置')
  await expect(page.getByRole('option', { name: /打开设置/ })).toBeVisible()
  await page.keyboard.press('Escape')

  await settingsLink.click()
  await expect(page).toHaveURL('/settings')
  await expect(page.getByRole('heading', { level: 1, name: '设置' })).toBeVisible()

  await page.getByText('深色', { exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByRole('combobox', { name: '界面语言' }).selectOption('en')
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('combobox', { name: 'Default template' }).selectOption('sidebar')

  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByRole('combobox', { name: 'Default template' })).toHaveValue('sidebar')

  await page.goto('/?example=neutral')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.locator('.resume')).toHaveAttribute('data-template', 'sidebar')
  await page.keyboard.press('Control+,')
  await expect(page).toHaveURL('/settings')

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Settings', exact: true })).toBeHidden()
  await page.getByRole('button', { name: 'More' }).click()
  await expect(page.getByRole('menuitem', { name: /Open settings/ })).toBeVisible()
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

    const touchTargets = await page.locator('.app-toolbar__mobile button, .app-toolbar__mobile > a, .bottom-menu__item').evaluateAll(elements => (
      elements.filter(element => element.getClientRects().length).map((element) => {
        const rect = element.getBoundingClientRect()
        return { height: rect.height, width: rect.width }
      })
    ))
    expect(touchTargets.every(rect => rect.height >= 44 && rect.width >= 44)).toBe(true)

    const mobileActionGaps = await page.locator('.app-toolbar__mobile-actions .command-button').evaluateAll((buttons) => {
      const rects = buttons.filter(button => button.getClientRects().length).map(button => button.getBoundingClientRect())
      return rects.slice(1).map((rect, index) => rect.left - rects[index].right)
    })
    await expect(page.locator('.app-toolbar__mobile-actions')).toHaveCSS('gap', '8px')
    expect(mobileActionGaps.every(gap => gap >= 7.5)).toBe(true)
  }

  await expect(page.getByRole('menubar')).toBeHidden()
  const mobileBrand = page.getByRole('link', { name: 'Web Resume · 首页' })
  await expect(mobileBrand).toBeVisible()
  await mobileBrand.click()
  await expect(page).toHaveURL('/')

  await page.getByRole('button', { name: '更多' }).click()
  await expect(page.getByRole('menuitemradio', { name: '使用清晰经典模板' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: '打开纯净预览' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: /搜索命令/ })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: /打开设置/ })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: '帮助与支持' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: '隐私政策' })).toBeVisible()
  await page.getByRole('menuitem', { name: /搜索命令/ }).click()
  const palette = page.getByRole('dialog', { name: '搜索命令' })
  await expect(palette).toBeVisible()
  await expect(palette).toHaveCSS('width', '375px')
  await page.getByRole('combobox', { name: '搜索命令' }).press('Escape')

  const homeLink = page.getByRole('link', { name: '首页', exact: true })
  await expect(homeLink).toHaveAttribute('aria-current', 'page')

  // Leave room for engines that reserve scrollbar width inside the CSS viewport.
  await page.setViewportSize({ width: 800, height: 900 })
  await expect(page.getByRole('menubar')).toBeVisible()
  await expect(page.getByRole('button', { name: '加载简历' })).toHaveCSS('min-height', '36px')
  await expect(page.getByRole('button', { name: '加载简历' })).toHaveCSS('font-size', '13px')
  const sideNavBox = await page.getByRole('navigation', { name: '主导航' }).boundingBox()
  const editorLinkBox = await page.getByRole('link', { name: '编辑器' }).boundingBox()
  const homeLinkBox = await homeLink.boundingBox()
  expect(sideNavBox).not.toBeNull()
  expect(homeLinkBox).not.toBeNull()
  expect(editorLinkBox).not.toBeNull()
  expect(sideNavBox!.x).toBe(0)
  expect(sideNavBox!.y).toBe(96)
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

test('sanitizes executable HTML from remote resumes', async ({ page }) => {
  await page.route('**/malicious.resume.yml', (route) => {
    if (new URL(route.request().url()).pathname !== '/malicious.resume.yml')
      return route.continue()

    return route.fulfill({
      body: `basics:
  name: Safe Example
projects:
  - name: Sanitized Project
    description: '<img src=x onerror="window.__resumeXss=1"><strong>Safe formatting</strong><script>window.__resumeXss=2</script>'
    highlights:
      - '<svg onload="window.__resumeXss=3"></svg><em>Safe highlight</em>'
    keywords:
      - security
    url: 'https://example.com/project'
`,
      contentType: 'text/yaml',
    })
  })

  await page.goto('/?url=/malicious.resume.yml')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Safe Example')
  await expect(page.locator('.resume-projects strong')).toHaveText('Safe formatting')
  await expect(page.locator('.resume-projects em')).toHaveText('Safe highlight')
  await expect(page.locator('.resume-projects img')).toHaveCount(0)
  await expect(page.locator('.resume-projects script, .resume-projects [onerror], .resume-projects [onload]')).toHaveCount(0)
  await expect(page.locator('.resume-project-keywords a')).toHaveAttribute('href', 'https://example.com/project')
  expect(await page.evaluate(() => (window as Window & { __resumeXss?: number }).__resumeXss)).toBeUndefined()
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
    '--template',
    'sidebar',
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
