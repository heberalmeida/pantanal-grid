# WebSocket Data Source Example

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import DataWebSocketExample from './components/DataWebSocketExample.vue'
</script>

Demonstrates real-time data updates using WebSocket with Pantanal Grid.

<ExamplePreview>
  <DataWebSocketExample />
</ExamplePreview>

## Code

```vue
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

onMounted(() => {
  ws.value = new WebSocket('ws://your-websocket-server.com')
  
  ws.value.onopen = () => {
    connected.value = true
    console.log('WebSocket connected')
  }
  
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'update') {
      // Update specific row
      const index = rows.value.findIndex(r => r.id === data.row.id)
      if (index !== -1) {
        rows.value[index] = { ...data.row, timestamp: new Date().toLocaleTimeString() }
      }
    } else if (data.type === 'refresh') {
      // Refresh all rows
      rows.value = data.rows || []
    }
  }
  
  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    connected.value = false
  }
  
  ws.value.onclose = () => {
    connected.value = false
    console.log('WebSocket disconnected')
  }
})

onUnmounted(() => {
  ws.value?.close()
})
</script>

<template>
  <div>
    <div class="mb-4 flex items-center gap-2">
      <span :class="connected ? 'text-green-600' : 'text-red-600'">
        {{ connected ? '● Connected' : '○ Disconnected' }}
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
  </div>
</template>
```

## WebSocket Message Format

Your WebSocket server should send messages in the following format:

### Update Single Row

```json
{
  "type": "update",
  "row": {
    "id": 1,
    "name": "Product A",
    "price": 29.99
  }
}
```

### Refresh All Rows

```json
{
  "type": "refresh",
  "rows": [
    { "id": 1, "name": "Product A", "price": 29.99 },
    { "id": 2, "name": "Product B", "price": 49.99 }
  ]
}
```

## Using with Socket.io

```plaintext
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const socket = ref<any>(null)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' }
]

onMounted(() => {
  socket.value = io('http://localhost:3000')
  
  socket.value.on('connect', () => {
    console.log('Connected to server')
  })
  
  socket.value.on('data-update', (data: any) => {
    rows.value = data.rows || []
  })
  
  socket.value.on('row-update', (row: any) => {
    const index = rows.value.findIndex(r => r.id === row.id)
    if (index !== -1) {
      rows.value[index] = row
    }
  })
})

onUnmounted(() => {
  socket.value?.disconnect()
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    locale="en"
    responsive="table"
  />
<\/template>
```

## Features

- ✅ Real-time data updates
- ✅ WebSocket connection management
- ✅ Automatic cleanup on unmount
- ✅ Connection status indicator
- ✅ Error handling

## See Also

- [Server-Side Mode Guide](/guide/server-side) - Server-side data handling
- [Data Sources API](/api/data-sources) - Data source components reference
