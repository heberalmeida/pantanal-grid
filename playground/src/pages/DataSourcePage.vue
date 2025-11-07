<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">DataSource Component</h2>
      <p class="text-sm text-slate-600 dark:text-slate-200">
        The DataSource component provides an abstraction for working with local data arrays or remote data services.
        It handles filtering, sorting, pagination, and grouping operations either client-side or server-side.
      </p>
    </header>

    <!-- Local DataSource Example -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Local DataSource</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Using DataSource with local data array. All operations (filtering, sorting, pagination) are performed client-side.
      </p>
      <PantanalDataSource
        ref="localDataSource"
        type="local"
        :data="localData"
        v-model:page="localPage"
        v-model:pageSize="localPageSize"
        v-model:sort="localSort"
        v-model:filter="localFilter"
        @change="handleLocalChange"
      >
      </PantanalDataSource>
      <PantanalGrid
        :rows="localDataSourceData"
        :columns="columns"
        key-field="id"
        v-model:page="localPage"
        v-model:pageSize="localPageSize"
        v-model:sort="localSort"
        v-model:filter="localFilter"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        locale="en"
      />
      <ExampleCode :source="localDataSourceCode" />
    </article>

    <!-- Remote DataSource Example -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Remote DataSource</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Using DataSource with remote data service. Operations are sent to the server via REST API.
      </p>
      <PantanalDataSource
        ref="remoteDataSource"
        type="remote"
        :transport="remoteTransport"
        :schema="remoteSchema"
        :server-paging="true"
        :server-filtering="true"
        :server-sorting="true"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
        v-model:sort="remoteSort"
        v-model:filter="remoteFilter"
        @change="handleRemoteChange"
        @error="handleRemoteError"
      >
      </PantanalDataSource>
      <PantanalGrid
        :rows="remoteDataSourceData"
        :columns="columns"
        key-field="id"
        :total="remoteTotal"
        server-side
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
        v-model:sort="remoteSort"
        v-model:filter="remoteFilter"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        locale="en"
      />
      <ExampleCode :source="remoteDataSourceCode" />
    </article>

    <!-- Using with ref attribute -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Using DataSource with ref</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        You can reference a DataSource instance and use it programmatically.
      </p>
      <PantanalDataSource
        ref="refDataSource"
        type="local"
        :data="refData"
        v-model:page="refPage"
        v-model:pageSize="refPageSize"
        @change="handleRefChange"
      >
      </PantanalDataSource>
      <div class="mb-4 space-x-2">
        <button
          @click="refDataSource?.read()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Refresh Data
        </button>
        <button
          @click="refDataSource?.query({ page: 1, pageSize: 10 })"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Reset to Page 1
        </button>
      </div>
      <PantanalGrid
        :rows="refDataSourceData"
        :columns="columns"
        key-field="id"
        v-model:page="refPage"
        v-model:pageSize="refPageSize"
        locale="en"
      />
      <ExampleCode :source="refDataSourceCode" />
    </article>

    <!-- Standalone DataSource Example -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Standalone DataSource (without Grid)</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        DataSource can be used independently without the Grid component. Perfect for custom UI components, lists, cards, or any other data presentation needs.
      </p>
      
      <PantanalDataSource
        ref="standaloneDataSource"
        type="local"
        :data="standaloneData"
        v-model:page="standalonePage"
        v-model:pageSize="standalonePageSize"
        v-model:sort="standaloneSort"
        v-model:filter="standaloneFilter"
        @change="handleStandaloneChange"
      >
      </PantanalDataSource>
      
      <div class="mb-4 space-y-4">
        <div class="flex gap-4 items-center flex-wrap">
          <div>
            <label class="text-sm font-medium mr-2">Filter:</label>
            <input
              v-model="standaloneFilterText"
              @input="updateStandaloneFilter"
              type="text"
              placeholder="Search by title..."
              class="px-3 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label class="text-sm font-medium mr-2">Sort:</label>
            <select
              v-model="standaloneSortField"
              @change="updateStandaloneSort"
              class="px-3 py-1 border rounded text-sm">
              <option value="">None</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium mr-2">Page Size:</label>
            <select
              v-model="standalonePageSize"
              class="px-3 py-1 border rounded text-sm">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
          </div>
          <button
            @click="standaloneDataSource?.read()"
            class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            Refresh
          </button>
        </div>
        
        <div class="text-sm text-slate-600 dark:text-slate-400">
          Showing {{ standaloneDisplayData.length }} of {{ standaloneTotal }} items
          (Page {{ standalonePage }} of {{ standaloneTotalPages }})
        </div>
      </div>

      <!-- Custom List Display -->
      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in standaloneDisplayData"
          :key="item.id"
          class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h4 class="font-semibold text-lg mb-2">{{ item.title }}</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">
            <strong>Price:</strong> ${{ item.price.toFixed(2) }}
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            <strong>Category:</strong> {{ item.category }}
          </p>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-center gap-2">
        <button
          @click="standalonePage = Math.max(1, standalonePage - 1)"
          :disabled="standalonePage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <span class="px-4 py-2 text-sm">
          Page {{ standalonePage }} / {{ standaloneTotalPages }}
        </span>
        <button
          @click="standalonePage = Math.min(standaloneTotalPages, standalonePage + 1)"
          :disabled="standalonePage >= standaloneTotalPages"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>

      <ExampleCode :source="standaloneDataSourceCode" />
    </article>

    <!-- Standalone Remote DataSource Example -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Standalone Remote DataSource</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Using DataSource standalone with remote API. Perfect for building custom data-driven components.
      </p>
      
      <PantanalDataSource
        ref="standaloneRemoteDataSource"
        type="remote"
        :transport="standaloneRemoteTransport"
        :schema="standaloneRemoteSchema"
        :server-paging="true"
        :server-filtering="true"
        v-model:page="standaloneRemotePage"
        v-model:pageSize="standaloneRemotePageSize"
        v-model:filter="standaloneRemoteFilter"
        @change="handleStandaloneRemoteChange"
        @error="handleStandaloneRemoteError"
        @requestStart="standaloneRemoteLoading = true"
        @requestEnd="standaloneRemoteLoading = false"
      >
      </PantanalDataSource>
      
      <div class="mb-4 space-y-4">
        <div class="flex gap-4 items-center">
          <div>
            <label class="text-sm font-medium mr-2">Search:</label>
            <input
              v-model="standaloneRemoteFilterText"
              @input="updateStandaloneRemoteFilter"
              type="text"
              placeholder="Search products..."
              class="px-3 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label class="text-sm font-medium mr-2">Page Size:</label>
            <select
              v-model="standaloneRemotePageSize"
              class="px-3 py-1 border rounded text-sm">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
          </div>
        </div>
        
        <div v-if="standaloneRemoteLoading" class="text-sm text-blue-600">
          Loading...
        </div>
        <div v-else class="text-sm text-slate-600 dark:text-slate-400">
          Showing {{ standaloneRemoteDisplayData.length }} of {{ standaloneRemoteTotal }} products
        </div>
      </div>

      <!-- Product Cards -->
      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in standaloneRemoteDisplayData"
          :key="product.id"
          class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h4 class="font-semibold text-lg mb-2">{{ product.title }}</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
            <strong>Price:</strong> ${{ product.price.toFixed(2) }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-500">
            ID: {{ product.id }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center gap-2">
        <button
          @click="standaloneRemotePage = Math.max(1, standaloneRemotePage - 1)"
          :disabled="standaloneRemotePage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <span class="px-4 py-2 text-sm">
          Page {{ standaloneRemotePage }}
        </span>
        <button
          @click="standaloneRemotePage = standaloneRemotePage + 1"
          :disabled="standaloneRemoteDisplayData.length < standaloneRemotePageSize"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>

      <ExampleCode :source="standaloneRemoteDataSourceCode" />
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, PantanalDataSource, type SortDescriptor, type FilterDescriptor, type DataSourceInstance } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localDataSourceCode from './DataSourcePage.local-code.vue?raw'
import remoteDataSourceCode from './DataSourcePage.remote-code.vue?raw'
import refDataSourceCode from './DataSourcePage.ref-code.vue?raw'
import standaloneDataSourceCode from './DataSourcePage.standalone-code.vue?raw'
import standaloneRemoteDataSourceCode from './DataSourcePage.standalone-remote-code.vue?raw'

type Product = { id: number; title: string; price: number; category: string }

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'title', title: 'Title', sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'price', title: 'Price', sortable: true, resizable: true, reorderable: true, format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'category', title: 'Category', sortable: true, filterable: true, resizable: true, reorderable: true },
]

