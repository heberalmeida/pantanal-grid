<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand Y', price: 49.99 },
  { id: 3, name: 'Product C', category: 'Clothing', brand: 'Brand X', price: 19.99 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand Z', price: 39.99 }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` }
]

const group = ref<GroupDescriptor[]>([])
const groupInfo = ref<string>('No groups applied')

function handleGroupChange(newGroup: GroupDescriptor[]) {
  group.value = newGroup
  if (newGroup.length === 0) {
    groupInfo.value = 'No groups applied'
  } else {
    groupInfo.value = `Grouping by: ${newGroup.map(g => g.field).join(' → ')}`
  }
}
</script>

<template>
  <div class="grouping-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
      Group changes are tracked. Check the console or the info below the grid.
    </p>
    <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
      <strong>Current grouping:</strong> {{ groupInfo }}
    </div>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      groupable
      :group="group"
      @update:group="handleGroupChange"
      key-field="id"
      locale="en"
      :height="350"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.grouping-example {
  padding: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-600 {
  color: #4b5563;
}

.dark .text-gray-400 {
  color: #9ca3af;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.dark .bg-blue-900\/20 {
  background-color: rgba(30, 58, 138, 0.2);
}

.rounded {
  border-radius: 0.25rem;
}

strong {
  font-weight: 600;
}
</style>

