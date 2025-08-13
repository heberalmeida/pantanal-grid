<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type FilterDescriptor, type SortDescriptor } from '@pantanal/grid'
import { fetchProducts, type Product } from '../api/dummyjson'

const rows = ref<Product[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const filter = ref<FilterDescriptor[]>([])
const sort = ref<SortDescriptor[]>([]) 

const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand' },
  { field:'category', title:'Category' },
  { field:'price', title:'Price' }
]

// Busca remota quando page/pageSize/filtro/sort mudar
watchEffect(async () => {
  const q = (filter.value.find(f => f.field === 'title')?.value as string) || ''
  const { rows: data, total: t } = await fetchProducts(page.value, pageSize.value, q)
  rows.value = data
  total.value = t
})
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Server-side (DummyJSON)</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="id"
      locale="en"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      v-model:sort="sort"
      :server-side="true"
      :total="total"
    />
    <p class="text-sm text-slate-600">Total remoto: {{ total }}</p>
  </section>
</template>
