<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type CellStyleConfig, type RowStyleConfig, type ColumnStyleConfig } from '@pantanal/grid'

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

const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (_row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 600
  },
  {
    rowIndex: 1,
    columnIndex: 2,
    backgroundColor: '#dc2626',
    color: 'white',
    fontWeight: 'bold'
  }
]

const rowStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 500
  }
]

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
    :cell-styles="cellStyles"
    :row-styles="rowStyles"
    :column-styles="columnStyles"
  />
</template>

