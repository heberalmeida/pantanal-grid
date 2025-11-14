<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type FilterDescriptor, type DataProvider, type DataProviderArgs, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import ExampleCode from '../components/ExampleCode.vue'

// Example 1: Local Data Arrays
const localRows = ref<any[]>([])

const localColumns: ColumnDef[] = [
  { field: 'ProductID', title: 'ID', width: 80 },
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'Discontinued', width: 120 },
]

onMounted(() => {
  localRows.value = [
    { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false },
    { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 17, "UnitsInStock": 40, "Discontinued": false },
    { "ProductID": 3, "ProductName": "Aniseed Syrup", "UnitPrice": 10, "UnitsInStock": 13, "Discontinued": false },
    { "ProductID": 4, "ProductName": "Chef Anton", "UnitPrice": 22, "UnitsInStock": 53, "Discontinued": false },
    { "ProductID": 5, "ProductName": "Chef Gumbo Mix", "UnitPrice": 21.35, "UnitsInStock": 0, "Discontinued": true },
    { "ProductID": 6, "ProductName": "Boysenberry Spread", "UnitPrice": 25, "UnitsInStock": 120, "Discontinued": false },
  ]
})

const localCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'ProductID', title: 'ID', width: 80 },
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'Discontinued', width: 120 },
]

onMounted(() => {
  rows.value = [
    { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false },
    { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 17, "UnitsInStock": 40, "Discontinued": false },
    // ... more data
  ]
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="ProductID"
  />
<\/template>`

// Example 2: Remote Data Services (REST)
const remoteLoading = ref(false)

const remoteColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Product Name', width: 180 },
  { field: 'price', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'stock', title: 'Units In Stock', width: 120 },
  { field: 'rating', title: 'Rating', width: 100 },
]

const remoteSort = ref<SortDescriptor[]>([])
const remoteFilter = ref<FilterDescriptor[]>([])
const remotePage = ref(1)
const remotePageSize = ref(20)

const remoteDataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  remoteLoading.value = true
  try {
    const { page, pageSize, signal } = args
    // REST API call
    const url = new URL('https://dummyjson.com/products')
    url.searchParams.set('limit', String(pageSize))
    url.searchParams.set('skip', String((page - 1) * pageSize))
    
    const res = await fetch(url.toString(), { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    
    const result = { rows: json.products || [], total: json.total || 0 }
    remoteLoading.value = false
    return result
  } catch (error) {
    console.error('Error loading data:', error)
    remoteLoading.value = false
    return { rows: [], total: 0 }
  }
}

const remoteCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Product Name', width: 180 },
  { field: 'price', title: 'Unit Price', width: 120, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'stock', title: 'Units In Stock', width: 120 },
]

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  loading.value = true
  try {
    const { page, pageSize, signal } = args
    const url = new URL('https://dummyjson.com/products')
    url.searchParams.set('limit', String(pageSize))
    url.searchParams.set('skip', String((page - 1) * pageSize))
    
    const res = await fetch(url.toString(), { signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const json = await res.json()
    
    return { rows: json.products || [], total: json.total || 0 }
  } catch (error) {
    console.error('Error:', error)
    return { rows: [], total: 0 }
  } finally {
    loading.value = false
  }
}
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :data-provider="dataProvider"
    :loading="loading"
    :auto-bind="true"
    key-field="id"
  />
<\/template>`

// Example 3: GraphQL Service
const graphqlLoading = ref(false)

const graphqlColumns: ColumnDef[] = [
  { field: 'productID', title: 'Post ID', width: 110 },
  { field: 'productName', title: 'Post Title', width: 300 },
  { field: 'unitPrice', title: 'Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'unitsInStock', title: 'User ID', width: 120 },
]

const graphqlSort = ref<SortDescriptor[]>([])
const graphqlPage = ref(1)
const graphqlPageSize = ref(20)

const graphqlDataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  graphqlLoading.value = true
  try {
    const { page, pageSize, signal } = args
    const query = `query ($options: PageQueryOptions) {
      posts(options: $options) {
        data {
          id
          title
          body
          user {
            id
            name
          }
        }
        meta {
          totalCount
        }
      }
    }`
    
    const variables = {
      options: {
        paginate: {
          page,
          limit: pageSize
        }
      }
    }
    
    const res = await fetch('https://graphqlzero.almansi.me/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal,
    })
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    
    // Transform GraphQL response to grid format
    const posts = json.data?.posts?.data || []
    const total = json.data?.posts?.meta?.totalCount || 0
    
    const rows = posts.map((post: any) => ({
      productID: post.id,
      productName: post.title,
      unitPrice: (post.id % 90) + 10, // Simulated price
      unitsInStock: post.user?.id || 0, // Simulated stock
    }))
    
    graphqlLoading.value = false
    return { rows, total }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      graphqlLoading.value = false
      return { rows: [], total: 0 }
    }
    console.error('GraphQL error:', error)
    graphqlLoading.value = false
    return { rows: [], total: 0 }
  }
}

const graphqlCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'productID', title: 'Post ID', width: 110 },
  { field: 'productName', title: 'Post Title', width: 300 },
  { field: 'unitPrice', title: 'Price', width: 120, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'unitsInStock', title: 'User ID', width: 120 },
]

