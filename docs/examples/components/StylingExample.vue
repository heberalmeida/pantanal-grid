<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

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
</template>

<style scoped>
:deep(.v3grid__row:nth-child(even)) {
  background-color: #f9fafb;
}

:deep(.v3grid__headercell) {
  background-color: #f3f4f6;
  font-weight: 600;
}
</style>


