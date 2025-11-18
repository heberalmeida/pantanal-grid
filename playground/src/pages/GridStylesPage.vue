<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Grid Styles & Hover Effects</h1>
    <p class="text-gray-600 mb-6">
      Customize the grid appearance with hover effects, borders, colors, and more using the <code class="bg-gray-100 px-2 py-1 rounded">gridStyles</code>, 
      <code class="bg-gray-100 px-2 py-1 rounded">cellHoverStyles</code>, and <code class="bg-gray-100 px-2 py-1 rounded">rowHoverStyles</code> props.
    </p>

    <!-- Example 1: No Borders -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Grid Without Borders</h2>
      <p class="text-gray-600 mb-4">
        Remove all borders from the grid using <code class="bg-gray-100 px-2 py-1 rounded">gridStyles.noBorders</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :grid-styles="{ noBorders: true }"
        />
      </div>

      <ExampleCode :source="noBordersCode" />
    </div>

    <!-- Example 2: Custom Colors -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Grid Colors</h2>
      <p class="text-gray-600 mb-4">
        Customize border colors, header background, and row colors using <code class="bg-gray-100 px-2 py-1 rounded">gridStyles</code>.
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
          :grid-styles="customColors"
        />
      </div>

      <ExampleCode :source="customColorsCode" />
    </div>

    <!-- Example 3: Row Hover -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Row Hover Effects</h2>
      <p class="text-gray-600 mb-4">
        Add hover effects to entire rows using <code class="bg-gray-100 px-2 py-1 rounded">rowHoverStyles</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :row-hover-styles="rowHoverStyles"
        />
      </div>

      <ExampleCode :source="rowHoverCode" />
    </div>

    <!-- Example 4: Cell Hover -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Cell Hover Effects</h2>
      <p class="text-gray-600 mb-4">
        Add hover effects to individual cells using <code class="bg-gray-100 px-2 py-1 rounded">cellHoverStyles</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :cell-hover-styles="cellHoverStyles"
        />
      </div>

      <ExampleCode :source="cellHoverCode" />
    </div>

    <!-- Example 5: Combined Styles -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Combined Styles</h2>
      <p class="text-gray-600 mb-4">
        Combine grid styles, row hover, and cell hover for a fully customized appearance.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :grid-styles="combinedGridStyles"
          :row-hover-styles="combinedRowHoverStyles"
          :cell-hover-styles="combinedCellHoverStyles"
        />
      </div>

      <ExampleCode :source="combinedStylesCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GridStyleConfig, type CellStyleConfig, type RowStyleConfig } from '@pantanal/grid'
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

// Example 1: No Borders
const noBordersCode = `
<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig } from '@pantanal/grid'

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
  />
</template>
`

// Example 2: Custom Colors
const customColors: GridStyleConfig = {
  borderColor: '#3b82f6',
  headerBackground: '#1e40af',
  headerColor: 'white',
  rowBackground: '#f8fafc',
  stripedBackground: '#e2e8f0'
}

const customColorsCode = `
<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig } from '@pantanal/grid'

const gridStyles: GridStyleConfig = {
  borderColor: '#3b82f6',
  headerBackground: '#1e40af',
  headerColor: 'white',
  rowBackground: '#f8fafc',
  stripedBackground: '#e2e8f0'
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :striped="true"
    :grid-styles="gridStyles"
  />
</template>
`

// Example 3: Row Hover
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
  }
]

const rowHoverCode = `
<script setup lang="ts">
import { PantanalGrid, type RowStyleConfig } from '@pantanal/grid'

const rowHoverStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Active',
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
    :row-hover-styles="rowHoverStyles"
  />
</template>
`

// Example 4: Cell Hover
const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Active',
    backgroundColor: '#86efac',
    color: '#166534'
  },
  {
    field: 'priority',
    condition: (_row, value) => value === 'High',
    backgroundColor: '#fca5a5',
    color: '#991b1b'
  }
]

const cellHoverCode = `
<script setup lang="ts">
import { PantanalGrid, type CellStyleConfig } from '@pantanal/grid'

const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Active',
    backgroundColor: '#86efac',
    color: '#166534'
  }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :cell-hover-styles="cellHoverStyles"
  />
</template>
`

// Example 5: Combined
const combinedGridStyles: GridStyleConfig = {
  borderColor: '#e5e7eb',
  headerBackground: '#f3f4f6',
  headerColor: '#111827',
  cellPadding: '0.75rem 1rem'
}

const combinedRowHoverStyles: RowStyleConfig[] = [
  {
    backgroundColor: '#f0f9ff',
    color: '#0c4a6e'
  }
]

const combinedCellHoverStyles: CellStyleConfig[] = [
  {
    field: 'priority',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
]

const combinedStylesCode = `
<script setup lang="ts">
import { PantanalGrid, type GridStyleConfig, type RowStyleConfig, type CellStyleConfig } from '@pantanal/grid'

const gridStyles: GridStyleConfig = {
  borderColor: '#e5e7eb',
  headerBackground: '#f3f4f6',
  headerColor: '#111827',
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
    :grid-styles="gridStyles"
    :row-hover-styles="rowHoverStyles"
    :cell-hover-styles="cellHoverStyles"
  />
</template>
`
</script>

<style scoped>
.grid-styles-page {
  padding: 1rem;
}
</style>


