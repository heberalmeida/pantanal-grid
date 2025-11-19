# Pantanal Grid (Vue 3 + Tailwind)

A feature-rich data grid for **Vue 3** applications. Pantanal Grid ships with a Vite/Tailwind playground, supports both client-side and server-side data flows, exposes a typed API, and includes quality-of-life features such as keyboard navigation, persisted state, virtual scrolling, grouping, and internationalization.

👉 **Live demo:** [https://heberalmeida.github.io/pantanal-grid/](https://heberalmeida.github.io/pantanal-grid/)  
📚 **Documentation:** [https://heberalmeida.github.io/pantanal-grid/docs/](https://heberalmeida.github.io/pantanal-grid/docs/)  
📦 **NPM Package:** [@pantanal/grid](https://www.npmjs.com/package/@pantanal/grid)

---

## Repository layout

```
pantanal-grid/
├─ packages/
│  └─ pantanal-grid       # source code of the published @pantanal/grid package
├─ playground/            # Vite + Vue 3 playground showcasing usage scenarios
└─ docs/                  # VitePress documentation site
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
yarn playground:build  # builds the playground itself
yarn docs:dev       # starts VitePress dev server for documentation
yarn docs:build     # builds the documentation site
yarn docs:preview   # previews the built documentation
yarn validate       # runs all tests and builds (test, build, playground:build, docs:build)
yarn prepare        # installs Git hooks (runs automatically on yarn install)
yarn workspace @pantanal/grid lint              # run eslint (if configured)
```

### Git Hooks

Git hooks are automatically installed when you run `yarn install` or `yarn prepare`. The pre-push hook validates all builds and tests before allowing a push. See [.husky/README.md](.husky/README.md) for details.

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

See [Virtualization Examples](/examples/virtualization) for more details.

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
- See [Grouping Basics Examples](/examples/grouping-basics) and [Aggregates Examples](/examples/aggregates) for more details.

---

## Data Binding

Pantanal Grid supports flexible data binding to various data sources:

### Local Data Arrays

The simplest way to provide data is using a local array. All operations are performed client-side:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
/>
```

### Remote Data Services (REST)

Use the `dataProvider` prop to fetch data from REST APIs:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :data-provider="dataProvider"
  server-side
  key-field="id"
/>
```

### GraphQL

Bind to GraphQL services with queries and mutations:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :data-provider="graphqlDataProvider"
  server-side
  key-field="productID"
/>
```

### WebSocket (Real-time)

Connect to WebSocket servers for real-time updates:

```vue
<PantanalGrid
  :rows="wsRows"
  :columns="columns"
  key-field="id"
/>
```

### Offline Mode

Work offline with localStorage persistence:

```vue
<PantanalGrid
  :rows="offlineRows"
  :columns="columns"
  key-field="id"
  editable="inline"
/>
```

See [Data Binding Examples](/examples/data-binding) for complete examples.

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
| Run docs locally         | `yarn docs:dev`                                        |
| Build library            | `yarn build`                                           |
| Build docs               | `yarn docs:build`                                      |
| Run tests                | `yarn test`                                            |
| Format / lint            | `yarn workspace @pantanal/grid lint`                   |
| Prepare release          | `yarn changeset` then `yarn changeset version`         |

Pull requests and issues are welcome. Please ensure code is linted and tested before submitting.

---

## License

[MIT](LICENSE)
