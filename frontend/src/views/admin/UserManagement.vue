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
              {{ roleLabel(record.role) }}
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
import { mapUserList, type AdminUserVM } from '../../utils/adapter'

const loading = ref(false)
const users = ref<AdminUserVM[]>([])

function roleColor(role: string): string {
  const map: Record<string, string> = {
    admin: 'red',
    trader: 'green',
    viewer: 'default',
  }
  return map[role] || 'default'
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    admin: '管理员',
    trader: '交易员',
    viewer: '只读用户',
  }
  return map[role] || role
}

const columns = [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
  { title: '显示名称', dataIndex: 'display_name', key: 'display_name', width: 140 },
  { title: '角色', key: 'role', dataIndex: 'role', width: 110 },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '状态', key: 'is_active', dataIndex: 'is_active', width: 100 },
  { title: '创建时间', key: 'created_at', dataIndex: 'created_at', width: 180 },
]

async function fetchUsers() {
  loading.value = true
  try {
    const res = await api.get('/api/admin/users')
    users.value = mapUserList(res.data)
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
