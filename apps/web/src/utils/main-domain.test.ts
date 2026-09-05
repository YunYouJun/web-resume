import { afterEach, describe, expect, it, vi } from 'vitest'
// @ts-expect-error Worker entry is a plain JavaScript runtime module.
import worker from '../../../../workers/main-domain.js'

afterEach(() => vi.unstubAllGlobals())

describe('main domain routing', () => {
  it('preserves the registered origin for login instead of routing through the mirror', async () => {
    const upstream = vi.fn(async (_url: URL, _init: RequestInit) => Response.json({ ok: true }))
    vi.stubGlobal('fetch', upstream)
    const response = await worker.fetch(new Request('https://resume.yunle.fun/api/session/login', {
      method: 'POST',
      headers: { origin: 'https://resume.yunle.fun' },
      body: '{}',
    }), { YLF_LOGIN_API_ENABLED: 'true' })
    expect(response.status).toBe(200)
    expect(String(upstream.mock.calls[0]?.[0])).toBe('https://drive.yunle.fun/api/v1/web-resume/session/login')
    expect(new Headers(upstream.mock.calls[0]?.[1]?.headers).get('origin')).toBe('https://resume.yunle.fun')
  })

  it('does not send the main-domain session cookie to the static mirror', async () => {
    const upstream = vi.fn(async (_request: Request) => new Response('resume'))
    vi.stubGlobal('fetch', upstream)
    await worker.fetch(new Request('https://resume.yunle.fun/user', {
      headers: { cookie: '__Host-ylf-web-resume-session=private' },
    }), {})
    const request = upstream.mock.calls[0]![0]
    expect(request.url).toBe('https://resume.elpsy.cn/user')
    expect(request.headers.get('cookie')).toBeNull()
  })
})
