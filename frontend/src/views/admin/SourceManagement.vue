<template>
  <div class="source-management p-4">
    <a-card class="rounded-lg">
      <a-table
        :data-source="sources"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        :row-key="(r) => r.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'source_type'">
            <a-tag>{{ sourceTypeLabel(record.source_type) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-badge
              :status="sourceStatusBadge(record.status)"
              :text="sourceStatusText(record.status)"
            />
          </template>
          <template v-else-if="column.key === 'is_enabled'">
            <a-switch
              :checked="record.is_enabled"
              :loading="!!updatingId[record.id]"
              @change="(checked) => handleToggleEnabled(record, !!checked)"
            />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import api from '../../api'
import { sourceTypeLabel } from '../../utils/format'
import { mapSource, mapSourceList, type MarketSourceVM } from '../../utils/adapter'

const loading = ref(false)
const sources = ref<MarketSourceVM[]>([])
const updatingId = ref<Record<string, boolean>>({})

function sourceStatusBadge(status: string): 'success' | 'warning' | 'error' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    online: 'success',
    offline: 'warning',
    error: 'error',
  }
  return map[status] || 'default'
}

function sourceStatusText(status: string): string {
  const map: Record<string, string> = {
    online: '在线',
    offline: '离线',
    error: '异常',
  }
  return map[status] || status
}

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '类型', key: 'source_type', dataIndex: 'source_type', width: 140 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '是否启用', key: 'is_enabled', dataIndex: 'is_enabled', width: 100 },
]

async function fetchSources() {
  loading.value = true
  try {
    const res = await api.get('/api/admin/sources')
    sources.value = mapSourceList(res.data)
  } catch {
    sources.value = []
  } finally {
    loading.value = false
  }
}

async function handleToggleEnabled(record: MarketSourceVM, enabled: boolean) {
  updatingId.value[record.id] = true
  try {
    const res = await api.put(`/api/admin/sources/${record.id}`, { is_enabled: enabled })
    const updated = mapSource(res.data as Record<string, unknown>)
    const idx = sources.value.findIndex((s) => s.id === record.id)
    if (idx >= 0) {
      sources.value[idx] = { ...sources.value[idx], ...updated }
    }
    message.success(enabled ? '已启用该行情源' : '已禁用该行情源')
  } catch {
    // 错误由 api 拦截器处理
  } finally {
    updatingId.value[record.id] = false
  }
}

onMounted(fetchSources)
</script>
