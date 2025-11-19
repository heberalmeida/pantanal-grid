---
title: Data Binding
description: Learn how to bind Pantanal Grid to different data sources including local arrays, REST APIs, GraphQL, WebSocket, and offline mode
---

# Data Binding

The Pantanal Grid enables you to bind it to different data sources. You can populate the Grid with local data arrays, remote data services (REST, GraphQL), WebSocket connections for real-time updates, or work offline with local storage.

<ExamplePreview>
  <DataBindingCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import DataBindingCompleteExample from './components/DataBindingCompleteExample.vue'
import DataRestExample from './components/DataRestExample.vue'
import DataGraphQLExample from './components/DataGraphQLExample.vue'
import DataWebSocketExample from './components/DataWebSocketExample.vue'
</script>

## Overview

Pantanal Grid supports multiple data binding strategies:

- **Local Data Arrays** - Simple arrays for client-side operations
- **REST APIs** - Standard HTTP endpoints with `dataProvider` or `PantanalDataSource`
- **GraphQL** - GraphQL queries and mutations
- **WebSocket** - Real-time data updates
- **Offline Mode** - Local storage with sync capabilities
- **DataSource Component** - Higher-level abstraction for data management

## Binding to Local Data Arrays

The simplest way to provide data to the Grid is by using a local data array. All operations (sorting, filtering, pagination) are performed client-side.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'ProductID', title: 'ID', width: 80 },
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'Discontinued', width: 120 },
]

