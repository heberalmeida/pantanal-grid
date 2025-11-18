# Grid Styles & Hover Effects

Customize the grid appearance with hover effects, borders, colors, and more using the `gridStyles`, `cellHoverStyles`, and `rowHoverStyles` props.

<ExamplePreview>
  <GridStylesExample />
</ExamplePreview>


## Grid Without Borders

Remove all borders from the grid using `gridStyles.noBorders`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GridStyleConfig } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active' },
  { id: 2, name: 'Jane Smith', status: 'Inactive' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 }
]

const gridStyles: GridStyleConfig = {
  noBorders: true
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :grid-styles="gridStyles"
    responsive="table"
  />
</template>
```

<ExampleCode :source="noBordersCode" />

## Custom Grid Colors

Customize border colors, header background, and row colors using `gridStyles`.

```vue
<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig } from '@pantanal/grid'

const gridStyles: GridStyleConfig = {
  borderColor: '#3b82f6',
  borderWidth: '2px',
  headerBackground: '#1e40af',
  headerColor: 'white',
  rowBackground: '#f8fafc',
  stripedBackground: '#e2e8f0',
  cellPadding: '0.75rem 1rem'
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    :grid-styles="gridStyles"
    responsive="table"
  />
</template>
```

<ExampleCode :source="customColorsCode" />

## Row Hover Effects

Add hover effects to entire rows using `rowHoverStyles`. You can target rows by condition, index, or multiple indices.

```vue
<script setup lang="ts">
import { PantanalGrid, type RowStyleConfig } from '@pantanal/grid'

const rowHoverStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Active',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  {
    condition: (row) => row.status === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  {
    rowIndices: [0, 2, 4],
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :row-hover-styles="rowHoverStyles"
    responsive="table"
  />
</template>
```

<ExampleCode :source="rowHoverCode" />

## Cell Hover Effects

Add hover effects to individual cells using `cellHoverStyles`. You can target cells by field, condition, row index, or column index.

```vue
<script setup lang="ts">
import { PantanalGrid, type CellStyleConfig } from '@pantanal/grid'

const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (row, value) => value === 'Active',
    backgroundColor: '#86efac',
    color: '#166534'
  },
  {
    field: 'priority',
    condition: (row, value) => value === 'High',
    backgroundColor: '#fca5a5',
    color: '#991b1b'
  },
  {
    rowIndex: 1,
    columnIndex: 2,
    backgroundColor: '#fbbf24',
    color: '#78350f'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-hover-styles="cellHoverStyles"
    responsive="table"
  />
</template>
```

<ExampleCode :source="cellHoverCode" />

## Combined Styles

Combine grid styles, row hover, and cell hover for a fully customized appearance.

```vue
<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig, type RowStyleConfig, type CellStyleConfig } from '@pantanal/grid'

const gridStyles: GridStyleConfig = {
  borderColor: '#e5e7eb',
  borderWidth: '1px',
  headerBackground: '#f3f4f6',
  headerColor: '#111827',
  rowBackground: '#ffffff',
  rowHoverBackground: '#f0f9ff',
  cellHoverBackground: '#fef3c7',
  stripedBackground: '#f9fafb',
  cellPadding: '0.75rem 1rem'
}

const rowHoverStyles: RowStyleConfig[] = [
  {
    backgroundColor: '#f0f9ff',
    color: '#0c4a6e'
  }
]

const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'priority',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    :grid-styles="gridStyles"
    :row-hover-styles="rowHoverStyles"
    :cell-hover-styles="cellHoverStyles"
    responsive="table"
  />
</template>
```

<ExampleCode :source="combinedStylesCode" />

## GridStyleConfig Options

```typescript
interface GridStyleConfig {
  noBorders?: boolean  // Remove all borders from grid
  borderColor?: string  // Custom border color (e.g., '#3b82f6')
  borderWidth?: string  // Custom border width (e.g., '2px')
  cellPadding?: string  // Custom cell padding (e.g., '0.75rem 1rem')
  headerBackground?: string  // Custom header background color
  headerColor?: string  // Custom header text color
  rowBackground?: string  // Default row background color
  rowHoverBackground?: string  // Row hover background color (applies to all rows)
  cellHoverBackground?: string  // Cell hover background color (applies to all cells)
  stripedBackground?: string  // Striped row background color
}
```

## Priority

When multiple hover styles match:
- **Cell hover styles** take precedence over row hover styles
- **Condition-based styles** take precedence over index-based styles
- **Specific field styles** take precedence over general styles

## See Also

- [Styling Props](/examples/styling-props) - Cell, row, and column styling without hover
- [Cell/Row/Column Styling](/examples/styling) - CSS-based styling examples
- [GridStyleConfig API](/api/types#gridstyleconfig) - Complete API reference

<script setup lang="ts">
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import GridStylesExample from './components/GridStylesExample.vue'
import ExampleCode from '../.vitepress/components/ExampleCode.vue'

const noBordersCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GridStyleConfig } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active' },
  { id: 2, name: 'Jane Smith', status: 'Inactive' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 }
]

const gridStyles: GridStyleConfig = {
  noBorders: true
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :grid-styles="gridStyles"
    responsive="table"
  />
</template>`

const customColorsCode = `<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig } from '@pantanal/grid'

const gridStyles: GridStyleConfig = {
  borderColor: '#3b82f6',
  borderWidth: '2px',
  headerBackground: '#1e40af',
  headerColor: 'white',
  rowBackground: '#f8fafc',
  stripedBackground: '#e2e8f0',
  cellPadding: '0.75rem 1rem'
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    :grid-styles="gridStyles"
    responsive="table"
  />
</template>`

const rowHoverCode = `<script setup lang="ts">
import { PantanalGrid, type RowStyleConfig } from '@pantanal/grid'

const rowHoverStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Active',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  {
    condition: (row) => row.status === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  {
    rowIndices: [0, 2, 4],
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :row-hover-styles="rowHoverStyles"
    responsive="table"
  />
</template>`

const cellHoverCode = `<script setup lang="ts">
import { PantanalGrid, type CellStyleConfig } from '@pantanal/grid'

const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (row, value) => value === 'Active',
    backgroundColor: '#86efac',
    color: '#166534'
  },
  {
    field: 'priority',
    condition: (row, value) => value === 'High',
    backgroundColor: '#fca5a5',
    color: '#991b1b'
  },
  {
    rowIndex: 1,
    columnIndex: 2,
    backgroundColor: '#fbbf24',
    color: '#78350f'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-hover-styles="cellHoverStyles"
    responsive="table"
  />
</template>`

const combinedStylesCode = `<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig, type RowStyleConfig, type CellStyleConfig } from '@pantanal/grid'

const gridStyles: GridStyleConfig = {
  borderColor: '#e5e7eb',
  borderWidth: '1px',
  headerBackground: '#f3f4f6',
  headerColor: '#111827',
  rowBackground: '#ffffff',
  rowHoverBackground: '#f0f9ff',
  cellHoverBackground: '#fef3c7',
  stripedBackground: '#f9fafb',
  cellPadding: '0.75rem 1rem'
}

const rowHoverStyles: RowStyleConfig[] = [
  {
    backgroundColor: '#f0f9ff',
    color: '#0c4a6e'
  }
]

const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'priority',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    :grid-styles="gridStyles"
    :row-hover-styles="rowHoverStyles"
    :cell-hover-styles="cellHoverStyles"
    responsive="table"
  />
</template>`
</script>

