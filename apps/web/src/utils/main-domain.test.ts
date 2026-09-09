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
    expect(request.url).toBe('https://web-resume.yunyoujun.cn/user')
    expect(request.headers.get('cookie')).toBeNull()
  })
})

describe('main domain gateway', () => {
  const env = { YLF_LOGIN_API_ENABLED: 'true', YLF_CLOUD_API_ENABLED: 'false' }

  it('serves EdgeOne assets without forwarding account credentials', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response('page'))
    vi.stubGlobal('fetch', fetchMock)
    await worker.fetch(new Request('https://resume.yunle.fun/settings?theme=dark', {
      headers: { cookie: 'session=private', authorization: 'Bearer private' },
    }), env)
    const forwarded = fetchMock.mock.calls[0]![0] as Request
    expect(forwarded.url).toBe('https://web-resume.yunyoujun.cn/settings?theme=dark')
    expect(forwarded.headers.has('cookie')).toBe(false)
    expect(forwarded.headers.has('authorization')).toBe(false)
  })

  it('keeps EdgeOne redirects on the main domain', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, {
      status: 301,
      headers: { location: 'https://web-resume.yunyoujun.cn/docs/' },
    })))
    const response = await worker.fetch(new Request('https://resume.yunle.fun/docs'), env)
    expect(response.headers.get('location')).toBe('https://resume.yunle.fun/docs/')
  })

  it('routes sessions to Drive and keeps cloud storage disabled', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) => Response.json({ session: null }))
    vi.stubGlobal('fetch', fetchMock)
    const response = await worker.fetch(new Request('https://resume.yunle.fun/api/session'), env)
    expect(response.headers.get('content-type')).toContain('application/json')
    expect(String(fetchMock.mock.calls[0]![0])).toBe('https://drive.yunle.fun/api/v1/web-resume/session')
    const blocked = await worker.fetch(new Request('https://resume.yunle.fun/api/documents'), env)
    expect(blocked.status).toBe(404)
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
