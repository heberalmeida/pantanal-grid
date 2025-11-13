# Pagination API Reference

Complete API reference for pagination features in Pantanal Grid.

## Overview

Pantanal Grid provides flexible pagination options with multiple variants, server-side support, and customizable page sizes.

## Props

### Basic Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageable` | `boolean` | `true` | Enable pagination |
| `page` | `number` | `1` | Current page number (v-model) |
| `pageSize` | `number` | `20` | Number of items per page (v-model) |
| `showFooter` | `boolean` | `true` | Show pagination footer |

### Pagination Variant Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `paginationVariant` | `'simple' \| 'pages' \| 'edges'` | `'simple'` | Pagination style variant |
| `paginationShowText` | `boolean` | `true` | Show pagination text labels |
| `paginationShowIcons` | `boolean` | `true` | Show pagination icons |
| `paginationShowTotal` | `boolean` | `true` | Show total count |
| `paginationMaxPages` | `number` | `5` | Maximum number of page buttons to show |

### Advanced Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageableAlwaysVisible` | `boolean` | `true` | Always show pagination controls |
| `pageablePageSizes` | `number[] \| boolean \| (number \| 'all')[]` | `[10, 20, 50, 100]` | Available page sizes |
| `pageablePreviousNext` | `boolean` | `true` | Show previous/next buttons |
| `pageableNumeric` | `boolean` | `false` | Show numeric page buttons |
| `pageableButtonCount` | `number` | - | Maximum number of numeric buttons |
| `pageableInput` | `boolean` | `false` | Show page number input field |
| `pageableRefresh` | `boolean` | `false` | Show refresh button |
| `pageableResponsive` | `boolean` | `true` | Enable responsive pagination |
| `pageableInfo` | `boolean` | `true` | Show pagination info text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:page` | `number` | Emitted when page changes |
| `update:pageSize` | `number` | Emitted when page size changes |
| `refresh` | `void` | Emitted when refresh button is clicked |

## Variants

### Simple

The default variant with previous/next buttons and page size selector.

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="simple"
/>
```

### Pages

Shows numeric page buttons with ellipsis for large page counts.

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="pages"
  :pagination-max-pages="7"
/>
```

### Edges

Shows first/last page buttons along with previous/next.

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="edges"
/>
```

## Page Sizes

### Default Page Sizes

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-page-sizes="[10, 20, 50, 100]"
/>
```

### Custom Page Sizes

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-page-sizes="[5, 10, 25, 50, 100, 'all']"
/>
```

### Disable Page Size Selector

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-page-sizes="false"
/>
```

## Server-Side Pagination

When using server-side mode, pagination is handled by the server:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' }
]

const page = ref(1)
const pageSize = ref(20)

const dataProvider: DataProvider = async (args) => {
  const response = await fetch(
    `/api/data?page=${args.page}&pageSize=${args.pageSize}`
  )
  const data = await response.json()
  return {
    rows: data.items,
    total: data.total
  }
}
</script>

<template>
  <PantanalGrid
    :columns="columns"
    key-field="id"
    :data-provider="dataProvider"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>
```

## Examples

### Basic Pagination

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

### With Page Input

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-input="true"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

### With Refresh Button

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-refresh="true"
  @refresh="handleRefresh"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

### Numeric Pagination

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-numeric="true"
  :pageable-button-count="5"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

## See Also

- [Pagination Guide](/guide/pagination) - Complete pagination guide
- [PantanalGrid API](/api/grid) - Main component reference
- [Server-Side Mode Guide](/guide/server-side) - Server-side pagination

