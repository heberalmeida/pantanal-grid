<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Small Dataset (1,000 rows)
const smallRows = ref(Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3]
})))

// Large Dataset (10,000 rows)
const largeRows = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3],
  stock: Math.floor(Math.random() * 1000),
  supplier: ['Supplier A', 'Supplier B', 'Supplier C'][i % 3]
})))

const smallColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150, filterable: true }
]

const largeColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150, filterable: true },
  { field: 'stock', title: 'Stock', width: 100, sortable: true },
  { field: 'supplier', title: 'Supplier', width: 150, filterable: true }
]

// With Sorting and Filtering
const sortedRows = ref([...smallRows.value])
const sortedColumns: ColumnDef[] = [...smallColumns]
</script>

<template>
  <div class="space-y-8">
    <!-- Small Dataset (1,000 rows) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Small Dataset (1,000 rows)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Virtual scrolling with 1,000 rows. Only visible rows are rendered for optimal performance.
        Scroll through the data to see smooth performance.
      </p>
      <PantanalGrid
        :rows="smallRows"
        :columns="smallColumns"
        key-field="id"
        :virtual="true"
        :height="400"
        :row-height="44"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Large Dataset (10,000 rows) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Large Dataset (10,000 rows)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Virtual scrolling with 10,000 rows. Even with a large dataset, performance remains smooth.
        Try sorting and filtering to see how virtual scrolling handles operations efficiently.
      </p>
      <PantanalGrid
        :rows="largeRows"
        :columns="largeColumns"
        key-field="id"
        :virtual="true"
        :height="400"
        :row-height="44"
        :sortable="true"
        :show-filter-row="true"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With Sorting and Filtering -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Virtual Scrolling with Sorting and Filtering</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Virtual scrolling works seamlessly with sorting and filtering. Operations are performed on the full dataset,
        but only visible rows are rendered.
      </p>
      <PantanalGrid
        :rows="sortedRows"
        :columns="sortedColumns"
        key-field="id"
        :virtual="true"
        :height="400"
        :row-height="44"
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
</style>









