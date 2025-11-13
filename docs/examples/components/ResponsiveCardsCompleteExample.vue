<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150, description: 'High quality product' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75, description: 'Comfortable and stylish' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200, description: 'Affordable option' },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50, description: 'Latest technology' },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'description', title: 'Description', width: 250 },
]

const responsiveMode = ref<'auto' | 'table' | 'cards'>('auto')
const cardBreakpoint = ref(768)
</script>

<template>
  <div class="space-y-8">
    <!-- Responsive Mode Controls -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Responsive Mode Controls</h3>
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium mb-2">Mode:</label>
          <select v-model="responsiveMode" class="px-3 py-2 border rounded">
            <option value="auto">Auto</option>
            <option value="table">Table</option>
            <option value="cards">Cards</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Card Breakpoint:</label>
          <input 
            v-model.number="cardBreakpoint" 
            type="number" 
            class="px-3 py-2 border rounded w-24"
            min="320"
            max="1920"
          />
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Current mode:</strong> {{ responsiveMode }}</p>
          <p><strong>Breakpoint:</strong> {{ cardBreakpoint }}px</p>
        </div>
      </div>
    </div>

    <!-- Auto Mode -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Auto Mode (Responsive)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Automatically switches between table and cards based on container width. Resize your browser window to see the change.
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        responsive="auto"
        :card-breakpoint="cardBreakpoint"
        :show-filters-in-cards="true"
        :height="responsiveMode === 'cards' ? 600 : 400"
        locale="en"
      />
    </div>

    <!-- Cards Mode -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Cards Mode</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Force card layout regardless of screen size. Useful for mobile-first designs.
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        responsive="cards"
        :show-filters-in-cards="true"
        :height="600"
        locale="en"
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
.p-4 {
  padding: 1rem;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.dark .bg-gray-800 {
  background-color: #1f2937;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.gap-4 {
  gap: 1rem;
}
.items-center {
  align-items: center;
}
.block {
  display: block;
}
.font-medium {
  font-weight: 500;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.border {
  border-width: 1px;
  border-color: #e5e7eb;
}
.rounded {
  border-radius: 0.25rem;
}
.w-24 {
  width: 6rem;
}
</style>



