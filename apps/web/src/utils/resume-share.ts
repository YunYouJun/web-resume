import type { ResumeTemplateId } from '~/types'

// Keep accidental image/base64 pastes from producing unmanageable URLs.
export const maxSharedResumeBytes = 48 * 1024
const prefix = '#resume='

export function createResumeContentLink(text: string, origin: string, template: ResumeTemplateId) {
  const bytes = new TextEncoder().encode(text)
  if (bytes.length > maxSharedResumeBytes)
    throw new Error('Resume exceeds the 48 KiB share-link limit')
  const encoded = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  const url = new URL('/', origin)
  url.searchParams.set('mode', 'preview')
  url.searchParams.set('template', template)
  url.hash = `resume=${encoded}`
  return url.toString()
}

export function readResumeContentLink(hash: string) {
  if (!hash.startsWith(prefix))
    return undefined
  const encoded = hash.slice(prefix.length)
  if (!encoded || encoded.length > Math.ceil(maxSharedResumeBytes * 4 / 3) || !/^[\w-]+$/.test(encoded))
    throw new Error('Invalid resume share link')
  const bytes = Uint8Array.from(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  if (bytes.length > maxSharedResumeBytes)
    throw new Error('Resume exceeds the 48 KiB share-link limit')
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}