const dataProvider: DataProvider<any> = async (args: DataProviderArgs) => {
  loading.value = true
  try {
    const { page, pageSize, signal } = args
    const query = \`query ($options: PageQueryOptions) {
      posts(options: $options) {
        data {
          id
          title
          body
          user {
            id
            name
          }
        }
        meta {
          totalCount
        }
      }
    }\`
    
    const variables = {
      options: {
        paginate: {
          page,
          limit: pageSize
        }
      }
    }
    
    const res = await fetch('https://graphqlzero.almansi.me/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal,
    })
    
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const json = await res.json()
    
    // Transform GraphQL response to grid format
    const posts = json.data?.posts?.data || []
    const total = json.data?.posts?.meta?.totalCount || 0
    
    const rows = posts.map((post: any) => ({
      productID: post.id,
      productName: post.title,
      unitPrice: (post.id % 90) + 10,
      unitsInStock: post.user?.id || 0,
    }))
    
    return { rows, total }
  } catch (error) {
    console.error('GraphQL error:', error)
    return { rows: [], total: 0 }
  } finally {
    loading.value = false
  }
}
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :data-provider="dataProvider"
    :loading="loading"
    :auto-bind="true"
    key-field="productID"
  />
<\/template>`

// Example 4: WebSocket (Real-time updates)
const wsRows = ref<any[]>([])
const wsLoading = ref(true)
const wsConnected = ref(false)
let ws: WebSocket | null = null
let reconnectTimeout: number | null = null

const wsColumns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 200 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

function connectWebSocket() {
  try {
    // Using public WebSocket echo server for testing
    // Options: wss://echo.websocket.org/, wss://ws.postman-echo.com/raw, wss://demos.kaazing.com/echo
    const host = 'wss://echo.websocket.org/'
    ws = new WebSocket(host)
    
    ws.onopen = () => {
      wsConnected.value = true
      wsLoading.value = false
      
      // Load initial data (simulated, since echo server just echoes back)
      wsRows.value = [
        { ProductID: 1, ProductName: 'Chai', UnitPrice: 18 },
        { ProductID: 2, ProductName: 'Chang', UnitPrice: 17 },
        { ProductID: 3, ProductName: 'Aniseed Syrup', UnitPrice: 10 },
        { ProductID: 4, ProductName: 'Chef Anton\'s Cajun Seasoning', UnitPrice: 22 },
        { ProductID: 5, ProductName: 'Chef Anton\'s Gumbo Mix', UnitPrice: 21.35 },
      ]
      
      // Simulate sending read request (echo server will echo it back)
      if (ws) {
        ws.send(JSON.stringify({ 
          type: 'read', 
          timestamp: Date.now(),
          message: 'Connected to WebSocket echo server. This is a demo with simulated data.' 
        }))
      }
    }
    
    ws.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data)
        // Echo server returns what we sent, so we can use it for testing
        console.log('WebSocket message received:', result)
      } catch (error) {
        // Non-JSON message (echo server returns plain text sometimes)
        console.log('WebSocket echo:', event.data)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      wsConnected.value = false
      wsLoading.value = false
    }
    
    ws.onclose = () => {
      wsConnected.value = false
      // Attempt to reconnect after 3 seconds
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      reconnectTimeout = window.setTimeout(() => {
        if (!wsConnected.value) {
          connectWebSocket()
        }
      }, 3000)
    }
  } catch (error) {
    console.error('WebSocket connection error:', error)
    wsLoading.value = false
    wsConnected.value = false
  }
}

let updateInterval: number | null = null

onMounted(() => {
  connectWebSocket()
  
  // Simulate real-time price updates every 5 seconds
  // (This simulates what would come from a real WebSocket server)
  updateInterval = window.setInterval(() => {
    if (wsRows.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * wsRows.value.length)
      const product = wsRows.value[randomIndex]
      const oldPrice = product.UnitPrice
      product.UnitPrice = Math.round((Math.max(1, product.UnitPrice + (Math.random() - 0.5) * 5)) * 100) / 100
      wsRows.value = [...wsRows.value] // Trigger reactivity
      
      // Simulate sending update to WebSocket (if connected)
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'update',
          productID: product.ProductID,
          oldPrice,
          newPrice: product.UnitPrice,
          timestamp: Date.now()
        }))
      }
    }
  }, 5000)
})

onBeforeUnmount(() => {
  if (updateInterval !== null) {
    clearInterval(updateInterval)
    updateInterval = null
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  if (ws) {
    ws.close()
    ws = null
  }
})

const wsCode = `<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const connected = ref(false)
let ws: WebSocket | null = null

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 200 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
]

function connectWebSocket() {
  // Public WebSocket servers for testing:
  // - wss://echo.websocket.org/
  // - wss://ws.postman-echo.com/raw
  // - wss://demos.kaazing.com/echo
  const host = 'wss://echo.websocket.org/'
  ws = new WebSocket(host)
  
  ws.onopen = () => {
    connected.value = true
    // Load initial data
    rows.value = [
      { ProductID: 1, ProductName: 'Chai', UnitPrice: 18 },
      { ProductID: 2, ProductName: 'Chang', UnitPrice: 17 },
      { ProductID: 3, ProductName: 'Aniseed Syrup', UnitPrice: 10 },
    ]
    
    // Send read request
    ws?.send(JSON.stringify({ type: 'read' }))
  }
  
  ws.onmessage = (event) => {
    try {
      const result = JSON.parse(event.data)
      // Handle real-time updates from server
      if (result.type === 'push-update') {
        const index = rows.value.findIndex((r: any) => r.ProductID === result.productID)
        if (index >= 0) {
          rows.value[index] = { ...rows.value[index], ...result.data }
        }
      }
    } catch (error) {
      // Handle non-JSON messages
      console.log('WebSocket message:', event.data)
    }
  }
  
  ws.onclose = () => {
    connected.value = false
    // Reconnect after 3 seconds
    setTimeout(connectWebSocket, 3000)
  }
}

onMounted(() => {
  connectWebSocket()
})

onBeforeUnmount(() => {
  if (ws) {
    ws.close()
    ws = null
  }
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="ProductID"
  />
<\/template>`

// Example 5: Working Offline
const offlineRows = ref<any[]>([])
const isOnline = ref(navigator.onLine)

const offlineColumns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 200 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'Discontinued', width: 120 },
  { field: 'command', title: ' ', width: 170, command: ['edit', 'destroy'] },
]

onMounted(() => {
  // Load from localStorage if available
  const stored = localStorage.getItem('offline-products')
  if (stored) {
    offlineRows.value = JSON.parse(stored)
  } else {
    // Initial data
    offlineRows.value = [
      { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false },
      { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 17, "UnitsInStock": 40, "Discontinued": false },
    ]
  }
  
  // Sync when back online
  window.addEventListener('online', syncOfflineData)
  window.addEventListener('offline', () => { isOnline.value = false })
})

onBeforeUnmount(() => {
  window.removeEventListener('online', syncOfflineData)
})

function syncOfflineData() {
  isOnline.value = true
  // In a real app, sync pending changes to server
  const pending = localStorage.getItem('offline-pending')
  if (pending) {
    // Send changes to server...
    // const changes = JSON.parse(pending)
    localStorage.removeItem('offline-pending')
  }
}

const offlineCode = `<script setup lang="ts">
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
    // Send to server...
  }
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="ProductID"
    editable="inline"
    toolbar="['create']"
  />
<\/template>`

// Example 6: Local Data with DataSource
const localDataSourceRef = ref<DataSourceInstance | null>(null)
const localDataSourceData = ref<any[]>([])
const localDataSourceRows = ref<any[]>([])
const localDataSourcePage = ref(1)
const localDataSourcePageSize = ref(10)
const localDataSourceSort = ref<SortDescriptor[]>([])
const localDataSourceFilter = ref<FilterDescriptor[]>([])

