<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 },
  { id: 6, name: 'Product F', price: 24.99, category: 'Accessories', stock: 300 },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150, filterable: true },
  { field: 'stock', title: 'Stock', width: 100, sortable: true },
]

const selectedKeys = ref<number[]>([])
</script>

<template>
  <div class="space-y-8">
    <!-- Keyboard Navigation Info -->
    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Keyboard Navigation</h3>
      <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
        <strong>Instructions:</strong> Click on the grid to focus it, then use keyboard shortcuts to navigate.
        The keyboard support is always available when <code>navigatable</code> prop is enabled.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-semibold mb-2">Header Shortcuts</h4>
          <ul class="space-y-1 text-gray-600 dark:text-gray-400">
            <li><kbd class="px-2 py-1 bg-white border rounded">Enter</kbd> - Sort by column</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Alt</kbd> + <kbd class="px-2 py-1 bg-white border rounded">Down</kbd> - Open filter menu</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Esc</kbd> - Close filter menu</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Ctrl</kbd> + <kbd class="px-2 py-1 bg-white border rounded">←</kbd> - Reorder column left</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Ctrl</kbd> + <kbd class="px-2 py-1 bg-white border rounded">→</kbd> - Reorder column right</li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold mb-2">Body Shortcuts</h4>
          <ul class="space-y-1 text-gray-600 dark:text-gray-400">
            <li><kbd class="px-2 py-1 bg-white border rounded">Arrow Keys</kbd> - Navigate cells</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Page Up/Down</kbd> - Navigate pages</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Space</kbd> - Select row</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Ctrl</kbd> + <kbd class="px-2 py-1 bg-white border rounded">Space</kbd> - Toggle selection</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Shift</kbd> + <kbd class="px-2 py-1 bg-white border rounded">Space</kbd> - Range selection</li>
            <li><kbd class="px-2 py-1 bg-white border rounded">Home/End</kbd> - First/last cell</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Grid with Keyboard Navigation -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Interactive Grid</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click on the grid to focus it, then try the keyboard shortcuts listed above. Use <kbd class="px-2 py-1 bg-gray-100 border rounded">Tab</kbd> to focus the grid.
      </p>
      <div v-if="selectedKeys.length > 0" class="mb-2 text-sm">
        <strong>Selected rows:</strong> {{ selectedKeys.join(', ') }}
      </div>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        :navigatable="true"
        :selectable="'multiple'"
        :sortable="true"
        :show-filter-row="true"
        :pageable="true"
        :enable-column-reorder="true"
        @selectionChange="selectedKeys = $event"
        :height="350"
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
.text-gray-700 {
  color: #374151;
}
.dark .text-gray-300 {
  color: #d1d5db;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
strong {
  font-weight: 600;
}
.p-4 {
  padding: 1rem;
}
.bg-blue-50 {
  background-color: #eff6ff;
}
.dark .bg-blue-900\/20 {
  background-color: rgba(30, 58, 138, 0.2);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.gap-4 {
  gap: 1rem;
}
.space-y-1 > * + * {
  margin-top: 0.25rem;
}
kbd {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875em;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.bg-white {
  background-color: #fff;
}
.border {
  border-width: 1px;
  border-color: #e5e7eb;
}
.rounded {
  border-radius: 0.25rem;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
</style>







