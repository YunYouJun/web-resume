import { describe, expect, it } from 'vitest'
import { createResumeContentLink, maxSharedResumeBytes, readResumeContentLink } from './resume-share'

describe('resume content links', () => {
  it('round trips Unicode YAML in a fragment and preserves the template', () => {
    const text = 'basics:\n  name: 云游君 👋\n# & + / = #\n'
    const url = new URL(createResumeContentLink(text, 'https://resume.example', 'sidebar'))
    expect(url.searchParams.get('template')).toBe('sidebar')
    expect(url.searchParams.get('mode')).toBe('preview')
    expect(url.search).not.toContain('basics')
    expect(readResumeContentLink(url.hash)).toBe(text)
  })

  it('ignores unrelated anchors and rejects invalid or oversized payloads', () => {
    expect(readResumeContentLink('#education')).toBeUndefined()
    for (const hash of ['#resume=', '#resume=!', '#resume=a', '#resume=_w'])
      expect(() => readResumeContentLink(hash)).toThrow()
    expect(() => createResumeContentLink('云'.repeat(maxSharedResumeBytes), 'https://resume.example', 'classic')).toThrow(/48 KiB/)
    expect(() => readResumeContentLink(`#resume=${'a'.repeat(maxSharedResumeBytes * 2)}`)).toThrow()
  })
})
