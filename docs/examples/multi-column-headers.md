# Multi-Column Headers

Pantanal Grid supports multi-column headers by nesting column definitions, allowing you to create complex header structures.

<ExamplePreview>
  <MultiColumnHeadersCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import MultiColumnHeadersCompleteExample from './components/MultiColumnHeadersCompleteExample.vue'
</script>

## Basic Multi-Column Headers

Nest columns by using the `columns` property of a column definition:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    title: 'Product Details',
    columns: [
      { field: 'productName', title: 'Product Name', width: 200 },
      { field: 'category', title: 'Category', width: 150 },
    ]
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

## Nested Column Groups

You can nest column groups to create multiple levels of headers:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    title: 'Product Details',
    columns: [
      { field: 'productName', title: 'Product Name', width: 200 },
      {
        title: 'Pricing',
        columns: [
          { field: 'unitPrice', title: 'Unit Price', width: 120 },
          { field: 'unitsInStock', title: 'Stock', width: 100 },
        ]
      },
      { field: 'category', title: 'Category', width: 150 },
    ]
  },
  { field: 'supplier', title: 'Supplier', width: 150 },
]
</script>
```

## With Sorting and Filtering

Multi-column headers support all standard grid features. You can sort and filter by leaf columns (columns with `field` property):

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  {
    title: 'Product Details',
    columns: [
      { field: 'productName', title: 'Product Name', width: 200, sortable: true, filterable: true },
      { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
    ]
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true, filterable: true },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :show-filter-row="true"
  />
</template>
```

## With Column Menu

The column menu works with leaf columns in multi-column headers:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :column-menu="true"
  :column-menu-columns="true"
/>
```

## With Grouping

You can group by leaf columns in multi-column headers:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type GroupDescriptor } from '@pantanal/grid'

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
  />
</template>
```

## Important Notes

1. **Leaf columns only**: Only columns with a `field` property can be sorted, filtered, or grouped
2. **Header columns**: Columns without a `field` are header-only and cannot have data operations
3. **Nesting depth**: You can nest columns to any depth
4. **Column width**: Parent column width is calculated from child columns

## See Also

- [ColumnDef API](/api/column-def) - Complete column definition reference
- [Grouping Guide](/guide/grouping) - Grouping with multi-column headers




