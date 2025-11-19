# Cell, Row & Column Styling with Props

Use the `cellStyles`, `rowStyles`, and `columnStyles` props to style cells, rows, and columns programmatically without CSS.

<ExamplePreview>
  <StylingPropsExample />
</ExamplePreview>

<script setup lang="ts">
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import StylingPropsExample from './components/StylingPropsExample.vue'
</script>

## Cell Styling

Style individual cells using the `cellStyles` prop. You can target cells by field, row index, column index, or condition function.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type CellStyleConfig } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active', priority: 'High' },
  { id: 2, name: 'Jane Smith', status: 'Inactive', priority: 'Medium' },
  { id: 3, name: 'Bob Johnson', status: 'Active', priority: 'Low' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 },
  { field: 'priority', title: 'Priority', width: 120 }
]

const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 600
  },
  {
    // Paint a specific cell (row 1, column 2 - status)
    rowIndex: 1,
    columnIndex: 2,
    backgroundColor: '#dc2626',
    color: 'white',
    fontWeight: 'bold'
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-styles="cellStyles"
    responsive="table"
  />
</template>
```

## Row Styling

Style entire rows using the `rowStyles` prop. You can target rows by index, multiple indices, or condition function.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type RowStyleConfig } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active', priority: 'High' },
  { id: 2, name: 'Jane Smith', status: 'Inactive', priority: 'Medium' },
  { id: 3, name: 'Bob Johnson', status: 'Active', priority: 'Low' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 },
  { field: 'priority', title: 'Priority', width: 120 }
]

const rowStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 500
  },
  {
    rowIndex: 2,
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  {
    // Style multiple rows
    rowIndices: [0, 4],
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :row-styles="rowStyles"
    responsive="table"
  />
</template>
```

## Column Styling

Style entire columns using the `columnStyles` prop. You can style both the column cells and the column header.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnStyleConfig } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active', priority: 'High' },
  { id: 2, name: 'Jane Smith', status: 'Inactive', priority: 'Medium' },
  { id: 3, name: 'Bob Johnson', status: 'Active', priority: 'Low' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 },
  { field: 'priority', title: 'Priority', width: 120 }
]

const columnStyles: ColumnStyleConfig[] = [
  {
    field: 'status',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 500,
    headerBackgroundColor: '#dc2626',
    headerColor: 'white',
    fontWeight: 600
  },
  {
    field: 'priority',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    headerBackgroundColor: '#2563eb',
    headerColor: 'white',
    fontWeight: 600
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :column-styles="columnStyles"
    responsive="table"
  />
</template>
```

## Combined Styling

Combine cell, row, and column styles for complex styling scenarios.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type CellStyleConfig, type RowStyleConfig, type ColumnStyleConfig } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active', priority: 'High' },
  { id: 2, name: 'Jane Smith', status: 'Inactive', priority: 'Medium' },
  { id: 3, name: 'Bob Johnson', status: 'Active', priority: 'Low' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 },
  { field: 'priority', title: 'Priority', width: 120 }
]

const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
]

const rowStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.priority === 'High',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]

const columnStyles: ColumnStyleConfig[] = [
  {
    field: 'status',
    headerBackgroundColor: '#dc2626',
    headerColor: 'white'
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-styles="cellStyles"
    :row-styles="rowStyles"
    :column-styles="columnStyles"
    responsive="table"
  />
</template>
```

## Configuration Options

### CellStyleConfig

```typescript
interface CellStyleConfig<T = Row> {
  field?: string  // Column field to target
  condition?: (row: T, value: any, rowIndex: number) => boolean  // Condition function
  backgroundColor?: string  // Background color (e.g., '#fee2e2' or 'red')
  color?: string  // Text color (e.g., '#991b1b' or 'white')
  fontWeight?: string | number  // Font weight (e.g., 'bold', 600)
  rowIndex?: number  // Specific row index (0-based)
  columnIndex?: number  // Specific column index (0-based)
}
```

### RowStyleConfig

```typescript
interface RowStyleConfig<T = Row> {
  condition?: (row: T, rowIndex: number) => boolean  // Condition function
  backgroundColor?: string  // Background color for entire row
  color?: string  // Text color for entire row
  fontWeight?: string | number  // Font weight
  rowIndex?: number  // Specific row index (0-based)
  rowIndices?: number[]  // Multiple row indices
}
```

### ColumnStyleConfig

```typescript
interface ColumnStyleConfig {
  field?: string  // Column field to target
  columnIndex?: number  // Column index (0-based)
  backgroundColor?: string  // Background color for entire column
  color?: string  // Text color for entire column
  fontWeight?: string | number  // Font weight
  headerBackgroundColor?: string  // Background color for column header
  headerColor?: string  // Text color for column header
}
```

## Color Examples

You can use any CSS color value:

- **Hex colors**: `#fee2e2`, `#dc2626`
- **RGB colors**: `rgb(254, 226, 226)`, `rgba(220, 38, 38, 0.1)`
- **Named colors**: `red`, `blue`, `green`, `white`
- **CSS variables**: `var(--my-color)`

## Priority

When multiple styles match the same cell/row/column:
- **Cell styles** take precedence over column styles
- **Row styles** apply to all cells in the row
- **Column styles** apply to all cells in the column
- **Cell styles** can override row and column styles

## See Also

- [CellStyleConfig API](/api/types#cellstyleconfig) - Complete API reference
- [RowStyleConfig API](/api/types#rowstyleconfig) - Complete API reference
- [ColumnStyleConfig API](/api/types#columnstyleconfig) - Complete API reference
- [GridProps API](/api/grid-props) - Grid props including styling props


