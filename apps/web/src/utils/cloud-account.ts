import type {
  SsoAuthorizationResult,
  SsoIdentityAdoptionAuth,
} from '@yunlefun/sso/browser'
import type { CloudSession } from '~/types'
import { consumeSsoRedirect, startSsoRedirect } from '@yunlefun/sso'
import {
  adoptSsoIdentityProof,
  requestHostSsoAuthorization,
  SsoIdentityAdoptionError,
} from '@yunlefun/sso/browser'

interface SimpleStorage {
  getItem: (key: string) => Promise<string | null>
  getItemSync: (key: string) => string | null
  removeItem: (key: string) => Promise<void>
  removeItemSync: (key: string) => void
  setItem: (key: string, value: string) => Promise<void>
  setItemSync: (key: string, value: string) => void
}

interface TransientAuth {
  auth: SsoIdentityAdoptionAuth & { signOut: () => Promise<unknown> }
}

export interface WebResumeCloudConfig {
  apiBase: string
  cloudbaseEnvId: string
  enabled: boolean
  loginEnabled: boolean
  ssoClientId: string
  ssoExchangeUrl: string
  ssoOrigin: string
  ssoRedirectUri: string
}

const DEFAULT_CLOUDBASE_ENV_ID = 'yunlefun-8g7ybcxc7345c490'
const DEFAULT_SSO_ORIGIN = 'https://www.yunle.fun'
const DEFAULT_SSO_EXCHANGE_URL = 'https://api.yunle.fun/sso-ticket'

export function isSupportedWebResumeOrigin(origin: string): boolean {
  return origin === 'https://resume.yunle.fun'
    || origin === 'https://resume.yunle.localhost:3455'
}

export function getWebResumeCloudConfig(): WebResumeCloudConfig {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return {
    apiBase: String(import.meta.env.VITE_YLF_CLOUD_API_BASE || '/api').replace(/\/$/, ''),
    cloudbaseEnvId: import.meta.env.VITE_YLF_CLOUDBASE_ENV_ID || DEFAULT_CLOUDBASE_ENV_ID,
    enabled: import.meta.env.VITE_YLF_CLOUD_ENABLED === 'true' && isSupportedWebResumeOrigin(origin),
    loginEnabled: (import.meta.env.VITE_YLF_LOGIN_ENABLED ?? import.meta.env.VITE_YLF_CLOUD_ENABLED) === 'true' && isSupportedWebResumeOrigin(origin),
    ssoClientId: import.meta.env.VITE_YLF_SSO_CLIENT_ID || 'web-resume-web',
    ssoExchangeUrl: import.meta.env.VITE_YLF_SSO_EXCHANGE_URL || DEFAULT_SSO_EXCHANGE_URL,
    ssoOrigin: import.meta.env.VITE_YLF_SSO_ORIGIN || DEFAULT_SSO_ORIGIN,
    ssoRedirectUri: `${origin}/user`,
  }
}

export async function beginWebResumeLogin(config: WebResumeCloudConfig): Promise<CloudSession | undefined> {
  const authorization = await requestHostSsoAuthorization({
    clientId: config.ssoClientId,
    prompt: 'consent',
    redirectUri: config.ssoRedirectUri,
    scope: ['identity:bootstrap'],
    ssoOrigin: config.ssoOrigin,
  })
  if (authorization)
    return exchangeWebResumeAuthorization(authorization, config)

  await startSsoRedirect({
    clientId: config.ssoClientId,
    prompt: 'select_account',
    redirectUri: config.ssoRedirectUri,
    scope: ['identity:bootstrap'],
    ssoOrigin: config.ssoOrigin,
  })
  return undefined
}

export async function consumeWebResumeLogin(config: WebResumeCloudConfig): Promise<CloudSession | undefined> {
  const authorization = consumeSsoRedirect()
  if (!authorization)
    return undefined
  if (!authorization.ok)
    throw new Error(`YunLeFun login failed: ${authorization.reason}`)
  return exchangeWebResumeAuthorization(authorization, config)
}