const localDataSourceColumns: ColumnDef[] = [
  { field: 'ProductID', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'ProductName', title: 'Product Name', width: 180, sortable: true, filterable: true },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, sortable: true, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120, sortable: true },
  { field: 'Discontinued', width: 120, filterable: true },
]

onMounted(() => {
  localDataSourceData.value = [
    { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false },
    { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 17, "UnitsInStock": 40, "Discontinued": false },
    { "ProductID": 3, "ProductName": "Aniseed Syrup", "UnitPrice": 10, "UnitsInStock": 13, "Discontinued": false },
    { "ProductID": 4, "ProductName": "Chef Anton", "UnitPrice": 22, "UnitsInStock": 53, "Discontinued": false },
    { "ProductID": 5, "ProductName": "Chef Gumbo Mix", "UnitPrice": 21.35, "UnitsInStock": 0, "Discontinued": true },
    { "ProductID": 6, "ProductName": "Boysenberry Spread", "UnitPrice": 25, "UnitsInStock": 120, "Discontinued": false },
    { "ProductID": 7, "ProductName": "Alice Mutton", "UnitPrice": 39, "UnitsInStock": 0, "Discontinued": true },
    { "ProductID": 8, "ProductName": "Boston Crab Meat", "UnitPrice": 18.4, "UnitsInStock": 123, "Discontinued": false },
    { "ProductID": 9, "ProductName": "Camembert Pierrot", "UnitPrice": 34, "UnitsInStock": 19, "Discontinued": false },
    { "ProductID": 10, "ProductName": "Carnarvon Tigers", "UnitPrice": 62.5, "UnitsInStock": 42, "Discontinued": false },
  ]
})

function handleLocalDataSourceChange(data: any[]) {
  localDataSourceRows.value = data
}

const localDataSourceCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type FilterDescriptor, type DataSourceInstance } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const data = ref<any[]>([])
const rows = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'ProductID', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'ProductName', title: 'Product Name', width: 180, sortable: true, filterable: true },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, sortable: true, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120, sortable: true },
]

onMounted(() => {
  data.value = [
    { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39 },
    { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 17, "UnitsInStock": 40 },
    // ... more data
  ]
})

function handleChange(data: any[]) {
  rows.value = data
}
<\/script>

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
    key-field="ProductID"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    :clean-strings="true"
  />
<\/template>`

// Example 7: Remote REST with DataSource
const remoteDataSourceRef = ref<DataSourceInstance | null>(null)
const remoteDataSourceRows = ref<any[]>([])
const remoteDataSourceTotal = ref(0)
const remoteDataSourceLoading = ref(false)
const remoteDataSourcePage = ref(1)
const remoteDataSourcePageSize = ref(20)
const remoteDataSourceSort = ref<SortDescriptor[]>([])
const remoteDataSourceFilter = ref<FilterDescriptor[]>([])

const remoteDataSourceColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'title', title: 'Product Name', width: 180, sortable: true, filterable: true },
  { field: 'price', title: 'Unit Price', width: 120, sortable: true, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'stock', title: 'Units In Stock', width: 120 },
  { field: 'rating', title: 'Rating', width: 100 },
]

const remoteDataSourceTransport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/products')
    url.searchParams.set('limit', String(params.pageSize || 20))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 20)))
    
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const titleFilter = filterObj.find((f: FilterDescriptor) => f.field === 'title')
        if (titleFilter?.value) {
          const searchUrl = new URL('https://dummyjson.com/products/search')
          searchUrl.searchParams.set('q', String(titleFilter.value))
          searchUrl.searchParams.set('limit', String(params.pageSize || 20))
          searchUrl.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 20)))
          const res = await fetch(searchUrl.toString(), { signal: options.signal })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: remoteDataSourcePage.value,
      pageSize: remoteDataSourcePageSize.value,
      sort: remoteDataSourceSort.value.length > 0 ? JSON.stringify(remoteDataSourceSort.value) : undefined,
      filter: remoteDataSourceFilter.value.length > 0 ? JSON.stringify(remoteDataSourceFilter.value) : undefined,
      ...data,
    }
  },
}

const remoteDataSourceSchema: DataSourceSchema = {
  data: (response: any) => response.products || [],
  total: (response: any) => response.total || 0,
}

function handleRemoteDataSourceChange(data: any[]) {
  remoteDataSourceRows.value = data
  if (remoteDataSourceRef.value) {
    const totalCount = remoteDataSourceRef.value.total()
    if (totalCount > 0) {
      remoteDataSourceTotal.value = totalCount
    }
  }
}

function handleRemoteDataSourceError(error: any) {
  console.error('DataSource error:', error)
  remoteDataSourceLoading.value = false
}

const remoteDataSourceCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type FilterDescriptor, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'title', title: 'Product Name', width: 180, sortable: true, filterable: true },
  { field: 'price', title: 'Unit Price', width: 120, sortable: true, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'stock', title: 'Units In Stock', width: 120 },
]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/products')
    url.searchParams.set('limit', String(params.pageSize || 20))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 20)))
    
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const titleFilter = filterObj.find((f: FilterDescriptor) => f.field === 'title')
        if (titleFilter?.value) {
          const searchUrl = new URL('https://dummyjson.com/products/search')
          searchUrl.searchParams.set('q', String(titleFilter.value))
          searchUrl.searchParams.set('limit', String(params.pageSize || 20))
          searchUrl.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 20)))
          const res = await fetch(searchUrl.toString(), { signal: options.signal })
          if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
          return res.json()
        }
      } catch (e) {
        // Ignore
      }
    }
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      filter: filter.value.length > 0 ? JSON.stringify(filter.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.products || [],
  total: (response: any) => response.total || 0,
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    const totalCount = dataSourceRef.value.total()
    if (totalCount > 0) {
      total.value = totalCount
    }
  }
}

function handleError(error: any) {
  console.error('DataSource error:', error)
  loading.value = false
}
<\/script>

<template>
  <PantanalDataSource
    ref="dataSourceRef"
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
    @error="handleError"
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
    v-model:sort="sort"
    v-model:filter="filter"
    :loading="loading"
    :clean-strings="true"
  />
<\/template>`

// Example 8: GraphQL with DataSource
const graphqlDataSourceRef = ref<DataSourceInstance | null>(null)
const graphqlDataSourceRows = ref<any[]>([])
const graphqlDataSourceTotal = ref(0)
const graphqlDataSourceLoading = ref(false)
const graphqlDataSourcePage = ref(1)
const graphqlDataSourcePageSize = ref(20)
const graphqlDataSourceSort = ref<SortDescriptor[]>([])

