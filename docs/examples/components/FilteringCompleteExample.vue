<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor } from '@pantanal/grid'

// Filter Row Example
const filterRowRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, category: 'Condiments' },
  { productID: 6, productName: "Grandma's Boysenberry Spread", unitPrice: 25, unitsInStock: 120, category: 'Confections' },
])

const filterRowColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, filterable: true, sortable: true },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true, sortable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true, sortable: true, type: 'number' },
  { field: 'category', title: 'Category', width: 150, filterable: true, sortable: true },
]

const filterRowFilters = ref<FilterDescriptor[]>([])

// Advanced Filter with Different Types
const advancedRows = ref([
  { orderID: 1, customerName: 'John Doe', orderDate: new Date('2024-01-15'), freight: 32.38, shipped: true },
  { orderID: 2, customerName: 'Jane Smith', orderDate: new Date('2024-01-20'), freight: 11.61, shipped: false },
  { orderID: 3, customerName: 'Bob Johnson', orderDate: new Date('2024-02-01'), freight: 65.83, shipped: true },
  { orderID: 4, customerName: 'Alice Brown', orderDate: new Date('2024-02-10'), freight: 41.34, shipped: true },
])

const advancedColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 100, filterable: true, sortable: true, type: 'number' },
  { field: 'customerName', title: 'Customer', width: 180, filterable: true, sortable: true, type: 'string' },
  { field: 'orderDate', title: 'Order Date', width: 150, filterable: true, sortable: true, type: 'date', format: (v: Date) => v.toLocaleDateString() },
  { field: 'freight', title: 'Freight', width: 120, filterable: true, sortable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'shipped', title: 'Shipped', width: 100, filterable: true, sortable: true, type: 'boolean', format: (v: boolean) => v ? 'Yes' : 'No' },
]

const advancedFilters = ref<FilterDescriptor[]>([])

// Custom Filter Options
const customRows = ref([
  { id: 1, name: 'Product A', status: 'active', priority: 'high', category: 'electronics' },
  { id: 2, name: 'Product B', status: 'inactive', priority: 'medium', category: 'electronics' },
  { id: 3, name: 'Product C', status: 'active', priority: 'low', category: 'clothing' },
  { id: 4, name: 'Product D', status: 'pending', priority: 'high', category: 'food' },
])

const customColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, filterable: true, sortable: true, type: 'number' },
  { field: 'name', title: 'Name', width: 200, filterable: true, sortable: true },
  { 
    field: 'status', 
    title: 'Status', 
    width: 120, 
    filterable: true, 
    sortable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ]
  },
  { 
    field: 'category', 
    title: 'Category', 
    width: 150, 
    filterable: true, 
    sortable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'food', label: 'Food' },
    ]
  },
]

const customFilters = ref<FilterDescriptor[]>([])
</script>

<template>
  <div class="space-y-8">
    <!-- Filter Row Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Filter Row</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Filter inputs appear directly in the header row. The grid automatically uses appropriate input types based on column data type.
      </p>
      <PantanalGrid
        :rows="filterRowRows"
        :columns="filterRowColumns"
        key-field="productID"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="filterRowFilters"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Advanced Filter with Different Types -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Advanced Filter (Different Types)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Filter row with support for different input types: text, number, date, and boolean.
      </p>
      <PantanalGrid
        :rows="advancedRows"
        :columns="advancedColumns"
        key-field="orderID"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="advancedFilters"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom Filter Options -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Filter Options</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use custom filter options with dropdown selects. Boolean filters are automatically translated.
      </p>
      <PantanalGrid
        :rows="customRows"
        :columns="customColumns"
        key-field="id"
        :show-filter-row="true"
        :sortable="true"
        locale="en"
        v-model:filter="customFilters"
        :height="300"
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





