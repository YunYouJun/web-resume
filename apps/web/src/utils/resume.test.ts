import { describe, expect, it } from 'vitest'

import { isImageLogo, reorderResumeSectionBlocks } from './resume'

describe('isImageLogo', () => {
  it.each([
    '/img/project.svg',
    './project.svg',
    '../project.png',
    'https://cdn.example.com/project.svg',
    '//cdn.example.com/project.webp',
    'data:image/svg+xml,%3Csvg%3E%3C/svg%3E',
    'blob:https://example.com/asset-id',
    'project.svg?version=2#logo',
  ])('recognizes image logo source %s', (logo) => {
    expect(isImageLogo(logo)).toBe(true)
  })

  it.each([
    'ri:github-line',
    'simple-icons:vue.js',
    'mdi:briefcase-outline',
  ])('keeps Iconify logo %s as an icon name', (logo) => {
    expect(isImageLogo(logo)).toBe(false)
  })
})

describe('reorderResumeSectionBlocks', () => {
  it('reorders only resume section blocks and preserves formatting and comments', () => {
    const source = `# resume\n\nbasics:\n  name: Ada\n\neducation:\n  # keep this comment\n  title: Education\n\nfooter:\n  link: example.test\n\nproject:\n  title: Projects\n`

    const result = reorderResumeSectionBlocks(source, ['project', 'education'])

    expect(result.indexOf('project:')).toBeLessThan(result.indexOf('education:'))
    expect(result).toContain('# keep this comment')
    expect(result).toContain('footer:\n  link: example.test')
    expect(result.startsWith('# resume\n\nbasics:')).toBe(true)
  })

  it('leaves documents with duplicate section keys unchanged', () => {
    const source = `education:\n  title: First\neducation:\n  title: Second\nproject:\n  title: Project\n`

    expect(reorderResumeSectionBlocks(source, ['project', 'education'])).toBe(source)
  })
})
