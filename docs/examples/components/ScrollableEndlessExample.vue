<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  status: ['Active', 'Inactive', 'Pending'][i % 3],
  priority: ['High', 'Medium', 'Low'][i % 3]
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'description', title: 'Description' },
  { field: 'status', title: 'Status', filterable: true },
  { field: 'priority', title: 'Priority', width: 100 }
]
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Endless scrolling with 5,000 rows using <code>scrollable-endless</code> prop.
      Scroll to the bottom to automatically load more items. No pagination controls needed.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      scrollable-endless
      :height="420"
      :row-height="44"
      :page-size="20"
      locale="en"
      responsive="table"
      sortable
      filterable
    />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>

