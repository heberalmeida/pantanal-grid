# PantanalColumn API Reference

The `PantanalColumn` component is used for declarative column definitions.

## Usage

```vue
<template>
  <PantanalGrid :rows="rows" key-field="id">
    <PantanalColumn field="id" title="ID" width="80" />
    <PantanalColumn field="name" title="Name" sortable filterable />
    <PantanalColumn field="price" title="Price" format="currency" />
  </PantanalGrid>
</template>
```

## Props

All props from `ColumnDef` interface are supported. See [ColumnDef API](/api/column-def) for complete reference.

## Examples

### Basic Column

```vue
<PantanalColumn field="name" title="Name" />
```

### Sortable Column

```vue
<PantanalColumn field="price" title="Price" sortable />
```

### Filterable Column

```vue
<PantanalColumn field="category" title="Category" filterable />
```

### Editable Column

```vue
<PantanalColumn field="name" title="Name" editable />
```

### Custom Template

Using templates with `PantanalColumn` is especially convenient:

```vue
<script setup lang="ts">
import { h } from 'vue'
import { PantanalColumn, PantanalGrid, type ColumnTemplateFn } from '@pantanal/grid'

const priceTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? 0
  return h('span', { 
    style: { color: value > 50 ? 'green' : 'red', fontWeight: 'bold' } 
  }, `$${value.toFixed(2)}`)
}

const stockTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? false
  return h('span', {
    class: value ? 'text-green-600' : 'text-red-600',
    style: { fontWeight: 'bold' }
  }, value ? '✓ Yes' : '✗ No')
}
</script>

<template>
  <PantanalGrid :rows="rows" key-field="id">
    <PantanalColumn field="id" title="ID" :width="80" />
    <PantanalColumn field="name" title="Name" :width="200" />
    <PantanalColumn 
      field="price" 
      title="Price" 
      :width="120"
      :template="priceTemplate"
    />
    <PantanalColumn 
      field="inStock" 
      title="In Stock" 
      :width="100"
      :template="stockTemplate"
    />
  </PantanalGrid>
</template>
```

The template function receives a context object with:
- `column`: The column definition
- `row`: The current row data
- `value`: The cell value
- `rowIndex`: The row index
- `columnIndex`: The column index

## Notes

- `PantanalColumn` is an alternative to the `columns` array prop
- Both approaches are equivalent and can be mixed
- Use whichever approach fits your coding style better
- Templates work seamlessly with `PantanalColumn` - just pass the template function as a prop








