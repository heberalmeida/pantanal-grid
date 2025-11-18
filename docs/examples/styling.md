# Cell, Row & Column Styling

Demonstrates how to customize the appearance of cells, rows, and columns using CSS classes, inline styles, and Vue slots.

<ExamplePreview>
  <StylingExample />
</ExamplePreview>

<script setup lang="ts">
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import StylingExample from './components/StylingExample.vue'
</script>

## Striped Rows

Enable striped rows using the `striped` prop. This alternates the background color of rows for better readability.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'role', title: 'Role', width: 100 }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    responsive="table"
  />
</template>
```

## Conditional Cell Styling

Use the `#cell` slot to apply conditional styling based on cell values.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

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

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-red-100 text-red-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-blue-100 text-blue-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    responsive="table"
  >
    <template #cell="{ column, value, row }">
      <span
        v-if="column.field === 'status'"
        :class="getStatusClass(value as string)"
        class="px-2 py-1 rounded text-sm font-medium"
      >
        {{ value }}
      </span>
      <span
        v-else-if="column.field === 'priority'"
        :class="getPriorityClass(value as string)"
        class="px-2 py-1 rounded text-sm font-medium"
      >
        {{ value }}
      </span>
      <span v-else>{{ value }}</span>
    </template>
  </PantanalGrid>
</template>
```

## Row Styling with CSS

Apply custom styles to rows using CSS classes and the `:deep()` selector.

```vue
<template>
  <div class="styled-rows-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.styled-rows-example :deep(.v3grid__row:nth-child(even)) {
  background-color: #f9fafb;
}

.styled-rows-example :deep(.v3grid__row:hover) {
  background-color: #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.styled-rows-example :deep(.v3grid__row[data-status="active"]) {
  border-left: 4px solid #10b981;
}
</style>
```

## Column Header Styling

Style column headers using CSS classes and custom templates.

```vue
<template>
  <div class="styled-headers-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.styled-headers-example :deep(.v3grid__headercell) {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.styled-headers-example :deep(.v3grid__headercell:hover) {
  background: linear-gradient(to bottom, #764ba2, #667eea);
}
</style>
```

## Cell Styling with Inline Styles

Use the `#cell` slot to apply inline styles based on cell values.

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    responsive="table"
  >
    <template #cell="{ column, value, row }">
      <span
        v-if="column.field === 'price'"
        :style="{
          color: value > 100 ? 'green' : 'red',
          fontWeight: value > 100 ? 'bold' : 'normal'
        }"
      >
        ${{ value }}
      </span>
      <span v-else>{{ value }}</span>
    </template>
  </PantanalGrid>
</template>
```

## Column-Specific Styling

Apply styles to specific columns using CSS selectors.

```vue
<style scoped>
/* Style a specific column by field */
.my-grid :deep(.v3grid__cell[data-field="status"]) {
  font-weight: 600;
  text-transform: uppercase;
}

/* Style cells in a specific column */
.my-grid :deep(.v3grid__row .v3grid__cell:nth-child(3)) {
  background-color: #f0f9ff;
  border-left: 3px solid #3b82f6;
}
</style>
```

## Row Classes Based on Data

Add custom classes to rows based on row data using CSS.

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    responsive="table"
  >
    <template #cell="{ row }">
      <!-- Add data attributes for styling -->
      <div :data-status="row.status" :data-priority="row.priority">
        {{ row.name }}
      </div>
    </template>
  </PantanalGrid>
</template>

<style scoped>
/* Style rows based on data attributes */
:deep(.v3grid__row[data-status="active"]) {
  background-color: #f0fdf4;
}

:deep(.v3grid__row[data-priority="high"]) {
  border-left: 4px solid #ef4444;
}
</style>
```

## Specific Cell Styling

Style individual cells with specific colors using the `#cell` slot.

### Cell with Background Color

Style a cell with a background color using inline styles in the slot.

```vue
<template #cell="{ column, value, row }">
  <span
    v-if="column.field === 'status' && value === 'Inactive'"
    class="px-2 py-1 rounded text-sm font-medium"
    style="background-color: #fee2e2; color: #991b1b;"
  >
    {{ value }}
  </span>
  <span v-else>{{ value }}</span>
</template>
```

### Complete Cell Background (Single Cell)

Paint a single cell completely with a background color using CSS targeting. The entire cell area will be colored.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

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
</script>

<template>
  <div class="complete-cell-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
      responsive="table"
    >
      <template #cell="{ column, value, row }">
        <!-- Add data attributes for CSS targeting -->
        <span
          v-if="column.field === 'status'"
          :data-status="value"
          :data-row-id="row.id"
        >
          {{ value }}
        </span>
        <span v-else>{{ value }}</span>
      </template>
    </PantanalGrid>
  </div>
</template>

<style scoped>
/* Paint a single cell completely red - targeting specific cell by row and column */
/* This targets the status cell (3rd column) of row 2 (Inactive status) */
.complete-cell-example :deep(.v3grid__row:nth-child(2) .v3grid__cell:nth-child(3)) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}

/* Alternative: Target cell by data attribute */
.complete-cell-example :deep(.v3grid__row:has(.v3grid__cell [data-status="Inactive"][data-row-id="2"]) .v3grid__cell:has([data-status="Inactive"])) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}

