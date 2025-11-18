<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor, type DataProvider } from '@pantanal/grid'

// Basic Server-Side with watchEffect
const basicRows = ref([])
const basicTotal = ref(0)
const basicLoading = ref(false)
const basicPage = ref(1)
const basicPageSize = ref(10)
const basicSort = ref<SortDescriptor[]>([])
const basicFilter = ref<FilterDescriptor[]>([])

const basicColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', width: 200, filterable: true },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'category', title: 'Category', width: 150, filterable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` }
]

watchEffect(async () => {
  // Skip fetch during SSR/build
  if (typeof window === 'undefined') {
    basicRows.value = []
    basicTotal.value = 0
    return
  }
  
  basicLoading.value = true
  try {
    const params = new URLSearchParams({
      limit: String(basicPageSize.value),
      skip: String((basicPage.value - 1) * basicPageSize.value)
    })
    
    const response = await fetch(`https://dummyjson.com/products?${params}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON')
    }
    const data = await response.json()
    basicRows.value = data.products || []
    basicTotal.value = data.total || 0
  } catch (error) {
    console.error('Error fetching data:', error)
    basicRows.value = []
    basicTotal.value = 0
  } finally {
    basicLoading.value = false
  }
})

// With DataProvider
const providerRows = ref([])
const providerTotal = ref(0)
const providerPage = ref(1)
const providerPageSize = ref(10)
const providerSort = ref<SortDescriptor[]>([])
const providerFilter = ref<FilterDescriptor[]>([])

const providerColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', width: 200, filterable: true },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` }
]

const dataProvider: DataProvider = async (args) => {
  // Skip fetch during SSR/build
  if (typeof window === 'undefined') {
    return { rows: [], total: 0 }
  }
  
  const params = new URLSearchParams({
    limit: String(args.pageSize),
    skip: String((args.page - 1) * args.pageSize)
  })
  
  // Add sorting
  if (args.sort && args.sort.length > 0) {
    params.append('sortBy', args.sort[0].field)
    params.append('order', args.sort[0].dir)
  }
  
  // Add filtering (simplified - in real app, send filter params to server)
  if (args.filter && args.filter.length > 0) {
    const filter = args.filter[0]
    if (filter.field === 'title' && filter.value) {
      params.append('q', String(filter.value))
    }
  }
  
  try {
    const response = await fetch(`https://dummyjson.com/products?${params}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON')
    }
    const data = await response.json()
    
    return {
      rows: data.products || [],
      total: data.total || 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { rows: [], total: 0 }
  }
}

// With Loading State
const loadingRows = ref([])
const loadingTotal = ref(0)
const loadingPage = ref(1)
const loadingPageSize = ref(10)
const loadingSort = ref<SortDescriptor[]>([])
const loadingFilter = ref<FilterDescriptor[]>([])
const loading = ref(false)

const loadingColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', width: 200, filterable: true },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` }
]

watchEffect(async () => {
  // Skip fetch during SSR/build
  if (typeof window === 'undefined') {
    loadingRows.value = []
    loadingTotal.value = 0
    return
  }
  
  loading.value = true
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const params = new URLSearchParams({
      limit: String(loadingPageSize.value),
      skip: String((loadingPage.value - 1) * loadingPageSize.value)
    })
    
    const response = await fetch(`https://dummyjson.com/products?${params}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON')
    }
    const data = await response.json()
    loadingRows.value = data.products || []
    loadingTotal.value = data.total || 0
  } catch (error) {
    console.error('Error fetching data:', error)
    loadingRows.value = []
    loadingTotal.value = 0
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Server-Side -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Server-Side</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Data is fetched from a remote API (DummyJSON). Pagination triggers new API requests.
        Total items: {{ basicTotal }}
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="id"
        :server-side="true"
        :total="basicTotal"
        :loading="basicLoading"
        v-model:page="basicPage"
        v-model:pageSize="basicPageSize"
        v-model:sort="basicSort"
        v-model:filter="basicFilter"
        :height="400"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With DataProvider -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Server-Side with DataProvider</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use the <code>dataProvider</code> prop for a cleaner API. The provider function handles all server-side operations
        (pagination, sorting, filtering) and returns the data.
      </p>
      <PantanalGrid
        :rows="providerRows"
        :columns="providerColumns"
        key-field="id"
        :data-provider="dataProvider"
        :auto-bind="true"
        server-side
        v-model:page="providerPage"
        v-model:pageSize="providerPageSize"
        v-model:sort="providerSort"
        v-model:filter="providerFilter"
        :height="400"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With Loading State -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Server-Side with Loading Indicator</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The grid automatically shows a loading indicator when <code>loading</code> is true.
        This example includes a simulated network delay to demonstrate the loading state.
      </p>
      <PantanalGrid
        :rows="loadingRows"
        :columns="loadingColumns"
        key-field="id"
        :server-side="true"
        :total="loadingTotal"
        :loading="loading"
        v-model:page="loadingPage"
        v-model:pageSize="loadingPageSize"
        v-model:sort="loadingSort"
        v-model:filter="loadingFilter"
        :height="400"
        locale="en"
        responsive="table"
      />
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>







