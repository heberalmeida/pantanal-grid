# Complete Example

This example demonstrates all major features of the PantanalGrid component in a single, comprehensive example.

<ExamplePreview>
  <CompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import CompleteExample from './components/CompleteExample.vue'
</script>

## Features Demonstrated

This complete example includes:

- **Sorting**: Click column headers to sort
- **Filtering**: Use filter row or column menu to filter data
- **Pagination**: Navigate through pages
- **Selection**: Select single or multiple rows
- **Editing**: Inline and batch editing
- **Grouping**: Drag columns to group zone
- **Export**: Export to PDF, Excel, CSV, and Word
- **Keyboard Navigation**: Navigate with arrow keys
- **State Management**: Get and set grid options programmatically

## Code Example

```vue
<template>
  <div>
    <!-- Toolbar Actions -->
    <div class="flex gap-2">
      <button @click="handleExportPdf">Export to PDF</button>
      <button @click="handleExportExcel">Export to Excel</button>
      <button @click="handleGetOptions">Get Options</button>
      <button @click="handleSetOptions">Set Options</button>
    </div>

    <!-- Grid -->
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
      :selectable="'multiple'"
      :sortable="true"
      :filterable="true"
      :pageable="true"
      :editable="true"
      :groupable="true"
      :navigatable="true"
      :toolbar="['create', 'save', 'cancel', 'excel', 'pdf', 'csv']"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      v-model:selectedKeys="selectedKeys"
      @selectionChange="handleSelectionChange"
      @edit="handleEdit"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, stock: 200 },
  // ... more rows
])

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Product Name', sortable: true, filterable: true, editable: true },
  { field: 'category', title: 'Category', sortable: true, filterable: true, editable: true },
  { field: 'price', title: 'Price', sortable: true, filterable: true, editable: true },
  { field: 'stock', title: 'Stock', sortable: true, filterable: true, editable: true },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
const selectedKeys = ref<number[]>([])

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function handleSelectionChange(keys: number[]) {
  console.log('Selection changed:', keys)
}

function handleEdit({ row }: { row: any }) {
  console.log('Edit started:', row)
}

function handleSave({ changes }: { changes: Array<{ type: string; row: any }> }) {
  console.log('Save:', changes)
}

async function handleExportPdf() {
  await gridRef.value?.exportToPdf()
}

async function handleExportExcel() {
  await gridRef.value?.exportToExcel()
}

function handleGetOptions() {
  const options = gridRef.value?.getOptions()
  console.log('Current options:', options)
}

function handleSetOptions() {
  gridRef.value?.setOptions({
    sort: [{ field: 'price', dir: 'desc' }],
    page: 1,
    pageSize: 5,
  })
}
</script>
```

## Methods Usage

### Export Methods

```typescript
// Export to PDF
await gridRef.value?.exportToPdf()

// Export to Excel
await gridRef.value?.exportToExcel()

// Export to CSV
await gridRef.value?.exportToCSV()

// Export to Word
await gridRef.value?.exportToDocx()
```

### State Management

```typescript
// Get current grid state
const options = gridRef.value?.getOptions()
// Returns: { sort, filter, page, pageSize, order, widths, selectedKeys }

// Set grid state
gridRef.value?.setOptions({
  sort: [{ field: 'price', dir: 'desc' }],
  page: 2,
  pageSize: 50,
  order: [1, 0, 2],
  widths: [150, 200, 100]
})
```

### Editing State

```typescript
// Check if a row is in edit mode
const isEditing = gridRef.value?.isRowEditing(row)
```

## See Also

- [Grid API Reference](/api/grid) - Complete API documentation
- [Getting Started Guide](/guide/getting-started) - Quick start guide
- [Selection Guide](/guide/selection) - Selection documentation
- [Editing Guide](/guide/editing) - Editing documentation

