# Aggregates

Pantanal Grid supports aggregate calculations (sum, avg, min, max, count) displayed in group footers or column footers.

<ExamplePreview>
  <AggregatesCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import AggregatesCompleteExample from './components/AggregatesCompleteExample.vue'
import AggregatesExample from './components/AggregatesExample.vue'
</script>

## Basic Aggregates

<ExamplePreview>
  <AggregatesExample />
</ExamplePreview>

Calculate aggregates for numeric fields:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, stock: 25 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :aggregates="aggregates"
  />
</template>
```

## Group Footers with Aggregates

Display aggregates in group footer rows:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Clothing', price: 19.99, stock: 25 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
  />
</template>
```

## Custom Group Footer Templates

Customize how aggregates are displayed:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    format: (v: number) => `$${v.toFixed(2)}`,
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        const sum = priceAgg.sum ?? 0
        const avg = priceAgg.avg ?? 0
        return `<strong style="color: #3b82f6;">Total: $${sum.toFixed(2)} | Avg: $${avg.toFixed(2)}</strong>`
      }
      return ''
    }
  },
  { 
    field: 'stock', 
    title: 'Stock',
    aggregates: ['sum', 'min', 'max'],
    groupFooterTemplate: (group) => {
      const stockAgg = group.aggregates?.stock
      if (stockAgg) {
        return `Sum: ${stockAgg.sum} | Min: ${stockAgg.min} | Max: ${stockAgg.max}`
      }
      return ''
    }
  }
]
</script>
```

## Column-Level Aggregates

Define aggregates per column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],  // Column-level aggregates
    format: (v: number) => `$${v.toFixed(2)}`
  },
  { 
    field: 'stock', 
    title: 'Stock',
    aggregates: ['sum', 'min', 'max']
  }
]
</script>
```

## All Aggregate Types

Use all available aggregate functions:

```vue
<script setup lang="ts">
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg', 'min', 'max'],
  stock: ['sum', 'avg', 'min', 'max', 'count'],
  id: ['count']
}
</script>
```

## Multi-Level Grouping with Aggregates

Aggregates work with multi-level grouping:

```vue
<script setup lang="ts">
const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 75 }
])

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
  />
</template>
```

## Column Footer Templates

Display aggregates in column footers (when not grouped):

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    format: (v: number) => `$${v.toFixed(2)}`,
    footerTemplate: (aggregates) => {
      const priceAgg = aggregates.price
      if (priceAgg) {
        const sum = priceAgg.sum ?? 0
        const avg = priceAgg.avg ?? 0
        return `<strong>Total: $${sum.toFixed(2)} | Avg: $${avg.toFixed(2)}</strong>`
      }
      return ''
    }
  }
]
</script>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 99.99, stock: 50, units: 10 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 100, units: 5 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 25, units: 20 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 75, units: 15 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand Z', price: 29.99, stock: 200, units: 8 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name' },
  { field: 'category', title: 'Category' },
  { field: 'brand', title: 'Brand' },
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    format: (v: number) => `$${v.toFixed(2)}`,
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        return `Sum: $${(priceAgg.sum ?? 0).toFixed(2)} | Avg: $${(priceAgg.avg ?? 0).toFixed(2)}`
      }
      return ''
    }
  },
  { 
    field: 'stock', 
    title: 'Stock',
    aggregates: ['sum', 'min', 'max'],
    groupFooterTemplate: (group) => {
      const stockAgg = group.aggregates?.stock
      if (stockAgg) {
        return `Sum: ${stockAgg.sum} | Min: ${stockAgg.min} | Max: ${stockAgg.max}`
      }
      return ''
    }
  },
  { 
    field: 'units', 
    title: 'Units',
    aggregates: ['count'],
    groupFooterTemplate: (group) => {
      const unitsAgg = group.aggregates?.units
      if (unitsAgg) {
        return `Count: ${unitsAgg.count}`
      }
      return ''
    }
  }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum', 'min', 'max'],
  units: ['count'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
    locale="en"
    responsive="table"
  />
</template>
```

## Aggregate Functions Reference

### sum
Calculates the sum of all numeric values in a field.

```vue
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum']
}
```

### avg
Calculates the average (mean) of all numeric values in a field.

```vue
const aggregates: Record<string, AggregateName[]> = {
  price: ['avg']
}
```

### min
Finds the minimum value in a field.

```vue
const aggregates: Record<string, AggregateName[]> = {
  price: ['min']
}
```

### max
Finds the maximum value in a field.

```vue
const aggregates: Record<string, AggregateName[]> = {
  price: ['max']
}
```

### count
Counts the number of items (works with any data type).

```vue
const aggregates: Record<string, AggregateName[]> = {
  id: ['count']
}
```

## Use Cases

### Financial Summary

```vue
const aggregates: Record<string, AggregateName[]> = {
  revenue: ['sum'],
  cost: ['sum'],
  profit: ['sum', 'avg']
}
```

### Inventory Management

```vue
const aggregates: Record<string, AggregateName[]> = {
  stock: ['sum', 'min', 'max'],
  units: ['count'],
  price: ['avg']
}
```

### Sales Analysis

```vue
const aggregates: Record<string, AggregateName[]> = {
  sales: ['sum', 'avg'],
  quantity: ['sum', 'count'],
  price: ['min', 'max', 'avg']
}
```

## See Also

- [Aggregates API](/api/aggregates) - Complete API reference
- [Grouping Guide](/guide/grouping) - Grouping documentation
- [Grouping Examples](/examples/grouping) - More grouping examples