/* Target any cell with Inactive status */
.complete-cell-example :deep(.v3grid__row .v3grid__cell:has([data-status="Inactive"])) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}
</style>
```

**Note:** The `nth-child()` selector uses 1-based indexing. The first row is `nth-child(1)`, second row is `nth-child(2)`, etc. Similarly, the first column is `nth-child(1)`, second column is `nth-child(2)`, etc.

## Specific Cell Styling (Original)

Style individual cells with specific colors using the `#cell` slot.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

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
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    responsive="table"
  >
    <template #cell="{ column, value, row }">
      <span
        v-if="column.field === 'status' && value === 'Inactive'"
        class="px-2 py-1 rounded text-sm font-medium"
        style="background-color: #fee2e2; color: #991b1b;"
      >
        {{ value }}
      </span>
      <span
        v-else-if="column.field === 'priority' && value === 'High'"
        class="px-2 py-1 rounded text-sm font-medium"
        style="background-color: #fee2e2; color: #991b1b;"
      >
        {{ value }}
      </span>
      <span v-else>{{ value }}</span>
    </template>
  </PantanalGrid>
</template>
```

## Entire Row Styling

Style entire rows with specific colors using CSS and data attributes.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active', priority: 'High' },
  { id: 2, name: 'Jane Smith', status: 'Inactive', priority: 'Medium' },
  { id: 3, name: 'Bob Johnson', status: 'Active', priority: 'Low' }
])

// No need to modify rows - we'll use CSS :has() selector

const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', width: 150 },
  { field: 'status', title: 'Status', width: 120 },
  { field: 'priority', title: 'Priority', width: 120 }
]
</script>

<template>
  <div class="styled-rows-color-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      responsive="table"
    >
      <template #cell="{ column, value, row }">
        <!-- Add data attributes to status cell for CSS targeting -->
        <span
          v-if="column.field === 'status'"
          :data-status="value"
        >
          {{ value }}
        </span>
        <span v-else>{{ value }}</span>
      </template>
    </PantanalGrid>
  </div>
</template>

<style scoped>
/* Style entire row with red background using :has() selector */
.styled-rows-color-example :deep(.v3grid__row:has(.v3grid__cell [data-status="Inactive"])) {
  background-color: #fee2e2 !important;
}

.styled-rows-color-example :deep(.v3grid__row:has(.v3grid__cell [data-status="Inactive"]) .v3grid__cell) {
  color: #991b1b;
  font-weight: 500;
}

/* Alternative: Style row based on index (blue) */
.styled-rows-color-example :deep(.v3grid__row:nth-child(3)) {
  background-color: #dbeafe !important;
}

.styled-rows-color-example :deep(.v3grid__row:nth-child(3) .v3grid__cell) {
  color: #1e40af;
}
</style>
```

## Entire Column Styling

Style entire columns with specific colors using CSS selectors.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

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
</script>

<template>
  <div class="styled-columns-color-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
      responsive="table"
    />
  </div>
</template>

<style scoped>
/* Style entire column (status column - 3rd column) - Red */
.styled-columns-color-example :deep(.v3grid__row .v3grid__cell:nth-child(3)) {
  background-color: #fee2e2 !important;
  color: #991b1b;
  font-weight: 500;
}

/* Style column header */
.styled-columns-color-example :deep(.v3grid__head .v3grid__cell:nth-child(3)) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}

/* Alternative: Style priority column (4th column) with blue */
.styled-columns-color-example :deep(.v3grid__row .v3grid__cell:nth-child(4)) {
  background-color: #dbeafe !important;
  color: #1e40af;
}

.styled-columns-color-example :deep(.v3grid__head .v3grid__cell:nth-child(4)) {
  background-color: #2563eb !important;
  color: white;
  font-weight: 600;
}
</style>
```

## Color Examples

### Red Cell
```vue
<template #cell="{ column, value }">
  <span
    v-if="column.field === 'status' && value === 'Inactive'"
    style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px;"
  >
    {{ value }}
  </span>
  <span v-else>{{ value }}</span>
</template>
```

### Red Row
```css
.styled-grid :deep(.v3grid__row[data-status="Inactive"]) {
  background-color: #fee2e2 !important;
}

.styled-grid :deep(.v3grid__row[data-status="Inactive"] .v3grid__cell) {
  color: #991b1b;
}
```

### Red Column
```css
/* Style 3rd column (status) with red */
.styled-grid :deep(.v3grid__row .v3grid__cell:nth-child(3)) {
  background-color: #fee2e2 !important;
  color: #991b1b;
}

.styled-grid :deep(.v3grid__head .v3grid__cell:nth-child(3)) {
  background-color: #dc2626 !important;
  color: white;
}
```

### Other Colors

You can use any color. Here are some examples:

- **Blue**: `background-color: #dbeafe; color: #1e40af;`
- **Green**: `background-color: #dcfce7; color: #166534;`
- **Yellow**: `background-color: #fef9c3; color: #854d0e;`
- **Purple**: `background-color: #f3e8ff; color: #6b21a8;`
- **Orange**: `background-color: #fed7aa; color: #9a3412;`

## See Also

- [ColumnDef API](/api/column-def) - Column definition options
- [GridProps API](/api/grid-props) - Grid props including `striped`
- [Templates Guide](/guide/templates) - Template usage guide
