---
title: MessagesProps API
description: "API Index | MessagesProps"
api_reference: true
slug: api_pager_messagesprops
---

# MessagesProps

Complete reference for all customizable messages in the Pager component.

## Overview

The Pager component supports comprehensive message customization through the `messages` prop. All pagination-related messages can be customized to match your application's locale or branding requirements.

## Available Messages

### pageable-display `String`

The information text of the Pager. Contains placeholders for dynamic content.

**Format:** `"Showing {0}-{1} of {2} items"`

**Placeholders:**
- `{0}` - The index of the first data item (1-based)
- `{1}` - The index of the last data item (1-based)
- `{2}` - The total number of data items

**Default (en):** `"Showing {0}-{1} of {2} items"`

**Example:**
```typescript
{
  pageableDisplay: 'Displaying {0} to {1} of {2} products'
}
// Output: "Displaying 1 to 20 of 100 products"
```

### pageable-empty `String`

The text that is displayed when the DataSource view does not contain items.

**Default (en):** `"No items to display"`

**Example:**
```typescript
{
  pageableEmpty: 'No data available'
}
```

### pageable-page `String`

The label that is displayed before the Pager input.

**Default (en):** `"Page"`

**Example:**
```typescript
{
  pageablePage: 'Página'
}
```

### pageable-of `String`

The label that is displayed after the page number input. Contains a placeholder for the total number of pages.

**Format:** `"of {0}"`

**Placeholder:**
- `{0}` - The total number of pages

**Default (en):** `"of {0}"`

**Example:**
```typescript
{
  pageableOf: 'of {0} pages'
}
// Output: "of 10 pages"
```

### pageable-items-per-page `String`

The label that is displayed after the page size drop-down list.

**Default (en):** `"items per page"`

**Example:**
```typescript
{
  pageableItemsPerPage: 'itens por página'
}
```

### pageable-first `String`

The tooltip of the button which navigates to the first page.

**Default (en):** `"First page"`

**Example:**
```typescript
{
  pageableFirst: 'Primeira página'
}
```

### pageable-last `String`

The tooltip of the button which navigates to the last page.

**Default (en):** `"Last page"`

**Example:**
```typescript
{
  pageableLast: 'Última página'
}
```

### pageable-previous `String`

The tooltip of the button which navigates to the previous page.

**Default (en):** `"Previous page"`

**Example:**
```typescript
{
  pageablePrevious: 'Página anterior'
}
```

### pageable-next `String`

The tooltip of the button which navigates to the next page.

**Default (en):** `"Next page"`

**Example:**
```typescript
{
  pageableNext: 'Próxima página'
}
```

### pageable-refresh `String`

The tooltip of the **Refresh** button.

**Default (en):** `"Refresh"`

**Example:**
```typescript
{
  pageableRefresh: 'Atualizar'
}
```

### pageable-more-pages `String`

The tooltip of the ellipsis button that appears when there are more pages to display.

**Default (en):** `"More pages"`

**Example:**
```typescript
{
  pageableMorePages: 'Mais páginas'
}
```

### pageable-custom `String`

The text that is displayed for the item which represents the custom page size option when `custom-page-size` is enabled.

**Default (en):** `"Custom"`

**Example:**
```typescript
{
  pageableCustom: 'Personalizado'
}
```

### pageable-cancel `String`

The text that is displayed on the cancel button when using custom page size input.

**Default (en):** `"Cancel"`

**Example:**
```typescript
{
  pageableCancel: 'Cancelar'
}
```

## Complete Message Interface

```typescript
interface Messages {
  // Pagination messages
  pageableDisplay?: string    // "Showing {0}-{1} of {2} items"
  pageableEmpty?: string      // "No items to display"
  pageablePage?: string       // "Page"
  pageableOf?: string         // "of {0}"
  pageableItemsPerPage?: string  // "items per page"
  pageableFirst?: string      // "First page"
  pageableLast?: string       // "Last page"
  pageablePrevious?: string   // "Previous page"
  pageableNext?: string       // "Next page"
  pageableRefresh?: string    // "Refresh"
  pageableMorePages?: string  // "More pages"
  pageableCustom?: string     // "Custom"
  pageableCancel?: string     // "Cancel"
  
  // ... other messages
}
```

## Usage