// Local DataSource
const localData = ref<Product[]>(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    category: ['Electronics', 'Clothing', 'Books'][i % 3],
  }))
)

const localDataSource = ref<DataSourceInstance | null>(null)
const localDataSourceData = ref<Product[]>([])
const localPage = ref(1)
const localPageSize = ref(10)
const localSort = ref<SortDescriptor[]>([])
const localFilter = ref<FilterDescriptor[]>([])

function handleLocalChange(data: Product[]) {
  localDataSourceData.value = data
}

// Remote DataSource
const remoteDataSource = ref<DataSourceInstance | null>(null)
const remoteDataSourceData = ref<Product[]>([])
const remoteTotal = ref(0)
const remotePage = ref(1)
const remotePageSize = ref(10)
const remoteSort = ref<SortDescriptor[]>([])
const remoteFilter = ref<FilterDescriptor[]>([])

const remoteTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/products')
    url.searchParams.set('limit', String(params.pageSize || 10))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
    
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const titleFilter = filterObj.find((f: FilterDescriptor) => f.field === 'title')
        if (titleFilter?.value) {
          url.searchParams.set('q', String(titleFilter.value))
          // Use search endpoint when filtering
          const searchUrl = new URL('https://dummyjson.com/products/search')
          searchUrl.searchParams.set('q', String(titleFilter.value))
          searchUrl.searchParams.set('limit', String(params.pageSize || 10))
          searchUrl.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
          const res = await fetch(searchUrl.toString())
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        }
      } catch (e) {
        // Ignore parse errors, continue with normal URL
      }
    }
    
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: remotePage.value,
      pageSize: remotePageSize.value,
      sort: remoteSort.value.length > 0 ? JSON.stringify(remoteSort.value) : undefined,
      filter: remoteFilter.value.length > 0 ? JSON.stringify(remoteFilter.value) : undefined,
      ...data,
    }
  },
}

