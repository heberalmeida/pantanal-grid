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

**Data Operations**
- Sorting (multi-column) with ascending/descending cycles
- Per-column filtering with multiple operators (equals, contains, starts with, ends with, etc.)
- Row selection: single, multiple, or disabled with checkbox support
- Inline cell and row editing with validation support
- Copy to clipboard functionality
- Export to Excel, PDF, CSV, and Word (DOCX) formats

**Pagination & Scrolling**
- Client-side pagination + server-side mode (`:serverSide="true"`)
- Custom pagination variants (simple, pages, edges)
- Virtual scrolling for large datasets (100,000+ rows)
- Endless scrolling mode
- Adaptive height with custom slots

**Column Management**
- Column resize and reorder (drag & drop)
- Pinned and locked columns (left/right) with optional sticky shadows
- Multi-column headers support
- Column menu with customizable actions
- Foreign key columns with lookup support
- Custom column templates (cell, header, footer)

**Data Visualization**
- Grouping with drag-and-drop UI, aggregations and expandable tree nodes
- Aggregates (sum, avg, min, max, count) with customizable templates
- Image columns with loading states, placeholders, and error handling
- Custom row heights
- Cell, row, and column styling with conditional formatting
- Grid styles customization (striped rows, hover effects, etc.)

**User Experience**
- Keyboard navigation (arrow keys + focus outline)
- Responsive design with automatic card layout for mobile devices
- Internationalization (en, es, pt) with pluggable messages and custom locales
- RTL (Right-to-Left) language support
- Customizable messages for all UI elements
- No records customization (message, template, or function)
- Loading states with custom templates

**State Management**
- Persisted state (sort, filter, page, order, widths) via `persistStateKey`
- Grid events (rowClick, cellClick, sortChange, filterChange, etc.)
- Custom commands (edit, update, destroy, cancel)

**Data Binding**
- Flexible data binding: Local arrays, REST APIs, GraphQL, WebSocket, and offline mode
- Data source adapters (Gantt, Scheduler, TreeList, Pivot, Hierarchical)
- Custom data providers with async support

**Styling & Theming**
- Flexible styling options with CSS variables
- Tailwind CSS support
- Custom styling props (gridStyles, rowHoverStyles, cellHoverStyles)
- Template-based customization
- Customizable toolbar and command buttons

**Configuration**
- Configurable props for sortable, filterable, groupable, pageable features
- Customizable column definitions with extensive options
- TypeScript support with full type definitions

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
- `messages.pdf` - Text for the "Export to PDF" button in the toolbar
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

## Pageable Props

The Grid supports extensive pagination configuration through various `pageable` props. You can customize the pager appearance, behavior, and messages.

### Always Visible

Control whether the pager is always visible using `pageableAlwaysVisible`:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :pageable-always-visible="true"
    :height="400"
  />
</template>
```

When `pageableAlwaysVisible` is `false`, the pager will be hidden when the total number of items is less than the `pageSize` value.

### Previous/Next Buttons

Show first/last page buttons using `pageablePreviousNext`:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :pageable-previous-next="true"
    pagination-variant="edges"
    :height="400"
  />
</template>
```

### Numeric Pager

Display numeric page buttons using `pageableNumeric`:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :pageable-numeric="true"
    :pageable-button-count="5"
    :height="400"
  />
</template>
```

The `pageableButtonCount` prop controls the maximum number of buttons displayed. If more pages are available, ellipsis (`...`) will be shown.

### Page Input

Allow users to type a page number using `pageableInput`:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :pageable-input="true"
    pagination-variant="edges"
    :height="400"
  />
</template>
```

**Note:** Avoid using `pageableNumeric` and `pageableInput` at the same time.

### Refresh Button

Display a refresh button using `pageableRefresh`:

```vue
<script setup lang="ts">
function handleRefresh() {
  // Reload data or refresh the grid
  console.log('Refresh clicked')
}
</script>

<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :pageable-refresh="true"
    @refresh="handleRefresh"
    :height="400"
  />
</template>
```

### Page Sizes

Customize available page sizes using `pageablePageSizes`:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="20"
    :pageable-page-sizes="[5, 10, 20, 50, 100]"
    :height="400"
  />
</template>
```

You can also use `'all'` as a page size option to show all records:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="20"
    :pageable-page-sizes="[10, 20, 50, 'all']"
    :height="400"
  />
</template>
```

Set `pageablePageSizes` to `false` to hide the page size selector.

### Page Info

Display pagination information using `pageableInfo`:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :pageable-info="true"
    :messages="customMessages"
    :height="400"
  />
</template>
```

### Custom Messages

Customize pagination messages using the `messages` prop:

```vue
<script setup lang="ts">
const customMessages = {
  pageableDisplay: 'Displaying {0}-{1} of {2} items',
  pageableEmpty: 'No items to display',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'Items per page',
  pageableFirst: 'First',
  pageableLast: 'Last',
  pageableNext: 'Next',
  pageablePrevious: 'Previous',
  pageableRefresh: 'Refresh',
  pageableMorePages: 'More pages',
}
</script>

