<template>
  <div class="favorites-view p-4">
    <a-card class="rounded-lg">
      <a-empty v-if="!loading && favorites.length === 0" description="暂无关注的债券，请在聚合行情中添加关注" />
      <a-table
        v-else
        :data-source="favorites"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        :row-key="(r) => r.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'code'">
            <router-link
              :to="`/market/${record.id}`"
              class="text-blue-600 hover:underline tabular-nums"
            >
              {{ record.code }}
            </router-link>
          </template>
          <template v-else-if="column.key === 'name'">
            <router-link
              :to="`/market/${record.id}`"
              class="text-blue-600 hover:underline"
            >
              {{ record.name }}
            </router-link>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag :color="bondTypeColor(record.bondType)">
              {{ record.bondType }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'coupon_rate'">
            <span class="tabular-nums">{{ record.couponRate != null ? formatPrice(record.couponRate) + '%' : '--' }}</span>
          </template>
          <template v-else-if="column.key === 'remaining_term'">
            <span class="tabular-nums">{{ record.remainingTerm ?? '--' }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-popconfirm
              title="确定取消关注该债券吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleUnfavorite(record.id)"
            >
              <a-button type="link" danger size="small">取消关注</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'
import { bondTypeColor, formatPrice } from '../utils/format'
import { adaptBond } from '../types'
import type { BondItem, BondRaw } from '../types'

const loading = ref(false)
const favorites = ref<BondItem[]>([])

const columns = [
  { title: '代码', key: 'code', dataIndex: 'code', width: 120, fixed: 'left' },
  { title: '简称', key: 'name', dataIndex: 'name', width: 180 },
  { title: '品种', key: 'type', width: 100 },
  { title: '发行人', dataIndex: 'issuer', key: 'issuer', ellipsis: true },
  { title: '票面利率', key: 'coupon_rate', width: 100 },
  { title: '剩余期限', key: 'remaining_term', width: 100 },
  { title: '评级', dataIndex: 'creditRating', key: 'rating', width: 80 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

async function fetchFavorites() {
  loading.value = true
  try {
    const res = await api.get<BondRaw[] | { items: BondRaw[] }>('/api/favorites')
    const data = res.data
    const list = Array.isArray(data) ? data : (data as { items: BondRaw[] }).items ?? []
    favorites.value = list.map(adaptBond)
  } catch {
    favorites.value = []
  } finally {
    loading.value = false
  }
}

async function handleUnfavorite(bondId: string) {
  try {
    await api.delete(`/api/favorites/${bondId}`)
    await fetchFavorites()
  } catch {
    // 错误由 api 拦截器处理
  }
}

onMounted(fetchFavorites)
</script>
