# Pantanal Grid (Vue 3 + Tailwind)

A feature-rich data grid for **Vue 3** applications. Pantanal Grid ships with a Vite/Tailwind playground, supports both client-side and server-side data flows, exposes a typed API, and includes quality-of-life features such as keyboard navigation, persisted state, virtual scrolling, grouping, and internationalization.

👉 **Live demo:** [https://heberalmeida.github.io/pantanal-grid/](https://heberalmeida.github.io/pantanal-grid/)

---

## Repository layout

```
pantanal-grid/
├─ packages/
│  └─ pantanal-grid       # source code of the published @pantanal/grid package
└─ playground/            # Vite + Vue 3 playground showcasing usage scenarios
```

## Requirements

- **Node.js** ≥ 18
- **Yarn Classic** (v1) with workspaces enabled

---

## Quick start (local development)

```bash
git clone https://github.com/heberalmeida/pantanal-grid.git
cd pantanal-grid
yarn                # install dependencies
yarn dev            # launches the playground at http://localhost:5173
```

The playground aliases `@pantanal/grid` to the local source, so every change you make to the package is reflected live.

### Additional scripts

```bash
yarn test           # executes vitest on the library workspace
yarn build          # builds the library (vite) and type definitions (vue-tsc)
yarn workspace pantanal-grid-playground build   # builds the playground itself
yarn workspace @pantanal/grid lint              # run eslint (if configured)
```

---

## Consuming the library in your project

Install the package together with the required peer dependencies:

```bash
yarn add @pantanal/grid
yarn add vue@^3                                    # if Vue is not yet installed
yarn add -D tailwindcss postcss autoprefixer       # optional but recommended for styling
```

Import the default stylesheet once in your application entry point:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@pantanal/grid/styles.css'

createApp(App).mount('#app')
```

Minimal usage example:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = [
  { id: 1, name: 'Alpha', price: 9.9 },
  { id: 2, name: 'Beta', price: 19.5 }
]

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true }
]
</script>

<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
</template>
```

---

## Core capabilities

- Sorting (multi-column) with ascending/descending cycles
- Per-column filtering with multiple operators
- Row selection: single, multiple, or disabled
- Client-side pagination + server-side mode (`:serverSide="true"`)
- Column resize and reorder (drag & drop)
- Keyboard navigation (arrow keys + focus outline)
- Virtual scroll for large datasets
- Pinned and locked columns (left/right) with optional sticky shadows
- Persisted state (sort, filter, page, order, widths) via `persistStateKey`
- Internationalization (en, es, pt) with pluggable messages
- Grouping with aggregations and expandable tree nodes

---

## Internationalization

```vue
<PantanalGrid locale="pt" />
<PantanalGrid locale="en" />
<PantanalGrid locale="es" />

<PantanalGrid
  locale="en"
  :messages="{ next: 'Next »', previous: '« Prev', rowsPerPage: 'Rows per page' }"
/>
```

You can register additional locales by calling `registerLocale(code, messages)` from the package.

---

## Messages Props

The Grid supports customizable messages for all UI elements. You can customize toolbar buttons, command buttons, and other messages through the `messages` prop.

### Toolbar Messages

Customize toolbar button messages using `messages.create`, `messages.save`, `messages.cancel`, and `messages.excel`:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const messages: Partial<Messages> = {
  create: 'Add New',
  save: 'Save All',
  cancel: 'Discard Changes',
  excel: 'Export Data',
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :toolbar="['create', 'save', 'cancel', 'excel']"
    :messages="messages"
  />
</template>
```

### Command Messages

Customize command button messages using `messages.edit`, `messages.update`, `messages.destroy`, and `messages.cancelEdit`:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'command', title: 'Actions', width: 150, command: ['edit', 'destroy'] },
]

const messages: Partial<Messages> = {
  edit: 'Modify',
  update: 'Confirm',
  destroy: 'Remove',
  cancelEdit: 'Undo',
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :editable="true"
    :messages="messages"
  />
</template>
```

### No Records Message

Customize the "no records" message using `messages.noRecords`:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const messages: Partial<Messages> = {
  noRecords: 'No products found. Please try a different search.',
}
</script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="true"
    :messages="messages"
  />
</template>
```

### Expand Collapse Column Header

Customize the expand/collapse column header message using `messages.expandCollapseColumnHeader` when using master-detail templates:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const detailTemplate = (row: Product) => {
  return `<div style="padding: 1rem;">
    <h3>Product Details</h3>
    <p><strong>Category:</strong> ${row.category}</p>
    <p><strong>Unit Price:</strong> $${row.unitPrice}</p>
  </div>`
}

const messages: Partial<Messages> = {
  expandCollapseColumnHeader: 'Details',
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :detail-template="detailTemplate"
    :messages="messages"
  />
</template>
```

### Available Message Properties

- `messages.create` - Text for the "Create" button in the toolbar
- `messages.save` - Text for the "Save" button in the toolbar
- `messages.cancel` - Text for the "Cancel" button in the toolbar
- `messages.excel` - Text for the "Export to Excel" button in the toolbar
- `messages.edit` - Text for the "Edit" button in command columns
- `messages.update` - Text for the "Update" button when editing (replaces "Save" in edit mode)
- `messages.destroy` - Text for the "Delete" button in command columns
- `messages.cancelEdit` - Text for the "Cancel" button when editing (replaces "Cancel" in edit mode)
- `messages.noRecords` - Text displayed when no records are available
- `messages.expandCollapseColumnHeader` - Text for the expand/collapse column header (when using master-detail)

### Notes

- All message properties are optional. If not provided, default messages will be used based on the current locale.
- Messages can be customized per grid instance or globally using the `messages` prop.
- The `messages` prop accepts a `Partial<Messages>` object, so you only need to specify the messages you want to customize.

---

## No Records Props

The Grid supports customizable templates for rendering when the current view contains no records. You can customize the no records display using the `noRecords` prop.

### Default No Records Message

By default, the Grid displays a message when no records are available. Use `noRecords: true` to enable the default message:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="true"
    :height="300"
  />
</template>
```

### Custom No Records Message

Customize the no records message using `noRecords: { message: '...' }`:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="{ message: 'No products found. Please try adjusting your filters or search criteria.' }"
    :height="300"
  />
</template>
```

### No Records Template (String)

Customize the no records display using an HTML template string:

```vue
<script setup lang="ts">
const templateString = '<div style="padding: 2rem; text-align: center;"><div style="font-size: 3rem; margin-bottom: 1rem;">📦</div><div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Products Found</div><div style="color: #6b7280;">Try adjusting your search or filter criteria.</div></div>'
</script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="{ template: templateString }"
    :height="300"
  />
</template>
```

### No Records Template (Function)

Use a function to generate the no records template dynamically:

```vue
<script setup lang="ts">
const templateFunction = () => {
  const timestamp = new Date().toLocaleString()
  return `<div style="padding: 2rem; text-align: center;">
    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
    <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Products Available</div>
    <div style="color: #6b7280; margin-bottom: 1rem;">The product catalog is currently empty.</div>
    <div style="font-size: 0.875rem; color: #9ca3af;">Last checked: ${timestamp}</div>
  </div>`
}
</script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="{ template: templateFunction }"
    :height="300"
  />
</template>
```

### No Records Template (Direct)

You can also pass a template string or function directly:

```vue
<script setup lang="ts">
// Direct string template
const directTemplate = '<div style="padding: 2rem; text-align: center; color: #6b7280;"><strong>No data available</strong></div>'

// Direct function template
const directTemplateFunction = () => {
  return '<div style="padding: 2rem; text-align: center;"><div style="font-size: 2rem; margin-bottom: 1rem;">🚫</div><div style="font-weight: 600;">No records to display</div></div>'
}
</script>

<template>
  <!-- Using string directly -->
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="directTemplate"
    :height="300"
  />
  
  <!-- Using function directly -->
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="directTemplateFunction"
    :height="300"
  />
</template>
```

### Disable No Records

Disable the no records message by setting `noRecords: false`:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="false"
    :height="300"
  />
</template>
```

### Available noRecords Prop Values

- `noRecords: true` - Enable default message (uses `messages.noRecords`)
- `noRecords: false` - Disable no records message
- `noRecords: string` - Use string as HTML template
- `noRecords: () => string` - Use function to generate HTML template
- `noRecords: { message: string }` - Use custom message text
- `noRecords: { template: string }` - Use string as HTML template
- `noRecords: { template: () => string }` - Use function to generate HTML template

### Notes

- Templates are rendered as HTML using `v-html`, so you can use any HTML markup.
- If no template is provided and `noRecords` is `true`, the default message from `messages.noRecords` is used.
- The template function is called whenever the grid needs to render the no records message.
- You can combine templates with custom messages for more flexibility.

---

## Virtual scroll

Enable `:virtual="true"` to render only the visible portion of the grid. Control the viewport height and row height to fine-tune performance:

```vue
<PantanalGrid
  :rows="items"
  :columns="columns"
  :virtual="true"
  :height="420"
  :row-height="44"
/>
```

---

## Grouping & aggregations

Pantanal Grid supports multi-level grouping with optional aggregations and group footers. The following example groups products by category and brand while calculating counts and sums:

```vue
<script setup lang="ts">
import { PantanalGrid, type GroupDescriptor } from '@pantanal/grid'
import '@pantanal/grid/styles.css'

const rows = [
  { id: 1, title: 'Wireless Earbuds', brand: 'Aurora', category: 'audio', price: 129.99 },
  { id: 2, title: 'Desk Lamp', brand: 'Neon', category: 'lighting', price: 49.99 },
  // ...
]

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', filterable: true },
  { field: 'brand', title: 'Brand', filterable: true },
  { field: 'category', title: 'Category', filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v:number) => `$ ${v.toFixed(2)}` }
]