const graphqlDataSourceColumns: ColumnDef[] = [
  { field: 'productID', title: 'Post ID', width: 110, sortable: true },
  { field: 'productName', title: 'Post Title', width: 300 },
  { field: 'unitPrice', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'unitsInStock', title: 'User ID', width: 120 },
]

const graphqlDataSourceTransport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const { page, pageSize, signal } = params
    
    const query = `query ($options: PageQueryOptions) {
      posts(options: $options) {
        data {
          id
          title
          body
          user {
            id
            name
          }
        }
        meta {
          totalCount
        }
      }
    }`
    
    const variables = {
      options: {
        paginate: {
          page,
          limit: pageSize
        }
      }
    }
    
    const res = await fetch('https://graphqlzero.almansi.me/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal,
    })
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    
    // Transform GraphQL response
    const posts = json.data?.posts?.data || []
    const total = json.data?.posts?.meta?.totalCount || 0
    
    const rows = posts.map((post: any) => ({
      productID: post.id,
      productName: post.title,
      unitPrice: (post.id % 90) + 10,
      unitsInStock: post.user?.id || 0,
    }))
    
    return { rows, total }
  },
  parameterMap: (data: any) => {
    return {
      page: graphqlDataSourcePage.value,
      pageSize: graphqlDataSourcePageSize.value,
      sort: graphqlDataSourceSort.value.length > 0 ? JSON.stringify(graphqlDataSourceSort.value) : undefined,
      ...data,
    }
  },
}

const graphqlDataSourceSchema: DataSourceSchema = {
  data: (response: any) => response.rows || [],
  total: (response: any) => response.total || 0,
}

function handleGraphqlDataSourceChange(data: any[]) {
  graphqlDataSourceRows.value = data
  if (graphqlDataSourceRef.value) {
    const totalCount = graphqlDataSourceRef.value.total()
    if (totalCount > 0) {
      graphqlDataSourceTotal.value = totalCount
    }
  }
}

function handleGraphqlDataSourceError(error: any) {
  console.error('GraphQL DataSource error:', error)
  graphqlDataSourceLoading.value = false
}

const graphqlDataSourceCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const sort = ref<SortDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'productID', title: 'Post ID', width: 110, sortable: true },
  { field: 'productName', title: 'Post Title', width: 300 },
  { field: 'unitPrice', title: 'Price', width: 120, sortable: true, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'unitsInStock', title: 'User ID', width: 120 },
]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const { page, pageSize, signal } = params
    
    const query = \`query ($options: PageQueryOptions) {
      posts(options: $options) {
        data {
          id
          title
          body
          user {
            id
            name
          }
        }
        meta {
          totalCount
        }
      }
    }\`
    
    const variables = {
      options: {
        paginate: {
          page,
          limit: pageSize
        }
      }
    }
    
    const res = await fetch('https://graphqlzero.almansi.me/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal,
    })
    
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const json = await res.json()
    
    // Transform GraphQL response
    const posts = json.data?.posts?.data || []
    const totalCount = json.data?.posts?.meta?.totalCount || 0
    
    const rows = posts.map((post: any) => ({
      productID: post.id,
      productName: post.title,
      unitPrice: (post.id % 90) + 10,
      unitsInStock: post.user?.id || 0,
    }))
    
    return { rows, total: totalCount }
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.rows || [],
  total: (response: any) => response.total || 0,
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    const totalCount = dataSourceRef.value.total()
    if (totalCount > 0) {
      total.value = totalCount
    }
  }
}

function handleError(error: any) {
  console.error('GraphQL DataSource error:', error)
  loading.value = false
}
<\/script>

<template>
  <PantanalDataSource
    ref="dataSourceRef"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-sorting="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    @change="handleChange"
    @error="handleError"
    @requestStart="loading = true"
    @requestEnd="loading = false"
  />
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :total="total"
    key-field="productID"
    server-side
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    :loading="loading"
    :clean-strings="true"
  />
<\/template>`

// Example 9: REST API Users (Auto-loaded)
const usersDataSourceRef = ref<DataSourceInstance | null>(null)
const usersDataSourceRows = ref<any[]>([])
const usersDataSourceTotal = ref(0)
const usersDataSourceLoading = ref(false)
const usersDataSourcePage = ref(1)
const usersDataSourcePageSize = ref(10)
const usersDataSourceSort = ref<SortDescriptor[]>([])
const usersDataSourceFilter = ref<FilterDescriptor[]>([])

const usersDataSourceColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'firstName', title: 'First Name', width: 150, sortable: true, filterable: true },
  { field: 'lastName', title: 'Last Name', width: 150, sortable: true, filterable: true },
  { field: 'email', title: 'Email', width: 200, sortable: true, filterable: true },
  { field: 'age', title: 'Age', width: 80, sortable: true },
  { field: 'gender', title: 'Gender', width: 100, filterable: true },
]

const usersDataSourceTransport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/users')
    url.searchParams.set('limit', String(params.pageSize || 10))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
    
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const searchFilter = filterObj.find((f: FilterDescriptor) => f.field === 'firstName' || f.field === 'lastName' || f.field === 'email')
        if (searchFilter?.value) {
          const searchUrl = new URL('https://dummyjson.com/users/search')
          searchUrl.searchParams.set('q', String(searchFilter.value))
          searchUrl.searchParams.set('limit', String(params.pageSize || 10))
          searchUrl.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
          const res = await fetch(searchUrl.toString(), { signal: options.signal })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: usersDataSourcePage.value,
      pageSize: usersDataSourcePageSize.value,
      sort: usersDataSourceSort.value.length > 0 ? JSON.stringify(usersDataSourceSort.value) : undefined,
      filter: usersDataSourceFilter.value.length > 0 ? JSON.stringify(usersDataSourceFilter.value) : undefined,
      ...data,
    }
  },
}

const usersDataSourceSchema: DataSourceSchema = {
  data: (response: any) => response.users || [],
  total: (response: any) => response.total || 0,
}

function handleUsersDataSourceChange(data: any[]) {
  usersDataSourceRows.value = data
  if (usersDataSourceRef.value) {
    const totalCount = usersDataSourceRef.value.total()
    if (totalCount > 0) {
      usersDataSourceTotal.value = totalCount
    }
  }
}

function handleUsersDataSourceError(error: any) {
  console.error('Users DataSource error:', error)
  usersDataSourceLoading.value = false
}

const usersDataSourceCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type FilterDescriptor, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'firstName', title: 'First Name', width: 150, sortable: true, filterable: true },
  { field: 'lastName', title: 'Last Name', width: 150, sortable: true, filterable: true },
  { field: 'email', title: 'Email', width: 200, sortable: true, filterable: true },
  { field: 'age', title: 'Age', width: 80, sortable: true },
]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/users')
    url.searchParams.set('limit', String(params.pageSize || 10))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      filter: filter.value.length > 0 ? JSON.stringify(filter.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.users || [],
  total: (response: any) => response.total || 0,
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    const totalCount = dataSourceRef.value.total()
    if (totalCount > 0) {
      total.value = totalCount
    }
  }
}

function handleError(error: any) {
  console.error('DataSource error:', error)
  loading.value = false
}
<\/script>

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
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
    @error="handleError"
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
    v-model:sort="sort"
    v-model:filter="filter"
    :loading="loading"
    :clean-strings="true"
  />
<\/template>`

// Example 10: REST API Posts (Auto-loaded)
const postsDataSourceRef = ref<DataSourceInstance | null>(null)
const postsDataSourceRows = ref<any[]>([])
const postsDataSourceTotal = ref(0)
const postsDataSourceLoading = ref(false)
const postsDataSourcePage = ref(1)
const postsDataSourcePageSize = ref(20)
const postsDataSourceSort = ref<SortDescriptor[]>([])

const postsDataSourceColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', width: 400, sortable: true },
  { field: 'body', title: 'Body', width: 300 },
  { field: 'userId', title: 'User ID', width: 100, sortable: true },
]

const postsDataSourceTransport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', { signal: options.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const allPosts = await res.json()
    
    // Client-side pagination (JSONPlaceholder doesn't support server-side pagination)
    const paginatedPosts = allPosts.slice(start, end)
    
    return {
      data: paginatedPosts,
      total: allPosts.length
    }
  },
  parameterMap: (data: any) => {
    return {
      page: postsDataSourcePage.value,
      pageSize: postsDataSourcePageSize.value,
      sort: postsDataSourceSort.value.length > 0 ? JSON.stringify(postsDataSourceSort.value) : undefined,
      ...data,
    }
  },
}

const postsDataSourceSchema: DataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

function handlePostsDataSourceChange(data: any[]) {
  postsDataSourceRows.value = data
  if (postsDataSourceRef.value) {
    const totalCount = postsDataSourceRef.value.total()
    if (totalCount > 0) {
      postsDataSourceTotal.value = totalCount
    }
  }
}

function handlePostsDataSourceError(error: any) {
  console.error('Posts DataSource error:', error)
  postsDataSourceLoading.value = false
}

const postsDataSourceCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const sort = ref<SortDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', width: 400, sortable: true },
  { field: 'body', title: 'Body', width: 300 },
  { field: 'userId', title: 'User ID', width: 100, sortable: true },
]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', { signal: options.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const allPosts = await res.json()
    
    // Client-side pagination (JSONPlaceholder doesn't support server-side pagination)
    const paginatedPosts = allPosts.slice(start, end)
    
    return {
      data: paginatedPosts,
      total: allPosts.length
    }
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    const totalCount = dataSourceRef.value.total()
    if (totalCount > 0) {
      total.value = totalCount
    }
  }
}

function handleError(error: any) {
  console.error('DataSource error:', error)
  loading.value = false
}
<\/script>

<template>
  <PantanalDataSource
    ref="dataSourceRef"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-sorting="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    @change="handleChange"
    @error="handleError"
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
    v-model:sort="sort"
    :loading="loading"
    :clean-strings="true"
  />
<\/template>`

// Example 11: REST API Quotes (Lazy Load - Manual Load)
const quotesDataSourceRef = ref<DataSourceInstance | null>(null)
const quotesDataSourceRows = ref<any[]>([])
const quotesDataSourceTotal = ref(0)
const quotesDataSourceLoading = ref(false)
const quotesDataSourcePage = ref(1)
const quotesDataSourcePageSize = ref(10)
const quotesDataSourceSort = ref<SortDescriptor[]>([])
const quotesDataSourceInitialized = ref(false)

const quotesDataSourceColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'quote', title: 'Quote', width: 500, sortable: true },
  { field: 'author', title: 'Author', width: 150, sortable: true },
]

const quotesDataSourceTransport: DataSourceTransport = {
  read: async (options: any) => {
    // Don't load on mount - wait for manual trigger
    if (!quotesDataSourceInitialized.value) {
      return { quotes: [], total: 0 }
    }
    
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/quotes')
    url.searchParams.set('limit', String(params.pageSize || 10))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: quotesDataSourcePage.value,
      pageSize: quotesDataSourcePageSize.value,
      sort: quotesDataSourceSort.value.length > 0 ? JSON.stringify(quotesDataSourceSort.value) : undefined,
      ...data,
    }
  },
}

const quotesDataSourceSchema: DataSourceSchema = {
  data: (response: any) => response.quotes || [],
  total: (response: any) => response.total || 0,
}

function handleQuotesDataSourceChange(data: any[]) {
  quotesDataSourceRows.value = data
  if (quotesDataSourceRef.value) {
    const totalCount = quotesDataSourceRef.value.total()
    if (totalCount > 0) {
      quotesDataSourceTotal.value = totalCount
    }
  }
}

function handleQuotesDataSourceError(error: any) {
  console.error('Quotes DataSource error:', error)
  quotesDataSourceLoading.value = false
}

async function loadQuotesData() {
  quotesDataSourceInitialized.value = true
  if (quotesDataSourceRef.value) {
    await quotesDataSourceRef.value.read()
  }
}

async function refreshQuotesData() {
  if (quotesDataSourceRef.value) {
    await quotesDataSourceRef.value.read()
  }
}

const quotesDataSourceCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const initialized = ref(false) // Control flag for lazy loading

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'quote', title: 'Quote', width: 500, sortable: true },
  { field: 'author', title: 'Author', width: 150, sortable: true },
]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    // Don't load on mount - wait for manual trigger
    if (!initialized.value) {
      return { quotes: [], total: 0 }
    }
    
    const params = options.data || {}
    const url = new URL('https://dummyjson.com/quotes')
    url.searchParams.set('limit', String(params.pageSize || 10))
    url.searchParams.set('skip', String((params.page - 1) * (params.pageSize || 10)))
    
    const res = await fetch(url.toString(), { signal: options.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.quotes || [],
  total: (response: any) => response.total || 0,
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    const totalCount = dataSourceRef.value.total()
    if (totalCount > 0) {
      total.value = totalCount
    }
  }
}

