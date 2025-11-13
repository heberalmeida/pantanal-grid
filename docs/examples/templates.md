# Templates

Demonstrates custom templates for cells, headers, and detail rows.

<ExamplePreview>
  <TemplatesCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import TemplatesCompleteExample from './components/TemplatesCompleteExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', description: 'High quality product' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', description: 'Comfortable and stylish' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'name',
    title: 'Name',
    headerTemplate: (col) => `<strong>${col.title}</strong>`
  },
  {
    field: 'price',
    title: 'Price',
    template: ({ value }) => `<strong style="color: blue;">$${value.toFixed(2)}</strong>`
  },
  { field: 'category', title: 'Category' }
]

const detailTemplate = (row: any) => {
  return `
    <div style="padding: 1rem; background: #f3f4f6;">
      <h3 style="font-weight: bold;">Details</h3>
      <p><strong>Description:</strong> ${row.description}</p>
      <p><strong>Category:</strong> ${row.category}</p>
    </div>
  `
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :detail-template="detailTemplate"
    locale="en"
    responsive="table"
  />
</template>
```

## Features

- Custom cell templates
- Custom header templates
- Detail template for expandable rows