onMounted(() => {
  rows.value = [
    { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false },
    { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 17, "UnitsInStock": 40, "Discontinued": false },
    { "ProductID": 3, "ProductName": "Aniseed Syrup", "UnitPrice": 10, "UnitsInStock": 13, "Discontinued": false },
    { "ProductID": 4, "ProductName": "Chef Anton", "UnitPrice": 22, "UnitsInStock": 53, "Discontinued": false },
    { "ProductID": 5, "ProductName": "Chef Gumbo Mix", "UnitPrice": 21.35, "UnitsInStock": 0, "Discontinued": true },
    { "ProductID": 6, "ProductName": "Boysenberry Spread", "UnitPrice": 25, "UnitsInStock": 120, "Discontinued": false },
  ]
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="ProductID"
  />
</template>
```

**Benefits:**
- Simple setup - just pass an array
- Fast filtering and sorting - no server roundtrips
- Works offline - no network dependency
- Best for small to medium datasets (up to ~10,000 rows)

## Binding to Remote Data Services (REST)

For remote data binding, use the `dataProvider` prop to fetch data from a REST API. The Grid handles pagination, sorting, and filtering requests automatically.

<ExamplePreview>
  <DataRestExample />
</ExamplePreview>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Product Name', width: 180 },
  { field: 'price', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'stock', title: 'Units In Stock', width: 120 },
  { field: 'command', title: ' ', command: ['edit', 'destroy'], width: 170 },
]

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  loading.value = true
  try {
    const { page, pageSize } = args
    const url = new URL('https://dummyjson.com/products')
    url.searchParams.set('limit', String(pageSize))
    url.searchParams.set('skip', String((page - 1) * pageSize))
    
    const res = await fetch(url.toString())
    const json = await res.json()
    
    return { rows: json.products, total: json.total }
  } catch (error) {
    console.error('Error:', error)
    return { rows: [], total: 0 }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :data-provider="dataProvider"
    :loading="loading"
    key-field="id"
    server-side
  />
</template>
```

**Benefits:**
- Efficient for large datasets - only loads visible data
- Server-side filtering and sorting - reduces client load
- Supports any REST API endpoint
- Automatic pagination handling

## Binding to GraphQL Service

GraphQL services are served over HTTP through a single endpoint. The Grid can perform CRUD operations through GraphQL queries and mutations.

<ExamplePreview>
  <DataGraphQLExample />
</ExamplePreview>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 110 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units in Stock', width: 120 },
  { field: 'command', title: 'Options', width: 200, command: ['edit', 'destroy'] },
]

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  loading.value = true
  try {
    const { page, pageSize } = args
    const query = `query {
      products(limit: ${pageSize}, skip: ${(page - 1) * pageSize}) {
        productID, productName, unitPrice, unitsInStock
      }
    }`
    
    const res = await fetch('https://your-graphql-endpoint.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    
    const json = await res.json()
    return { rows: json.data?.products || [], total: json.data?.total || 0 }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :data-provider="dataProvider"
    :loading="loading"
    key-field="productID"
    server-side
  />
</template>
```

**Benefits:**
- Single endpoint for all operations
- Flexible querying - request only needed fields
- Type-safe with GraphQL schema
- Supports subscriptions for real-time updates

## Binding to WebSocket (Real-time Updates)

The Grid allows you to perform real-time updates for all users. You can utilize WebSockets to receive push notifications when data changes on the server.

<ExamplePreview>
  <DataWebSocketExample />
</ExamplePreview>

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
let ws: WebSocket | null = null

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 200 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120 },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

onMounted(() => {
  const host = 'wss://your-websocket-server.com'
  ws = new WebSocket(host)
  
  ws.onopen = () => {
    ws?.send(JSON.stringify({ type: 'read' }))
  }
  
  ws.onmessage = (event) => {
    const result = JSON.parse(event.data)
    if (result.type === 'push-create' || result.type === 'push-update') {
      // Update rows with real-time data
      rows.value = result.data
    } else if (result.type === 'push-destroy') {
      rows.value = rows.value.filter((item: any) => item.ProductID !== result.data.ProductID)
    }
  }
})

onBeforeUnmount(() => {
  if (ws) ws.close()
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="ProductID"
  />
</template>
```

**Benefits:**
- Real-time synchronization across clients
- Push notifications for data changes
- Efficient for collaborative applications
- Low latency updates

## Working Offline

The Grid supports working offline by storing data in localStorage. You can edit, create, or delete records when offline, and sync the updates when you're back online.

```vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const isOnline = ref(navigator.onLine)

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 200 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120 },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'command', title: ' ', width: 170, command: ['edit', 'destroy'] },
]

onMounted(() => {
  // Load from localStorage
  const stored = localStorage.getItem('offline-products')
  if (stored) {
    rows.value = JSON.parse(stored)
  }
  
  window.addEventListener('online', syncData)
})

// Save to localStorage on changes
watch(rows, () => {
  localStorage.setItem('offline-products', JSON.stringify(rows.value))
}, { deep: true })

function syncData() {
  // Sync pending changes to server
  const pending = localStorage.getItem('offline-pending')
  if (pending) {
    const changes = JSON.parse(pending)
    // Send to server...
    localStorage.removeItem('offline-pending')
  }
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="ProductID"
    editable="inline"
    toolbar="['create']"
  />
</template>
```

**Benefits:**
- Works without internet connection
- Automatic local storage persistence
- Sync when connection is restored
- Better user experience in unreliable networks

## Data Provider Pattern

The `dataProvider` prop allows you to provide a function that fetches data asynchronously. The grid automatically calls this function when pagination, sorting, or filtering changes.

### Basic Data Provider

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` }
]

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  loading.value = true
  try {
    const { page, pageSize, sort, filter, signal } = args
    
    // Build API URL with parameters
    const url = new URL('https://api.example.com/products')
    url.searchParams.set('page', String(page))
    url.searchParams.set('limit', String(pageSize))
    
    if (sort && sort.length > 0) {
      url.searchParams.set('sort', JSON.stringify(sort))
    }
    
    if (filter && filter.length > 0) {
      url.searchParams.set('filter', JSON.stringify(filter))
    }
    
    const response = await fetch(url.toString(), { signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const data = await response.json()
    
    return {
      rows: data.items || [],
      total: data.total || 0
    }
  } catch (error) {
    console.error('Data fetch error:', error)
    return { rows: [], total: 0 }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :data-provider="dataProvider"
    :loading="loading"
    :auto-bind="true"
    key-field="id"
    server-side
  />
</template>
```

### Data Provider with Auto-bind

Use `auto-bind="true"` to automatically load data when the component mounts:

```vue
<PantanalGrid
  :rows="[]"
  :columns="columns"
  :data-provider="dataProvider"
  :loading="loading"
  :auto-bind="true"
  key-field="id"
  server-side
/>
```

### Manual Data Binding

You can also trigger data loading manually:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

async function loadData() {
  if (gridRef.value) {
    await gridRef.value.rebind()
  }
}
</script>

<template>
  <div>
    <button @click="loadData">Load Data</button>
    <PantanalGrid
      ref="gridRef"
      :rows="[]"
      :columns="columns"
      :data-provider="dataProvider"
      key-field="id"
      server-side
    />
  </div>
</template>
```

## PantanalDataSource Component

The `PantanalDataSource` component provides a higher-level abstraction for data management. It handles filtering, sorting, and pagination automatically.

### Local DataSource

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type DataSourceInstance } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const data = ref([/* your data */])
const rows = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const sort = ref([])
const filter = ref([])

const columns: ColumnDef[] = [/* ... */]

function handleChange(data: any[]) {
  rows.value = data
}
</script>

<template>
  <PantanalDataSource
    ref="dataSourceRef"
    type="local"
    :data="data"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>
```

### Remote DataSource with Transport

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)

const columns: ColumnDef[] = [/* ... */]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const url = new URL('https://api.example.com/data')
    url.searchParams.set('page', String(params.page || 1))
    url.searchParams.set('limit', String(params.pageSize || 20))
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      ...data
    }
  }
}