export async function exchangeWebResumeAuthorization(
  authorization: SsoAuthorizationResult,
  config: WebResumeCloudConfig,
): Promise<CloudSession> {
  const { auth } = await createTransientAuth(config.cloudbaseEnvId)
  try {
    const proof = await adoptSsoIdentityProof(auth, authorization, {
      exchangeUrl: config.ssoExchangeUrl,
    })
    const response = await fetch(`${config.apiBase}/session/login`, {
      body: JSON.stringify(proof),
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    const payload: unknown = await response.json().catch(() => null)
    if (!response.ok)
      throw new Error(readApiMessage(payload) || 'Web Resume session exchange failed')
    const session = readCloudSession(payload)
    if (!session)
      throw new Error('Web Resume session exchange returned invalid data')
    return session
  }
  catch (error) {
    if (error instanceof SsoIdentityAdoptionError && error.reason === 'phone_verification_required')
      throw new Error('A verified YunLeFun phone number is required')
    throw error
  }
  finally {
    await auth.signOut().catch(() => undefined)
  }
}

export function readApiMessage(value: unknown): string | undefined {
  if (!isRecord(value))
    return undefined
  return typeof value.statusMessage === 'string'
    ? value.statusMessage
    : typeof value.message === 'string' ? value.message : undefined
}

export function readCloudSession(value: unknown): CloudSession | undefined {
  if (!isRecord(value) || !isRecord(value.session))
    return undefined
  const session = value.session
  if (!isRecord(session.user))
    return undefined
  const user = session.user
  if (typeof session.id !== 'string' || typeof user.uid !== 'string')
    return undefined
  if (user.accountStatus !== 'active' || user.phoneVerified !== true)
    return undefined
  return {
    id: session.id,
    user: {
      accountStatus: user.accountStatus,
      phoneVerified: user.phoneVerified,
      uid: user.uid,
      ...(typeof user.avatarUrl === 'string' ? { avatarUrl: user.avatarUrl } : {}),
      ...(typeof user.handle === 'string' ? { handle: user.handle } : {}),
      ...(typeof user.name === 'string' ? { name: user.name } : {}),
    },
  }
}

async function createTransientAuth(cloudbaseEnvId: string): Promise<TransientAuth> {
  const { default: cloudbase } = await import('@cloudbase/js-sdk')
  const storage = createMemoryStorage()
  const app = cloudbase.init({
    auth: { detectSessionInUrl: false, storage },
    env: cloudbaseEnvId,
    region: 'ap-shanghai',
  } as unknown as Parameters<typeof cloudbase.init>[0])
  return {
    auth: app.auth({
      persistence: 'none',
      storage,
    } as unknown as Parameters<typeof app.auth>[0]) as unknown as TransientAuth['auth'],
  }
}

function createMemoryStorage(): SimpleStorage {
  const values = new Map<string, string>()
  return {
    async getItem(key) { return values.get(key) ?? null },
    getItemSync: key => values.get(key) ?? null,
    async removeItem(key) { values.delete(key) },
    removeItemSync: key => void values.delete(key),
    async setItem(key, value) { values.set(key, value) },
    setItemSync: (key, value) => void values.set(key, value),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export type CloudAccountProfile = Pick<CloudSession['user'], 'uid' | 'name' | 'handle' | 'avatarUrl'>

/** Presentation cache only: a server-confirmed session is required before restoring it. */
export function restoreCloudAccountProfile(session: CloudSession | undefined, cached: unknown): CloudSession | undefined {
  if (!session || !isRecord(cached) || cached.uid !== session.user.uid)
    return session
  const user = { ...session.user }
  for (const field of ['name', 'handle', 'avatarUrl'] as const) {
    if (user[field] === undefined && typeof cached[field] === 'string')
      user[field] = cached[field]
  }
  return { ...session, user }
}

/** Never persist session identifiers, credentials, or authorization flags. */
export function cloudAccountProfile(session: CloudSession | undefined): CloudAccountProfile | null {
  if (!session)
    return null
  const { uid, name, handle, avatarUrl } = session.user
  return { uid, name, handle, avatarUrl }
}