const remoteSchema = {
  data: (response: any) => response.products || [],
  total: (response: any) => response.total || 0,
}

function handleRemoteChange(data: Product[]) {
  remoteDataSourceData.value = data
  if (remoteDataSource.value) {
    const totalCount = remoteDataSource.value.total()
    if (totalCount > 0) {
      remoteTotal.value = totalCount
    }
  }
}

function handleRemoteError(error: any) {
  console.error('DataSource error:', error)
}

// Ref DataSource
const refData = ref<Product[]>(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    price: +(Math.random() * 500).toFixed(2),
    category: ['A', 'B', 'C'][i % 3],
  }))
)

const refDataSource = ref<DataSourceInstance | null>(null)
const refDataSourceData = ref<Product[]>([])
const refPage = ref(1)
const refPageSize = ref(10)

function handleRefChange(data: Product[]) {
  refDataSourceData.value = data
}

// Standalone DataSource
const standaloneData = ref<Product[]>(
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: +(Math.random() * 500).toFixed(2),
    category: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'][i % 5],
  }))
)

const standaloneDataSource = ref<DataSourceInstance | null>(null)
const standaloneDisplayData = ref<Product[]>([])
const standaloneTotal = computed(() => standaloneDataSource.value?.total() || 0)
const standaloneTotalPages = computed(() => Math.ceil(standaloneTotal.value / standalonePageSize.value) || 1)
const standalonePage = ref(1)
const standalonePageSize = ref(6)
const standaloneSort = ref<SortDescriptor[]>([])
const standaloneFilter = ref<FilterDescriptor[]>([])
const standaloneFilterText = ref('')
const standaloneSortField = ref('')

function handleStandaloneChange(data: Product[]) {
  standaloneDisplayData.value = data
}

function updateStandaloneFilter() {
  const others = standaloneFilter.value.filter(f => f.field !== 'title')
  if (standaloneFilterText.value) {
    standaloneFilter.value = [...others, { field: 'title', operator: 'contains', value: standaloneFilterText.value }]
  } else {
    standaloneFilter.value = others
  }
}

function updateStandaloneSort() {
  if (standaloneSortField.value) {
    const existing = standaloneSort.value.find(s => s.field === standaloneSortField.value)
    if (existing) {
      standaloneSort.value = existing.dir === 'asc'
        ? [{ field: standaloneSortField.value, dir: 'desc' }]
        : []
      if (standaloneSort.value.length === 0) standaloneSortField.value = ''
    } else {
      standaloneSort.value = [{ field: standaloneSortField.value, dir: 'asc' }]
    }
  } else {
    standaloneSort.value = []
  }
}

// Standalone Remote DataSource
const standaloneRemoteDataSource = ref<DataSourceInstance | null>(null)
const standaloneRemoteDisplayData = ref<Product[]>([])
const standaloneRemoteTotal = ref(0)
const standaloneRemotePage = ref(1)
const standaloneRemotePageSize = ref(6)
const standaloneRemoteFilter = ref<FilterDescriptor[]>([])
const standaloneRemoteFilterText = ref('')
const standaloneRemoteLoading = ref(false)

const standaloneRemoteTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const baseUrl = params.filter ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products'
    const url = new URL(baseUrl)
    
    url.searchParams.set('limit', String(params.pageSize || 6))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 6)))
    
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const titleFilter = filterObj.find((f: FilterDescriptor) => f.field === 'title')
        if (titleFilter?.value) {
          url.searchParams.set('q', String(titleFilter.value))
        }
      } catch (e) {
        // Ignore
      }
    }
    
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: standaloneRemotePage.value,
      pageSize: standaloneRemotePageSize.value,
      filter: standaloneRemoteFilter.value.length > 0 ? JSON.stringify(standaloneRemoteFilter.value) : undefined,
      ...data,
    }
  },
}

const standaloneRemoteSchema = {
  data: (response: any) => response.products || [],
  total: (response: any) => response.total || 0,
}

function handleStandaloneRemoteChange(data: Product[]) {
  standaloneRemoteDisplayData.value = data
  if (standaloneRemoteDataSource.value) {
    const totalCount = standaloneRemoteDataSource.value.total()
    standaloneRemoteTotal.value = totalCount || data.length
  } else {
    standaloneRemoteTotal.value = data.length
  }
}

function handleStandaloneRemoteError(error: any) {
  console.error('DataSource error:', error)
  standaloneRemoteLoading.value = false
}

function updateStandaloneRemoteFilter() {
  const others = standaloneRemoteFilter.value.filter(f => f.field !== 'title')
  if (standaloneRemoteFilterText.value) {
    standaloneRemoteFilter.value = [...others, { field: 'title', operator: 'contains', value: standaloneRemoteFilterText.value }]
  } else {
    standaloneRemoteFilter.value = others
  }
}
</script>

