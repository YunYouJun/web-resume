export interface CloudAccountUser {
  accountStatus: 'active'
  avatarUrl?: string
  handle?: string
  name?: string
  phoneVerified: boolean
  uid: string
}

export interface CloudSession {
  id: string
  user: CloudAccountUser
}

export interface CloudResumeDocument {
  _id: string
  conflictOf?: string
  contentSha256?: string
  createdAt: number
  currentReservationId?: string
  name: string
  pendingSave?: {
    baseVersion: number
    contentSha256: string
    expiresAt: number
    reservationId: string
    sizeBytes: number
  } | null
  purgeAfter?: number | null
  recordType: 'web_resume_document'
  schemaVersion: 1
  slotKey: string
  state: 'active' | 'trashed'
  templateId: string
  trashedAt?: number | null
  updatedAt: number
  userId: string
  validationStatus: 'draft-invalid' | 'valid'
  version: number
}

export interface CloudStorageQuota {
  availableBytes: number
  isOverQuota: boolean
  quotaBytes: number
  reservedBytes: number
  usedBytes: number
}

export interface CloudResumeBinding {
  documentId: string
  name: string
  version: number
}

export type CloudSyncStatus = 'anonymous' | 'disabled' | 'error' | 'loading' | 'ready' | 'saving'
