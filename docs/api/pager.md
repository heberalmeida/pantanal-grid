---
title: Pager API
description: "API Index | Pager"
api_reference: true
slug: api_pagercomponent
---

# Pager

The Pager component provides comprehensive pagination functionality for managing large datasets. It can be used standalone or integrated with the Pantanal Grid component.

## Component

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

## Props

### page `Number` (v-model)

The current page number. The page is 1-based (starts at 1).

**Required:** Yes

**Example:**
```vue
<PantanalPagination
  v-model:page="currentPage"
  :page-size="20"
  :total="100"
/>
```

### page-size `Number` (v-model)

The number of items to display per page.

**Required:** Yes

**Example:**
```vue
<PantanalPagination
  :page="1"
  v-model:page-size="itemsPerPage"
  :total="100"
/>
```

### total `Number`

The total number of items across all pages.

**Required:** Yes

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
/>
```

### variant `String`

The pagination style variant.

**Values:**
- `'simple'` (default) - Shows previous/next buttons and page size selector
- `'pages'` - Shows numeric page buttons with ellipsis
- `'edges'` - Shows first/last buttons along with previous/next

**Default:** `'simple'`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  variant="pages"
/>
```

### previous-next `Boolean`

Defines whether the Pager will display buttons for navigating to the previous or next pages.

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :previous-next="true"
/>
```

### numeric `Boolean`

Defines whether a numeric portion of the Pager will be shown. When enabled, displays page number buttons.

**Default:** `false`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :numeric="true"
/>
```

### button-count `Number`

The number of numeric page buttons to display when `numeric` is enabled or `variant` is `'pages'`.

**Default:** `5`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :numeric="true"
  :button-count="7"
/>
```

### input `Boolean`

Defines whether an input element which allows the user to navigate to a given page will be displayed.

**Default:** `false`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :input="true"
/>
```

### info `Boolean`

Defines whether the label which shows the current paging information will be displayed. Shows text like "Showing 1-20 of 100 items".

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :info="true"
/>
```

### page-sizes `Boolean | Array`

If `page-sizes` is set to `true`, the Pager will display a drop-down list which allows the user to pick a page size. By default, the drop-down list for the page size is not displayed. To override the default list, set `page-sizes` to an array of predefined page sizes.

**Values:**
- `false` - No page size selector (default)
- `true` - Shows default page sizes: `[10, 20, 50, 100]`
- `number[]` - Custom array of page sizes, e.g., `[5, 10, 25, 50, 100]`
- `(number | 'all')[]` - Array with 'all' option, e.g., `[10, 20, 50, 'all']`

**Default:** `false`

**Example:**
```vue
<!-- Default page sizes -->
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :page-sizes="true"
/>

<!-- Custom page sizes -->
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :page-sizes="[5, 10, 25, 50, 100]"
/>

<!-- With 'all' option -->
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :page-sizes="[10, 20, 50, 'all']"
/>
```

### refresh `Boolean`

Defines whether the Pager will display a **Refresh** button. Clicking the **Refresh** button will emit a `refresh` event that can be handled to reload data.

**Default:** `false`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :refresh="true"
  @refresh="handleRefresh"
/>
```

### responsive `Boolean`

Defines whether the Pager will be responsive. When enabled, the Pager adapts its layout for mobile devices.

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :responsive="true"
/>
```

### show-text `Boolean`

Defines whether text labels will be displayed on navigation buttons (e.g., "Previous", "Next").

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :show-text="true"
/>
```

### show-icons `Boolean`

Defines whether icons will be displayed on navigation buttons.

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :show-icons="true"
/>
```

### show-total `Boolean`

Defines whether the total count of items will be displayed.

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :show-total="true"
/>
```

### max-pages `Number`

The maximum number of page buttons to display (used when `variant` is `'pages'`).

**Default:** `5`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  variant="pages"
  :max-pages="7"
