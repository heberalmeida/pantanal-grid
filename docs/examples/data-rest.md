# REST API Data Source Example

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import { CodeGroup, CodeGroupItem } from 'vitepress/dist/client/theme-default/components'
import DataRestExample from './components/DataRestExample.vue'
</script>

Demonstrates fetching data from a REST API endpoint using Pantanal Grid.

<ExamplePreview>
  <DataRestExample />
  <template #code>
    <CodeGroup>
      <CodeGroupItem title="Vue" active>
```plaintext
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', width: 250 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 }
]

async function fetchData() {
  loading.value = true
  try {
    const response = await fetch('https://dummyjson.com/products?limit=20')
    const data = await response.json()
    rows.value = data.products || []
  } catch (error) {
    console.error('Error fetching data:', error)
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :loading="loading"
    locale="en"
    responsive="table"
    :height="400"
  />
<\/template>
```
      </CodeGroupItem>
    </CodeGroup>
  </template>
</ExamplePreview>

## Features

- ✅ Fetches data from REST API endpoint
- ✅ Loading state handling
- ✅ Error handling
- ✅ Automatic data binding

## Using with DataProvider

For server-side pagination, sorting, and filtering, use the `dataProvider` prop:

```plaintext
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` }
]

const dataProvider: DataProvider = async (args) => {
  const params = new URLSearchParams({
    page: String(args.page),
    limit: String(args.pageSize),
    sortBy: args.sort[0]?.field || 'id',
    order: args.sort[0]?.dir || 'asc'
  })
  
  const response = await fetch(`https://dummyjson.com/products?${params}`)
  const data = await response.json()
  
  return {
    rows: data.products || [],
    total: data.total || 0
  }
}
</script>

<template>
  <PantanalGrid
    :columns="columns"
    key-field="id"
    :data-provider="dataProvider"
    locale="en"
    responsive="table"
    :height="400"
  />
</template>
```

## See Also

- [Server-Side Mode Guide](/guide/server-side) - Complete server-side documentation
- [Data Sources API](/api/data-sources) - Data source components reference
