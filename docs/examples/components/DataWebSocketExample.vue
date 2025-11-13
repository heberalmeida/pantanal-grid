<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const ws = ref<WebSocket | null>(null)
const connected = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'timestamp', title: 'Last Updated', width: 180 }
]

// Simulated WebSocket - using interval to simulate real-time updates
let intervalId: number | null = null

onMounted(() => {
  // Simulate initial data
  rows.value = [
    { id: 1, name: 'Product A', price: 29.99, timestamp: new Date().toLocaleTimeString() },
    { id: 2, name: 'Product B', price: 49.99, timestamp: new Date().toLocaleTimeString() },
    { id: 3, name: 'Product C', price: 19.99, timestamp: new Date().toLocaleTimeString() }
  ]
  
  connected.value = true
  
  // Simulate WebSocket updates every 3 seconds
  intervalId = window.setInterval(() => {
    if (rows.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * rows.value.length)
      const updatedRows = [...rows.value]
      updatedRows[randomIndex] = {
        ...updatedRows[randomIndex],
        price: (Math.random() * 100).toFixed(2),
        timestamp: new Date().toLocaleTimeString()
      }
      rows.value = updatedRows
    }
  }, 3000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
  ws.value?.close()
})
</script>

<template>
  <div>
    <div class="mb-4 flex items-center gap-2 text-sm">
      <span :class="connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
        {{ connected ? '● Connected' : '○ Disconnected' }}
      </span>
      <span class="text-gray-600 dark:text-gray-400">
        (Simulated - updates every 3 seconds)
      </span>
    </div>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      locale="en"
      responsive="table"
      :height="400"
    />
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
      <p><strong>Note:</strong> This example simulates WebSocket updates. In a real application, you would connect to an actual WebSocket server:</p>
      <pre class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"><code>const ws = new WebSocket('ws://your-server.com')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  rows.value = data.rows || []
}</code></pre>
    </div>
  </div>
</template>




