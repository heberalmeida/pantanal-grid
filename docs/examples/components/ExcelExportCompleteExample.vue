<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const basicRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, category: 'Condiments' },
])

const basicColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'category', title: 'Category', width: 150 },
]

// Export All Pages
const allPagesRows = ref(Array.from({ length: 50 }, (_, i) => ({
  productID: i + 1,
  productName: `Product ${i + 1}`,
  unitPrice: Math.round(Math.random() * 1000) / 100,
  unitsInStock: Math.floor(Math.random() * 100),
  category: ['Beverages', 'Condiments', 'Confections'][i % 3]
})))

const allPagesColumns: ColumnDef[] = [...basicColumns]

// Custom File Name
const customFileName = ref('my-products-export.csv')
const customFileNameRows = ref([...basicRows.value])
const customFileNameColumns: ColumnDef[] = [...basicColumns]
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Excel Export -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Excel Export</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Add <code>'excel'</code> to the toolbar to enable Excel export. By default, only the current page is exported.
        Click the Excel button in the toolbar to export the data.
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="productID"
        :toolbar="['excel']"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Export All Pages -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Export All Pages</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Set <code>excelAllPages</code> to <code>true</code> to export all data pages instead of just the current page.
        This is useful when you have paginated data and want to export everything.
      </p>
      <PantanalGrid
        :rows="allPagesRows"
        :columns="allPagesColumns"
        key-field="productID"
        :toolbar="['excel']"
        :excel-all-pages="true"
        :pageable="true"
        :page-size="10"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom File Name -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom File Name</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Specify a custom file name using the <code>excelFileName</code> prop. The file will be exported as CSV format (which Excel opens correctly).
      </p>
      <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
        <label class="block text-sm font-medium mb-2">File name:</label>
        <input
          v-model="customFileName"
          type="text"
          class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter file name (e.g., my-export.csv)"
        />
      </div>
      <PantanalGrid
        :rows="customFileNameRows"
        :columns="customFileNameColumns"
        key-field="productID"
        :toolbar="['excel']"
        :excel-file-name="customFileName"
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
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
.p-3 {
  padding: 0.75rem;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.dark .bg-gray-800 {
  background-color: #1f2937;
}
.rounded {
  border-radius: 0.25rem;
}
.block {
  display: block;
}
.font-medium {
  font-weight: 500;
}
.w-full {
  width: 100%;
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
.dark .bg-gray-700 {
  background-color: #374151;
}
.dark .border-gray-600 {
  border-color: #4b5563;
}
</style>





