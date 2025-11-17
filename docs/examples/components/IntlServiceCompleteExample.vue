<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, IntlService, type ColumnDef } from '@pantanal/grid'

const intl = new IntlService('en')

interface Product {
  id: number
  name: string
  price: number
  date: Date
  discount: number
  quantity: number
}

const rows = ref<Product[]>([
  { id: 1, name: 'Product A', price: 1234.56, date: new Date(2024, 0, 15), discount: 0.15, quantity: 100 },
  { id: 2, name: 'Product B', price: 567.89, date: new Date(2024, 1, 20), discount: 0.25, quantity: 50 },
  { id: 3, name: 'Product C', price: 890.12, date: new Date(2024, 2, 25), discount: 0.10, quantity: 75 },
  { id: 4, name: 'Product D', price: 2345.67, date: new Date(2024, 3, 10), discount: 0.30, quantity: 200 },
  { id: 5, name: 'Product E', price: 456.78, date: new Date(2024, 4, 5), discount: 0.20, quantity: 150 },
])

const columns: ColumnDef<Product>[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { 
    field: 'price', 
    title: 'Price',
    width: 140,
    sortable: true,
    format: (v: number) => intl.formatNumber(v, { style: 'currency', currency: 'USD' })
  },
  { 
    field: 'date', 
    title: 'Date',
    width: 150,
    sortable: true,
    format: (v: Date) => intl.formatDate(v, 'short')
  },
  { 
    field: 'discount', 
    title: 'Discount',
    width: 120,
    sortable: true,
    format: (v: number) => intl.formatNumber(v, { style: 'percent', minimumFractionDigits: 0 })
  },
  { 
    field: 'quantity', 
    title: 'Quantity',
    width: 120,
    sortable: true,
    format: (v: number) => intl.formatNumber(v, { style: 'decimal', useGrouping: true })
  }
]
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-2">Grid with IntlService Formatting</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        This example demonstrates using IntlService to format currency, dates, percentages, and numbers in grid columns.
        The grid supports sorting, filtering, and all standard features.
      </p>
      <PantanalGrid 
        :rows="rows" 
        :columns="columns" 
        key-field="id"
        :height="400"
        locale="en"
        responsive="table"
        :sortable="true"
        :filterable="true"
      />
    </div>
    
    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h4 class="font-semibold mb-2">Formatting Examples</h4>
      <ul class="space-y-1 text-sm">
        <li><strong>Currency:</strong> {{ intl.formatNumber(1234.56, { style: 'currency', currency: 'USD' }) }}</li>
        <li><strong>Decimal:</strong> {{ intl.formatNumber(1234.56, { style: 'decimal', useGrouping: true }) }}</li>
        <li><strong>Percent:</strong> {{ intl.formatNumber(0.15, { style: 'percent' }) }}</li>
        <li><strong>Date (short):</strong> {{ intl.formatDate(new Date(), 'short') }}</li>
        <li><strong>Date (long):</strong> {{ intl.formatDate(new Date(), 'long') }}</li>
        <li><strong>Formatted string:</strong> {{ intl.format('Total: {0:c}', [1234.56]) }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
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
.bg-blue-50 {
  background-color: #eff6ff;
}
.dark .bg-blue-900\/20 {
  background-color: rgba(30, 58, 138, 0.2);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.space-y-1 > * + * {
  margin-top: 0.25rem;
}
</style>