function handleError(error: any) {
  console.error('DataSource error:', error)
  loading.value = false
}

// Manual load function - sets flag and triggers read
async function loadData() {
  initialized.value = true
  if (dataSourceRef.value) {
    await dataSourceRef.value.read()
  }
}

// Refresh function - just triggers read again
async function refreshData() {
  if (dataSourceRef.value) {
    await dataSourceRef.value.read()
  }
}
<\/script>

<template>
  <div class="mb-4">
    <button
      @click="loadData"
      :disabled="loading"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
      {{ loading ? 'Loading...' : 'Load Data' }}
    </button>
    <button
      v-if="rows.length > 0"
      @click="refreshData"
      :disabled="loading"
      class="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
      Refresh
    </button>
  </div>
  <PantanalDataSource
    ref="dataSourceRef"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-sorting="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    @change="handleChange"
    @error="handleError"
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
    v-model:sort="sort"
    :loading="loading"
    :clean-strings="true"
  />
<\/template>`

// Example 12: REST API Todos (Offset-based Pagination)
const todosDataSourceRef = ref<DataSourceInstance | null>(null)
const todosDataSourceRows = ref<any[]>([])
const todosDataSourceTotal = ref(0)
const todosDataSourceLoading = ref(false)
const todosDataSourcePage = ref(1)
const todosDataSourcePageSize = ref(20)
const todosDataSourceSort = ref<SortDescriptor[]>([])
const todosDataSourceFilter = ref<FilterDescriptor[]>([])

const todosDataSourceColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'title', title: 'Title', width: 400, sortable: true, filterable: true },
  { field: 'completed', title: 'Completed', width: 120, filterable: true, template: (row: any) => row.completed ? '✓ Yes' : '✗ No' },
  { field: 'userId', title: 'User ID', width: 100, sortable: true },
]

const todosDataSourceTransport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const offset = (page - 1) * pageSize
    
    const res = await fetch('https://jsonplaceholder.typicode.com/todos', { signal: options.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    let allTodos = await res.json()
    
    // Apply filter if provided
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const completedFilter = filterObj.find((f: FilterDescriptor) => f.field === 'completed')
        if (completedFilter?.value !== undefined) {
          allTodos = allTodos.filter((todo: any) => todo.completed === completedFilter.value)
        }
        const titleFilter = filterObj.find((f: FilterDescriptor) => f.field === 'title')
        if (titleFilter?.value) {
          allTodos = allTodos.filter((todo: any) => 
            todo.title.toLowerCase().includes(String(titleFilter.value).toLowerCase())
          )
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Apply sort if provided
    if (params.sort) {
      try {
        const sortObj = JSON.parse(params.sort)
        if (sortObj.length > 0) {
          const sortItem = sortObj[0]
          allTodos.sort((a: any, b: any) => {
            const aVal = a[sortItem.field]
            const bVal = b[sortItem.field]
            if (sortItem.dir === 'asc') {
              return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
            } else {
              return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
            }
          })
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Apply offset-based pagination
    const paginatedTodos = allTodos.slice(offset, offset + pageSize)
    
    return {
      data: paginatedTodos,
      total: allTodos.length
    }
  },
  parameterMap: (data: any) => {
    return {
      page: todosDataSourcePage.value,
      pageSize: todosDataSourcePageSize.value,
      sort: todosDataSourceSort.value.length > 0 ? JSON.stringify(todosDataSourceSort.value) : undefined,
      filter: todosDataSourceFilter.value.length > 0 ? JSON.stringify(todosDataSourceFilter.value) : undefined,
      ...data,
    }
  },
}

const todosDataSourceSchema: DataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

function handleTodosDataSourceChange(data: any[]) {
  todosDataSourceRows.value = data
  if (todosDataSourceRef.value) {
    const totalCount = todosDataSourceRef.value.total()
    if (totalCount > 0) {
      todosDataSourceTotal.value = totalCount
    }
  }
}

function handleTodosDataSourceError(error: any) {
  console.error('Todos DataSource error:', error)
  todosDataSourceLoading.value = false
}

const todosDataSourceCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource, type ColumnDef, type SortDescriptor, type FilterDescriptor, type DataSourceInstance, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'

const dataSourceRef = ref<DataSourceInstance | null>(null)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'title', title: 'Title', width: 400, sortable: true, filterable: true },
  { field: 'completed', title: 'Completed', width: 120, filterable: true, template: (row: any) => row.completed ? '✓ Yes' : '✗ No' },
  { field: 'userId', title: 'User ID', width: 100, sortable: true },
]

const transport: DataSourceTransport = {
  read: async (options: any) => {
    const params = options.data || {}
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const offset = (page - 1) * pageSize
    
    const res = await fetch('https://jsonplaceholder.typicode.com/todos', { signal: options.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    let allTodos = await res.json()
    
    // Apply filter if provided
    if (params.filter) {
      try {
        const filterObj = JSON.parse(params.filter)
        const completedFilter = filterObj.find((f: FilterDescriptor) => f.field === 'completed')
        if (completedFilter?.value !== undefined) {
          allTodos = allTodos.filter((todo: any) => todo.completed === completedFilter.value)
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Apply offset-based pagination
    const paginatedTodos = allTodos.slice(offset, offset + pageSize)
    
    return {
      data: paginatedTodos,
      total: allTodos.length
    }
  },
  parameterMap: (data: any) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      filter: filter.value.length > 0 ? JSON.stringify(filter.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

function handleChange(data: any[]) {
  rows.value = data
  if (dataSourceRef.value) {
    const totalCount = dataSourceRef.value.total()
    if (totalCount > 0) {
      total.value = totalCount
    }
  }
}

function handleError(error: any) {
  console.error('DataSource error:', error)
  loading.value = false
}
<\/script>

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
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
    @error="handleError"
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
    v-model:sort="sort"
    v-model:filter="filter"
    :loading="loading"
    :clean-strings="true"
  />
<\/template>`
</script>

