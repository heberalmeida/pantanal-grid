<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Basic Multi-Column Headers
const basicRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages', supplier: 'Supplier A' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages', supplier: 'Supplier B' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments', supplier: 'Supplier A' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments', supplier: 'Supplier C' },
])

const basicColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80 },
  {
    title: 'Product Details',
    columns: [
      { field: 'productName', title: 'Product Name', width: 200 },
      { field: 'category', title: 'Category', width: 150 },
    ]
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
]

// Nested Column Groups
const nestedRows = ref([...basicRows.value])
const nestedColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80 },
  {
    title: 'Product Details',
    columns: [
      { field: 'productName', title: 'Product Name', width: 200 },
      {
        title: 'Pricing',
        columns: [
          { field: 'unitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
          { field: 'unitsInStock', title: 'Stock', width: 100 },
        ]
      },
      { field: 'category', title: 'Category', width: 150 },
    ]
  },
  { field: 'supplier', title: 'Supplier', width: 150 },
]

// With Sorting and Filtering
const sortFilterRows = ref([...basicRows.value])
const sortFilterColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, sortable: true, filterable: true },
  {
    title: 'Product Details',
    columns: [
      { field: 'productName', title: 'Product Name', width: 200, sortable: true, filterable: true },
      { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
    ]
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true, filterable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, sortable: true, filterable: true },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Multi-Column Headers -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Multi-Column Headers</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Nest columns by using the <code>columns</code> property of a column definition. The <strong>Product Details</strong> column contains nested columns.
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="productID"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Nested Column Groups -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Nested Column Groups</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        You can nest column groups to create multiple levels of headers. In this example, <strong>Product Details</strong> contains <strong>Pricing</strong> which has nested columns.
      </p>
      <PantanalGrid
        :rows="nestedRows"
        :columns="nestedColumns"
        key-field="productID"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With Sorting and Filtering -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Multi-Column Headers with Sorting and Filtering</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Multi-column headers support all standard grid features. You can sort and filter by leaf columns (columns with <code>field</code> property).
      </p>
      <PantanalGrid
        :rows="sortFilterRows"
        :columns="sortFilterColumns"
        key-field="productID"
        :sortable="true"
        :show-filter-row="true"
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
strong {
  font-weight: 600;
}
</style>