/>
```

### custom-page-size `Boolean`

Enables a custom page size input field, allowing users to enter any page size value.

**Default:** `false`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :page-sizes="true"
  :custom-page-size="true"
/>
```

### messages `Object`

Defines the texts that will be displayed within the Pager. Used for customization and localization of the Pager messages.

**Type:** `Partial<Messages>`

**See:** [MessagesProps API](/api/pager/messagesprops) for all available message properties.

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :messages="{
    pageablePage: 'Página',
    pageableOf: 'de {0}',
    pageableItemsPerPage: 'itens por página',
    pageableFirst: 'Primeira página',
    pageableLast: 'Última página',
    pageablePrevious: 'Anterior',
    pageableNext: 'Próxima'
  }"
/>
```

### locale `String`

The locale for the Pager messages. Available locales: `'en'`, `'pt'`, `'es'`, or any custom locale registered with `registerLocale`.

**Default:** `'en'`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  locale="pt"
/>
```

### template `String | Function`

Custom template for rendering the entire Pager. Can be a string template or a function that receives the pagination context.

**Type:** `string | ((context: PaginationTemplateContext) => string)`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :template="customTemplate"
/>

<script setup>
const customTemplate = (context) => {
  return `
    <div>
      Page ${context.page} of ${context.totalPages}
      <button @click="goPrev">Previous</button>
      <button @click="goNext">Next</button>
    </div>
  `
}
</script>
```

### mobile-breakpoint `Number`

The window width breakpoint (in pixels) at which the mobile variant will be used. Only applies when `mobile-variant` is set.

**Default:** `768`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  variant="pages"
  mobile-variant="simple"
  :mobile-breakpoint="640"
/>
```

### mobile-variant `String`

The pagination variant to use on mobile devices (when window width is below `mobile-breakpoint`).

**Values:** `'simple' | 'pages' | 'edges'`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  variant="pages"
  mobile-variant="simple"
/>
```

### dense `Boolean`

Enables dense mode, which reduces padding and spacing for a more compact appearance.

**Default:** `false`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :dense="true"
/>
```

### rtl `Boolean`

Enables right-to-left (RTL) layout direction.

**Default:** `false`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :rtl="true"
/>
```

### tailwind `Boolean`

Enables Tailwind CSS styling. Set to `false` to use custom CSS classes.

**Default:** `true`

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :tailwind="false"
/>
```

## Events

### update:page

Fires when the current page was changed.

**Payload:** `number` - The new page number

**Example:**
```vue
<PantanalPagination
  :page="currentPage"
  :page-size="20"
  :total="100"
  @update:page="currentPage = $event"
/>
```

### update:page-size

Fires when the page size was changed.

**Payload:** `number` - The new page size

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="currentPageSize"
  :total="100"
  @update:page-size="currentPageSize = $event"
/>
```

### refresh

Fires when the Refresh button is clicked. Handle this event to reload data from the data source.

**Example:**
```vue
<PantanalPagination
  :page="1"
  :page-size="20"
  :total="100"
  :refresh="true"
  @refresh="handleRefresh"
/>

<script setup>
function handleRefresh() {
  // Reload data from data source
  loadData()
}
</script>
```

## Slots

### before

Slot for content before the pagination controls.

**Props:** `context: PaginationTemplateContext`

**Example:**
```vue
<PantanalPagination :page="1" :page-size="20" :total="100">
  <template #before="{ context }">
    <span>Items {{ context.firstItem }}-{{ context.lastItem }} of {{ context.total }}</span>
  </template>
</PantanalPagination>
```

### after

Slot for content after the pagination controls.

**Props:** `context: PaginationTemplateContext`

**Example:**
```vue
<PantanalPagination :page="1" :page-size="20" :total="100">
  <template #after="{ context }">
    <button @click="exportData">Export</button>
  </template>
