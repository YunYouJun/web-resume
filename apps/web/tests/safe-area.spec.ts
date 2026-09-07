import { expect, test } from '@playwright/test'

for (const bottom of [0, 34]) {
  test(`mobile navigation reserves ${bottom}px safe area without shrinking touch targets`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/user')
    await page.addStyleTag({ content: `:root { --safe-area-inset-top: 59px; --safe-area-inset-bottom: ${bottom}px; }` })
    await expect(page.getByRole('heading', { name: '账号与资料' })).toBeVisible()
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/)
    const bounds = await page.locator('.bottom-menu').evaluate((nav) => {
      const link = nav.querySelector('a')!
      return {
        height: nav.getBoundingClientRect().height,
        itemHeight: link.getBoundingClientRect().height,
        bottomGap: window.innerHeight - link.getBoundingClientRect().bottom,
        reserved: Number.parseFloat(getComputedStyle(document.querySelector('main')!).paddingBottom),
      }
    })
    expect(bounds.height).toBe(64 + bottom)
    expect(bounds.reserved).toBe(bounds.height)
    expect(bounds.itemHeight).toBeGreaterThanOrEqual(44)
    expect(bounds.bottomGap).toBeGreaterThanOrEqual(bottom + 6)
    await page.getByRole('link', { name: '发现', exact: true }).click()
    await expect(page).toHaveURL(/\/explore$/)
  })
}

test('wide landscape keeps sidebar and content clear of the notch', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 })
  await page.goto('/user')
  await page.addStyleTag({ content: ':root { --safe-area-inset-left: 59px; --safe-area-inset-right: 59px; --safe-area-inset-bottom: 21px; }' })
  const bounds = await page.evaluate(() => {
    const main = document.querySelector('main')!
    const nav = document.querySelector('.bottom-menu')!
    const first = nav.querySelector('a')!
    return {
      itemLeft: first.getBoundingClientRect().left,
      reservedLeft: Number.parseFloat(getComputedStyle(main).paddingLeft),
      reservedRight: Number.parseFloat(getComputedStyle(main).paddingRight),
      navWidth: nav.getBoundingClientRect().width,
      settingsBottom: nav.lastElementChild!.getBoundingClientRect().bottom,
      itemHeight: first.getBoundingClientRect().height,
    }
  })
  expect(bounds.itemLeft).toBeGreaterThanOrEqual(59)
  expect(bounds.reservedLeft).toBe(bounds.navWidth)
  expect(bounds.reservedRight).toBe(59)
  expect(bounds.settingsBottom).toBeLessThanOrEqual(390 - 21)
  expect(bounds.itemHeight).toBeGreaterThanOrEqual(44)
})
