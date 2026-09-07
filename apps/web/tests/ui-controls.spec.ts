import { expect, test } from '@playwright/test'

for (const width of [390, 1280]) {
  test(`command dialog supports touch close and restores keyboard focus at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/user')
    if (width === 1280) {
      const toolbar = await page.locator('.app-toolbar').boundingBox()
      const navigation = await page.locator('.bottom-menu').boundingBox()
      expect(navigation!.y).toBeGreaterThanOrEqual(toolbar!.y + toolbar!.height)
    }
    const trigger = page.getByRole('link', { name: '我的', exact: true })
    await trigger.focus()
    await page.keyboard.press('Control+Shift+P')
    const dialog = page.getByRole('dialog', { name: '搜索命令' })
    await expect(dialog).toBeVisible()
    const close = dialog.getByRole('button', { name: '关闭', exact: true })
    await expect(close).toBeVisible()
    if (width === 390) {
      const box = await close.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
      expect(box!.width).toBeGreaterThanOrEqual(44)
    }
    await close.click()
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Control+Shift+P')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}

test('mobile profile fields and actions remain accessible in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/settings')
  await page.getByRole('radio', { name: '深色', exact: true }).check()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.goto('/user')
  const name = page.getByRole('textbox', { name: '姓名', exact: true })
  await name.fill('布局验证')
  await expect(name).toBeFocused()
  await expect(name).toHaveValue('布局验证')
  const controls = page.locator('.profile-card--local input, .profile-card--local button')
  for (const control of await controls.all()) {
    const box = await control.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  }
  await page.reload()
  await expect(name).toHaveValue('布局验证')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByRole('button', { name: '清除本机数据', exact: true }).click()
  await expect(page.getByRole('button', { name: '取消', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '取消', exact: true }).click()
  await expect(name).toHaveValue('布局验证')
})