</PantanalPagination>
```

### info

Slot for custom info display.

**Props:** `context: PaginationTemplateContext`

**Example:**
```vue
<PantanalPagination :page="1" :page-size="20" :total="100">
  <template #info="{ context }">
    <div>Showing {{ context.firstItem }} to {{ context.lastItem }} of {{ context.total }}</div>
  </template>
</PantanalPagination>
```

### pageSize

Slot for custom page size selector.

**Props:** `context: PaginationTemplateContext`

**Example:**
```vue
<PantanalPagination :page="1" :page-size="20" :total="100">
  <template #pageSize="{ context }">
    <select v-model="pageSize">
      <option>10</option>
      <option>20</option>
      <option>50</option>
    </select>
  </template>
</PantanalPagination>
```

### pageInput

Slot for custom page number input.

**Props:** `context: PaginationTemplateContext`

**Example:**
```vue
<PantanalPagination :page="1" :page-size="20" :total="100">
  <template #pageInput="{ context }">
    <input type="number" :min="1" :max="context.totalPages" v-model="page" />
  </template>
</PantanalPagination>
```

### buttons

Slot for custom navigation buttons.

**Props:** `context: PaginationTemplateContext`

**Example:**
```vue
<PantanalPagination :page="1" :page-size="20" :total="100">
  <template #buttons="{ context }">
    <button @click="goToFirst">First</button>
    <button @click="goToPrevious">Previous</button>
    <button @click="goToNext">Next</button>
    <button @click="goToLast">Last</button>
  </template>
</PantanalPagination>
```

## Methods

Access methods via component ref:

```vue
<template>
  <PantanalPagination
    ref="pagerRef"
    :page="page"
    :page-size="pageSize"
    :total="total"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalPagination } from '@pantanal/grid'

const pagerRef = ref()

// The Pager component doesn't expose custom methods directly
// All functionality is handled through props and events
</script>
```

## PaginationTemplateContext

The context object provided to templates and slots:

```typescript
interface PaginationTemplateContext {
  page: number              // Current page number
  pageSize: number          // Current page size
  total: number             // Total number of items
  totalPages: number        // Total number of pages
  firstItem: number         // Index of first item on current page (1-based)
  lastItem: number          // Index of last item on current page (1-based)
  canGoPrevious: boolean    // Whether previous button should be enabled
  canGoNext: boolean        // Whether next button should be enabled
  canGoFirst: boolean       // Whether first button should be enabled
  canGoLast: boolean        // Whether last button should be enabled
  messages: Messages        // Localized messages object
}
```

## Usage Examples

### Basic Usage

```vue
<template>
  <PantanalPagination
    :page="page"
    :page-size="pageSize"
    :total="total"
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

### With Page Size Selector

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :page-sizes="[10, 20, 50, 100]"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

### With Numeric Pages

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  variant="pages"
  :numeric="true"
  :button-count="7"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

### With Refresh Button

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :refresh="true"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
  @refresh="handleRefresh"
/>

<script setup>
function handleRefresh() {
  // Reload data
  loadData()
}
</script>
```

### With Page Input

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :input="true"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

### Responsive Design

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  variant="pages"
  mobile-variant="simple"
  :mobile-breakpoint="768"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

### Custom Locale

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  locale="pt"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

### Custom Messages

```vue
<PantanalPagination
  :page="page"
  :page-size="pageSize"
  :total="total"
  :messages="{
    pageablePage: 'Página',
    pageableOf: 'de {0}',
    pageableItemsPerPage: 'itens por página',
    pageableFirst: 'Primeira',
    pageableLast: 'Última',
    pageablePrevious: 'Anterior',
    pageableNext: 'Próxima'
  }"
  @update:page="page = $event"
  @update:page-size="pageSize = $event"
/>
```

## See Also

- [MessagesProps API](/api/pager/messagesprops) - Complete messages reference
- [Pagination Guide](/guide/pagination) - Complete pagination guide
- [PantanalGrid API](/api/grid) - Grid component with integrated pagination