const group: GroupDescriptor[] = [
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
]

const aggregates = { price: ['sum', 'avg'], id: ['count'] } as const
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :group="group"
    :aggregates="aggregates"
    :showGroupFooters="true"
    :pageSize="10"
    :height="520"
  />
</template>
```

### Tips

- Group headers render full-width rows with the field/value and aggregate count.
- Use the built-in footer buttons (or `toggleGroup` event) to expand/collapse all groups at once.
- For server-side grouping, compute aggregates on the backend and feed the grid with pre-grouped rows.

---

## Server-side mode

When `:serverSide="true"` is set (or a `dataProvider` is provided), the grid stops mutating its local rows and instead emits the current sort/filter/page model. Bind to those events and fetch data from your API:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :serverSide="true"
  :total="total"
  v-model:sort="sort"
  v-model:filter="filter"
  v-model:page="page"
  v-model:pageSize="pageSize"
  @loading="isLoading = $event"
/>
```

Alternatively, pass a `dataProvider` function that returns `{ rows, total }` and Pantanal Grid will handle pagination requests and loading state automatically.

---

## Events

Pantanal Grid emits the following events for integration with parent components:

- `update:sort`, `update:page`, `update:pageSize`, `update:filter` — v-model bindings
- `selectionChange` — array of key values for selected rows
- `columnResize` — `{ field, width }`
- `columnReorder` — `{ from, to }`
- `toggleGroup` — `(key, expanded)`
- `rowClick` — emits the clicked row
- `loading` — boolean flag around asynchronous data-provider calls

---

## Contributing

| Task                     | Command                                               |
|--------------------------|--------------------------------------------------------|
| Install dependencies     | `yarn`                                                 |
| Run playground           | `yarn dev`                                             |
| Build library            | `yarn build`                                           |
| Run tests                | `yarn test`                                            |
| Format / lint            | `yarn workspace @pantanal/grid lint`                   |
| Prepare release          | `yarn changeset` then `yarn changeset version`         |

Pull requests and issues are welcome. Please ensure code is linted and tested before submitting.

---

## License

[MIT](LICENSE)
