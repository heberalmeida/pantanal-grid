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

## Messages Configuration

The pagination component supports comprehensive message customization through the `messages` prop. All pagination-related messages can be customized to match your application's locale or branding requirements.

### Available Messages

| Property | Type | Default (en) | Description |
|----------|------|--------------|-------------|
| `pageableDisplay` | `string` | `"Showing {0}-{1} of {2} items"` | The information text displayed in the pagination footer. Contains placeholders: `{0}` (first item index), `{1}` (last item index), `{2}` (total items) |
| `pageableEmpty` | `string` | `"No items to display"` | The text displayed when the DataSource view does not contain items |
| `pageablePage` | `string` | `"Page"` | The label displayed before the page number input |
| `pageableOf` | `string` | `"of {0}"` | The label displayed after the page number input. Contains placeholder `{0}` (total pages) |
| `pageableItemsPerPage` | `string` | `"items per page"` | The label displayed after the page size drop-down list |
| `pageableFirst` | `string` | `"First page"` | The tooltip of the button which navigates to the first page |
| `pageableLast` | `string` | `"Last page"` | The tooltip of the button which navigates to the last page |
| `pageablePrevious` | `string` | `"Previous page"` | The tooltip of the button which navigates to the previous page |
| `pageableNext` | `string` | `"Next page"` | The tooltip of the button which navigates to the next page |
| `pageableRefresh` | `string` | `"Refresh"` | The tooltip of the **Refresh** button |
| `pageableMorePages` | `string` | `"More pages"` | The tooltip of the ellipsis button that appears when there are more pages to display |
| `pageableCustom` | `string` | `"Custom"` | The text displayed for the item which represents the custom page size option |
| `pageableCancel` | `string` | `"Cancel"` | The text displayed on the cancel button when using custom page size |

### Message Placeholders

Some messages support placeholders for dynamic content:

#### pageableDisplay

Format: `"Showing {0}-{1} of {2} items"`

- `{0}` - The index of the first data item (1-based)
- `{1}` - The index of the last data item (1-based)
- `{2}` - The total number of data items

**Example:**
```typescript
{
  pageableDisplay: 'Displaying {0} to {1} of {2} products'
}
// Output: "Displaying 1 to 20 of 100 products"
```

#### pageableOf

Format: `"of {0}"`

- `{0}` - The total number of pages

**Example:**
```typescript
{
  pageableOf: 'of {0} pages'
}
// Output: "of 10 pages"
```

### Customizing Messages

You can customize pagination messages in several ways:

#### 1. Through Grid Component

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :messages="customMessages"
  />
</template>

<script setup>
import { PantanalGrid } from '@pantanal/grid'

const customMessages = {
  pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'itens por página',
  pageableFirst: 'Primeira página',
  pageableLast: 'Última página',
  pageablePrevious: 'Página anterior',
  pageableNext: 'Próxima página',
  pageableRefresh: 'Atualizar'
}
</script>
```

#### 2. Through Locale Configuration

```typescript
import { registerLocale } from '@pantanal/grid'
import type { Messages } from '@pantanal/grid'

const portugueseMessages: Messages = {
  // ... other messages
  pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
  pageableEmpty: 'Nenhum item para exibir',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'itens por página',
  pageableFirst: 'Primeira página',
  pageableLast: 'Última página',
  pageableNext: 'Próxima página',
  pageablePrevious: 'Página anterior',
  pageableRefresh: 'Atualizar',
  pageableMorePages: 'Mais páginas',
  pageableCustom: 'Personalizado',
  pageableCancel: 'Cancelar'
}

registerLocale('pt', portugueseMessages)
```

#### 3. Through Pagination Component (Standalone)

```vue
<template>
  <PantanalPagination
    :page="page"
    :page-size="pageSize"
    :total="total"
    :messages="customMessages"
    @update:page="page = $event"
    @update:page-size="pageSize = $event"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalPagination } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(20)
const total = ref(100)

const customMessages = {
  pageableDisplay: 'Showing {0} to {1} of {2}',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'per page'
}
</script>
```

### Built-in Locales

Pantanal Grid includes three built-in locales with all pagination messages pre-configured:

- **English (`en`)** - Default locale
- **Spanish (`es`)** - Español
- **Portuguese (`pt`)** - Português

### Complete Message Example

```typescript
import type { Messages } from '@pantanal/grid'

const completePaginationMessages: Partial<Messages> = {
  // Display information
  pageableDisplay: 'Showing {0}-{1} of {2} items',
  pageableEmpty: 'No items to display',
  
  // Page navigation labels
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  
  // Page size selector
  pageableItemsPerPage: 'items per page',
  pageableCustom: 'Custom',
  pageableCancel: 'Cancel',
  
  // Navigation buttons
  pageableFirst: 'First page',
  pageableLast: 'Last page',
  pageablePrevious: 'Previous page',
  pageableNext: 'Next page',
  
  // Additional controls
  pageableRefresh: 'Refresh',
  pageableMorePages: 'More pages'
}
```

## See Also

- [Pagination Guide](/guide/pagination) - Complete pagination guide
- [PantanalGrid API](/api/grid) - Main component reference
- [Server-Side Mode Guide](/guide/server-side) - Server-side pagination
- [Messages API](/api/messages) - Complete messages reference

