<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Pagination with URL Sync</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports synchronizing pagination state with URL query parameters. This allows users to share links
      with specific page and page size, and the grid will automatically restore the state when the page loads.
      This works with both client-side and server-side pagination.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
      <p class="text-gray-600 mb-4">
        Enable URL synchronization by setting <code class="bg-gray-100 px-2 py-1 rounded">pageableSyncUrl</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
        The page and pageSize will be automatically synced with the URL query parameters.
      </p>
      
      <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p class="text-sm text-blue-800">
          <strong>Try it:</strong> Change the page or page size, then copy the URL and open it in a new tab.
          The grid will automatically load with the same pagination state.
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :page="basicPage"
          :pageSize="basicPageSize"
          :pageable="true"
          :pageableSyncUrl="true"
          responsive="table"
          key-field="orderID"
          @update:page="basicPage = $event"
          @update:pageSize="basicPageSize = $event"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom URL Parameter Names</h2>
      <p class="text-gray-600 mb-4">
        You can customize the URL parameter names using <code class="bg-gray-100 px-2 py-1 rounded">pageableUrlParamPage</code>
        and <code class="bg-gray-100 px-2 py-1 rounded">pageableUrlParamPageSize</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customRows"
          :columns="customColumns"
          :page="customPage"
          :pageSize="customPageSize"
          :pageable="true"
          :pageableSyncUrl="true"
          pageableUrlParamPage="p"
          pageableUrlParamPageSize="size"
          responsive="table"
          key-field="orderID"
          @update:page="customPage = $event"
          @update:pageSize="customPageSize = $event"
        />
      </div>

      <ExampleCode :source="customCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Server-Side Pagination with URL</h2>
      <p class="text-gray-600 mb-4">
        URL synchronization works seamlessly with server-side pagination. The grid will read the initial state
        from the URL and maintain it as the user navigates.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="serverRows"
          :columns="serverColumns"
          v-model:page="serverPage"
          v-model:pageSize="serverPageSize"
          :server-side="true"
          :pageable="true"
          :pageableSyncUrl="true"
          :total="serverTotal"
          responsive="table"
          key-field="id"
        />
      </div>

      <ExampleCode :source="serverCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Browser Navigation</h2>
      <p class="text-gray-600 mb-4">
        The grid automatically handles browser back/forward buttons. When you navigate using browser history,
        the grid will update its pagination state to match the URL.
      </p>
      
      <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded">
        <p class="text-sm text-green-800">
          <strong>Try it:</strong> Change the page, then use the browser back button. The grid will restore
          the previous page state.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Order extends Record<string, unknown> {
  orderID: number
  shipName: string
  freight: number
  orderDate: string
}

// Basic Usage
const basicRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Hanari Carnes', freight: 58.17, orderDate: '1996-07-11' },
  { orderID: 7, shipName: 'Chop-suey Chinese', freight: 22.98, orderDate: '1996-07-12' },
  { orderID: 8, shipName: 'Richter Supermarkt', freight: 148.33, orderDate: '1996-07-15' },
  { orderID: 9, shipName: 'Wellington Importadora', freight: 13.97, orderDate: '1996-07-16' },
  { orderID: 10, shipName: 'HILARIÓN-Abastos', freight: 81.91, orderDate: '1996-07-17' },
  { orderID: 11, shipName: 'Ernst Handel', freight: 140.51, orderDate: '1996-07-18' },
  { orderID: 12, shipName: 'Centro comercial Moctezuma', freight: 3.25, orderDate: '1996-07-19' },
  { orderID: 13, shipName: 'Ottilies Käseladen', freight: 55.09, orderDate: '1996-07-22' },
  { orderID: 14, shipName: 'Que Delícia', freight: 3.05, orderDate: '1996-07-23' },
  { orderID: 15, shipName: 'Rattlesnake Canyon Grocery', freight: 48.29, orderDate: '1996-07-24' },
  { orderID: 16, shipName: 'Ernst Handel', freight: 146.06, orderDate: '1996-07-25' },
  { orderID: 17, shipName: 'Folk och fä HB', freight: 3.67, orderDate: '1996-07-26' },
  { orderID: 18, shipName: 'Reggiani Caseifici', freight: 55.28, orderDate: '1996-07-29' },
  { orderID: 19, shipName: 'Maison Dewey', freight: 25.36, orderDate: '1996-07-30' },
  { orderID: 20, shipName: 'Island Trading', freight: 18.69, orderDate: '1996-07-31' },
  { orderID: 21, shipName: 'Wartian Herkku', freight: 58.88, orderDate: '1996-08-01' },
  { orderID: 22, shipName: 'Simons bistro', freight: 13.75, orderDate: '1996-08-02' },
  { orderID: 23, shipName: 'QUICK-Stop', freight: 62.74, orderDate: '1996-08-05' },
  { orderID: 24, shipName: 'Wilman Kala', freight: 12.69, orderDate: '1996-08-06' },
  { orderID: 25, shipName: 'Berglunds snabbköp', freight: 10.96, orderDate: '1996-08-07' },
])

const basicColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 180, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const basicPage = ref(1)
const basicPageSize = ref(10)

// Custom URL Parameters
const customRows = ref<Order[]>([...basicRows.value])
const customColumns: ColumnDef[] = [...basicColumns]
const customPage = ref(1)
const customPageSize = ref(10)

// Server-Side Pagination with real API
interface Product extends Record<string, unknown> {
  id: number
  title: string
  brand: string
  category: string
  price: number
  stock: number
  rating: number
}

const serverPage = ref(1)
const serverPageSize = ref(20)
const serverTotal = ref(0)
const serverRows = ref<Product[]>([])

// Fetch data when page or pageSize changes
watchEffect(async () => {
  try {
    // Calculate skip for pagination (dummyjson uses skip/limit)
    const skip = (serverPage.value - 1) * serverPageSize.value
    const limit = serverPageSize.value
    
    // Fetch data from real API endpoint with timeout and better error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Update total from API response
      serverTotal.value = data.total || 0
      
      // Map API response to grid rows
      serverRows.value = (data.products || []).map((product: any) => ({
        id: product.id,
        title: product.title,
        brand: product.brand || 'Unknown',
        category: product.category,
        price: product.price,
        stock: product.stock,
        rating: product.rating,
      }))
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // If it's an abort error (timeout), provide fallback data
      if (fetchError.name === 'AbortError') {
        console.warn('Request timeout, using fallback data')
        generateFallbackData()
        return
      }
      
      throw fetchError
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    // Use fallback data instead of empty array
    generateFallbackData()
  }
})

// Generate fallback data when API fails
function generateFallbackData() {
  const skip = (serverPage.value - 1) * serverPageSize.value
  const limit = serverPageSize.value
  
  // Generate sample data for demonstration
  const fallbackData: Product[] = []
  for (let i = 0; i < limit; i++) {
    const id = skip + i + 1
    fallbackData.push({
      id,
      title: `Product ${id}`,
      brand: `Brand ${(id % 5) + 1}`,
      category: ['Electronics', 'Clothing', 'Accessories', 'Home', 'Sports'][id % 5],
      price: Math.round((Math.random() * 100 + 10) * 100) / 100,
      stock: Math.floor(Math.random() * 100),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    })
  }
  
  serverRows.value = fallbackData
  serverTotal.value = 100 // Set a reasonable total for pagination
}

const serverColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Product Title', width: 300 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'rating', title: 'Rating', width: 100, format: (v: number) => v.toFixed(1) },
]

const basicCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :page="page"
    :pageSize="pageSize"
    :pageable="true"
    :pageableSyncUrl="true"
    key-field="orderID"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
const page = ref(1)
const pageSize = ref(10)
<\/script>`

const customCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :page="page"
    :pageSize="pageSize"
    :pageable="true"
    :pageableSyncUrl="true"
    pageableUrlParamPage="p"
    pageableUrlParamPageSize="size"
    key-field="orderID"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
const page = ref(1)
const pageSize = ref(10)
<\/script>`

const serverCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :server-side="true"
    :pageable="true"
    :pageableSyncUrl="true"
    :total="total"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const rows = ref([])

// Fetch data when page or pageSize changes
watchEffect(async () => {
  try {
    // Calculate skip for pagination (dummyjson uses skip/limit)
    const skip = (page.value - 1) * pageSize.value
    const limit = pageSize.value
    
    // Fetch data from real API endpoint
    const response = await fetch(\`https://dummyjson.com/products?skip=\${skip}&limit=\${limit}\`)
    const data = await response.json()
    
    // Update total from API response
    total.value = data.total || 0
    
    // Map API response to grid rows
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
    console.error('Error fetching products:', error)
    rows.value = []
    total.value = 0
  }
})

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Product Title', width: 300 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => \`$\${v.toFixed(2)}\` },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'rating', title: 'Rating', width: 100, format: (v: number) => v.toFixed(1) },
]
<\/script>`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

