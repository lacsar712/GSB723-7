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
          <template v-else-if="column.key === 'is_active'">
            <a-badge
              :status="record.is_active ? 'success' : 'default'"
              :text="record.is_active ? '启用' : '停用'"
            />
          </template>
          <template v-else-if="column.key === 'created_at'">
            <span class="tabular-nums">{{ formatDateTime(record.created_at) }}</span>
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
import type { AdminUserItem } from '../../types'

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
  { title: '显示名称', dataIndex: 'display_name', key: 'display_name', width: 120 },
  { title: '角色', key: 'role', dataIndex: 'role', width: 100 },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '状态', key: 'is_active', dataIndex: 'is_active', width: 100 },
  { title: '创建时间', key: 'created_at', dataIndex: 'created_at', width: 180 },
]

async function fetchUsers() {
  loading.value = true
  try {
    const res = await api.get<AdminUserItem[] | { items: AdminUserItem[] }>('/api/admin/users')
    const data = res.data
    users.value = Array.isArray(data) ? data : (data as { items: AdminUserItem[] }).items ?? []
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
