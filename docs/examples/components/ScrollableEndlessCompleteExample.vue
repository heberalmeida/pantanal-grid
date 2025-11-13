<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Medium Dataset (2,000 rows)
const mediumRows = ref(Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  status: ['Active', 'Inactive', 'Pending'][i % 3],
  priority: ['High', 'Medium', 'Low'][i % 3]
})))

// Large Dataset (5,000 rows)
const largeRows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories', 'Home', 'Sports'][i % 5],
  inStock: i % 3 !== 0,
  rating: Math.round((Math.random() * 4 + 1) * 10) / 10
})))

const mediumColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { field: 'description', title: 'Description', width: 300 },
  { field: 'status', title: 'Status', width: 120, filterable: true },
  { field: 'priority', title: 'Priority', width: 100 }
]

const largeColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150, filterable: true },
  { field: 'inStock', title: 'In Stock', width: 100 },
  { field: 'rating', title: 'Rating', width: 100, sortable: true }
]

// With Sorting and Filtering
const sortedRows = ref([...mediumRows.value])
const sortedColumns: ColumnDef[] = [...mediumColumns]
</script>

<template>
  <div class="space-y-8">
    <!-- Medium Dataset (2,000 rows) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Medium Dataset (2,000 rows)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Endless scrolling with 2,000 rows using <code>scrollable-endless</code> prop.
        Scroll to the bottom to automatically load more items. No pagination controls needed.
      </p>
      <PantanalGrid
        :rows="mediumRows"
        :columns="mediumColumns"
        key-field="id"
        scrollable-endless
        :height="400"
        :row-height="44"
        :page-size="20"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Large Dataset (5,000 rows) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Large Dataset (5,000 rows)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Endless scrolling with 5,000 rows. Scroll down to see items load progressively.
        Try sorting and filtering to see how endless scrolling works with operations.
      </p>
      <PantanalGrid
        :rows="largeRows"
        :columns="largeColumns"
        key-field="id"
        scrollable-endless
        :height="400"
        :row-height="44"
        :page-size="30"
        :sortable="true"
        :show-filter-row="true"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With Sorting and Filtering -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Endless Scrolling with Sorting and Filtering</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Endless scrolling works seamlessly with sorting and filtering. As you scroll,
        more items are loaded automatically based on the current filter and sort state.
      </p>
      <PantanalGrid
        :rows="sortedRows"
        :columns="sortedColumns"
        key-field="id"
        scrollable-endless
        :height="400"
        :row-height="44"
        :page-size="25"
        :sortable="true"
        :show-filter-row="true"
        locale="en"
        responsive="table"
      />
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
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
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>