<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :messages="customMessages"
    :height="400"
  />
</template>
```

### Available Pageable Props

- `pageable` - Enable/disable pagination (default: `true`)
- `pageableAlwaysVisible` - Always show pager even when items < pageSize (default: `true`)
- `pageablePageSizes` - Array of page sizes or `false` to hide (default: `[10, 20, 50, 100]`)
- `pageablePreviousNext` - Show first/last page buttons (default: `true`)
- `pageableNumeric` - Show numeric page buttons (default: `false`)
- `pageableButtonCount` - Maximum number of numeric buttons (default: `5`)
- `pageableInput` - Show page number input (default: `false`)
- `pageableRefresh` - Show refresh button (default: `false`)
- `pageableResponsive` - Enable responsive pager (default: `true`)
- `pageableInfo` - Show pagination info (default: `true`)

### Notes

- The `pageableDisplay` message supports placeholders: `{0}` (first item), `{1}` (last item), `{2}` (total items).
- The `pageableOf` message supports placeholder: `{0}` (total pages).
- Avoid using `pageableNumeric` and `pageableInput` at the same time.
- The refresh button emits a `refresh` event that you can handle to reload data.

---

## Virtual scrolling

Virtual scrolling is an alternative to paging and optimizes grid performance when displaying huge volumes of data. Enable it using `scrollable-virtual`, `virtual`, or `scrollable: { virtual: true }`:

```vue
<PantanalGrid
  :rows="items"
  :columns="columns"
  scrollable-virtual
  :height="600"
  :page-size="20"
  :row-height="44"
/>
```

**Features:**
- Renders only visible rows (typically 20-50 rows)
- Smooth scrolling performance with 100,000+ records
- Works with both local and remote data
- Compatible with sorting, filtering, and inline editing
- Supports custom row heights

---

## Grouping & aggregations

Pantanal Grid supports multi-level grouping with drag-and-drop UI, optional aggregations, and group footers.

### Drag-and-Drop Grouping

Enable `groupable` to allow users to drag column headers to a drop zone for grouping:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  groupable
  key-field="id"
/>
```

**Features:**
- Drag column headers to drop zone to group by that column
- Multiple column grouping support
- Reorder groups by dragging badges
- Remove groups with × button
- Column-level control (`groupable: false` on specific columns)

### Programmatic Grouping

You can also set groups programmatically:

```vue
<script setup lang="ts">
import { PantanalGrid, type GroupDescriptor, type AggregateName } from '@pantanal/grid'
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

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  id: ['count']
}
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

### Aggregates

Calculate aggregates (sum, avg, min, max, count) for grouped or ungrouped data:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :aggregates="{ price: ['sum', 'avg'], stock: ['sum'], id: ['count'] }"
/>
```

**Features:**
- Multiple aggregate types per column
- Custom aggregate templates
- Group footers with aggregate values
- Total aggregates when not grouped
- Internationalized aggregate labels (pt, en, es)

### Tips

- Group headers render full-width rows with the field/value and aggregate count.
- Use the built-in footer buttons (or `toggleGroup` event) to expand/collapse all groups at once.
- For server-side grouping, compute aggregates on the backend and feed the grid with pre-grouped rows.

---

## PDF Export

The Grid supports exporting data to PDF format. You can export the current view, customize paper size, margins, orientation, and metadata.

> **Note:** PDF export requires `jspdf` and `html2canvas` libraries. Install them:
> ```bash
> npm install jspdf html2canvas
> ```

### Basic Usage

Add `'pdf'` to the toolbar to enable PDF export:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['pdf']"
    key-field="productID"
    :height="400"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
</script>
```

### Custom Paper Size and Orientation

Configure paper size and orientation using `pdfPaperSize` and `pdfLandscape` props:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfPaperSize="'A4'"
  :pdfLandscape="true"
  key-field="productID"
  :height="400"
/>
```

Supported paper sizes: `'A4'`, `'A3'`, `'A2'`, `'A1'`, `'A0'`, `'Letter'`, `'Legal'`, `'Tabloid'`, `'Ledger'`, or any custom size string.

### Custom Margins

Specify custom margins using the `pdfMargin` prop. Margins can be specified as strings (e.g., `"2cm"`, `"20mm"`) or numbers (in mm):

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfMargin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
  key-field="productID"
  :height="400"
/>
```

### Custom File Name

Specify a custom file name using the `pdfFileName` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfFileName="'my-products-export.pdf'"
  key-field="productID"
  :height="400"
/>
```

### PDF Metadata

Set PDF metadata (title, author, subject, keywords, creator) using the respective props:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfTitle="'Products Report'"
  :pdfAuthor="'Pantanal Grid'"
  :pdfSubject="'Product Inventory'"
  :pdfKeywords="'products, inventory, report'"
  :pdfCreator="'Pantanal Grid PDF Export'"
  key-field="productID"
  :height="400"
/>
```

### Scale and Quality

Control the scale and quality of the PDF using the `pdfScale` prop. Higher values (e.g., `2`) produce better quality but larger file sizes:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfScale="0.8"
  key-field="productID"
  :height="400"
/>
```

### Avoid Links

