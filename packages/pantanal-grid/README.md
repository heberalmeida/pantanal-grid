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
- Adaptive body height via `autoHeight`/`maxBodyHeight`
- Column-specific slots via `column.slot`
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

## Flexible height

When virtualization is disabled you can let the grid compute its body height automatically:

```vue
<PantanalGrid
  :rows="items"
  :columns="columns"
  auto-height
  :max-body-height="480"
/>
```

`autoHeight` multiplies the number of visible rows by `rowHeight` and stretches the body accordingly. Provide `maxBodyHeight` to cap the growth and re-enable vertical scrolling when the content exceeds that limit. The virtual mode keeps precedence—if `virtual` is `true`, the grid will honor the fixed `height` instead of auto-sizing.

## Column slots

Each column can point to its own slot without resorting to long `v-if` chains inside `#cell`:

```vue
const columns = [
  { field: 'status', title: 'Status', width: 140, slot: 'status' },
  { field: 'owner', title: 'Owner', width: 220, slot: 'ownerCard' },
  { field: 'goal', title: 'Goal', width: 120 },
]
```

```vue
<PantanalGrid :rows="rows" :columns="columns">
  <template #status="{ value }">
    <StatusBadge :status="value" />
  </template>

  <template #ownerCard="{ row }">
    <OwnerAvatar :name="row.owner" :region="row.region" />
  </template>
</PantanalGrid>
```

For each column the grid tries both `#col-{slot}` and `#{slot}` (for example, `#col-status` and `#status`). The payload matches the generic `#cell` slot: `value`, `row`, `column`, `rowIndex` and `columnIndex`. The default `#cell` continues to work as a fallback when no named slot is provided.

---

## Declarative columns

Prefer a template-driven API? Declare columns as children and the grid will build the configuration for you:

```vue
<script setup lang="ts">
import { PantanalGrid, PantanalColumn } from '@pantanal/grid'
</script>

<PantanalGrid :rows="rows" auto-height>
  <PantanalColumn field="product" title="Product" :width="220" />
  <PantanalColumn field="status" title="Status" :template="renderStatus" />
  <PantanalColumn field="price" title="Price" :format="currency" :width="140" />
</PantanalGrid>
```

```ts
import { h } from 'vue'

function renderStatus({ value }) {
  return h('span', { class: 'status-badge' }, value)
}
```

You can also forward shared renderers by returning a function, e.g. `:template="({ row }) => renderShared(row)"`.

As soon as at least one `<PantanalColumn>` is present, the grid ignores the `columns` prop and relies entirely on the declarative definitions. Both styles can coexist across different grids—pick the approach that feels more natural for each view.

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
