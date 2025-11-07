<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Data Binding — Offline Mode</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports offline data operations. Changes made while offline are stored locally and can be synchronized
        with the server when the connection is restored.
      </p>
    </header>

    <!-- Connection Status -->
    <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <div class="flex items-center gap-2 mb-4">
        <div
          :class="[
            'w-3 h-3 rounded-full',
            isOnline ? 'bg-green-500' : 'bg-red-500'
          ]"
        ></div>
        <span class="font-medium">
          {{ isOnline ? 'Online' : 'Offline' }}
        </span>
        <button
          @click="toggleConnection"
          class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {{ isOnline ? 'Go Offline' : 'Go Online' }}
        </button>
      </div>
      
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium">Pending Changes:</span>
          <span class="ml-2">{{ pendingChanges.length }}</span>
        </div>
        <div>
          <span class="font-medium">Local Storage:</span>
          <span class="ml-2">{{ hasLocalStorage ? 'Available' : 'Not Available' }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        @click="addProduct"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Product
      </button>
      <button
        @click="syncChanges"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        :disabled="pendingChanges.length === 0 || !isOnline"
      >
        Sync Changes ({{ pendingChanges.length }})
      </button>
      <button
        @click="clearLocalStorage"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Clear Local Storage
      </button>
    </div>

    <!-- Grid -->
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="productID"
      :sortable="true"
      :filterable="true"
      :selectable="true"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      @rowClick="onRowClick"
    />

    <!-- Pending Changes -->
    <div v-if="pendingChanges.length > 0" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Pending Changes ({{ pendingChanges.length }})</h2>
      <div class="space-y-2">
        <div
          v-for="(change, index) in pendingChanges"
          :key="index"
          class="p-2 bg-white dark:bg-slate-700 rounded text-sm"
        >
          <span class="font-medium">{{ change.type }}:</span>
          <span class="ml-2">{{ change.data.productName || `Product ${change.data.productID}` }}</span>
          <span class="ml-2 text-slate-500">({{ new Date(change.timestamp).toLocaleTimeString() }})</span>
        </div>
      </div>
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
import { ref, onMounted, watch } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './DataOfflinePage.vue?raw'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

interface PendingChange {
  type: 'create' | 'update' | 'delete'
  data: Product
  timestamp: number
}

interface EventLogEntry {
  timestamp: string
  message: string
}

const STORAGE_KEY = 'pantanal-grid-offline-data'
const PENDING_CHANGES_KEY = 'pantanal-grid-pending-changes'

const rows = ref<Product[]>([])
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
const isOnline = ref(navigator.onLine)
const pendingChanges = ref<PendingChange[]>([])
const eventLog = ref<EventLogEntry[]>([])
const hasLocalStorage = ref(typeof Storage !== 'undefined')

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

function loadFromLocalStorage() {
  if (!hasLocalStorage.value) return
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      rows.value = JSON.parse(stored)
      addLog(`Loaded ${rows.value.length} items from local storage`)
    }
    
    const pending = localStorage.getItem(PENDING_CHANGES_KEY)
    if (pending) {
      pendingChanges.value = JSON.parse(pending)
      addLog(`Loaded ${pendingChanges.value.length} pending changes`)
    }
  } catch (error) {
    addLog(`Error loading from local storage: ${error}`)
  }
}

function saveToLocalStorage() {
  if (!hasLocalStorage.value) return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.value))
    localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pendingChanges.value))
  } catch (error) {
    addLog(`Error saving to local storage: ${error}`)
  }
}

function clearLocalStorage() {
  if (!hasLocalStorage.value) return
  
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(PENDING_CHANGES_KEY)
  rows.value = []
  pendingChanges.value = []
  addLog('Local storage cleared')
}

function toggleConnection() {
  isOnline.value = !isOnline.value
  addLog(`Switched to ${isOnline.value ? 'online' : 'offline'} mode`)
  
  if (isOnline.value && pendingChanges.value.length > 0) {
    addLog('Connection restored. You can now sync pending changes.')
  }
}

function addProduct() {
  const newId = Math.max(...rows.value.map(p => p.productID), 0, 0) + 1
  const products = ['Widget', 'Gadget', 'Thing', 'Item', 'Product']
  const newProduct: Product = {
    productID: newId,
    productName: `${products[Math.floor(Math.random() * products.length)]} ${newId}`,
    unitPrice: Math.round(Math.random() * 100 * 100) / 100,
    unitsInStock: Math.floor(Math.random() * 100),
    discontinued: false,
  }
  
  rows.value = [...rows.value, newProduct]
  
  if (isOnline.value) {
    // In real app, send to server
    addLog(`Created: ${newProduct.productName} (synced)`)
  } else {
    // Store as pending change
    pendingChanges.value.push({
      type: 'create',
      data: newProduct,
      timestamp: Date.now(),
    })
    addLog(`Created: ${newProduct.productName} (pending sync)`)
  }
  
  saveToLocalStorage()
}

function syncChanges() {
  if (!isOnline.value || pendingChanges.value.length === 0) return
  
  addLog(`Syncing ${pendingChanges.value.length} changes...`)
  
  // Simulate server sync
  setTimeout(() => {
    const synced = pendingChanges.value.length
    pendingChanges.value = []
    saveToLocalStorage()
    addLog(`Successfully synced ${synced} changes`)
  }, 1000)
}

function onRowClick(row: Product) {
  addLog(`Row clicked: ${row.productName}`)
}

// Watch for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline.value = true
    addLog('Browser detected online status')
  })
  
  window.addEventListener('offline', () => {
    isOnline.value = false
    addLog('Browser detected offline status')
  })
}

// Watch for changes to save
watch(rows, () => {
  saveToLocalStorage()
}, { deep: true })

watch(pendingChanges, () => {
  saveToLocalStorage()
}, { deep: true })

onMounted(() => {
  // Load initial data
  if (rows.value.length === 0) {
    rows.value = [
      { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
      { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
      { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
    ]
  }
  
  loadFromLocalStorage()
  addLog('Offline mode initialized')
})

const codeSnippet = exampleSource
</script>

