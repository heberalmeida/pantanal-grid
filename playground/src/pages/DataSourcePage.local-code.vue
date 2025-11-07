<template>
  <PantanalDataSource
    ref="localDataSource"
    type="local"
    :data="localData"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns as any"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

type Product = {
  id: number
  title: string
  price: number
  category: string
}

const localData = ref<Product[]>([
  { id: 1, title: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, title: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const columns: ColumnDef<Product>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'price', title: 'Price', width: 100 },
  { field: 'category', title: 'Category', width: 150 },
]

const dataSourceData = ref<Product[]>([])
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

function handleChange(data: Product[]) {
  dataSourceData.value = data
}
</script>

