<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref(Array.from({ length: 120 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  price: Math.round(Math.random() * 1000) / 100,
  category: ['A', 'B', 'C'][i % 3]
})))

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Nome', sortable: true, filterable: true },
  { field: 'price', title: 'Preço', sortable: true, filterable: true, format: (v:any) => `R$ ${Number(v).toFixed(2)}` },
  { field: 'category', title: 'Categoria', sortable: true, filterable: true }
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(20)
</script>

<template>
  <main class="p-6 space-y-4" data-theme="light">
    <h1 class="text-2xl font-bold">Pantanal Grid — Playground</h1>

    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="id"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      selectable="multiple"
    />
  </main>
</template>
