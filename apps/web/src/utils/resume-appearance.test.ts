import { describe, expect, it } from 'vitest'
import { applyResumeAppearanceToUrl, defaultResumeAppearance, resolveResumeAppearance, resumeAppearanceStyle, resumePalettes } from './resume-appearance'
import { createResumeContentLink } from './resume-share'

describe('resume appearance', () => {
  it('normalizes missing, invalid and untrusted settings without accepting CSS', () => {
    for (const value of [null, [], 'forest', { palette: 'red; background:url(https://example.com)', font: ['serif'], photo: false }])
      expect(resolveResumeAppearance(value)).toEqual(defaultResumeAppearance)
    expect(resolveResumeAppearance({ palette: 'forest', font: 'serif', density: 'dense', photo: 'circle', extra: 'ignored' }))
      .toEqual({ palette: 'forest', font: 'serif', density: 'dense', photo: 'circle' })
  })

  it('carries all appearance choices through both link formats', () => {
    const appearance = { ...defaultResumeAppearance, palette: 'forest', photo: 'circle' } as const
    const source = applyResumeAppearanceToUrl(new URL('https://resume.example/?url=/resume.yml'), appearance)
    const content = new URL(createResumeContentLink('basics: {name: Test}', 'https://resume.example', 'sidebar', appearance))
    for (const url of [source, content])
      expect(resolveResumeAppearance(Object.fromEntries(url.searchParams))).toEqual(appearance)
    expect(resumeAppearanceStyle(appearance)['--resume-theme-accent']).toBe('#166448')
  })

  it('keeps every palette readable against white (WCAG AA normal-text contrast)', () => {
    function luminance(hex: string) {
      const rgb = hex.slice(1).match(/../g)!.map((part) => {
        const channel = Number.parseInt(part, 16) / 255
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
      })
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
    }
    for (const palette of Object.values(resumePalettes)) {
      for (const color of [palette.accent, palette.strong])
        expect(1.05 / (luminance(color) + 0.05)).toBeGreaterThanOrEqual(4.5)
    }
  })
})
