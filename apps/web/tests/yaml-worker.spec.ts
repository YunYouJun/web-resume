import { expect, test } from '@playwright/test'

test('YAML worker formats, validates and completes a resume', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/editor')
  await expect(page.locator('.monaco-editor').first()).toBeVisible()

  const formatted = await page.evaluate(async () => {
    const editor = window.monaco!.editor.getEditors()[0]!
    editor.setValue('basics: {name: Test}\n')
    await editor.getAction('editor.action.formatDocument')!.run()
    return editor.getValue()
  })
  expect(formatted).toBe('basics: { name: Test }\n')

  await page.evaluate(() => {
    window.monaco!.editor.getEditors()[0]!.setValue('basics:\n  name: 42\n')
  })
  await expect.poll(() => page.evaluate(() => window.monaco!.editor.getModelMarkers({ owner: 'yaml' })
    .map(marker => marker.message)
    .join('\n'))).toMatch(/string/i)

  await page.evaluate(() => {
    const editor = window.monaco!.editor.getEditors()[0]!
    editor.setValue('basics:\n  na')
    editor.setPosition({ lineNumber: 2, column: 5 })
    editor.focus()
    editor.trigger('test', 'editor.action.triggerSuggest', {})
  })
  await expect(page.locator('.suggest-widget.visible')).toContainText('name')
  expect(errors).toEqual([])
})
