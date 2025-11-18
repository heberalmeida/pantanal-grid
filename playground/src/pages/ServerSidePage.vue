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
    <p class="text-sm text-slate-600 dark:text-slate-300">Remote total: {{ total }}</p>
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type FilterDescriptor, type SortDescriptor } from '@pantanal/grid'
import { fetchProducts, type Product } from '../api/dummyjson'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './ServerSidePage.vue?raw'

const rows = ref<Product[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const filter = ref<FilterDescriptor[]>([])
const sort = ref<SortDescriptor[]>([]) 

const codeSnippet = exampleSource

const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand' },
  { field:'category', title:'Category' },
  { field:'price', title:'Price' }
]

// Generate fallback data when API fails
function generateFallbackData(pageNum: number, size: number, query?: string) {
  const skip = (pageNum - 1) * size
  const fallbackData: Product[] = []
  
  // Generate enough items to fill the page
  let generated = 0
  let id = skip + 1
  
  while (generated < size && id < 1000) {
    const title = `Product ${id}`
    
    // Filter by query if provided
    if (query && !title.toLowerCase().includes(query.toLowerCase())) {
      id++
      continue
    }
    
    fallbackData.push({
      id,
      title,
      brand: `Brand ${(id % 5) + 1}`,
      category: ['Electronics', 'Clothing', 'Accessories', 'Home', 'Sports'][id % 5],
      price: Math.round((Math.random() * 100 + 10) * 100) / 100,
    })
    
    generated++
    id++
  }
  
  // If filtering, adjust total (estimate based on query)
  const total = query ? Math.max(50, generated * 2) : 100
  
  return { rows: fallbackData, total }
}

// Busca remota quando page/pageSize/filtro/sort mudar
watchEffect(async () => {
  try {
    const q = (filter.value.find(f => f.field === 'title')?.value as string) || ''
    const { rows: data, total: t } = await fetchProducts(page.value, pageSize.value, q)
    rows.value = data
    total.value = t
  } catch (error) {
    console.error('Error fetching products:', error)
    // Use fallback data instead of empty array
    const q = (filter.value.find(f => f.field === 'title')?.value as string) || ''
    const fallback = generateFallbackData(page.value, pageSize.value, q)
    rows.value = fallback.rows
    total.value = fallback.total
  }
})
</script>
