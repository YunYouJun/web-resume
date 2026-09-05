import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWebResumeCloudConfig, isSupportedWebResumeOrigin, readApiMessage, readCloudSession } from './cloud-account'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('cloud account response parsing', () => {
  it('enables main-domain login separately from cloud sync and keeps mirrors local', () => {
    vi.stubEnv('VITE_YLF_LOGIN_ENABLED', 'true')
    vi.stubEnv('VITE_YLF_CLOUD_ENABLED', 'false')
    vi.stubGlobal('window', { location: { origin: 'https://resume.yunle.fun' } })
    expect(getWebResumeCloudConfig()).toMatchObject({ loginEnabled: true, enabled: false })
    vi.stubGlobal('window', { location: { origin: 'https://resume.elpsy.cn' } })
    expect(getWebResumeCloudConfig()).toMatchObject({ loginEnabled: false, enabled: false })
  })

  it('enables login only on the registered production and development origins', () => {
    expect(isSupportedWebResumeOrigin('https://resume.yunle.fun')).toBe(true)
    expect(isSupportedWebResumeOrigin('https://resume.yunle.localhost:3455')).toBe(true)
    expect(isSupportedWebResumeOrigin('https://resume.yunle.localhost:3000')).toBe(false)
    expect(isSupportedWebResumeOrigin('https://resume.example.com')).toBe(false)
    expect(isSupportedWebResumeOrigin('http://resume.yunle.fun')).toBe(false)
  })

  it('accepts only the public session shape', () => {
    expect(readCloudSession({
      session: {
        id: 'session-1',
        user: {
          accountStatus: 'active',
          name: 'Yun',
          phoneVerified: true,
          uid: 'user-1',
        },
      },
    })).toEqual({
      id: 'session-1',
      user: {
        accountStatus: 'active',
        name: 'Yun',
        phoneVerified: true,
        uid: 'user-1',
      },
    })
    expect(readCloudSession({ session: { id: 'session-1', user: { uid: 'user-1' } } })).toBeUndefined()
    expect(readCloudSession({
      session: {
        id: 'session-1',
        user: { accountStatus: 'suspended', phoneVerified: true, uid: 'user-1' },
      },
    })).toBeUndefined()
  })

  it('returns only documented API error fields', () => {
    expect(readApiMessage({ statusMessage: 'safe' })).toBe('safe')
    expect(readApiMessage({ internal: 'secret' })).toBeUndefined()
  })
})
