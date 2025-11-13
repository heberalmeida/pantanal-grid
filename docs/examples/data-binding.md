# Data Binding

The Pantanal Grid enables you to bind it to different data sources. You can populate the Grid with local data arrays, remote data services (REST, GraphQL), WebSocket connections for real-time updates, or work offline with local storage.

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

## Best Practices

### Choosing the Right Data Source

- **Local Arrays**: Best for small datasets (< 10,000 rows) or static data
- **REST API**: Best for standard CRUD operations with large datasets
- **GraphQL**: Best for complex queries and type-safe APIs
- **WebSocket**: Best for real-time collaborative applications
- **Offline Mode**: Best for mobile apps or unreliable network conditions

### Performance Tips

1. **Local Arrays**: Use virtual scrolling for large local datasets
2. **REST API**: Implement proper caching and request debouncing
3. **GraphQL**: Request only the fields you need
4. **WebSocket**: Use connection pooling and reconnection logic
5. **Offline Mode**: Batch sync operations to reduce server load

### Error Handling

Always implement proper error handling for remote data sources:

```typescript
const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  try {
    // ... fetch data
  } catch (error) {
    console.error('Data fetch error:', error)
    // Show user-friendly error message
    return { rows: [], total: 0 }
  }
}
```

## Related Topics

- [Virtual Scrolling](/examples/virtualization) - Optimize performance for large datasets
- [Server-side Pagination](/examples/server-side) - Handle large datasets efficiently
- [Editing](/examples/editing) - Enable CRUD operations with data binding


