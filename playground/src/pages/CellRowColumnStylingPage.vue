<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Cell, Row & Column Styling</h1>
    <p class="text-gray-600 mb-6">
      Customize the appearance of cells, rows, and columns using CSS classes, inline styles, and Vue slots.
      This includes striped rows, conditional styling, and custom colors.
    </p>

    <!-- Example 1: Striped Rows -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Striped Rows</h2>
      <p class="text-gray-600 mb-4">
        Enable striped rows using the <code class="bg-gray-100 px-2 py-1 rounded">striped</code> prop.
        This alternates the background color of rows for better readability.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="stripedCode" />
    </div>

    <!-- Example 2: Conditional Cell Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Conditional Cell Styling</h2>
      <p class="text-gray-600 mb-4">
        Use the <code class="bg-gray-100 px-2 py-1 rounded">#cell</code> slot to apply conditional styling
        based on cell values.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        >
          <template #cell="{ column, value }">
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
      </div>

      <ExampleCode :source="conditionalCellCode" />
    </div>

    <!-- Example 3: Row Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Row Styling with CSS</h2>
      <p class="text-gray-600 mb-4">
        Apply custom styles to rows using CSS classes and the <code class="bg-gray-100 px-2 py-1 rounded">:deep()</code> selector.
      </p>
      
      <div class="mb-6 styled-rows-example">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
        />
      </div>

      <ExampleCode :source="rowStylingCode" />
    </div>

    <!-- Example 4: Column Header Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Header Styling</h2>
      <p class="text-gray-600 mb-4">
        Style column headers using CSS classes and custom templates.
      </p>
      
      <div class="mb-6 styled-headers-example">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="headerStylingCode" />
    </div>

    <!-- Example 5: Specific Cell Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Specific Cell Styling</h2>
      <p class="text-gray-600 mb-4">
        Style individual cells with specific colors using the <code class="bg-gray-100 px-2 py-1 rounded">#cell</code> slot.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        >
          <template #cell="{ column, value }">
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
      </div>

      <ExampleCode :source="specificCellCode" />
    </div>

    <!-- Example 5.5: Complete Cell Background Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Complete Cell Background (Single Cell)</h2>
      <p class="text-gray-600 mb-4">
        Paint a single cell completely with a background color using CSS targeting. The entire cell area will be colored.
      </p>
      
      <div class="mb-6 complete-cell-example">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
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

      <ExampleCode :source="completeCellCode" />
    </div>

    <!-- Example 6: Entire Row Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Entire Row Styling</h2>
      <p class="text-gray-600 mb-4">
        Style entire rows with specific colors using CSS and data attributes.
      </p>
      
      <div class="mb-6 styled-rows-color-example">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
        >
          <template #cell="{ column, value }">
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

      <ExampleCode :source="entireRowCode" />
    </div>

    <!-- Example 7: Entire Column Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Entire Column Styling</h2>
      <p class="text-gray-600 mb-4">
        Style entire columns with specific colors using CSS selectors.
      </p>
      
      <div class="mb-6 styled-columns-color-example">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="entireColumnCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

const rows = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    priority: 'High',
    role: 'Admin'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Inactive',
    priority: 'Medium',
    role: 'User'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'Active',
    priority: 'Low',
    role: 'User'
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    status: 'Pending',
    priority: 'High',
    role: 'Admin'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    status: 'Active',
    priority: 'Medium',
    role: 'User'
  }
])

const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    width: 150
  },
  {
    field: 'email',
    title: 'Email',
    width: 200
  },
  {
    field: 'status',
    title: 'Status',
    width: 120
  },
  {
    field: 'priority',
    title: 'Priority',
    width: 120
  },
  {
    field: 'role',
    title: 'Role',
    width: 100
  }
]

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const stripedCode = `
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :striped="true"
/>
`

