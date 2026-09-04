import { afterEach, describe, expect, it, vi } from 'vitest'
// @ts-expect-error Cloudflare Pages functions are plain JavaScript runtime modules.
import { onRequest } from '../../../../functions/api/[[path]].js'

afterEach(() => vi.unstubAllGlobals())

function context(path: string, init: RequestInit = {}, enabled = true) {
  return {
    env: { YLF_CLOUD_API_ENABLED: enabled ? 'true' : 'false' },
    request: new Request(`https://resume.yunle.fun${path}`, init),
  }
}

describe('cloud API proxy boundary', () => {
  it('fails closed while the rollout flag is disabled', async () => {
    const response = await onRequest(context('/api/session', {}, false))
    expect(response.status).toBe(404)
  })

  it('rejects unknown routes and cross-origin mutations', async () => {
    await expect(onRequest(context('/api/admin'))).resolves.toMatchObject({ status: 404 })
    await expect(onRequest(context('/api/documents/save', {
      body: '{}',
      headers: { 'content-type': 'application/json', 'origin': 'https://attacker.example' },
      method: 'POST',
    }))).resolves.toMatchObject({ status: 403 })
  })

  it('forwards only the bounded Web Resume route and request headers', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response('{"ok":true}', {
      headers: { 'content-type': 'application/json', 'set-cookie': '__Host-ylf-web-resume-session=value; Secure; HttpOnly; Path=/' },
      status: 200,
    }))
    vi.stubGlobal('fetch', fetchMock)

    const response = await onRequest(context('/api/documents/save', {
      body: '{}',
      headers: {
        'authorization': 'must-not-forward',
        'cookie': '__Host-ylf-web-resume-session=value',
        'content-type': 'application/json',
        'origin': 'https://resume.yunle.fun',
        'x-csrf-token': 'csrf',
      },
      method: 'POST',
    }))

    const [url, init] = fetchMock.mock.calls[0] || []
    expect(String(url)).toBe('https://drive.yunle.fun/api/v1/web-resume/documents/save')
    expect(new Headers(init?.headers).get('authorization')).toBeNull()
    expect(new Headers(init?.headers).get('x-csrf-token')).toBe('csrf')
    expect(response.headers.get('set-cookie')).toContain('__Host-ylf-web-resume-session=')
    expect(response.headers.get('cache-control')).toBe('no-store')
  })
})
