// 统一的前后端字段类型定义与适配层
// 所有页面必须从此处导入接口，禁止在各个 Vue 页面里各自复制一套字段转换逻辑。

// ---- 后端原始返回结构（与 FastAPI schema 字段严格对齐）----

export interface SourceRaw {
  id: string
  name: string
  source_type: string
  status: 'online' | 'offline' | 'error'
  description?: string | null
  is_enabled: boolean
}

export interface AdminUserRaw {
  id: string
  username: string
  display_name?: string | null
  role: 'admin' | 'trader' | 'viewer'
  department?: string | null
  is_active: boolean
  created_at?: string | null
}

export interface BondRaw {
  id: string
  code: string
  name: string
  bond_type: string
  issuer?: string
  coupon_rate?: number | null
  remaining_term?: number | null
  credit_rating?: string | null
}

// ---- 前端视图使用的规范化结构 ----

export interface SourceItem {
  id: string
  name: string
  sourceType: string
  status: 'online' | 'offline' | 'error'
  description: string
  isEnabled: boolean
}

export interface AdminUserItem {
  id: string
  username: string
  displayName: string
  role: 'admin' | 'trader' | 'viewer'
  department: string
  isActive: boolean
  createdAt?: string
}

export interface BondItem {
  id: string
  code: string
  name: string
  bondType: string
  issuer: string
  couponRate?: number | null
  remainingTerm?: number | null
  creditRating?: string | null
}

// ---- 适配器：后端原始字段 -> 前端规范化字段 ----

export function adaptSource(raw: SourceRaw): SourceItem {
  return {
    id: raw.id,
    name: raw.name,
    sourceType: raw.source_type,
    status: raw.status,
    description: raw.description ?? '',
    isEnabled: raw.is_enabled,
  }
}

export function adaptUser(raw: AdminUserRaw): AdminUserItem {
  return {
    id: raw.id,
    username: raw.username,
    displayName: raw.display_name ?? '',
    role: raw.role,
    department: raw.department ?? '',
    isActive: raw.is_active,
    createdAt: raw.created_at ?? undefined,
  }
}

export function adaptBond(raw: BondRaw): BondItem {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    bondType: raw.bond_type,
    issuer: raw.issuer ?? '',
    couponRate: raw.coupon_rate ?? null,
    remainingTerm: raw.remaining_term ?? null,
    creditRating: raw.credit_rating ?? null,
  }
}

// ---- 适配器：前端字段 -> 后端更新载荷 ----

export function toSourceUpdatePayload(patch: { isEnabled?: boolean; status?: string; description?: string }) {
  const payload: Record<string, unknown> = {}
  if (patch.isEnabled !== undefined) payload.is_enabled = patch.isEnabled
  if (patch.status !== undefined) payload.status = patch.status
  if (patch.description !== undefined) payload.description = patch.description
  return payload
}