const conditionalCellCode = `
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :striped="true"
>
  <template #cell="{ column, value, row }">
    <span
      v-if="column.field === 'status'"
      :class="getStatusClass(value)"
      class="px-2 py-1 rounded text-sm font-medium"
    >
      {{ value }}
    </span>
    <span v-else>{{ value }}</span>
  </template>
</PantanalGrid>
`

const rowStylingCode = `
<style scoped>
.styled-rows-example :deep(.v3grid__row:nth-child(even)) {
  background-color: #f9fafb;
}

.styled-rows-example :deep(.v3grid__row:hover) {
  background-color: #f3f4f6;
  cursor: pointer;
}

.styled-rows-example :deep(.v3grid__row[data-status="active"]) {
  border-left: 4px solid #10b981;
}
</style>
`

const headerStylingCode = `
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
`

const specificCellCode = `
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :striped="true"
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
`

const entireRowCode = `
<template>
  <div class="styled-rows-color-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
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

/* Alternative: Style row based on index (blue) - row 3 */
.styled-rows-color-example :deep(.v3grid__row:nth-child(3)) {
  background-color: #dbeafe !important;
}

.styled-rows-color-example :deep(.v3grid__row:nth-child(3) .v3grid__cell) {
  color: #1e40af;
}
</style>
`

const entireColumnCode = `
<template>
  <div class="styled-columns-color-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
    />
  </div>
</template>

<style scoped>
/* Style entire column (status column - 3rd column) */
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
}
</style>
`

const completeCellCode = `
<template>
  <div class="complete-cell-example">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
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
/* This targets the status cell (3rd column) of the row with id=2 (Inactive status) */
.complete-cell-example :deep(.v3grid__row:nth-child(2) .v3grid__cell:nth-child(3)) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
}

/* Alternative: Target cell by data attribute */
.complete-cell-example :deep(.v3grid__row:has(.v3grid__cell [data-status="Inactive"][data-row-id="2"]) .v3grid__cell:has([data-status="Inactive"])) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}

/* You can also target by field value in any row */
.complete-cell-example :deep(.v3grid__row .v3grid__cell:has([data-status="Inactive"])) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}
</style>
`
</script>

<style scoped>
/* Row styling example */
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

/* Header styling example */
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

/* Entire row styling with colors */
/* Style row where status cell has data-status="Inactive" - red background */
.styled-rows-color-example :deep(.v3grid__row:has(.v3grid__cell [data-status="Inactive"])) {
  background-color: #fee2e2 !important;
}

.styled-rows-color-example :deep(.v3grid__row:has(.v3grid__cell [data-status="Inactive"]) .v3grid__cell) {
  color: #991b1b;
  font-weight: 500;
}

/* Alternative: Style row based on index (blue) - row 3 */
.styled-rows-color-example :deep(.v3grid__row:nth-child(3)) {
  background-color: #dbeafe !important;
}

.styled-rows-color-example :deep(.v3grid__row:nth-child(3) .v3grid__cell) {
  color: #1e40af;
}

/* Entire column styling with colors */
/* Status column (3rd column) - Red */
.styled-columns-color-example :deep(.v3grid__row .v3grid__cell:nth-child(3)) {
  background-color: #fee2e2 !important;
  color: #991b1b;
  font-weight: 500;
}

.styled-columns-color-example :deep(.v3grid__head .v3grid__cell:nth-child(3)) {
  background-color: #dc2626 !important;
  color: white;
  font-weight: 600;
}

/* Priority column (4th column) - Blue */
.styled-columns-color-example :deep(.v3grid__row .v3grid__cell:nth-child(4)) {
  background-color: #dbeafe !important;
  color: #1e40af;
}

.styled-columns-color-example :deep(.v3grid__head .v3grid__cell:nth-child(4)) {
  background-color: #2563eb !important;
  color: white;
  font-weight: 600;
}

/* Complete cell background styling - paint a single cell completely */
/* Target specific cell by row index and column index */
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