<template>
  <section class="space-y-8 px-4 py-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Data Binding</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        The Pantanal Grid enables you to bind it to different data sources. You can populate the Grid with local data arrays, 
        remote data services (REST, GraphQL), WebSocket connections for real-time updates, or work offline with local storage.
      </p>
    </header>

    <!-- Local Data Arrays -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to Local Data Arrays</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The simplest way to provide data to the Grid is by using a local data array. All operations (sorting, filtering, pagination) 
        are performed client-side.
      </p>
      <PantanalGrid
        :rows="localRows"
        :columns="localColumns"
        key-field="ProductID"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="localCode" />
    </div>

    <!-- Remote Data Services -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to Remote Data Services (REST)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        For remote data binding, use the <code>dataProvider</code> prop to fetch data from a REST API. The Grid handles 
        pagination, sorting, and filtering requests automatically.
      </p>
      <PantanalGrid
        :rows="[]"
        :columns="remoteColumns"
        :data-provider="remoteDataProvider"
        :loading="remoteLoading"
        :auto-bind="true"
        :clean-strings="true"
        v-model:sort="remoteSort"
        v-model:filter="remoteFilter"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
        key-field="id"
        locale="en"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="remoteCode" />
    </div>

    <!-- GraphQL Service -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to GraphQL Service</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        GraphQL services are served over HTTP through a single endpoint. The Grid can perform CRUD operations through 
        GraphQL queries and mutations.
      </p>
      <PantanalGrid
        :rows="[]"
        :columns="graphqlColumns"
        :data-provider="graphqlDataProvider"
        :loading="graphqlLoading"
        :auto-bind="true"
        :clean-strings="true"
        v-model:sort="graphqlSort"
        v-model:page="graphqlPage"
        v-model:pageSize="graphqlPageSize"
        key-field="productID"
        locale="en"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="graphqlCode" />
    </div>

    <!-- Local Data with DataSource -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to Local Data with DataSource Component</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The <code>PantanalDataSource</code> component provides a higher-level abstraction for data management. 
        It handles filtering, sorting, and pagination automatically. Use it with local data arrays for client-side operations.
      </p>
      <PantanalDataSource
        ref="localDataSourceRef"
        type="local"
        :data="localDataSourceData"
        v-model:page="localDataSourcePage"
        v-model:pageSize="localDataSourcePageSize"
        v-model:sort="localDataSourceSort"
        v-model:filter="localDataSourceFilter"
        @change="handleLocalDataSourceChange"
      />
      <PantanalGrid
        :rows="localDataSourceRows"
        :columns="localDataSourceColumns"
        key-field="ProductID"
        v-model:page="localDataSourcePage"
        v-model:pageSize="localDataSourcePageSize"
        v-model:sort="localDataSourceSort"
        v-model:filter="localDataSourceFilter"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="localDataSourceCode" />
    </div>

    <!-- Remote Data with DataSource -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to Remote REST with DataSource Component</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use the <code>PantanalDataSource</code> component with a <code>transport</code> configuration to fetch data from REST APIs. 
        The DataSource handles server-side pagination, sorting, and filtering automatically.
      </p>
      <PantanalDataSource
        ref="remoteDataSourceRef"
        type="remote"
        :transport="remoteDataSourceTransport"
        :schema="remoteDataSourceSchema"
        :server-paging="true"
        :server-filtering="true"
        :server-sorting="true"
        v-model:page="remoteDataSourcePage"
        v-model:pageSize="remoteDataSourcePageSize"
        v-model:sort="remoteDataSourceSort"
        v-model:filter="remoteDataSourceFilter"
        @change="handleRemoteDataSourceChange"
        @error="handleRemoteDataSourceError"
        @requestStart="remoteDataSourceLoading = true"
        @requestEnd="remoteDataSourceLoading = false"
      />
      <PantanalGrid
        :rows="remoteDataSourceRows"
        :columns="remoteDataSourceColumns"
        :total="remoteDataSourceTotal"
        key-field="id"
        server-side
        v-model:page="remoteDataSourcePage"
        v-model:pageSize="remoteDataSourcePageSize"
        v-model:sort="remoteDataSourceSort"
        v-model:filter="remoteDataSourceFilter"
        :loading="remoteDataSourceLoading"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="remoteDataSourceCode" />
    </div>

    <!-- GraphQL with DataSource -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to GraphQL with DataSource Component</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use the <code>PantanalDataSource</code> component with a custom <code>transport.read</code> function to integrate with GraphQL services. 
        The DataSource handles pagination and state management while you handle GraphQL queries and mutations.
      </p>
      <PantanalDataSource
        ref="graphqlDataSourceRef"
        type="remote"
        :transport="graphqlDataSourceTransport"
        :schema="graphqlDataSourceSchema"
        :server-paging="true"
        :server-sorting="true"
        v-model:page="graphqlDataSourcePage"
        v-model:pageSize="graphqlDataSourcePageSize"
        v-model:sort="graphqlDataSourceSort"
        @change="handleGraphqlDataSourceChange"
        @error="handleGraphqlDataSourceError"
        @requestStart="graphqlDataSourceLoading = true"
        @requestEnd="graphqlDataSourceLoading = false"
      />
      <PantanalGrid
        :rows="graphqlDataSourceRows"
        :columns="graphqlDataSourceColumns"
        :total="graphqlDataSourceTotal"
        key-field="productID"
        server-side
        v-model:page="graphqlDataSourcePage"
        v-model:pageSize="graphqlDataSourcePageSize"
        v-model:sort="graphqlDataSourceSort"
        :loading="graphqlDataSourceLoading"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="graphqlDataSourceCode" />
    </div>

    <!-- REST API Users Example (Auto-loaded) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">REST API: Users List (Auto-loaded on Mount)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Example using <code>PantanalDataSource</code> with REST API for users. Data is automatically loaded when component mounts. 
        Uses <code>https://dummyjson.com/users</code> API with pagination, sorting, and filtering.
      </p>
      <PantanalDataSource
        ref="usersDataSourceRef"
        type="remote"
        :transport="usersDataSourceTransport"
        :schema="usersDataSourceSchema"
        :server-paging="true"
        :server-sorting="true"
        :server-filtering="true"
        v-model:page="usersDataSourcePage"
        v-model:pageSize="usersDataSourcePageSize"
        v-model:sort="usersDataSourceSort"
        v-model:filter="usersDataSourceFilter"
        @change="handleUsersDataSourceChange"
        @error="handleUsersDataSourceError"
        @requestStart="usersDataSourceLoading = true"
        @requestEnd="usersDataSourceLoading = false"
      />
      <PantanalGrid
        :rows="usersDataSourceRows"
        :columns="usersDataSourceColumns"
        :total="usersDataSourceTotal"
        key-field="id"
        server-side
        v-model:page="usersDataSourcePage"
        v-model:pageSize="usersDataSourcePageSize"
        v-model:sort="usersDataSourceSort"
        v-model:filter="usersDataSourceFilter"
        :loading="usersDataSourceLoading"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="usersDataSourceCode" />
    </div>

    <!-- REST API Posts Example (Auto-loaded) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">REST API: Posts List (Auto-loaded on Mount)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Example using <code>PantanalDataSource</code> with JSONPlaceholder API for posts. Data is automatically loaded when component mounts. 
        Uses <code>https://jsonplaceholder.typicode.com/posts</code> with server-side pagination and sorting.
      </p>
      <PantanalDataSource
        ref="postsDataSourceRef"
        type="remote"
        :transport="postsDataSourceTransport"
        :schema="postsDataSourceSchema"
        :server-paging="true"
        :server-sorting="true"
        v-model:page="postsDataSourcePage"
        v-model:pageSize="postsDataSourcePageSize"
        v-model:sort="postsDataSourceSort"
        @change="handlePostsDataSourceChange"
        @error="handlePostsDataSourceError"
        @requestStart="postsDataSourceLoading = true"
        @requestEnd="postsDataSourceLoading = false"
      />
      <PantanalGrid
        :rows="postsDataSourceRows"
        :columns="postsDataSourceColumns"
        :total="postsDataSourceTotal"
        key-field="id"
        server-side
        v-model:page="postsDataSourcePage"
        v-model:pageSize="postsDataSourcePageSize"
        v-model:sort="postsDataSourceSort"
        :loading="postsDataSourceLoading"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="postsDataSourceCode" />
    </div>

    <!-- REST API Quotes Example (Lazy Load - Not Auto-loaded) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">REST API: Quotes List (Lazy Load - Manual Load)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Example using <code>PantanalDataSource</code> with REST API for quotes. Data is <strong>NOT</strong> automatically loaded. 
        Use the "Load Data" button to fetch data when needed. Uses <code>https://dummyjson.com/quotes</code> API.
      </p>
      <div class="mb-4">
        <button
          @click="loadQuotesData"
          :disabled="quotesDataSourceLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ quotesDataSourceLoading ? 'Loading...' : 'Load Data' }}
        </button>
        <button
          v-if="quotesDataSourceRows.length > 0"
          @click="refreshQuotesData"
          :disabled="quotesDataSourceLoading"
          class="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
          Refresh
        </button>
      </div>
      <PantanalDataSource
        ref="quotesDataSourceRef"
        type="remote"
        :transport="quotesDataSourceTransport"
        :schema="quotesDataSourceSchema"
        :server-paging="true"
        :server-sorting="true"
        :auto-sync="false"
        v-model:page="quotesDataSourcePage"
        v-model:pageSize="quotesDataSourcePageSize"
        v-model:sort="quotesDataSourceSort"
        @change="handleQuotesDataSourceChange"
        @error="handleQuotesDataSourceError"
        @requestStart="quotesDataSourceLoading = true"
        @requestEnd="quotesDataSourceLoading = false"
      />
      <PantanalGrid
        :rows="quotesDataSourceRows"
        :columns="quotesDataSourceColumns"
        :total="quotesDataSourceTotal"
        key-field="id"
        server-side
        v-model:page="quotesDataSourcePage"
        v-model:pageSize="quotesDataSourcePageSize"
        v-model:sort="quotesDataSourceSort"
        :loading="quotesDataSourceLoading"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="quotesDataSourceCode" />
    </div>

    <!-- REST API Todos Example (Offset-based Pagination) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">REST API: Todos List (Offset-based Pagination)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Example using <code>PantanalDataSource</code> with JSONPlaceholder API for todos. This example demonstrates offset-based pagination 
        instead of page-based. Uses <code>https://jsonplaceholder.typicode.com/todos</code> API with automatic loading.
      </p>
      <PantanalDataSource
        ref="todosDataSourceRef"
        type="remote"
        :transport="todosDataSourceTransport"
        :schema="todosDataSourceSchema"
        :server-paging="true"
        :server-sorting="true"
        :server-filtering="true"
        v-model:page="todosDataSourcePage"
        v-model:pageSize="todosDataSourcePageSize"
        v-model:sort="todosDataSourceSort"
        v-model:filter="todosDataSourceFilter"
        @change="handleTodosDataSourceChange"
        @error="handleTodosDataSourceError"
        @requestStart="todosDataSourceLoading = true"
        @requestEnd="todosDataSourceLoading = false"
      />
      <PantanalGrid
        :rows="todosDataSourceRows"
        :columns="todosDataSourceColumns"
        :total="todosDataSourceTotal"
        key-field="id"
        server-side
        v-model:page="todosDataSourcePage"
        v-model:pageSize="todosDataSourcePageSize"
        v-model:sort="todosDataSourceSort"
        v-model:filter="todosDataSourceFilter"
        :loading="todosDataSourceLoading"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="todosDataSourceCode" />
    </div>

    <!-- WebSocket -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Binding to WebSocket (Real-time Updates)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The Grid allows you to perform real-time updates for all users. You can utilize WebSockets to receive push notifications 
        when data changes on the server.
      </p>
      <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <div class="flex items-center gap-2 mb-2">
          <div :class="['w-3 h-3 rounded-full', wsConnected ? 'bg-green-500' : 'bg-red-500']"></div>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
            {{ wsConnected ? 'Connected to WebSocket' : 'Disconnected' }}
          </span>
        </div>
        <p class="text-sm text-blue-800 dark:text-blue-200">
          ℹ️ This example uses <code>wss://echo.websocket.org/</code> (public echo server) for WebSocket connection testing. 
          The prices update automatically every 5 seconds to simulate real-time updates. 
          The echo server is used for connection testing; in production, replace with your own WebSocket server.
        </p>
      </div>
      <PantanalGrid
        :rows="wsRows"
        :columns="wsColumns"
        key-field="ProductID"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="wsCode" />
    </div>

    <!-- Working Offline -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Working Offline</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The Grid supports working offline by storing data in localStorage. You can edit, create, or delete records when 
        offline, and sync the updates when you're back online.
      </p>
      <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <p class="text-sm text-blue-800 dark:text-blue-200">
          Status: <strong>{{ isOnline ? 'Online' : 'Offline' }}</strong>
        </p>
      </div>
      <PantanalGrid
        :rows="offlineRows"
        :columns="offlineColumns"
        key-field="ProductID"
        editable="inline"
        toolbar="['create']"
        locale="en"
        :clean-strings="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="offlineCode" />
    </div>
  </section>
</template>

