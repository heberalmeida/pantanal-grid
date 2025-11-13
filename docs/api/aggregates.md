---
title: Aggregates API
description: "API Index | Aggregates"
api_reference: true
slug: api_grid_aggregates
---

# Aggregates

The Pantanal Grid enables you to display aggregate calculations at the bottom of groups or columns. Aggregates provide summary statistics for your data, such as sums, averages, minimums, maximums, and counts.

## Overview

Aggregates can be displayed in:
- **Group Footers**: Summary values for each group when using grouping
- **Column Footers**: Summary values for entire columns (when not grouped)

## Aggregate Functions

The following aggregate functions are available:

### sum

Calculates the sum of numeric values in a field.

```vue
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum']
}
```

### avg

Calculates the average (mean) of numeric values in a field.

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

## Basic Usage

### Grid-Level Aggregates

Define aggregates at the grid level using the `aggregates` prop:

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
  stock: ['sum', 'min', 'max'],
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

### Column-Level Aggregates

Define aggregates per column using the `aggregates` property in column definitions:

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

## Group Footers

Display aggregates in group footer rows when using grouping:

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

## Custom Footer Templates

Customize how aggregates are displayed using footer templates:

### Group Footer Template

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
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

### Column Footer Template

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
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

## Multiple Aggregates

You can calculate multiple aggregates for the same field:

```vue
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg', 'min', 'max'],
  stock: ['sum', 'min', 'max', 'count']
}
```

## Aggregate Data Structure

Aggregates are provided to templates in the following structure:

```typescript
// For group footers
{
  field: string,
  value: any,
  items: T[],
  aggregates?: {
    [field: string]: {
      sum?: number,
      avg?: number,
      min?: number,
      max?: number,
      count?: number
    }
  }
}

// For column footers
{
  [field: string]: {
    sum?: number,
    avg?: number,
    min?: number,
    max?: number,
    count?: number
  }
}
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
    aggregates: ['count']
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

## Server-Side Aggregates

For server-side data, aggregates should be calculated on the server:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([])
const group = ref<GroupDescriptor[]>([])

watchEffect(async () => {
  const params = new URLSearchParams()
  
  if (group.value.length > 0) {
    params.append('group', JSON.stringify(group.value))
  }
  
  const response = await fetch(`/api/data?${params}`)
  const data = await response.json()
  
  // Server should return aggregates in the response
  rows.value = data.items.map((item: any) => ({
    ...item,
    // Aggregates might be included in the response
    _aggregates: item._aggregates
  }))
})
</script>
```

## Best Practices

1. **Use appropriate aggregates**: Choose aggregates that make sense for your data type
   - Numeric fields: `sum`, `avg`, `min`, `max`
   - Any field: `count`

2. **Performance**: For large datasets, consider server-side aggregation

3. **Formatting**: Use `format` functions to display aggregate values consistently

4. **Templates**: Use custom templates for better control over aggregate display

5. **Grouping**: Aggregates work best with grouping enabled

## Limitations

- Aggregates are calculated client-side by default
- For very large datasets, use server-side aggregation
- Aggregates require numeric values for `sum`, `avg`, `min`, `max`
- `count` works with any data type

## Suggested Links

* [Aggregates in Kendo UI Grid for jQuery](https://docs.telerik.com/kendo-ui/controls/data-management/grid/aggregates)
* [Grouping Guide](/guide/grouping) - Complete grouping documentation
* [Grouping Examples](/examples/grouping) - Grouping examples with aggregates
* [Grid Props API](/api/grid-props) - All grid props

