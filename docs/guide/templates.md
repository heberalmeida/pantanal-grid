# Templates

Pantanal Grid provides extensive template support for customizing the appearance and behavior of cells, headers, footers, and rows.

## Cell Templates

Customize cell rendering using the `template` property:

```vue
<script setup lang="ts">
import { h } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'status',
    title: 'Status',
    template: ({ value }) => {
      return h('span', {
        class: value === 'active' ? 'text-green-500' : 'text-red-500'
      }, value)
    }
  }
]
</script>
```

### String Template

Use HTML string templates:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    template: ({ value }) => `<strong class="text-blue-600">$${value.toFixed(2)}</strong>`
  }
]
</script>
```

### Function Template

Use function templates for dynamic content:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'rating',
    title: 'Rating',
    template: ({ value, row }) => {
      const stars = '⭐'.repeat(Math.floor(value))
      return `<div>${stars} (${value}/5)</div>`
    }
  }
]
</script>
```

## Header Templates

Customize column headers:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    headerTemplate: (column) => `<div class="font-bold text-blue-600">${column.title}</div>`
  }
]
</script>
```

## Footer Templates

Customize footer cells (for aggregates):

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    footerTemplate: (aggregates) => {
      const sum = aggregates.price_sum || 0
      const avg = aggregates.price_avg || 0
      return `<div>Sum: $${sum.toFixed(2)} | Avg: $${avg.toFixed(2)}</div>`
    }
  }
]
</script>
```

## Group Header Templates

Customize group headers:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    groupHeaderTemplate: (group) => {
      return `<div class="font-bold">
        ${group.field}: ${group.value} 
        <span class="text-gray-500">(${group.items.length} items)</span>
      </div>`
    }
  }
]
</script>
```

## Group Footer Templates

Customize group footers:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    groupFooterTemplate: (group) => {
      const sum = group.aggregates?.price_sum || 0
      return `<div class="font-semibold">Total: $${sum.toFixed(2)}</div>`
    }
  }
]
</script>
```

## Row Templates

Customize entire rows:

```vue
<script setup lang="ts">
const rowTemplate = (row: any, rowIndex: number) => {
  return `
    <tr class="${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
      <td>${row.id}</td>
      <td class="font-bold">${row.name}</td>
      <td>$${row.price.toFixed(2)}</td>
    </tr>
  `
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :row-template="rowTemplate"
  />
</template>
```

## Detail Template (Master-Detail)

Add expandable detail rows:

```vue
<script setup lang="ts">
const detailTemplate = (row: any) => {
  return `
    <div class="p-4 bg-gray-50">
      <h3 class="font-bold">Details</h3>
      <p>Category: ${row.category}</p>
      <p>Stock: ${row.stock}</p>
      <p>Description: ${row.description}</p>
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
  />
</template>
```

## Using Slots

Use Vue slots for more complex templates:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  >
    <template #cell="{ column, row, value }">
      <div v-if="column.field === 'status'">
        <span :class="value === 'active' ? 'text-green-500' : 'text-red-500'">
          {{ value }}
        </span>
      </div>
      <div v-else>{{ value }}</div>
    </template>
  </PantanalGrid>
</template>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { 
    id: 1, 
    name: 'Product A', 
    price: 29.99, 
    category: 'Electronics',
    status: 'active',
    rating: 4.5,
    stock: 150
  },
  { 
    id: 2, 
    name: 'Product B', 
    price: 49.99, 
    category: 'Clothing',
    status: 'inactive',
    rating: 3.8,
    stock: 75
  }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'name',
    title: 'Name',
    headerTemplate: (col) => `<div class="font-bold">${col.title}</div>`
  },
  {
    field: 'price',
    title: 'Price',
    template: ({ value }) => `<strong class="text-blue-600">$${value.toFixed(2)}</strong>`
  },
  {
    field: 'status',
    title: 'Status',
    template: ({ value }) => {
      const color = value === 'active' ? 'green' : 'red'
      return `<span class="text-${color}-500 font-semibold">${value}</span>`
    }
  },
  {
    field: 'rating',
    title: 'Rating',
    template: ({ value }) => {
      const stars = '⭐'.repeat(Math.floor(value))
      return `<div>${stars} ${value}/5</div>`
    }
  }
]

const detailTemplate = (row: any) => {
  return `
    <div style="padding: 1rem; background: #f3f4f6;">
      <h3 style="font-weight: bold; margin-bottom: 0.5rem;">Product Details</h3>
      <p><strong>Category:</strong> ${row.category}</p>
      <p><strong>Stock:</strong> ${row.stock}</p>
      <p><strong>Price:</strong> $${row.price.toFixed(2)}</p>
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
  />
</template>
```

## Tips

- Use templates for custom formatting and styling
- Templates can return Vue components, HTML strings, or use render functions
- Use slots for complex interactive templates
- Detail templates are great for showing additional information
- Group templates help visualize hierarchical data
- Footer templates are useful for displaying aggregates








