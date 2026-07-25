<template>
  <div class="user-management p-4">
    <a-card class="rounded-lg">
      <a-table
        :data-source="users"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        :row-key="(r) => r.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="roleColor(record.role)">
              {{ record.role }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-badge
              :status="record.isActive ? 'success' : 'default'"
              :text="record.isActive ? '启用' : '停用'"
            />
          </template>
          <template v-else-if="column.key === 'created_at'">
            <span class="tabular-nums">{{ formatDateTime(record.createdAt) }}</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api'
import { formatDateTime } from '../../utils/format'
import { adaptUser } from '../../types'
import type { AdminUserItem, AdminUserRaw } from '../../types'

const loading = ref(false)
const users = ref<AdminUserItem[]>([])

function roleColor(role: string): string {
  const map: Record<string, string> = {
    admin: 'blue',
    trader: 'green',
    viewer: 'default',
  }
  return map[role] || 'default'
}

const columns = [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
  { title: '显示名称', dataIndex: 'displayName', key: 'display_name', width: 120 },
  { title: '角色', key: 'role', dataIndex: 'role', width: 100 },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', key: 'created_at', width: 180 },
]

async function fetchUsers() {
  loading.value = true
  try {
    const res = await api.get<AdminUserRaw[] | { items: AdminUserRaw[] }>('/api/admin/users')
    const data = res.data
    const list = Array.isArray(data) ? data : (data as { items: AdminUserRaw[] }).items ?? []
    users.value = list.map(adaptUser)
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
