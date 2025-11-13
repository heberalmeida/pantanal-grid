<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 },
  { id: 6, name: 'Product F', price: 24.99, category: 'Accessories', stock: 300 },
  { id: 7, name: 'Product G', price: 69.99, category: 'Electronics', stock: 25 },
  { id: 8, name: 'Product H', price: 34.99, category: 'Clothing', stock: 120 }
])

const columns: ColumnDef[] = [
  { 
    field: 'id', 
    title: 'ID', 
    width: 80, 
    sortable: true, 
    filterable: true,
    resizable: true
  },
  { 
    field: 'name', 
    title: 'Product Name', 
    sortable: true, 
    filterable: true,
    resizable: true
  },
  { 
    field: 'price', 
    title: 'Price', 
    sortable: true, 
    filterable: true,
    format: (v: number) => `$${v.toFixed(2)}`,
    resizable: true
  },
  { 
    field: 'category', 
    title: 'Category', 
    filterable: true,
    resizable: true
  },
  { 
    field: 'stock', 
    title: 'Stock', 
    sortable: true,
    resizable: true
  }
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    v-model:filter="filter"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :height="400"
    locale="en"
    responsive="table"
  />
</template>

