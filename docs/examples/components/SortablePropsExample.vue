<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books', stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, category: 'Electronics', stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true },
  { field: 'stock', title: 'Stock', sortable: true }
]

const sort = ref<SortDescriptor[]>([])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-allow-unsort="true"
    :sortable-show-indexes="true"
    sortable-initial-direction="asc"
    v-model:sort="sort"
    locale="en"
    responsive="table"
  />
</template>

