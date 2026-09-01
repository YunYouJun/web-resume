import { expect, test } from '@playwright/test'

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
