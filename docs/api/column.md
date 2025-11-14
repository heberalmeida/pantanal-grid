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

```vue
<PantanalColumn 
  field="status" 
  title="Status"
  :template="statusTemplate"
/>
```

## Notes

- `PantanalColumn` is an alternative to the `columns` array prop
- Both approaches are equivalent and can be mixed
- Use whichever approach fits your coding style better





