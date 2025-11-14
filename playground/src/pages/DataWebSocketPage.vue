<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Data Binding — WebSocket</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid can be bound to WebSocket connections for real-time data updates. This enables live synchronization
        across multiple clients when data changes occur.
      </p>
    </header>

    <!-- Connection Status -->
    <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <div class="flex items-center gap-2">
        <div
          :class="[
            'w-3 h-3 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          ]"
        ></div>
        <span class="font-medium">
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </span>
        <button
          v-if="!isConnected"
          @click="connect"
          class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Connect
        </button>
        <button
          v-else
          @click="disconnect"
          class="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Disconnect
        </button>
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
        ℹ️ This example uses <code>wss://echo.websocket.org/</code> (public echo server) for WebSocket connection testing.
        The echo server returns messages sent to it. For production, replace with your own WebSocket server.
      </p>
    </div>

    <!-- Grid -->
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="productID"
      :sortable="true"
      :filterable="true"
      :selectable="'multiple'"
      :clean-strings="true"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      @rowClick="onRowClick"
      @selectionChange="onSelectionChange"
    />

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        @click="addRandomProduct"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        :disabled="!isConnected"
      >
        Add Random Product
      </button>
      <button
        @click="updateRandomProduct"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        :disabled="!isConnected || rows.length === 0"
      >
        Update Random Product
      </button>
      <button
        @click="deleteRandomProduct"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        :disabled="!isConnected || rows.length === 0"
      >
        Delete Random Product
      </button>
    </div>

    <!-- Event Log -->
    <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Event Log</h2>
        <button
          @click="clearLog"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Clear Log
        </button>
      </div>
      <div class="max-h-64 overflow-y-auto space-y-2">
        <div
          v-for="(event, index) in eventLog"
          :key="index"
          class="p-2 bg-white dark:bg-slate-700 rounded text-sm font-mono"
        >
          <span class="font-semibold text-blue-600 dark:text-blue-400">[{{ event.timestamp }}]</span>
          <span class="ml-2">{{ event.message }}</span>
        </div>
        <div v-if="eventLog.length === 0" class="text-slate-500 dark:text-slate-400 text-sm">
          No events logged yet.
        </div>
      </div>
    </div>

    <ExampleCode :source="codeSnippet" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './DataWebSocketPage.vue?raw'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

interface EventLogEntry {
  timestamp: string
  message: string
}

const rows = ref<Product[]>([])
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
const isConnected = ref(false)
const eventLog = ref<EventLogEntry[]>([])
const ws = ref<WebSocket | null>(null)

const columns: ColumnDef<Product>[] = [
  { field: 'productID', title: 'ID', width: 80, sortable: true },
  { field: 'productName', title: 'Product Name', width: 200, sortable: true, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true, format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, sortable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, format: (v: boolean) => (v ? 'Yes' : 'No') },
]

function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.unshift({ timestamp, message })
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50)
  }
}

function clearLog() {
  eventLog.value = []
}

// Real WebSocket connection using public echo server
function connect() {
  if (ws.value?.readyState === WebSocket.OPEN) {
    return
  }

  addLog('Connecting to WebSocket...')
  
  try {
    // Using public WebSocket echo server for testing
    // Options: wss://echo.websocket.org/, wss://ws.postman-echo.com/raw, wss://demos.kaazing.com/echo
    const host = 'wss://echo.websocket.org/'
    ws.value = new WebSocket(host)
    
    ws.value.onopen = () => {
      isConnected.value = true
      addLog('Connected to WebSocket')
      
      // Load initial data (simulated, since echo server just echoes back)
      loadInitialData()
      
      // Send initial message
      if (ws.value) {
        ws.value.send(JSON.stringify({ 
          type: 'read', 
          timestamp: Date.now(),
          message: 'Connected to WebSocket echo server' 
        }))
      }
      
      // Simulate receiving push updates
      simulatePushUpdates()
    }
    
    ws.value.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data)
        addLog(`Message received: ${JSON.stringify(result)}`)
      } catch (error) {
        addLog(`Echo received: ${event.data}`)
      }
    }
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      addLog('WebSocket error occurred')
    }
    
    ws.value.onclose = () => {
      isConnected.value = false
      addLog('Disconnected from WebSocket')
      ws.value = null
    }
  } catch (error) {
    console.error('Connection error:', error)
    addLog('Failed to connect to WebSocket')
  }
}

function disconnect() {
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }
  isConnected.value = false
  addLog('Disconnected from WebSocket')
}

function loadInitialData() {
  // Simulate initial data
  rows.value = [
    { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
    { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
    { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
    { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false },
    { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true },
  ]
  addLog('Initial data loaded')
}

// Simulate push updates from server
let pushInterval: number | null = null
function simulatePushUpdates() {
  if (pushInterval) return
  
  pushInterval = window.setInterval(() => {
    if (!isConnected.value) {
      if (pushInterval) {
        clearInterval(pushInterval)
        pushInterval = null
      }
      return
    }
    
    // Randomly simulate updates
    if (Math.random() > 0.7 && rows.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * rows.value.length)
      const product = rows.value[randomIndex]
      product.unitsInStock = Math.floor(Math.random() * 100)
      addLog(`Push update: ${product.productName} stock updated`)
    }
  }, 5000)
}

function addRandomProduct() {
  if (!isConnected.value) return
  
  const newId = Math.max(...rows.value.map(p => p.productID), 0) + 1
  const products = ['Widget', 'Gadget', 'Thing', 'Item', 'Product']
  const newProduct: Product = {
    productID: newId,
    productName: `${products[Math.floor(Math.random() * products.length)]} ${newId}`,
    unitPrice: Math.round(Math.random() * 100 * 100) / 100,
    unitsInStock: Math.floor(Math.random() * 100),
    discontinued: false,
  }
  
  rows.value = [...rows.value, newProduct]
  addLog(`Created: ${newProduct.productName}`)
}

function updateRandomProduct() {
  if (!isConnected.value || rows.value.length === 0) return
  
  const randomIndex = Math.floor(Math.random() * rows.value.length)
  const product = rows.value[randomIndex]
  product.unitPrice = Math.round(Math.random() * 100 * 100) / 100
  product.unitsInStock = Math.floor(Math.random() * 100)
  
  rows.value = [...rows.value] // Trigger reactivity
  addLog(`Updated: ${product.productName}`)
}

function deleteRandomProduct() {
  if (!isConnected.value || rows.value.length === 0) return
  
  const randomIndex = Math.floor(Math.random() * rows.value.length)
  const product = rows.value[randomIndex]
  rows.value = rows.value.filter((_, i) => i !== randomIndex)
  addLog(`Deleted: ${product.productName}`)
}

function onRowClick(row: Product) {
  addLog(`Row clicked: ${row.productName}`)
}

function onSelectionChange(selected: Product[]) {
  addLog(`Selection changed: ${selected.length} item(s) selected`)
}

onMounted(() => {
  // Auto-connect on mount (simulated)
  // connect()
})

onBeforeUnmount(() => {
  disconnect()
  if (pushInterval) {
    clearInterval(pushInterval)
  }
})

const codeSnippet = exampleSource
</script>

