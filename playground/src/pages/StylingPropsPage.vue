<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Cell, Row & Column Styling with Props</h1>
    <p class="text-gray-600 mb-6">
      Use the <code class="bg-gray-100 px-2 py-1 rounded">cellStyles</code>, <code class="bg-gray-100 px-2 py-1 rounded">rowStyles</code>, and 
      <code class="bg-gray-100 px-2 py-1 rounded">columnStyles</code> props to style cells, rows, and columns programmatically without CSS.
    </p>

    <!-- Example 1: Cell Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Cell Styling</h2>
      <p class="text-gray-600 mb-4">
        Style individual cells using the <code class="bg-gray-100 px-2 py-1 rounded">cellStyles</code> prop.
        You can target cells by field, row index, column index, or condition function.
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
          :cell-styles="cellStyles"
        />
      </div>

      <ExampleCode :source="cellStylesCode" />
    </div>

    <!-- Example 2: Row Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Row Styling</h2>
      <p class="text-gray-600 mb-4">
        Style entire rows using the <code class="bg-gray-100 px-2 py-1 rounded">rowStyles</code> prop.
        You can target rows by index, multiple indices, or condition function.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :row-styles="rowStyles"
        />
      </div>

      <ExampleCode :source="rowStylesCode" />
    </div>

    <!-- Example 3: Column Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Styling</h2>
      <p class="text-gray-600 mb-4">
        Style entire columns using the <code class="bg-gray-100 px-2 py-1 rounded">columnStyles</code> prop.
        You can style both the column cells and the column header.
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
          :column-styles="columnStyles"
        />
      </div>

      <ExampleCode :source="columnStylesCode" />
    </div>

    <!-- Example 4: Combined Styling -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Combined Styling</h2>
      <p class="text-gray-600 mb-4">
        Combine cell, row, and column styles for complex styling scenarios.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :cell-styles="combinedCellStyles"
          :row-styles="combinedRowStyles"
          :column-styles="combinedColumnStyles"
        />
      </div>

      <ExampleCode :source="combinedStylesCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type CellStyleConfig, type RowStyleConfig, type ColumnStyleConfig } from '@pantanal/grid'
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

// Example 1: Cell Styles
const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 600
  },
  {
    field: 'priority',
    condition: (_row, value) => value === 'High',
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

// Example 2: Row Styles
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
  }
]

// Example 3: Column Styles
const columnStyles: ColumnStyleConfig[] = [
  {
    field: 'status',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
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

// Example 4: Combined Styles
const combinedCellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
]

const combinedRowStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.priority === 'High',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]

const combinedColumnStyles: ColumnStyleConfig[] = [
  {
    field: 'status',
    headerBackgroundColor: '#dc2626',
    headerColor: 'white'
  }
]

const cellStylesCode = `
<script setup lang="ts">
import { PantanalGrid, type CellStyleConfig } from '@pantanal/grid'

const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 600
  },
  {
    // Paint a specific cell (row 1, column 2)
    rowIndex: 1,
    columnIndex: 2,
    backgroundColor: '#dc2626',
    color: 'white',
    fontWeight: 'bold'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-styles="cellStyles"
  />
</template>
`

const rowStylesCode = `
<script setup lang="ts">
import { PantanalGrid, type RowStyleConfig } from '@pantanal/grid'

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
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :row-styles="rowStyles"
  />
</template>
`

const columnStylesCode = `
<script setup lang="ts">
import { PantanalGrid, type ColumnStyleConfig } from '@pantanal/grid'

const columnStyles: ColumnStyleConfig[] = [
  {
    field: 'status',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    headerBackgroundColor: '#dc2626',
    headerColor: 'white',
    fontWeight: 600
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :column-styles="columnStyles"
  />
</template>
`

const combinedStylesCode = `
<script setup lang="ts">
import { PantanalGrid, type CellStyleConfig, type RowStyleConfig, type ColumnStyleConfig } from '@pantanal/grid'

const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Inactive',
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
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-styles="cellStyles"
    :row-styles="rowStyles"
    :column-styles="columnStyles"
  />
</template>
`
</script>

<style scoped>
.styling-props-page {
  padding: 1rem;
}
</style>


