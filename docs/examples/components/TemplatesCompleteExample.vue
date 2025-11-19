<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Row Template
const rowTemplateRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' },
])

const rowTemplateColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
]

// Detail Template (Master-Detail)
const detailRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', description: 'High quality product with advanced features' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', description: 'Comfortable and stylish design' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', description: 'Affordable option for everyday use' },
])

const detailColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
]

const detailTemplate = (row: any) => {
  return `
    <div style="padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; margin: 0.5rem 0;">
      <h3 style="font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">Details</h3>
      <p style="margin: 0.25rem 0;"><strong>Description:</strong> ${row.description}</p>
      <p style="margin: 0.25rem 0;"><strong>Category:</strong> ${row.category}</p>
      <p style="margin: 0.25rem 0;"><strong>Price:</strong> $${row.price.toFixed(2)}</p>
    </div>
  `
}

// Header Template
const headerRows = ref([...rowTemplateRows.value])
const headerColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { 
    field: 'name', 
    title: 'Name', 
    width: 200,
    headerTemplate: (col: any) => `<strong style="color: #2563eb;">${col.title}</strong>`
  },
  { 
    field: 'price', 
    title: 'Price', 
    width: 120,
    headerTemplate: (col: any) => `<span style="font-weight: 600;">💰 ${col.title}</span>`
  },
  { field: 'category', title: 'Category', width: 150 },
]

// Footer Template (Aggregates)
const footerRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' },
])

const footerColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { 
    field: 'price', 
    title: 'Price', 
    width: 120,
    format: (v: number) => `$${v.toFixed(2)}`,
    aggregates: ['sum', 'avg'],
    footerTemplate: (aggs: any) => {
      return `<div style="font-weight: 600;">
        Total: $${aggs.price_sum?.toFixed(2) || '0.00'} | 
        Avg: $${aggs.price_avg?.toFixed(2) || '0.00'}
      </div>`
    }
  },
  { field: 'category', title: 'Category', width: 150 },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Header Template -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Header Template</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Customize column headers using the <code>headerTemplate</code> property.
      </p>
      <PantanalGrid
        :rows="headerRows"
        :columns="headerColumns"
        key-field="id"
        :height="250"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Detail Template (Master-Detail) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Detail Template (Master-Detail)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click the expand icon to view row details. Use <code>detailTemplate</code> to customize the detail view.
      </p>
      <PantanalGrid
        :rows="detailRows"
        :columns="detailColumns"
        key-field="id"
        :detail-template="detailTemplate"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Footer Template (Aggregates) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Footer Template (Aggregates)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Show aggregate values in column footers using <code>footerTemplate</code> and <code>aggregates</code>.
      </p>
      <PantanalGrid
        :rows="footerRows"
        :columns="footerColumns"
        key-field="id"
        :show-footer="true"
        :height="250"
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









