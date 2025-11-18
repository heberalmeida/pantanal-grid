<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Hide Header</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports hiding the table header row by setting the <code class="bg-gray-100 px-2 py-1 rounded">hideHeader</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
      This is useful when you want to display data without column headers, such as in compact views or when the column structure is self-explanatory.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
      <p class="text-gray-600 mb-4">
        Simply set <code class="bg-gray-100 px-2 py-1 rounded">hideHeader</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code> to hide the header row.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          :hideHeader="true"
          responsive="table"
          key-field="id"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Comparison: With and Without Header</h2>
      <p class="text-gray-600 mb-4">
        Compare the grid with and without the header to see the difference.
      </p>
      
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">With Header (default):</label>
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          :hideHeader="false"
          responsive="table"
          key-field="id"
          :height="300"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Without Header:</label>
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          :hideHeader="true"
          responsive="table"
          key-field="id"
          :height="300"
        />
      </div>

      <ExampleCode :source="comparisonCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">With Pagination</h2>
      <p class="text-gray-600 mb-4">
        The header can be hidden even when pagination is enabled.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="paginatedRows"
          :columns="columns"
          :hideHeader="true"
          :page="page"
          :pageSize="pageSize"
          :pageable="true"
          responsive="table"
          key-field="id"
          @update:page="page = $event"
          @update:pageSize="pageSize = $event"
        />
      </div>

      <ExampleCode :source="paginationCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  id: number
  title: string
  brand: string
  category: string
  price: number
  stock: number
  rating: number
}

const rows = ref<Product[]>([])
const page = ref(1)
const pageSize = ref(10)

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return rows.value.slice(start, end)
})

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Product Title', width: 300 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'rating', title: 'Rating', width: 100, format: (v: number) => v.toFixed(1) },
]

onMounted(async () => {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=30')
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    rows.value = (data.products || []).map((product: any) => ({
      id: product.id,
      title: product.title,
      brand: product.brand || 'Unknown',
      category: product.category,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
    }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
    rows.value = [
      { id: 1, title: 'Sample Product 1', brand: 'Brand A', category: 'Electronics', price: 99.99, stock: 10, rating: 4.5 },
      { id: 2, title: 'Sample Product 2', brand: 'Brand B', category: 'Clothing', price: 49.99, stock: 20, rating: 4.0 },
      { id: 3, title: 'Sample Product 3', brand: 'Brand C', category: 'Accessories', price: 29.99, stock: 15, rating: 4.2 },
    ]
  }
})

const basicCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :hideHeader="true"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
<\/script>`

const comparisonCode = `<template>
  <!-- With Header (default) -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :hideHeader="false"
    key-field="id"
  />

  <!-- Without Header -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :hideHeader="true"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
<\/script>`

const paginationCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :hideHeader="true"
    :page="page"
    :pageSize="pageSize"
    :pageable="true"
    key-field="id"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const page = ref(1)
const pageSize = ref(10)
<\/script>`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>