### Through Component Props

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
  pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'itens por página',
  pageableFirst: 'Primeira página',
  pageableLast: 'Última página',
  pageablePrevious: 'Anterior',
  pageableNext: 'Próxima',
  pageableRefresh: 'Atualizar',
  pageableMorePages: 'Mais páginas',
  pageableCustom: 'Personalizado',
  pageableCancel: 'Cancelar'
}
</script>
```

### Through Locale Configuration

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

### Through Grid Component

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
  // ... other messages
}
</script>
```

## Message Placeholders

### pageableDisplay

The `pageableDisplay` message supports three placeholders:

- `{0}` - First item index (1-based)
- `{1}` - Last item index (1-based)
- `{2}` - Total items

**Examples:**
```typescript
// English
pageableDisplay: 'Showing {0}-{1} of {2} items'
// Output: "Showing 1-20 of 100 items"

// Portuguese
pageableDisplay: 'Exibindo {0} a {1} de {2} itens'
// Output: "Exibindo 1 a 20 de 100 itens"

// Spanish
pageableDisplay: 'Mostrando {0} a {1} de {2} elementos'
// Output: "Mostrando 1 a 20 de 100 elementos"

// Custom format
pageableDisplay: 'Displaying {0} to {1} of {2} products'
// Output: "Displaying 1 to 20 of 100 products"
```

### pageableOf

The `pageableOf` message supports one placeholder:

- `{0}` - Total pages

**Examples:**
```typescript
// English
pageableOf: 'of {0}'
// Output: "of 10"

// Portuguese
pageableOf: 'de {0}'
// Output: "de 10"

// Spanish
pageableOf: 'de {0}'
// Output: "de 10"

// Custom format
pageableOf: 'of {0} pages'
// Output: "of 10 pages"
```

## Built-in Locales

Pantanal Grid includes three built-in locales with all pagination messages pre-configured:

### English (en)

```typescript
{
  pageableDisplay: 'Showing {0}-{1} of {2} items',
  pageableEmpty: 'No items to display',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'items per page',
  pageableFirst: 'First page',
  pageableLast: 'Last page',
  pageablePrevious: 'Previous page',
  pageableNext: 'Next page',
  pageableRefresh: 'Refresh',
  pageableMorePages: 'More pages',
  pageableCustom: 'Custom',
  pageableCancel: 'Cancel'
}
```

### Portuguese (pt)

```typescript
{
  pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
  pageableEmpty: 'Nenhum item para exibir',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'itens por página',
  pageableFirst: 'Primeira página',
  pageableLast: 'Última página',
  pageablePrevious: 'Página anterior',
  pageableNext: 'Próxima página',
  pageableRefresh: 'Atualizar',
  pageableMorePages: 'Mais páginas',
  pageableCustom: 'Personalizado',
  pageableCancel: 'Cancelar'
}
```

### Spanish (es)

```typescript
{
  pageableDisplay: 'Mostrando {0}-{1} de {2} elementos',
  pageableEmpty: 'No hay elementos para mostrar',
  pageablePage: 'Página',
  pageableOf: 'de {0}',
  pageableItemsPerPage: 'elementos por página',
  pageableFirst: 'Primera página',
  pageableLast: 'Última página',
  pageablePrevious: 'Página anterior',
  pageableNext: 'Página siguiente',
  pageableRefresh: 'Actualizar',
  pageableMorePages: 'Más páginas',
  pageableCustom: 'Personalizado',
  pageableCancel: 'Cancelar'
}
```

## Complete Example

```vue
<template>
  <PantanalPagination
    :page="page"
    :page-size="pageSize"
    :total="total"
    locale="pt"
    :messages="{
      pageableDisplay: 'Exibindo {0} a {1} de {2} itens',
      pageableEmpty: 'Nenhum item para exibir',
      pageablePage: 'Página',
      pageableOf: 'de {0}',
      pageableItemsPerPage: 'itens por página',
      pageableFirst: 'Primeira',
      pageableLast: 'Última',
      pageablePrevious: 'Anterior',
      pageableNext: 'Próxima',
      pageableRefresh: 'Atualizar',
      pageableMorePages: 'Mais páginas',
      pageableCustom: 'Personalizado',
      pageableCancel: 'Cancelar'
    }"
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
</script>
```

## See Also

- [Pager API](/api/pager) - Complete Pager component reference
- [Messages API](/api/messages) - All messages reference
- [Internationalization Guide](/guide/i18n) - Complete i18n guide

