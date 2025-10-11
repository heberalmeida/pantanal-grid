<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

type Row = { id: number; name: string; price: number; category: string }

const rows = ref<Row[]>(
  Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: +(Math.random() * 100).toFixed(2),
    category: ['A','B','C'][i % 3],
  }))
)

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'price', title: 'Price', sortable: true, resizable: true, reorderable: true, format:(v:number)=>`$ ${v.toFixed(2)}` },
  { field: 'category', title: 'Category', sortable: true, filterable: true, resizable: true, reorderable: true },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(20)
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Data Binding — Local</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="id"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      persist-state-key="pantanal-demo-data-local"
      :enable-column-resize="true"
      :enable-column-reorder="true"
      locale="en"
    />
  </section>
</template>
