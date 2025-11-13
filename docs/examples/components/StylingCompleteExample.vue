<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Striped Rows
const stripedRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
])

const stripedColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'stock', title: 'Stock', width: 100 },
]

// Compact Density
const compactRows = ref([...stripedRows.value])
const compactColumns: ColumnDef[] = [...stripedColumns]

// Custom Styling
const customRows = ref([...stripedRows.value])
const customColumns: ColumnDef[] = [...stripedColumns]
</script>

<template>
  <div class="space-y-8">
    <!-- Striped Rows -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Striped Rows</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Enable striped row styling for better readability.
      </p>
      <PantanalGrid
        :rows="stripedRows"
        :columns="stripedColumns"
        key-field="id"
        :striped="true"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Compact Density -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Compact Density</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use compact density to show more rows in less space.
      </p>
      <PantanalGrid
        :rows="compactRows"
        :columns="compactColumns"
        key-field="id"
        density="compact"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom Styling -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Styling</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Apply custom CSS styles to the grid. Use scoped styles or global CSS classes.
      </p>
      <div class="custom-grid-wrapper">
        <PantanalGrid
          :rows="customRows"
          :columns="customColumns"
          key-field="id"
          :height="300"
          locale="en"
          responsive="table"
        />
      </div>
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

/* Custom Grid Styling */
.custom-grid-wrapper :deep(.v3grid) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-grid-wrapper :deep(.v3grid__headercell) {
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

.custom-grid-wrapper :deep(.v3grid__row:hover) {
  background: #f0f9ff;
  transition: background-color 0.2s;
}

.custom-grid-wrapper :deep(.v3grid__cell) {
  padding: 0.75rem 1rem;
}
</style>



