<template>
  <PantanalDataSource
    ref="dataSource"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-filtering="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:filter="filter"
    @change="handleChange"
    @requestStart="loading = true"
    @requestEnd="loading = false"
  />
  
  <input
    v-model="filterText"
    @input="updateFilter"
    placeholder="Search..."
  />
  
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="item in displayData" :key="item.id">
      <h4>{{ item.title }}</h4>
      <p>${{ item.price }}</p>
    </div>
  </div>
  
  <div class="pagination">
    <button @click="page = Math.max(1, page - 1)">Previous</button>
    <span>Page {{ page }}</span>
    <button @click="page = page + 1">Next</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalDataSource, 
  type FilterDescriptor,
  type DataSourceTransport,
  type DataSourceSchema
} from '@pantanal/grid'

type Product = {
  id: number
  title: string
  price: number
}

const transport: DataSourceTransport = {
  read: async (options) => {
    const url = new URL('https://api.example.com/products')
    url.searchParams.set('page', String(options.data?.page || 1))
    url.searchParams.set('pageSize', String(options.data?.pageSize || 10))
    const res = await fetch(url.toString())
    return res.json()
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.products || [],
  total: (response: any) => response.total || 0,
}

const displayData = ref<Product[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(6)
const filter = ref<FilterDescriptor[]>([])
const filterText = ref('')

function handleChange(data: Product[]) {
  displayData.value = data
}

function updateFilter() {
  const others = filter.value.filter(f => f.field !== 'title')
  if (filterText.value) {
    filter.value = [...others, { field: 'title', operator: 'contains', value: filterText.value }]
  } else {
    filter.value = others
  }
}
</script>

