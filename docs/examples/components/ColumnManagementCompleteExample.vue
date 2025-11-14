<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Column Resizing
const resizeRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, category: 'Condiments' },
])

const resizeColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, resizable: true },
  { field: 'productName', title: 'Product Name', width: 200, resizable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, resizable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, resizable: true },
  { field: 'category', title: 'Category', width: 150, resizable: true },
]

// Column Reordering
const reorderRows = ref([...resizeRows.value])
const reorderColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, reorderable: true },
  { field: 'productName', title: 'Product Name', width: 200, reorderable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, reorderable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, reorderable: true },
  { field: 'category', title: 'Category', width: 150, reorderable: true },
]

// Pinned Columns
const pinnedRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150, description: 'High quality product', brand: 'Brand X', rating: 4.5 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75, description: 'Comfortable and stylish', brand: 'Brand Y', rating: 4.2 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200, description: 'Affordable option', brand: 'Brand Z', rating: 4.0 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50, description: 'Latest technology', brand: 'Brand X', rating: 4.8 },
])

const pinnedColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, pinned: 'left' },
  { field: 'name', title: 'Name', width: 200, pinned: 'left' },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'description', title: 'Description', width: 250 },
  { field: 'brand', title: 'Brand', width: 120 },
  { field: 'rating', title: 'Rating', width: 100, pinned: 'right' },
]

// Combined: Resize + Reorder
const combinedRows = ref([...resizeRows.value])
const combinedColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, resizable: true, reorderable: true },
  { field: 'productName', title: 'Product Name', width: 200, resizable: true, reorderable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, resizable: true, reorderable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, resizable: true, reorderable: true },
  { field: 'category', title: 'Category', width: 150, resizable: true, reorderable: true },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Column Resizing -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Column Resizing</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Hover over the right edge of any column header and drag to resize. Column widths are adjustable.
      </p>
      <PantanalGrid
        :rows="resizeRows"
        :columns="resizeColumns"
        key-field="productID"
        :enable-column-resize="true"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Column Reordering -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Column Reordering</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Drag column headers to reorder columns. Drop them in the desired position.
      </p>
      <PantanalGrid
        :rows="reorderRows"
        :columns="reorderColumns"
        key-field="productID"
        :enable-column-reorder="true"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Pinned Columns -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Pinned Columns</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        ID and Name columns are pinned on the left, Rating is pinned on the right. Scroll horizontally to see pinned columns stay in place.
      </p>
      <PantanalGrid
        :rows="pinnedRows"
        :columns="pinnedColumns"
        key-field="id"
        :pinned-shadows="true"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Combined: Resize + Reorder -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Combined: Resize + Reorder</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Combine column resizing and reordering for maximum flexibility. Resize and reorder columns independently.
      </p>
      <PantanalGrid
        :rows="combinedRows"
        :columns="combinedColumns"
        key-field="productID"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :height="300"
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