const schema: DataSourceSchema = {
  data: (response: any) => response.items || [],
  total: (response: any) => response.total || 0
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    total.value = dataSourceRef.value.total()
  }
}
</script>

<template>
  <PantanalDataSource
    ref="dataSourceRef"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-sorting="true"
    :server-filtering="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
    @requestStart="loading = true"
    @requestEnd="loading = false"
  />
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :total="total"
    key-field="id"
    server-side
    v-model:page="page"
    v-model:pageSize="pageSize"
    :loading="loading"
  />
</template>
```

## Data Provider Arguments

The `DataProviderArgs` interface provides all the information needed to fetch data:

```typescript
interface DataProviderArgs {
  page: number              // Current page number
  pageSize: number          // Number of rows per page
  sort?: SortDescriptor[]   // Current sort configuration
  filter?: FilterDescriptor[] // Current filter configuration
  group?: GroupDescriptor[] // Current group configuration
  signal?: AbortSignal      // AbortSignal for request cancellation
}
```

## Data Provider Response

Your data provider function must return an object with this structure:

```typescript
interface DataProviderResult {
  rows: any[]    // Array of row data
  total: number  // Total number of rows (for pagination)
}
```

## Request Cancellation

The grid automatically cancels previous requests when new ones are made using `AbortSignal`:

```typescript
const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  const { signal } = args
  
  const response = await fetch(url, { signal })
  // If the request is cancelled, fetch will throw an AbortError
  // which you can handle gracefully
}
```

## Error Handling

Always implement proper error handling for remote data sources:

```typescript
const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  try {
    const response = await fetch(url, { signal: args.signal })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return { rows: data.items || [], total: data.total || 0 }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Request was cancelled, return empty result
      return { rows: [], total: 0 }
    }
    
    console.error('Data fetch error:', error)
    // Show user-friendly error message
    // You could emit an event or show a toast notification here
    return { rows: [], total: 0 }
  }
}
```

## Loading States

Manage loading states to provide user feedback:

```vue
<script setup lang="ts">
const loading = ref(false)

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  loading.value = true
  try {
    // ... fetch data
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :data-provider="dataProvider"
    :loading="loading"
    :auto-bind="true"
    key-field="id"
    server-side
  />
</template>
```

## Best Practices

### Choosing the Right Data Source

- **Local Arrays**: Best for small datasets (< 10,000 rows) or static data
- **REST API with dataProvider**: Best for standard CRUD operations with large datasets
- **REST API with DataSource**: Best when you need more control over data operations
- **GraphQL**: Best for complex queries and type-safe APIs
- **WebSocket**: Best for real-time collaborative applications
- **Offline Mode**: Best for mobile apps or unreliable network conditions

### Performance Tips

1. **Local Arrays**: Use virtual scrolling for large local datasets (10,000+ rows)
2. **REST API**: Implement proper caching and request debouncing
3. **GraphQL**: Request only the fields you need to reduce payload size
4. **WebSocket**: Use connection pooling and reconnection logic
5. **Offline Mode**: Batch sync operations to reduce server load
6. **Request Cancellation**: Always use the `signal` parameter to cancel stale requests
7. **Error Handling**: Provide user-friendly error messages and fallback UI

### Data Source Comparison

| Feature | Local Array | dataProvider | DataSource Component |
|---------|-------------|--------------|---------------------|
| Setup Complexity | Low | Medium | High |
| Client-side Operations | ✅ Full | ❌ Limited | ✅ Full |
| Server-side Operations | ❌ | ✅ Full | ✅ Full |
| State Management | Manual | Automatic | Automatic |
| Error Handling | Manual | Manual | Built-in events |
| Request Cancellation | N/A | ✅ Automatic | ✅ Automatic |
| Best For | Small datasets | Simple APIs | Complex scenarios |

## DataSource Component Features

The `PantanalDataSource` component provides additional features beyond basic data binding:

### DataSource Events

```vue
<PantanalDataSource
  ref="dataSourceRef"
  type="remote"
  :transport="transport"
  :schema="schema"
  @change="handleChange"           // Fired when data changes
  @error="handleError"             // Fired on data fetch errors
  @requestStart="loading = true"  // Fired when request starts
  @requestEnd="loading = false"    // Fired when request ends
/>
```

### DataSource Methods

```vue
<script setup lang="ts">
const dataSourceRef = ref<DataSourceInstance | null>(null)

// Read data manually
async function loadData() {
  if (dataSourceRef.value) {
    await dataSourceRef.value.read()
  }
}

// Get total count
function getTotal() {
  return dataSourceRef.value?.total() || 0
}

// Get current data
function getData() {
  return dataSourceRef.value?.data() || []
}

// Refresh data
async function refresh() {
  if (dataSourceRef.value) {
    await dataSourceRef.value.read()
  }
}
</script>
```

### DataSource Configuration

```vue
<PantanalDataSource
  type="remote"
  :transport="transport"
  :schema="schema"
  :server-paging="true"      // Enable server-side pagination
  :server-sorting="true"     // Enable server-side sorting
  :server-filtering="true"   // Enable server-side filtering
  :server-grouping="true"    // Enable server-side grouping
  :auto-sync="true"          // Auto-load on mount (default: true)
  :batch="false"             // Batch operations
/>
```

## Advanced Patterns

### Combining Multiple Data Sources

You can switch between different data sources dynamically:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'

const dataSourceType = ref<'local' | 'rest' | 'graphql'>('local')
const localData = ref([/* ... */])
const loading = ref(false)

const dataProvider: DataProvider<any> = computed(() => {
  if (dataSourceType.value === 'local') {
    return async () => ({ rows: localData.value, total: localData.value.length })
  }
  
  if (dataSourceType.value === 'rest') {
    return async (args) => {
      // REST API implementation
      const res = await fetch(`/api/data?page=${args.page}`)
      const data = await res.json()
      return { rows: data.items, total: data.total }
    }
  }
  
  // GraphQL implementation
  return async (args) => {
    // GraphQL query implementation
  }
})
</script>

<template>
  <div>
    <select v-model="dataSourceType">
      <option value="local">Local Data</option>
      <option value="rest">REST API</option>
      <option value="graphql">GraphQL</option>
    </select>
    
    <PantanalGrid
      :rows="[]"
      :columns="columns"
      :data-provider="dataProvider"
      :loading="loading"
      :auto-bind="true"
      key-field="id"
      server-side
    />
  </div>
</template>
```

### Caching Data Provider Results

Implement caching to reduce API calls:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const cache = new Map<string, { rows: any[], total: number, timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  const cacheKey = JSON.stringify({ page: args.page, pageSize: args.pageSize, sort: args.sort, filter: args.filter })
  const cached = cache.get(cacheKey)
  
  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { rows: cached.rows, total: cached.total }
  }
  
  // Fetch fresh data
  const response = await fetch(`/api/data?${new URLSearchParams({
    page: String(args.page),
    limit: String(args.pageSize)
  })}`)
  const data = await response.json()
  
  // Cache the result
  cache.set(cacheKey, {
    rows: data.items,
    total: data.total,
    timestamp: Date.now()
  })
  
  return { rows: data.items, total: data.total }
}
</script>
```

### Debouncing Data Provider Calls

Debounce rapid changes to reduce API calls:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

let debounceTimer: number | null = null
const DEBOUNCE_DELAY = 300 // milliseconds

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  return new Promise((resolve) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = window.setTimeout(async () => {
      const response = await fetch(`/api/data?page=${args.page}`)
      const data = await response.json()
      resolve({ rows: data.items, total: data.total })
    }, DEBOUNCE_DELAY)
  })
}
</script>
```

## TypeScript Support

All data binding features are fully typed:

```typescript
import {
  PantanalGrid,
  PantanalDataSource,
  type ColumnDef,
  type DataProvider,
  type DataProviderArgs,
  type DataSourceInstance,
  type DataSourceTransport,
  type DataSourceSchema
} from '@pantanal/grid'

// Type-safe data provider
const dataProvider: DataProvider<MyDataType> = async (args: DataProviderArgs) => {
  // args is fully typed
  // Return type is inferred
  return { rows: [], total: 0 }
}
```

## Related Topics

- [Virtual Scrolling](/examples/virtualization) - Optimize performance for large datasets
- [Server-side Pagination](/examples/server-side) - Handle large datasets efficiently
- [Editing](/examples/editing) - Enable CRUD operations with data binding
- [Data Sources API](/api/data-sources) - Complete API documentation for data binding


