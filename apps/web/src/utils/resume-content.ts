import sanitizeHtml from 'sanitize-html'

const allowedLinkProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:'])
const safeHtmlOptions: sanitizeHtml.IOptions = {
  allowedAttributes: {
    a: ['href', 'rel', 'target', 'title'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  allowedTags: [
    'a',
    'abbr',
    'b',
    'br',
    'code',
    'em',
    'i',
    'mark',
    's',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'u',
  ],
  transformTags: {
    a: (_tagName, attribs) => ({
      attribs: {
        ...(attribs.href ? { href: attribs.href } : {}),
        rel: 'noopener noreferrer',
        target: '_blank',
        ...(attribs.title ? { title: attribs.title } : {}),
      },
      tagName: 'a',
    }),
  },
}

/** Keeps lightweight inline formatting while removing executable HTML. */
export function sanitizeResumeHtml(value: string | undefined) {
  return sanitizeHtml(value || '', safeHtmlOptions)
}

/** Allows only navigation protocols that are useful in resume content. */
export function sanitizeResumeHref(value: string | undefined) {
  const source = value?.trim()
  if (!source)
    return undefined

  try {
    const url = new URL(source, 'https://resume.invalid')
    return allowedLinkProtocols.has(url.protocol) ? source : undefined
  }
  catch {
    return undefined
  }
}

/** Allows web, local and inline image sources, including SVG images. */
export function sanitizeResumeImageSource(value: string | undefined) {
  const source = value?.trim()
  if (!source)
    return undefined

  if (/^data:image\/(?:avif|gif|jpe?g|png|svg\+xml|webp)[;,]/i.test(source))
    return source
  if (/^blob:/i.test(source))
    return source
  if (/^\.{0,2}\//.test(source))
    return source

  try {
    const url = new URL(source, 'https://resume.invalid')
    return url.protocol === 'http:' || url.protocol === 'https:' ? source : undefined
  }
  catch {
    return undefined
  }
}
