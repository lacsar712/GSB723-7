export type SourceStatus = 'online' | 'offline' | 'error'
export type SourceType = 'xbond' | 'broker' | 'exchange' | 'swap' | 'futures'
export type UserRole = 'admin' | 'trader' | 'viewer'

export interface MarketSourceVM {
  id: string
  name: string
  source_type: SourceType | string
  status: SourceStatus | string
  description?: string
  is_enabled: boolean
  created_at?: string
}

export interface AdminUserVM {
  id: string
  username: string
  display_name: string
  role: UserRole | string
  department?: string
  is_active: boolean
  created_at?: string
}

export interface BondVM {
  id: string
  code: string
  name: string
  bond_type: string
  issuer: string
  coupon_rate?: number
  remaining_term?: number
  credit_rating?: string
}

type Raw = Record<string, unknown>

function pickStr(raw: Raw, ...keys: string[]): string {
  for (const k of keys) {
    const v = raw[k]
    if (v != null) return String(v)
  }
  return ''
}

function pickBool(raw: Raw, ...keys: string[]): boolean {
  for (const k of keys) {
    const v = raw[k]
    if (v != null) return Boolean(v)
  }
  return false
}

function pickNum(raw: Raw, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = raw[k]
    if (v != null) return Number(v)
  }
  return undefined
}

export function mapSource(raw: Raw): MarketSourceVM {
  return {
    id: pickStr(raw, 'id'),
    name: pickStr(raw, 'name'),
    source_type: pickStr(raw, 'source_type', 'type'),
    status: pickStr(raw, 'status') as SourceStatus,
    description: raw.description != null ? String(raw.description) : undefined,
    is_enabled: pickBool(raw, 'is_enabled', 'enabled'),
    created_at: raw.created_at != null ? String(raw.created_at) : undefined,
  }
}

export function mapSourceList(data: unknown): MarketSourceVM[] {
  if (Array.isArray(data)) return data.map((d) => mapSource(d as Raw))
  if (data && typeof data === 'object' && Array.isArray((data as Raw).items)) {
    return ((data as Raw).items as Raw[]).map(mapSource)
  }
  return []
}

export function mapUser(raw: Raw): AdminUserVM {
  let isActive: boolean
  if (raw.is_active != null) {
    isActive = Boolean(raw.is_active)
  } else if (raw.status != null) {
    isActive = raw.status === 'active'
  } else {
    isActive = true
  }
  return {
    id: pickStr(raw, 'id'),
    username: pickStr(raw, 'username'),
    display_name: pickStr(raw, 'display_name'),
    role: pickStr(raw, 'role') as UserRole,
    department: raw.department != null ? String(raw.department) : undefined,
    is_active: isActive,
    created_at: raw.created_at != null ? String(raw.created_at) : undefined,
  }
}

export function mapUserList(data: unknown): AdminUserVM[] {
  if (Array.isArray(data)) return data.map((d) => mapUser(d as Raw))
  if (data && typeof data === 'object' && Array.isArray((data as Raw).items)) {
    return ((data as Raw).items as Raw[]).map(mapUser)
  }
  return []
}

export function mapBond(raw: Raw): BondVM {
  return {
    id: pickStr(raw, 'id'),
    code: pickStr(raw, 'code'),
    name: pickStr(raw, 'name'),
    bond_type: pickStr(raw, 'bond_type', 'type'),
    issuer: pickStr(raw, 'issuer'),
    coupon_rate: pickNum(raw, 'coupon_rate'),
    remaining_term: pickNum(raw, 'remaining_term'),
    credit_rating: raw.credit_rating != null ? String(raw.credit_rating) : (raw.rating != null ? String(raw.rating) : undefined),
  }
}
