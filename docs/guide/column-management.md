# Column Management

Pantanal Grid provides powerful column management features including resizing, reordering, pinning, locking, column menu, and header visibility control.

## Column Resizing

Enable column resizing:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :enable-column-resize="true"
  />
</template>
```

Users can drag column borders to resize. Resized widths can be persisted using `persistStateKey`.

## Column Reordering

Enable column reordering via drag and drop:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :enable-column-reorder="true"
  />
</template>
```

## Pinned Columns

Pin columns to the left or right side:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, pinned: 'left' },      // Pinned left
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' },
  { field: 'actions', title: 'Actions', pinned: 'right' }       // Pinned right
]
</script>
```

## Locked Columns

Lock columns to prevent reordering:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, locked: 'left' },       // Locked left
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' },
  { field: 'actions', title: 'Actions', locked: 'right' }       // Locked right
]
</script>
```

## Hide Header

You can hide the table header row by setting the `hideHeader` prop to `true`. This is useful when you want to display data without column headers, such as in compact views or when the column structure is self-explanatory.

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :hideHeader="true"
  />
</template>
```

### Use Cases

- **Compact Views**: When space is limited and headers are not essential
- **Self-Explanatory Data**: When the data structure is clear without headers
- **Custom Headers**: When you want to implement your own header solution outside the grid
- **Print/Export Views**: When preparing data for printing or export without headers

### Notes

- When `hideHeader` is `true`, all header-related features (sorting indicators, column menu buttons, resize handles) are also hidden
- The filter row (if enabled) will still be displayed below where the header would be
- Locked/pinned columns also have their headers hidden when `hideHeader` is `true`
- Multi-column headers are also hidden when `hideHeader` is `true`

## Column Menu

Enable column menu for additional options:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :column-menu="true"
  />
</template>
```

The column menu provides options for:
- Sorting
- Filtering
- Locking/Unlocking
- Column visibility

## Hide Columns

Hide columns programmatically:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'internal', title: 'Internal', hidden: true }  // Hidden column
]
</script>
```

## Column Visibility

Control column visibility dynamically:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showPrice = ref(true)

const columns = computed(() => [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', hidden: !showPrice.value }
])
</script>
```

## Responsive Columns

Hide columns on smaller screens:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { 
    field: 'description', 
    title: 'Description',
    minScreenWidth: 768  // Hide below 768px
  }
]
</script>
```

## Column Widths

Set fixed or flexible column widths:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },           // Fixed width
  { field: 'name', title: 'Name', width: 200 },      // Fixed width
  { field: 'description', title: 'Description' }     // Flexible width
]
</script>
```

## Column Resize Events

Listen to column resize events:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :enable-column-resize="true"
    @columnResize="handleColumnResize"
  />
</template>

<script setup lang="ts">
function handleColumnResize({ field, width }: { field: string; width: number }) {
  console.log(`Column ${field} resized to ${width}px`)
  // Save to server, update state, etc.
}
</script>
```

## Column Reorder Events

Listen to column reorder events:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :enable-column-reorder="true"
    @columnReorder="handleColumnReorder"
  />
</template>

<script setup lang="ts">
function handleColumnReorder({ from, to }: { from: number; to: number }) {
  console.log(`Column moved from ${from} to ${to}`)
  // Update column order, save to server, etc.
}
</script>
```

## Persist Column State

Persist column widths and order:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :enable-column-resize="true"
    :enable-column-reorder="true"
    persist-state-key="my-grid-columns"
  />
</template>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, pinned: 'left', locked: 'left' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'actions', title: 'Actions', width: 120, pinned: 'right' }
]

function handleColumnResize({ field, width }: { field: string; width: number }) {
  console.log(`Column ${field} resized to ${width}px`)
}

function handleColumnReorder({ from, to }: { from: number; to: number }) {
  console.log(`Column moved from position ${from} to ${to}`)
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :enable-column-resize="true"
    :enable-column-reorder="true"
    :column-menu="true"
    @columnResize="handleColumnResize"
    @columnReorder="handleColumnReorder"
    persist-state-key="grid-columns"
    locale="en"
  />
</template>
```

## Tips

- Use pinned columns for important data that should always be visible
- Lock critical columns to prevent accidental reordering
- Persist column state for better user experience
- Use responsive columns to optimize mobile experience
- Listen to resize/reorder events to sync with server state







