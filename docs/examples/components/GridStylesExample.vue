<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GridStyleConfig, type RowStyleConfig, type CellStyleConfig } from '@pantanal/grid'

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

const gridStyles: GridStyleConfig = {
  borderColor: '#3b82f6',
  borderWidth: '2px',
  headerBackground: '#1e40af',
  headerColor: 'white',
  rowBackground: '#f8fafc',
  stripedBackground: '#e2e8f0',
  cellPadding: '0.75rem 1rem'
}

const rowHoverStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Active',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  }
]

const cellHoverStyles: CellStyleConfig[] = [
  {
    field: 'priority',
    condition: (_row, value) => value === 'High',
    backgroundColor: '#fca5a5',
    color: '#991b1b'
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :height="400"
    locale="en"
    responsive="table"
    :striped="true"
    :grid-styles="gridStyles"
    :row-hover-styles="rowHoverStyles"
    :cell-hover-styles="cellHoverStyles"
  />
</template>

