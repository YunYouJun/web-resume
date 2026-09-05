import type {
  CloudResumeBinding,
  CloudResumeDocument,
  CloudSession,
  CloudStorageQuota,
  CloudSyncStatus,
} from '~/types'
import { useStorage, watchDebounced } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { namespace } from '~/utils'
import {
  beginWebResumeLogin,
  consumeWebResumeLogin,
  getWebResumeCloudConfig,
  readApiMessage,
  readCloudSession,
} from '~/utils/cloud-account'

interface DocumentsResponse {
  documents: CloudResumeDocument[]
  quota: CloudStorageQuota
}

interface BeginSaveResponse {
  conflictCreated: boolean
  document: CloudResumeDocument
  reservationId: string
  upload: {
    headers?: Record<string, string>
    method: 'PUT'
    url: string
  }
}

const WEB_RESUME_UPLOAD_HOST = 'yunlefun-private-1325586649.cos.ap-shanghai.myqcloud.com'

export const useCloudStore = defineStore('cloud', () => {
  const app = useAppStore()
  const editor = useEditorStore()
  const config = getWebResumeCloudConfig()

  const session = ref<CloudSession>()
  const documents = ref<CloudResumeDocument[]>([])
  const trashedDocuments = ref<CloudResumeDocument[]>([])
  const quota = ref<CloudStorageQuota>()
  const status = ref<CloudSyncStatus>(config.loginEnabled ? 'loading' : 'disabled')
  const errorMessage = ref('')
  const lastSavedAt = ref<number>()
  const conflictCreated = ref(false)
  const activeBinding = skipHydrate(useStorage<CloudResumeBinding | null>(`${namespace}:cloud-resume`, null))

  let csrfToken = ''
  let initialized = false
  let savePromise: Promise<void> | undefined
  let saveAgain = false
  let lastSyncedText = ''

  const isAuthenticated = computed(() => Boolean(session.value))
  const activeDocument = computed(() => documents.value.find(document => document._id === activeBinding.value?.documentId))

  watchDebounced(
    () => editor.resumeText,
    () => {
      if (!config.enabled || !session.value || !activeBinding.value || editor.resumeText === lastSyncedText)
        return
      void saveCurrentResume().catch(() => undefined)
    },
    { debounce: 2000, maxWait: 8000 },
  )

  async function bootstrap() {
    if (!config.loginEnabled || initialized)
      return
    initialized = true
    status.value = 'loading'
    errorMessage.value = ''
    try {
      session.value = await consumeWebResumeLogin(config) ?? await fetchSession()
      if (!session.value) {
        status.value = 'anonymous'
        return
      }
      await refreshCsrf()
      if (config.enabled)
        await loadDocuments()
      status.value = 'ready'
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
    }
  }

  async function login() {
    if (!config.loginEnabled)
      return
    status.value = 'loading'
    errorMessage.value = ''
    try {
      const nextSession = await beginWebResumeLogin(config)
      if (!nextSession)
        return
      session.value = nextSession
      await refreshCsrf()
      if (config.enabled)
        await loadDocuments()
      status.value = 'ready'
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
    }
  }

  async function logout() {
    if (!session.value)
      return
    errorMessage.value = ''
    try {
      await cloudRequest('/session', { method: 'DELETE' }, true)
      session.value = undefined
      documents.value = []
      trashedDocuments.value = []
      quota.value = undefined
      csrfToken = ''
      status.value = 'anonymous'
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
      throw error
    }
  }

  async function loadDocuments() {
    if (!session.value)
      return
    errorMessage.value = ''
    try {
      const [active, trash] = await Promise.all([
        cloudRequest<DocumentsResponse>('/documents'),
        cloudRequest<DocumentsResponse>('/documents?state=trashed'),
      ])
      documents.value = active.documents
      trashedDocuments.value = trash.documents
      quota.value = active.quota
      if (activeBinding.value && !documents.value.some(document => document._id === activeBinding.value?.documentId))
        activeBinding.value = null
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
      throw error
    }
  }

  async function openDocument(documentId: string) {
    errorMessage.value = ''
    try {
      const payload = await cloudRequest<{ document: CloudResumeDocument, text: string }>(`/documents/${encodeURIComponent(documentId)}`)
      activeBinding.value = {
        documentId: payload.document._id,
        name: payload.document.name,
        version: payload.document.version,
      }
      lastSyncedText = payload.text
      editor.setResumeText(payload.text)
      editor.setResumeBaseline(payload.text)
      editor.codeEditor?.setValue(payload.text)
      app.curResume = { id: payload.document._id, title: payload.document.name, url: '' }
      app.showToast({ title: payload.document.name, description: 'Cloud resume loaded' })
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
      throw error
    }
  }

  async function createDocument(name: string) {
    if (!session.value)
      throw new Error('Sign in before saving to YunLeFun Drive')
    if (savePromise)
      await savePromise.catch(() => undefined)
    activeBinding.value = null
    await saveCurrentResume(name)
  }

  async function saveCurrentResume(firstSaveName?: string) {
    if (!session.value)
      return
    if (savePromise) {
      saveAgain = true
      return savePromise
    }
    savePromise = performSave(firstSaveName)
      .finally(async () => {
        savePromise = undefined
        if (saveAgain) {
          saveAgain = false
          if (editor.resumeText !== lastSyncedText)
            await saveCurrentResume()
        }
      })
    return savePromise
  }

  async function performSave(firstSaveName?: string) {
    const currentText = editor.resumeText
    if (!currentText)
      throw new Error('Resume content is empty')
    const binding = activeBinding.value
    const name = firstSaveName?.trim() || binding?.name
    if (!name)
      throw new Error('Name this resume before its first cloud save')
    status.value = 'saving'
    errorMessage.value = ''
    try {
      const bytes = new TextEncoder().encode(currentText)
      if (bytes.byteLength > 2 * 1024 * 1024)
        throw new Error('Cloud resumes cannot exceed 2 MiB')
      const checksum = await sha256Hex(bytes)
      const begin = await cloudRequest<BeginSaveResponse>('/documents/save', {
        body: JSON.stringify({
          contentSha256: checksum,
          ...(binding ? { documentId: binding.documentId, expectedVersion: binding.version } : {}),
          name,
          sizeBytes: bytes.byteLength,
          templateId: app.resumeTemplateId,
          validationStatus: editor.resumeJson ? 'valid' : 'draft-invalid',
        }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      }, true)
      await uploadYaml(begin.upload, bytes)
      const completed = await cloudRequest<CloudResumeDocument>(`/uploads/${encodeURIComponent(begin.reservationId)}/complete`, {
        method: 'POST',
      }, true)
      activeBinding.value = {
        documentId: completed._id,
        name: completed.name,
        version: completed.version,
      }
      conflictCreated.value = begin.conflictCreated
      lastSyncedText = currentText
      lastSavedAt.value = Date.now()
      await loadDocuments()
      status.value = 'ready'
      app.showToast({
        title: begin.conflictCreated ? 'Conflict copy saved' : 'Saved to YunLeFun Drive',
        description: completed.name,
      })
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
      throw error
    }
  }

  async function renameDocument(documentId: string, name: string) {
    await mutateDocument(async () => {
      const updated = await cloudRequest<CloudResumeDocument>(`/documents/${encodeURIComponent(documentId)}`, {
        body: JSON.stringify({ name }),
        headers: { 'content-type': 'application/json' },
        method: 'PATCH',
      }, true)
      if (activeBinding.value?.documentId === documentId)
        activeBinding.value = { documentId, name: updated.name, version: updated.version }
      await loadDocuments()
    })
  }

  async function trashDocument(documentId: string) {
    await mutateDocument(async () => {
      await cloudRequest(`/documents/${encodeURIComponent(documentId)}`, { method: 'DELETE' }, true)
      if (activeBinding.value?.documentId === documentId)
        activeBinding.value = null
      await loadDocuments()
    })
  }

  async function restoreDocument(documentId: string) {
    await mutateDocument(async () => {
      await cloudRequest(`/documents/${encodeURIComponent(documentId)}/restore`, { method: 'POST' }, true)
      await loadDocuments()
    })
  }

  async function mutateDocument(action: () => Promise<void>) {
    errorMessage.value = ''
    try {
      await action()
      status.value = 'ready'
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = errorText(error)
      throw error
    }
  }

  function clearDeviceData() {
    if (typeof window === 'undefined')
      return
    for (let index = window.localStorage.length - 1; index >= 0; index--) {
      const key = window.localStorage.key(index)
      if (key?.startsWith(namespace))
        window.localStorage.removeItem(key)
    }
    window.location.reload()
  }

  async function fetchSession() {
    const response = await fetch(`${config.apiBase}/session`, {
      credentials: 'include',
      headers: { accept: 'application/json' },
    })
    if (response.status === 401)
      return undefined
    const payload: unknown = await response.json().catch(() => null)
    if (!response.ok)
      throw new Error(readApiMessage(payload) || 'Unable to restore cloud session')
    return readCloudSession(payload)
  }

  async function refreshCsrf() {
    const payload = await cloudRequest<{ csrfToken: string }>('/session/csrf')
    if (!payload.csrfToken)
      throw new Error('Cloud session protection is unavailable')
    csrfToken = payload.csrfToken
  }

  async function cloudRequest<T = unknown>(path: string, init: RequestInit = {}, mutation = false, retried = false): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('accept', 'application/json')
    if (mutation && csrfToken)
      headers.set('x-csrf-token', csrfToken)
    const response = await fetch(`${config.apiBase}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    })
    if (mutation && response.status === 403 && !retried) {
      await refreshCsrf()
      return cloudRequest<T>(path, init, mutation, true)
    }
    if (response.status === 401) {
      session.value = undefined
      status.value = 'anonymous'
    }
    const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok)
      throw new Error(readApiMessage(payload) || `Cloud request failed (${response.status})`)
    return payload as T
  }

  return {
    activeBinding,
    activeDocument,
    bootstrap,
    clearDeviceData,
    config,
    conflictCreated,
    createDocument,
    documents,
    errorMessage,
    isAuthenticated,
    lastSavedAt,
    loadDocuments,
    login,
    logout,
    openDocument,
    quota,
    renameDocument,
    restoreDocument,
    saveCurrentResume,
    session,
    status,
    trashDocument,
    trashedDocuments,
  }
})

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', Uint8Array.from(bytes).buffer)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function uploadYaml(upload: BeginSaveResponse['upload'], bytes: Uint8Array): Promise<void> {
  const url = new URL(upload.url)
  if (
    url.protocol !== 'https:'
    || url.hostname !== WEB_RESUME_UPLOAD_HOST
    || !url.searchParams.has('q-signature')
    || !url.searchParams.has('x-cos-security-token')
    || upload.method !== 'PUT'
  ) {
    throw new Error('Cloud upload capability is invalid')
  }
  const headers = new Headers()
  for (const [name, value] of Object.entries(upload.headers || {})) {
    if (name.toLowerCase() !== 'content-type')
      throw new Error('Cloud upload requested an unsupported header')
    headers.set(name, value)
  }
  headers.set('content-type', 'application/yaml')
  const response = await fetch(url, {
    body: new Blob([Uint8Array.from(bytes).buffer], { type: 'application/yaml' }),
    credentials: 'omit',
    headers,
    method: 'PUT',
  })
  if (!response.ok)
    throw new Error(`Cloud upload failed (${response.status})`)
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot))
