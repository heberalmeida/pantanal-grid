<template>
  <PantanalDataSource
    ref="remoteDataSource"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-filtering="true"
    :server-sorting="true"
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
    :total="total"
    server-side
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGrid, 
  PantanalDataSource, 
  type ColumnDef, 
  type SortDescriptor, 
  type FilterDescriptor,
  type DataSourceTransport,
  type DataSourceSchema,
  type DataSourceInstance
} from '@pantanal/grid'

type Product = {
  id: number
  title: string
  price: number
  category: string
}

const columns: ColumnDef<Product>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'price', title: 'Price', width: 100 },
  { field: 'category', title: 'Category', width: 150 },
]

const transport: DataSourceTransport = {
  read: async (_options) => {
    const url = new URL('https://api.example.com/products')
    // Configure URL with pagination, filtering, sorting
    const res = await fetch(url.toString())
    return res.json()
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.products || [],
  total: (response: any) => response.total || 0,
}

const remoteDataSource = ref<DataSourceInstance | null>(null)
const dataSourceData = ref<Product[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

function handleChange(data: Product[]) {
  dataSourceData.value = data
  total.value = remoteDataSource.value?.total() || 0
}
</script>

