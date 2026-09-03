import { describe, expect, it } from 'vitest'

import {
  sanitizeResumeHref,
  sanitizeResumeHtml,
  sanitizeResumeImageSource,
} from './resume-content'

describe('sanitizeResumeHtml', () => {
  it('preserves safe inline formatting and hardens links', () => {
    expect(sanitizeResumeHtml('<strong>Built it</strong> with <a href="https://example.com">details</a>')).toBe(
      '<strong>Built it</strong> with <a href="https://example.com" rel="noopener noreferrer" target="_blank">details</a>',
    )
  })

  it('removes executable tags, event handlers, and unsafe protocols', () => {
    const result = sanitizeResumeHtml('<script>alert(1)</script><img src=x onerror="alert(2)"><a href="javascript:alert(3)">open</a>')

    expect(result).toBe('<a rel="noopener noreferrer" target="_blank">open</a>')
  })
})

describe('sanitizeResumeHref', () => {
  it.each([
    'https://example.com',
    'http://example.com',
    'mailto:hello@example.com',
    'tel:+8613800000000',
    '/resume/example.yml',
    '#projects',
  ])('accepts safe resume link %s', (url) => {
    expect(sanitizeResumeHref(url)).toBe(url)
  })

  it.each(['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)'])(
    'rejects unsafe resume link %s',
    (url) => {
      expect(sanitizeResumeHref(url)).toBeUndefined()
    },
  )
})

describe('sanitizeResumeImageSource', () => {
  it.each([
    '/img/logo.svg',
    './logo.svg',
    'logo.svg?version=2',
    'https://cdn.example.com/logo.svg',
    'data:image/svg+xml,%3Csvg%3E%3C/svg%3E',
    'blob:https://example.com/id',
  ])('accepts safe image source %s', (url) => {
    expect(sanitizeResumeImageSource(url)).toBe(url)
  })

  it.each(['javascript:alert(1).svg', 'data:text/html,<script>alert(1)</script>', 'file:///etc/passwd'])(
    'rejects unsafe image source %s',
    (url) => {
      expect(sanitizeResumeImageSource(url)).toBeUndefined()
    },
  )
})
