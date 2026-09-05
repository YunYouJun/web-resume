import { afterEach, describe, expect, it, vi } from 'vitest'
import { cloudAccountProfile, getWebResumeCloudConfig, isSupportedWebResumeOrigin, readApiMessage, readCloudSession, restoreCloudAccountProfile } from './cloud-account'

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

describe('account display profile restoration', () => {
  const session = { id: 'server-session', user: { uid: 'user-1', accountStatus: 'active' as const, phoneVerified: true } }
  const cached = { uid: 'user-1', name: 'Yun', handle: 'yun', id: 'untrusted', phoneVerified: false }

  it('restores display fields only after the server confirms the same account', () => {
    expect(restoreCloudAccountProfile(session, cached)).toEqual({
      ...session,
      user: { ...session.user, name: 'Yun', handle: 'yun' },
    })
    expect(restoreCloudAccountProfile(undefined, cached)).toBeUndefined()
    expect(restoreCloudAccountProfile(session, { ...cached, uid: 'someone-else' })).toEqual(session)
  })

  it('keeps fresh profile fields and discards invalid cached fields', () => {
    const fresh = { ...session, user: { ...session.user, name: 'Updated' } }
    expect(restoreCloudAccountProfile(fresh, { ...cached, handle: 123 })).toEqual(fresh)
  })

  it('persists presentation fields only and clears them without a session', () => {
    expect(cloudAccountProfile(restoreCloudAccountProfile(session, cached))).toEqual({ uid: 'user-1', name: 'Yun', handle: 'yun' })
    expect(cloudAccountProfile(undefined)).toBeNull()
  })
})