Control whether links should be converted to text using the `pdfAvoidLinks` prop. By default, links are converted to text to avoid broken links in the PDF:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfAvoidLinks="true"
  key-field="productID"
  :height="400"
/>
```

### Repeat Headers

Control whether headers should be repeated on each page using the `pdfRepeatHeaders` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfRepeatHeaders="true"
  key-field="productID"
  :height="400"
/>
```

### PDF Template (Headers/Footers)

Add headers and footers to each page using the `pdfTemplate` prop. The template supports `{pageNum}` and `{totalPages}` variables:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfTemplate="'Page {pageNum} of {totalPages}'"
  key-field="productID"
  :height="400"
/>
```

**Note:** Full HTML rendering in templates requires additional libraries. Simple text templates are recommended.

### Custom Paper Size

Specify a custom paper size using an array of numbers (in mm) or strings (with units):

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfPaperSize="[210, 297]"
  key-field="productID"
  :height="400"
/>
```

Or with units:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfPaperSize="['210mm', '297mm']"
  key-field="productID"
  :height="400"
/>
```

### Individual Margins

Specify margins individually using `pdfMarginTop`, `pdfMarginLeft`, `pdfMarginRight`, and `pdfMarginBottom`:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfMarginTop="'2cm'"
  :pdfMarginLeft="'1cm'"
  :pdfMarginRight="'1cm'"
  :pdfMarginBottom="'2cm'"
  key-field="productID"
  :height="400"
/>
```

### PDF Proxy

Use a server-side proxy for PDF download (useful for browsers that don't support direct downloads):

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfForceProxy="false"
  :pdfProxyUrl="'/api/pdf-proxy'"
  :pdfProxyTarget="'_blank'"
  key-field="productID"
  :height="400"
/>
```

### PDF Date

Set the PDF creation date:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfDate="new Date()"
  key-field="productID"
  :height="400"
/>
```

### Avoid Links with CSS Selector

Ignore specific links using a CSS selector:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['pdf']"
  :pdfAvoidLinks="'.external-link'"
  key-field="productID"
  :height="400"
/>
```

### Available PDF Props

- `pdfAllPages` - Export all pages (default: `false`, reserved for future use with server-side data)
- `pdfAvoidLinks` - Convert links to text or ignore matching links via CSS selector (default: `true`, can be `boolean` or `string`)
- `pdfPaperSize` - Paper size (default: `'A4'`). Can be:
  - String: `'A4'`, `'A3'`, `'A2'`, `'A1'`, `'A0'`, `'B0'`-`'B10'`, `'C0'`-`'C10'`, `'Letter'`, `'Legal'`, `'Tabloid'`, `'Ledger'`, `'Executive'`, `'Folio'`, `'auto'`
  - Array of numbers: `[width, height]` in mm
  - Array of strings: `[width, height]` with units (e.g., `['210mm', '297mm']`)
- `pdfMargin` - Margins object `{ top, left, right, bottom }` (default: `{ top: '1cm', left: '1cm', right: '1cm', bottom: '1cm' }`)
- `pdfMarginTop` - Top margin (string with unit or number in pt)
- `pdfMarginLeft` - Left margin (string with unit or number in pt)
- `pdfMarginRight` - Right margin (string with unit or number in pt)
- `pdfMarginBottom` - Bottom margin (string with unit or number in pt)
- `pdfLandscape` - Landscape orientation (default: `false`)
- `pdfRepeatHeaders` - Repeat headers on each page (default: `true`)
- `pdfScale` - Scale factor (default: `1`). Higher values produce better quality but larger file sizes
- `pdfFileName` - File name (default: `'export.pdf'`)
- `pdfAuthor` - PDF author metadata
- `pdfTitle` - PDF title metadata
- `pdfSubject` - PDF subject metadata
- `pdfKeywords` - PDF keywords metadata
- `pdfCreator` - PDF creator metadata
- `pdfDate` - PDF creation date (default: `new Date()`)
- `pdfTemplate` - HTML template for headers/footers. Supports `{pageNum}` and `{totalPages}` variables (limited HTML support, simple text recommended)
- `pdfForceProxy` - Force use of proxy for download (default: `false`)
- `pdfProxyUrl` - URL of server-side proxy for PDF download
- `pdfProxyTarget` - Where to display the document returned by proxy (`'_blank'`, `'_self'`, or iframe name)

### Programmatic Export

You can also export PDF programmatically by calling the `exportToPdf` or `saveAsPdf` method on the grid component:

```vue
<template>
  <PantanalGrid
    ref="gridRef"
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :height="400"
  />
  <button @click="handleExport">Export to PDF</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

const handleExport = () => {
  gridRef.value?.exportToPdf()
  // or
  gridRef.value?.saveAsPdf()
}
</script>
```

### Notes

- PDF export requires `jspdf` and `html2canvas` libraries to be installed
- The exported PDF is generated from a screenshot of the grid, so it preserves the visual appearance
- Toolbar and footer are automatically excluded from the export
- Links are converted to text by default to avoid broken links in the PDF
- The export respects the current view (current page, filters, sorting)

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
