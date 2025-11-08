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

### Grid Component

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

### DataSource Component

Use DataSource for managing local or remote data with filtering, sorting, and pagination:

```vue
<script setup lang="ts">
import { PantanalDataSource } from '@pantanal/grid'
import { ref } from 'vue'

const data = ref([
  { id: 1, name: 'Product 1', price: 99.99 },
  { id: 2, name: 'Product 2', price: 49.99 },
])

const displayData = ref([])
const page = ref(1)
const pageSize = ref(10)

function handleChange(items: any[]) {
  displayData.value = items
}
</script>

<template>
  <PantanalDataSource
    type="local"
    :data="data"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
  <!-- Use displayData in your UI -->
</template>
```

### Pagination Component

Use Pagination standalone for any paginated content:

```vue
<script setup lang="ts">
import { Pagination as PantanalPagination } from '@pantanal/grid'
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
const total = ref(100)
</script>

<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="pages"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
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
- Comprehensive event system for data operations and user interactions

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

## Sorting

Pantanal Grid supports sorting by one or multiple columns. Enable sorting by setting the `sortable` prop to `true` and configure individual columns with `sortable: true`.

### Basic Usage (Single Column)

Enable single-column sorting by setting `sortable` to `true` and `sortableMode` to `'single'`:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    :sortableMode="'single'"
    :sort="sort"
    @update:sort="sort = $event"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Alpha', price: 9.9 },
  { id: 2, name: 'Beta', price: 19.5 },
  { id: 3, name: 'Gamma', price: 29.9 },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true },
]

const sort = ref<SortDescriptor[]>([])
</script>
```

### Multi-Column Sorting

Enable multi-column sorting by setting `sortableMode` to `'multiple'`. You can sort by multiple columns by clicking on different column headers:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    :sortableMode="'multiple'"
    :sortableShowIndexes="true"
    :sort="sort"
    @update:sort="sort = $event"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const sort = ref<SortDescriptor[]>([])
// ... rows and columns
</script>
```

### Sorting Options

- `sortable` - Enable/disable sorting globally (default: `false`)
- `sortableMode` - Sorting mode: `'single'` or `'multiple'` (default: `'single'`)
- `sortableAllowUnsort` - Allow users to remove sorting by clicking a sorted column (default: `true`)
- `sortableShowIndexes` - Show sorting order indices in multi-column mode (default: `false`)

### Column-Level Sortable

Control sorting per column by setting `sortable` on individual columns. Only columns with `sortable: true` will be sortable:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', width: 200, sortable: false },
  { field: 'price', title: 'Price', width: 120, sortable: true },
]
</script>
```

### Server-Side Sorting

For large datasets, use server-side sorting by setting `serverSide` to `true` and providing a `dataProvider` function that handles sorting:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :sortable="true"
    :sortableMode="'multiple'"
    :serverSide="true"
    :sort="sort"
    :dataProvider="dataProvider"
    @update:sort="sort = $event"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type DataProvider } from '@pantanal/grid'

const sort = ref<SortDescriptor[]>([])

const dataProvider: DataProvider = async (args) => {
  // Apply sorting on server
  let data = [...allData]
  if (args.sort && args.sort.length > 0) {
    data.sort((a, b) => {
      for (const s of args.sort!) {
        const av = (a as any)[s.field]
        const bv = (b as any)[s.field]
        if (av === bv) continue
        const dir = s.dir === 'asc' ? 1 : -1
        return av > bv ? dir : -dir
      }
      return 0
    })
  }
  
  // Apply pagination
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  
  return {
    rows: data.slice(start, end),
    total: data.length,
  }
}
</script>
```

---

## Grid Events

The Grid component emits various events that allow you to react to user interactions and data operations.

### Available Events

#### Data Events

- `@databinding` - Fired before data is loaded/bound
  ```typescript
  (options: { 
    sort?: SortDescriptor[]; 
    filter?: FilterDescriptor[]; 
    group?: GroupDescriptor[]; 
    page?: number; 
    pageSize?: number 
  }) => void
  ```

- `@databound` - Fired after data is loaded/bound
  ```typescript
  (data: unknown[]) => void
  ```

#### Operation Events

- `@sort` - Fired when sorting changes
  ```typescript
  (options: { sort: SortDescriptor[] }) => void
  ```

- `@filter` - Fired when filtering changes
  ```typescript
  (options: { filter: FilterDescriptor[] }) => void
  ```

- `@group` - Fired when grouping changes
  ```typescript
  (options: { groups: GroupDescriptor[] }) => void
  ```

- `@groupexpand` - Fired when a group is expanded
  ```typescript
  (options: { group: { field: string; value: unknown; aggregates?: Record<string, any> } }) => void
  ```

- `@groupcollapse` - Fired when a group is collapsed
  ```typescript
  (options: { group: { field: string; value: unknown; aggregates?: Record<string, any> } }) => void
  ```

#### Interaction Events

- `@selectionChange` - Fired when selection changes
  ```typescript
  (selected: unknown[]) => void
  ```

- `@rowClick` - Fired when a row is clicked
  ```typescript
  (row: unknown) => void
  ```

- `@columnResize` - Fired when a column is resized
  ```typescript
  (options: { field: string; width: number }) => void
  ```

- `@columnReorder` - Fired when columns are reordered
  ```typescript
  (options: { from: number; to: number }) => void
  ```

#### Status Events

- `@loading` - Fired when loading state changes
  ```typescript
  (loading: boolean) => void
  ```

- `@error` - Fired when an error occurs
  ```typescript
  (error: unknown) => void
  ```

### Example: Using Grid Events

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :filterable="true"
    :groupable="true"
    :selectable="true"
    @databinding="onDataBinding"
    @databound="onDataBound"
    @sort="onSort"
    @filter="onFilter"
    @group="onGroup"
    @groupexpand="onGroupExpand"
    @groupcollapse="onGroupCollapse"
    @selectionChange="onSelectionChange"
    @rowClick="onRowClick"
    @columnResize="onColumnResize"
    @columnReorder="onColumnReorder"
    @loading="onLoading"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { PantanalGrid, type SortDescriptor, type FilterDescriptor, type GroupDescriptor } from '@pantanal/grid'

function onDataBinding(options: any) {
  console.log('Data binding:', options)
}

function onDataBound(data: unknown[]) {
  console.log('Data bound:', data.length, 'items')
}

function onSort(options: { sort: SortDescriptor[] }) {
  console.log('Sort:', options.sort)
}

function onFilter(options: { filter: FilterDescriptor[] }) {
  console.log('Filter:', options.filter)
}

function onGroup(options: { groups: GroupDescriptor[] }) {
  console.log('Group:', options.groups)
}

function onGroupExpand(options: { group: { field: string; value: unknown } }) {
  console.log('Group expanded:', options.group)
}

function onGroupCollapse(options: { group: { field: string; value: unknown } }) {
  console.log('Group collapsed:', options.group)
}

function onSelectionChange(selected: unknown[]) {
  console.log('Selection changed:', selected.length, 'items')
}

function onRowClick(row: unknown) {
  console.log('Row clicked:', row)
}

function onColumnResize(options: { field: string; width: number }) {
  console.log('Column resized:', options.field, options.width)
}

function onColumnReorder(options: { from: number; to: number }) {
  console.log('Column reordered:', options.from, 'to', options.to)
}

function onLoading(loading: boolean) {
  console.log('Loading:', loading)
}

function onError(error: unknown) {
  console.error('Error:', error)
}
</script>
```

---

## Data Binding

The Grid supports various data binding methods to connect to different data sources.

### Local Data Arrays

Bind the Grid to local data arrays for client-side operations:

```vue
<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const products = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39 },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40 },
])

const columns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
]
</script>
```

### Remote Data Services (REST API)

Use the `dataProvider` prop to connect to REST APIs:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :data-provider="dataProvider"
    :auto-bind="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(10)

const dataProvider: DataProvider = async ({ page, pageSize, signal }: DataProviderArgs) => {
  const response = await fetch(`/api/products?page=${page}&pageSize=${pageSize}`, { signal })
  const json = await response.json()
  return {
    rows: json.data,
    total: json.total,
  }
}
</script>
```

### GraphQL Services

Connect to GraphQL services using the `dataProvider` prop:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :data-provider="graphQLProvider"
    :auto-bind="true"
  />
</template>

<script setup lang="ts">
import { PantanalGrid, type DataProvider, type DataProviderArgs } from '@pantanal/grid'

const graphQLProvider: DataProvider = async ({ page, pageSize, signal }: DataProviderArgs) => {
  const query = `
    query ($page: Int!, $limit: Int!) {
      products(page: $page, limit: $limit) {
        data { id name price }
        total
      }
    }
  `
  
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { page, limit: pageSize } }),
    signal,
  })
  
  const json = await response.json()
  return {
    rows: json.data.products.data,
    total: json.data.products.total,
  }
}
</script>
```

### WebSocket Connections

For real-time data updates, you can integrate WebSocket connections:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = ref([])
const ws = ref<WebSocket | null>(null)

onMounted(() => {
  ws.value = new WebSocket('wss://your-server.com')
  
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'update') {
      // Update rows based on WebSocket message
      rows.value = data.products
    }
  }
})

onBeforeUnmount(() => {
  ws.value?.close()
})
</script>
```

### Offline Mode

The Grid can work offline by storing data and changes in local storage:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = ref([])
const STORAGE_KEY = 'grid-offline-data'

// Load from local storage
onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    rows.value = JSON.parse(stored)
  }
})

// Save to local storage on changes
watch(rows, (newRows) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newRows))
}, { deep: true })
</script>
```

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

## DataSource Component

The `PantanalDataSource` component provides an abstraction for working with local data arrays or remote data services. It handles filtering, sorting, pagination, and grouping operations either client-side or server-side.

### Local DataSource

Use DataSource with local data arrays for client-side operations:

```vue
<script setup lang="ts">
import { PantanalGrid, PantanalDataSource } from '@pantanal/grid'
import { ref } from 'vue'

const localData = ref([
  { id: 1, title: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, title: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const dataSourceData = ref([])
const page = ref(1)
const pageSize = ref(10)
const sort = ref([])
const filter = ref([])

function handleChange(data: any[]) {
  dataSourceData.value = data
}
</script>

<template>
  <PantanalDataSource
    type="local"
    :data="localData"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>
```

### Remote DataSource

Use DataSource with remote data services for server-side operations:

```vue
<script setup lang="ts">
import { PantanalGrid, PantanalDataSource, type DataSourceTransport, type DataSourceSchema } from '@pantanal/grid'
import { ref } from 'vue'

const dataSourceData = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const sort = ref([])
const filter = ref([])

const transport: DataSourceTransport = {
  read: async (options) => {
    const url = new URL('https://api.example.com/products')
    url.searchParams.set('page', String(options.data?.page || 1))
    url.searchParams.set('pageSize', String(options.data?.pageSize || 10))
    
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },
  parameterMap: (data) => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value.length > 0 ? JSON.stringify(sort.value) : undefined,
      filter: filter.value.length > 0 ? JSON.stringify(filter.value) : undefined,
      ...data,
    }
  },
}

const schema: DataSourceSchema = {
  data: (response) => response.products || [],
  total: (response) => response.total || 0,
}

function handleChange(data: any[]) {
  dataSourceData.value = data
}
</script>

<template>
  <PantanalDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-filtering="true"
    :server-sorting="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
    :total="total"
    server-side
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>
```

### Standalone DataSource (without Grid)

DataSource can be used independently without the Grid component. Perfect for custom UI components, lists, cards, or any other data presentation needs:

```vue
<script setup lang="ts">
import { PantanalDataSource, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'
import { ref } from 'vue'

const data = ref([
  { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const displayData = ref([])
const page = ref(1)
const pageSize = ref(6)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

function handleChange(data: any[]) {
  displayData.value = data
}
</script>

<template>
  <PantanalDataSource
    type="local"
    :data="data"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  
  <!-- Custom UI using DataSource data -->
  <div class="grid gap-3">
    <div
      v-for="item in displayData"
      :key="item.id"
      class="p-4 border rounded">
      <h4>{{ item.name }}</h4>
      <p>Price: ${{ item.price.toFixed(2) }}</p>
    </div>
  </div>
  
  <!-- Custom Pagination -->
  <div class="flex gap-2">
    <button @click="page = Math.max(1, page - 1)">Previous</button>
    <span>Page {{ page }}</span>
    <button @click="page = page + 1">Next</button>
  </div>
</template>
```

### Standalone Remote DataSource

Use DataSource standalone with remote API for building custom data-driven components:

```vue
<script setup lang="ts">
import { PantanalDataSource, type DataSourceTransport, type DataSourceSchema, type FilterDescriptor } from '@pantanal/grid'
import { ref } from 'vue'

const displayData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(6)
const filter = ref<FilterDescriptor[]>([])
const filterText = ref('')

const transport: DataSourceTransport = {
  read: async (options) => {
    const url = new URL('https://api.example.com/products')
    url.searchParams.set('page', String(options.data?.page || 1))
    url.searchParams.set('pageSize', String(options.data?.pageSize || 10))
    const res = await fetch(url.toString())
    return res.json()
  },
}

const schema: DataSourceSchema = {
  data: (response) => response.products || [],
  total: (response) => response.total || 0,
}

function handleChange(data: any[]) {
  displayData.value = data
}

function updateFilter() {
  const others = filter.value.filter(f => f.field !== 'title')
  if (filterText.value) {
    filter.value = [...others, { field: 'title', operator: 'contains', value: filterText.value }]
  } else {
    filter.value = others
  }
}
</script>

<template>
  <PantanalDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-filtering="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:filter="filter"
    @change="handleChange"
    @requestStart="loading = true"
    @requestEnd="loading = false"
  />
  
  <input
    v-model="filterText"
    @input="updateFilter"
    placeholder="Search..."
  />
  
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="item in displayData" :key="item.id">
      <h4>{{ item.title }}</h4>
      <p>${{ item.price }}</p>
    </div>
  </div>
  
  <div class="pagination">
    <button @click="page = Math.max(1, page - 1)">Previous</button>
    <span>Page {{ page }}</span>
    <button @click="page = page + 1">Next</button>
  </div>
</template>
```

### Using DataSource with ref

You can reference a DataSource instance and use it programmatically:

```vue
<script setup lang="ts">
import { PantanalGrid, PantanalDataSource, type DataSourceInstance } from '@pantanal/grid'
import { ref } from 'vue'

const dataSource = ref<DataSourceInstance | null>(null)
const dataSourceData = ref([])
const page = ref(1)
const pageSize = ref(10)

function handleChange(data: any[]) {
  dataSourceData.value = data
}

function refresh() {
  dataSource.value?.read()
}

function reset() {
  dataSource.value?.query({ page: 1, pageSize: 10 })
}
</script>

<template>
  <PantanalDataSource
    ref="dataSource"
    type="local"
    :data="data"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
  <button @click="refresh">Refresh Data</button>
  <button @click="reset">Reset to Page 1</button>
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>
```

### DataSource Props

- `type` - `'local' | 'remote'` - Type of data source (default: `'local'`)
- `data` - `T[]` - Local data array (for local type)
- `transport` - `DataSourceTransport` - Transport configuration for remote data
- `schema` - `DataSourceSchema` - Schema configuration for parsing remote responses
- `page` - `number` - Current page number (default: `1`)
- `pageSize` - `number` - Number of items per page (default: `20`)
- `sort` - `SortDescriptor[]` - Sort descriptors
- `filter` - `FilterDescriptor[]` - Filter descriptors
- `group` - `GroupDescriptor[]` - Group descriptors
- `serverPaging` - `boolean` - Enable server-side pagination (default: `false`)
- `serverFiltering` - `boolean` - Enable server-side filtering (default: `false`)
- `serverSorting` - `boolean` - Enable server-side sorting (default: `false`)
- `serverGrouping` - `boolean` - Enable server-side grouping (default: `false`)

### DataSource Events

- `change` - Emitted when data changes
- `error` - Emitted when an error occurs
- `requestStart` - Emitted when a request starts
- `requestEnd` - Emitted when a request ends
- `sync` - Emitted after data is synced
- `update:data`, `update:page`, `update:pageSize`, `update:sort`, `update:filter`, `update:group` - v-model bindings

### DataSource Methods

- `data()` - Returns the current processed data array
- `total()` - Returns the total number of items
- `read()` - Reads data from the remote service (for remote type)
- `sync()` - Syncs data changes
- `query(options)` - Queries data with the provided options

---

## GanttDataSource Component

The `PantanalGanttDataSource` component extends the `PantanalDataSource` component and provides specialized support for Gantt task data structures. It includes automatic field mapping, date handling, and hierarchical task support.

### GanttTask Interface

```typescript
interface GanttTask {
  id: number | string
  parentId?: number | string | null
  orderId?: number
  start: Date | string
  end: Date | string
  title: string
  percentComplete?: number
  summary?: boolean
  expanded?: boolean
  [key: string]: any
}
```

### Basic Usage

```vue
<script setup lang="ts">
import { PantanalGanttDataSource, PantanalGrid, type GanttTask } from '@pantanal/grid'
import { ref } from 'vue'

const tasks: GanttTask[] = [
  {
    id: 1,
    title: 'Project Planning',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-15'),
    percentComplete: 100,
    parentId: null,
  },
  {
    id: 2,
    title: 'Design Phase',
    start: new Date('2024-01-16'),
    end: new Date('2024-02-15'),
    percentComplete: 75,
    parentId: null,
  },
]

const dataSourceData = ref<GanttTask[]>([])

function handleChange(data: GanttTask[]) {
  dataSourceData.value = data
}
</script>

<template>
  <PantanalGanttDataSource
    :data="tasks"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
  />
</template>
```

### Model Field Mapping

GanttDataSource supports field mapping from different data structures using the schema model configuration:

```vue
<script setup lang="ts">
import { 
  PantanalGanttDataSource, 
  type GanttTask, 
  type GanttDataSourceSchema 
} from '@pantanal/grid'

const tasks = [
  {
    ID: 1,
    Title: 'Task 1',
    Start: '2024-01-01',
    End: '2024-01-10',
    ParentID: null,
    PercentComplete: 50,
  },
]

const schema: GanttDataSourceSchema = {
  model: {
    id: 'id',
    fields: {
      id: { from: 'ID', type: 'number' },
      parentId: { from: 'ParentID', type: 'number', defaultValue: null },
      start: { from: 'Start', type: 'date' },
      end: { from: 'End', type: 'date' },
      title: { from: 'Title', type: 'string' },
      percentComplete: { from: 'PercentComplete', type: 'number', defaultValue: 0 },
      summary: { from: 'Summary', type: 'boolean', defaultValue: false },
      expanded: { from: 'Expanded', type: 'boolean', defaultValue: true },
    },
  },
}
</script>

<template>
  <PantanalGanttDataSource
    :data="tasks"
    :schema="schema"
    @change="handleChange"
  />
</template>
```

### Remote GanttDataSource

```vue
<script setup lang="ts">
import { 
  PantanalGanttDataSource, 
  type GanttDataSourceSchema,
  type DataSourceTransport 
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async () => {
    const res = await fetch('https://api.example.com/gantt/tasks')
    return res.json()
  },
}

const schema: GanttDataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}
</script>

<template>
  <PantanalGanttDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
</template>
```

### Standalone Usage

GanttDataSource can be used independently to manage task data programmatically:

```vue
<script setup lang="ts">
import { PantanalGanttDataSource, type GanttDataSourceInstance } from '@pantanal/grid'
import { ref } from 'vue'

const ganttDataSource = ref<GanttDataSourceInstance | null>(null)
const tasks = ref<GanttTask[]>([...])

function addTask() {
  ganttDataSource.value?.add({
    title: 'New Task',
    start: new Date('2024-02-01'),
    end: new Date('2024-02-10'),
    percentComplete: 0,
  })
}

function removeTask(id: number | string) {
  ganttDataSource.value?.remove(id)
}

function updateTask(task: GanttTask) {
  ganttDataSource.value?.update(task)
}

function getAllTasks() {
  return ganttDataSource.value?.tasks() || []
}
</script>

<template>
  <PantanalGanttDataSource
    ref="ganttDataSource"
    :data="tasks"
    @change="handleChange"
  />
</template>
```

### GanttDataSource Props

Extends all `PantanalDataSource` props, plus:

- `schema` - `GanttDataSourceSchema` - Schema configuration with model field mapping

### GanttDataSource Events

Same as `PantanalDataSource` events.

### GanttDataSource Methods

Extends all `PantanalDataSource` methods, plus:

- `tasks()` - Returns all tasks as `GanttTask[]`
- `add(task)` - Adds a new task
- `remove(task)` - Removes a task by ID or task object
- `update(task)` - Updates an existing task

### Schema Model Configuration

The schema model allows you to map fields from different data structures:

```typescript
interface GanttTaskFieldConfig {
  from?: string           // Source field name
  type?: 'string' | 'number' | 'boolean' | 'date'
  defaultValue?: any
  validation?: {
    required?: boolean
    min?: number
    max?: number
  }
  parse?: (value: any) => any
}
```

---

## GanttDependencyDataSource Component

The `PantanalGanttDependencyDataSource` component extends the `PantanalDataSource` component and provides specialized support for Gantt dependency data structures. Dependencies represent relationships between tasks (predecessor and successor).

### GanttDependency Interface

```typescript
interface GanttDependency {
  id: number | string
  predecessorId: number | string
  successorId: number | string
  type?: number
  [key: string]: any
}
```

### Dependency Types

- `0` - Finish to Start (FS): The successor task cannot start until the predecessor task finishes
- `1` - Start to Start (SS): The successor task cannot start until the predecessor task starts
- `2` - Finish to Finish (FF): The successor task cannot finish until the predecessor task finishes
- `3` - Start to Finish (SF): The successor task cannot finish until the predecessor task starts

### Basic Usage

```vue
<script setup lang="ts">
import { PantanalGanttDependencyDataSource, PantanalGrid, type GanttDependency } from '@pantanal/grid'
import { ref } from 'vue'

const dependencies: GanttDependency[] = [
  {
    id: 1,
    predecessorId: 1,
    successorId: 2,
    type: 0,
  },
  {
    id: 2,
    predecessorId: 2,
    successorId: 3,
    type: 0,
  },
]

const dataSourceData = ref<GanttDependency[]>([])

function handleChange(data: GanttDependency[]) {
  dataSourceData.value = data
}
</script>

<template>
  <PantanalGanttDependencyDataSource
    :data="dependencies"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
  />
</template>
```

### Model Field Mapping

GanttDependencyDataSource supports field mapping from different data structures using the schema model configuration:

```vue
<script setup lang="ts">
import { 
  PantanalGanttDependencyDataSource, 
  type GanttDependency, 
  type GanttDependencyDataSourceSchema 
} from '@pantanal/grid'

const dependencies = [
  {
    ID: 1,
    PredecessorID: 1,
    SuccessorID: 2,
    Type: 0,
  },
]

const schema: GanttDependencyDataSourceSchema = {
  model: {
    id: 'id',
    fields: {
      id: { from: 'ID', type: 'number' },
      predecessorId: { from: 'PredecessorID', type: 'number' },
      successorId: { from: 'SuccessorID', type: 'number' },
      type: { from: 'Type', type: 'number', defaultValue: 0 },
    },
  },
}
</script>

<template>
  <PantanalGanttDependencyDataSource
    :data="dependencies"
    :schema="schema"
    @change="handleChange"
  />
</template>
```

### Remote GanttDependencyDataSource

```vue
<script setup lang="ts">
import { 
  PantanalGanttDependencyDataSource, 
  type GanttDependencyDataSourceSchema,
  type DataSourceTransport 
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async () => {
    const res = await fetch('https://api.example.com/gantt/dependencies')
    return res.json()
  },
}

const schema: GanttDependencyDataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}
</script>

<template>
  <PantanalGanttDependencyDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
</template>
```

### Standalone Usage

GanttDependencyDataSource can be used independently to manage dependency data programmatically:

```vue
<script setup lang="ts">
import { PantanalGanttDependencyDataSource, type GanttDependencyDataSourceInstance } from '@pantanal/grid'
import { ref } from 'vue'

const dependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const dependencies = ref<GanttDependency[]>([...])

function addDependency() {
  dependencyDataSource.value?.add({
    predecessorId: 1,
    successorId: 2,
    type: 0,
  })
}

function removeDependency(id: number | string) {
  dependencyDataSource.value?.remove(id)
}

function updateDependency(dependency: GanttDependency) {
  dependencyDataSource.value?.update(dependency)
}

function getAllDependencies() {
  return dependencyDataSource.value?.dependencies() || []
}
</script>

<template>
  <PantanalGanttDependencyDataSource
    ref="dependencyDataSource"
    :data="dependencies"
    @change="handleChange"
  />
</template>
```

### GanttDependencyDataSource Props

Extends all `PantanalDataSource` props, plus:

- `schema` - `GanttDependencyDataSourceSchema` - Schema configuration with model field mapping

### GanttDependencyDataSource Events

Same as `PantanalDataSource` events.

### GanttDependencyDataSource Methods

Extends all `PantanalDataSource` methods, plus:

- `dependencies()` - Returns all dependencies as `GanttDependency[]`
- `add(dependency)` - Adds a new dependency
- `remove(dependency)` - Removes a dependency by ID or dependency object
- `update(dependency)` - Updates an existing dependency

### Schema Model Configuration

The schema model allows you to map fields from different data structures:

```typescript
interface GanttDependencyDataSourceSchema {
  model?: {
    id?: string | GanttTaskFieldConfig
    fields?: {
      id?: GanttTaskFieldConfig | string
      predecessorId?: GanttTaskFieldConfig | string
      successorId?: GanttTaskFieldConfig | string
      type?: GanttTaskFieldConfig | string
    }
  }
}
```

---

## HierarchicalDataSource Component

The `PantanalHierarchicalDataSource` component extends the `PantanalDataSource` component and provides specialized support for hierarchical data structures. It enables you to represent data in a tree-like structure with parent-child relationships.

### HierarchicalNode Interface

```typescript
interface HierarchicalNode {
  id?: number | string
  text?: string
  children?: HierarchicalNode[]
  _hasChildren?: boolean
  _expanded?: boolean
  _level?: number
  [key: string]: any
}
```

### Basic Usage

```vue
<script setup lang="ts">
import { PantanalHierarchicalDataSource, PantanalGrid, type HierarchicalNode } from '@pantanal/grid'
import { ref } from 'vue'

const data: HierarchicalNode[] = [
  {
    id: 1,
    text: 'Category A',
    children: [
      {
        id: 11,
        text: 'Subcategory A1',
        children: [
          { id: 111, text: 'Item A1a' },
          { id: 112, text: 'Item A1b' },
        ],
      },
      {
        id: 12,
        text: 'Subcategory A2',
      },
    ],
  },
  {
    id: 2,
    text: 'Category B',
    children: [
      { id: 21, text: 'Subcategory B1' },
    ],
  },
]

const gridData = ref<HierarchicalNode[]>([])

function handleChange(data: HierarchicalNode[]) {
  gridData.value = flattenTree(data)
}
</script>

<template>
  <PantanalHierarchicalDataSource
    :data="data"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="gridData"
    :columns="columns"
    key-field="id"
  />
</template>
```

### Schema Configuration

Configure the hierarchical structure using schema model:

```vue
<script setup lang="ts">
import { 
  PantanalHierarchicalDataSource, 
  type HierarchicalDataSourceSchema 
} from '@pantanal/grid'

const data = [
  {
    id: 1,
    name: 'Department A',
    products: [
      { id: 11, name: 'Product A1' },
      { id: 12, name: 'Product A2' },
    ],
  },
]

const schema: HierarchicalDataSourceSchema = {
  model: {
    id: 'id',
    hasChildren: 'products',  // Field that indicates children
    children: 'products',     // Field that contains children
  },
}
</script>

<template>
  <PantanalHierarchicalDataSource
    :data="data"
    :schema="schema"
    @change="handleChange"
  />
</template>
```

### Remote HierarchicalDataSource with Lazy Loading

Load hierarchical data from a remote API with lazy loading of children:

```vue
<script setup lang="ts">
import { 
  PantanalHierarchicalDataSource, 
  type HierarchicalDataSourceSchema,
  type DataSourceTransport 
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async () => {
    const res = await fetch('https://api.example.com/categories')
    return res.json()
  },
}

const schema: HierarchicalDataSourceSchema = {
  data: (response: any) => response.data || [],
  model: {
    id: 'id',
    hasChildren: '_hasChildren',
    children: {
      type: 'remote',
      transport: {
        read: async (options: any) => {
          const parentId = options.data?.parentId
          const res = await fetch(`https://api.example.com/categories/${parentId}/children`)
          return res.json()
        },
      },
      schema: {
        data: (response: any) => response.data || [],
      },
    },
  },
}
</script>

<template>
  <PantanalHierarchicalDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    @change="handleChange"
  />
</template>
```

### Standalone Usage

HierarchicalDataSource can be used independently to manage hierarchical data programmatically:

```vue
<script setup lang="ts">
import { PantanalHierarchicalDataSource, type HierarchicalDataSourceInstance } from '@pantanal/grid'
import { ref } from 'vue'

const hierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const data = ref<HierarchicalNode[]>([...])

// Expand a node
async function expandNode(nodeId: number | string) {
  await hierarchicalDataSource.value?.expand(nodeId)
}

// Collapse a node
function collapseNode(nodeId: number | string) {
  hierarchicalDataSource.value?.collapse(nodeId)
}

// Load children for a node
async function loadChildren(nodeId: number | string) {
  return await hierarchicalDataSource.value?.loadChildren(nodeId) || []
}

// Get a specific node
function getNode(nodeId: number | string) {
  return hierarchicalDataSource.value?.getNode(nodeId) || null
}

// Get root nodes
function getRootNodes() {
  return hierarchicalDataSource.value?.rootNodes() || []
}
</script>

<template>
  <PantanalHierarchicalDataSource
    ref="hierarchicalDataSource"
    :data="data"
    @change="handleChange"
  />
</template>
```

### HierarchicalDataSource Props

Extends all `PantanalDataSource` props, plus:

- `schema` - `HierarchicalDataSourceSchema` - Schema configuration with hierarchical model

### HierarchicalDataSource Events

Same as `PantanalDataSource` events.

### HierarchicalDataSource Methods

Extends all `PantanalDataSource` methods, plus:

- `rootNodes()` - Returns all root nodes as `HierarchicalNode[]`
- `getNode(id)` - Gets a node by ID
- `expand(node)` - Expands a node and loads its children if needed
- `collapse(node)` - Collapses a node
- `loadChildren(node)` - Loads children for a node (async)

### Schema Model Configuration

The schema model allows you to configure hierarchical structure:

```typescript
interface HierarchicalDataSourceSchemaModel {
  id?: string                                    // Field name for node ID
  hasChildren?: string | boolean | Function      // Indicates if node has children
  children?: string | HierarchicalDataSourceSchemaModelChildren  // Children configuration
}
```

#### hasChildren Options

- `string` - Field name that contains children or indicates children existence
- `boolean` - All nodes have children or none have children
- `Function` - Function that returns whether a node has children: `(item: any) => boolean`

#### children Options

- `string` - Field name that contains the children array (for local data)
- `HierarchicalDataSourceSchemaModelChildren` - Configuration object for remote children loading

---

## PivotDataSource Component

The `PantanalPivotDataSource` component extends the `PantanalDataSource` component and provides specialized support for OLAP (Online Analytical Processing) data structures. It communicates with OLAP cubes using the XMLA protocol and supports client-side cube processing for local data.

### PivotCube Interface

```typescript
interface PivotCube {
  dimensions?: Record<string, PivotDimension>
  measures?: Record<string, PivotMeasure>
}
```

### Basic Usage

```vue
<script setup lang="ts">
import { PantanalPivotDataSource, type PivotDataSourceSchema, type PivotColumn, type PivotRow } from '@pantanal/grid'
import { ref } from 'vue'

const data = [
  { Country: 'USA', CompanyName: 'Company A', ContactTitle: 'Manager', CustomerID: 1 },
  { Country: 'USA', CompanyName: 'Company B', ContactTitle: 'Manager', CustomerID: 2 },
  { Country: 'UK', CompanyName: 'Company C', ContactTitle: 'Director', CustomerID: 3 },
]

const schema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Country: { caption: 'All Countries' },
      CompanyName: { caption: 'All Companies' },
      ContactTitle: { caption: 'All Titles' },
    },
    measures: {
      'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
    },
  },
}

const columns: PivotColumn[] = [
  { name: 'Country', expand: true },
]

const rows: PivotRow[] = [
  { name: 'ContactTitle' },
]

const measures = ['Contacts Count']
</script>

<template>
  <PantanalPivotDataSource
    type="local"
    :data="data"
    :schema="schema"
    :columns="columns"
    :rows="rows"
    :measures="measures"
    @change="handleChange"
  />
</template>
```

### Remote PivotDataSource

Load pivot data from a remote OLAP server or OData service:

```vue
<script setup lang="ts">
import { PantanalPivotDataSource, type PivotDataSourceTransport, type PivotDataSourceSchema } from '@pantanal/grid'

const transport: PivotDataSourceTransport = {
  read: async (options: any) => {
    const res = await fetch('https://api.example.com/pivot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        columns: options.columns,
        rows: options.rows,
        measures: options.measures,
      }),
    })
    return res.json()
  },
}

const schema: PivotDataSourceSchema = {
  data: (response: any) => response,
}
</script>

<template>
  <PantanalPivotDataSource
    type="odata"
    :transport="transport"
    :schema="schema"
    :columns="columns"
    :rows="rows"
    :measures="measures"
    @change="handleChange"
  />
</template>
```

### Standalone Usage

PivotDataSource can be used independently to manage pivot data programmatically:

```vue
<script setup lang="ts">
import { PantanalPivotDataSource, type PivotDataSourceInstance } from '@pantanal/grid'
import { ref } from 'vue'

const pivotDataSource = ref<PivotDataSourceInstance | null>(null)

// Update columns programmatically
async function updateColumns() {
  // Update columns, rows, or measures
  await pivotDataSource.value?.query({
    columns: [{ name: 'Product' }],
    rows: [{ name: 'Region' }],
  })
}

// Get axes
function getAxes() {
  return pivotDataSource.value?.axes()
}

// Get measures
function getMeasures() {
  return pivotDataSource.value?.measures()
}
</script>

<template>
  <PantanalPivotDataSource
    ref="pivotDataSource"
    type="local"
    :data="data"
    :schema="schema"
    :columns="columns"
    :rows="rows"
    :measures="measures"
    @change="handleChange"
  />
</template>
```

### PivotDataSource Props

- `type` - `'xmla' | 'odata' | 'local'` - Type of data source (default: `'local'`)
- `data` - `any[]` - Local data array (for `type='local'`)
- `transport` - `PivotDataSourceTransport` - Transport configuration for remote data
- `schema` - `PivotDataSourceSchema` - Schema configuration with cube definition
- `columns` - `PivotColumn[] | string[]` - Column axis members
- `rows` - `PivotRow[] | string[]` - Row axis members
- `measures` - `string[] | PivotMeasure[]` - Measures configuration
- `autoSync` - `boolean` - Automatically sync data on mount (default: `false`)

### PivotDataSource Events

- `change` - Fires when the pivot data changes
- `error` - Fires when an error occurs
- `requestStart` - Fires when a request starts
- `requestEnd` - Fires when a request ends
- `sync` - Fires when data is synchronized

### PivotDataSource Methods

- `data()` - Returns the current pivot result as `PivotResult`
- `total()` - Returns the total number of cells
- `read()` - Reads data from the remote source or processes local data
- `sync()` - Synchronizes data
- `query(options)` - Updates columns, rows, or measures and refreshes data
- `axes()` - Returns the axes configuration (columns and rows)
- `measures()` - Returns the measures configuration
- `columns()` - Returns the columns configuration
- `rows()` - Returns the rows configuration

### Schema Cube Configuration

The schema cube allows you to configure dimensions and measures:

```typescript
interface PivotCube {
  dimensions?: Record<string, PivotDimension>
  measures?: Record<string, PivotMeasure>
}

interface PivotDimension {
  caption?: string
  name?: string
}

interface PivotMeasure {
  field?: string
  aggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  format?: string
  name?: string
}
```

#### Measure Aggregates

- `sum` - Sum of values
- `avg` - Average of values
- `count` - Count of items
- `min` - Minimum value
- `max` - Maximum value

### PivotColumn and PivotRow

```typescript
interface PivotColumn {
  name: string
  expand?: boolean
}

interface PivotRow {
  name: string
  expand?: boolean
}
```

---

## SchedulerDataSource Component

The `PantanalSchedulerDataSource` component extends the `PantanalDataSource` component and provides specialized support for Scheduler event data structures. It includes field mapping, date handling, timezone support, and recurrence support.

### SchedulerEvent Interface

```typescript
interface SchedulerEvent {
  taskId?: number | string
  id?: number | string
  title: string
  start: Date | string
  end: Date | string
  startTimezone?: string
  endTimezone?: string
  description?: string
  recurrenceId?: number | string | null
  recurrenceRule?: string | null
  recurrenceException?: string | null
  ownerId?: number | string
  isAllDay?: boolean
  [key: string]: any
}
```

### Basic Usage

```vue
<script setup lang="ts">
import { 
  PantanalSchedulerDataSource, 
  PantanalGrid,
  type SchedulerEvent 
} from '@pantanal/grid'
import { ref } from 'vue'

const events = ref<SchedulerEvent[]>([
  {
    taskId: 1,
    id: 1,
    title: 'Meeting',
    start: new Date('2024-01-15T09:00:00'),
    end: new Date('2024-01-15T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  },
])

const data = ref<SchedulerEvent[]>([])

function handleChange(newData: SchedulerEvent[]) {
  data.value = newData
}
</script>

<template>
  <PantanalSchedulerDataSource
    :data="events"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns"
    key-field="id"
  />
</template>
```

### Schema Configuration

Configure field mapping using schema model:

```vue
<script setup lang="ts">
import { 
  PantanalSchedulerDataSource, 
  type SchedulerDataSourceSchema 
} from '@pantanal/grid'

const data = [
  {
    TaskID: 1,
    Title: 'Team Meeting',
    Start: '2024-01-17T10:00:00',
    End: '2024-01-17T11:00:00',
    OwnerID: 1,
    IsAllDay: false,
  },
]

const schema: SchedulerDataSourceSchema = {
  model: {
    taskId: { from: 'TaskID', type: 'number' },
    title: { from: 'Title', defaultValue: 'No title' },
    start: { from: 'Start', type: 'date' },
    end: { from: 'End', type: 'date' },
    ownerId: { from: 'OwnerID', type: 'number', defaultValue: 1 },
    isAllDay: { from: 'IsAllDay', type: 'boolean' },
  },
}
</script>

<template>
  <PantanalSchedulerDataSource
    :data="data"
    :schema="schema"
    @change="handleChange"
  />
</template>
```

### Remote SchedulerDataSource

Load events from a remote API:

```vue
<script setup lang="ts">
import { 
  PantanalSchedulerDataSource, 
  type SchedulerDataSourceSchema,
  type DataSourceTransport 
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async (options) => {
    const response = await fetch('/api/scheduler-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: options.page,
        pageSize: options.pageSize,
      }),
    })
    return response.json()
  },
  create: async (options) => {
    const response = await fetch('/api/scheduler-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    })
    return response.json()
  },
  update: async (options) => {
    const response = await fetch(`/api/scheduler-events/${options.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    })
    return response.json()
  },
  destroy: async (options) => {
    const response = await fetch(`/api/scheduler-events/${options.id}`, {
      method: 'DELETE',
    })
    return response.json()
  },
}

const schema: SchedulerDataSourceSchema = {
  model: {
    taskId: { from: 'taskId', type: 'number' },
    title: { from: 'title', defaultValue: 'No title' },
    start: { from: 'start', type: 'date' },
    end: { from: 'end', type: 'date' },
    ownerId: { from: 'ownerId', type: 'number' },
    isAllDay: { from: 'isAllDay', type: 'boolean' },
  },
  data: (response: any) => response.data || response,
  total: (response: any) => response.total || 0,
}
</script>

<template>
  <PantanalSchedulerDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
</template>
```

### Standalone Usage

Use SchedulerDataSource independently with programmatic access:

```vue
<script setup lang="ts">
import { 
  PantanalSchedulerDataSource, 
  type SchedulerEvent,
  type SchedulerDataSourceInstance
} from '@pantanal/grid'
import { ref } from 'vue'

const schedulerDataSource = ref<SchedulerDataSourceInstance | null>(null)
const events = ref<SchedulerEvent[]>([
  {
    taskId: 1,
    id: 1,
    title: 'Event 1',
    start: new Date('2024-02-01T09:00:00'),
    end: new Date('2024-02-01T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  },
])

const data = ref<SchedulerEvent[]>([])

function handleChange(newData: SchedulerEvent[]) {
  data.value = newData
}

function addEvent() {
  if (!schedulerDataSource.value) return
  
  const newEvent: Partial<SchedulerEvent> = {
    title: `Event ${events.value.length + 1}`,
    start: new Date('2024-02-01T09:00:00'),
    end: new Date('2024-02-01T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  }
  
  schedulerDataSource.value.add(newEvent)
}

function removeEvent() {
  if (!schedulerDataSource.value || data.value.length === 0) return
  
  const lastEvent = data.value[data.value.length - 1]
  const eventId = lastEvent.taskId || lastEvent.id
  if (eventId) {
    schedulerDataSource.value.remove(eventId)
  }
}
</script>

<template>
  <PantanalSchedulerDataSource
    ref="schedulerDataSource"
    :data="events"
    @change="handleChange"
  />
  
  <button @click="addEvent">Add Event</button>
  <button @click="removeEvent">Remove Last Event</button>
  
  <div>
    <p>Events: {{ data.length }}</p>
    <ul>
      <li v-for="event in data" :key="event.id || event.taskId">
        {{ event.title }} ({{ formatDate(event.start) }} - {{ formatDate(event.end) }})
      </li>
    </ul>
  </div>
</template>
```

### Props

All props from `PantanalDataSource` are supported, plus:

- `schema?: SchedulerDataSourceSchema` - Schema configuration with model field mapping and timezone

### Events

All events from `PantanalDataSource` are supported:

- `@change` - Fired when data changes
- `@error` - Fired when an error occurs
- `@requestStart` - Fired when a request starts
- `@requestEnd` - Fired when a request ends
- `@sync` - Fired when data is synchronized
- `@update:data` - Fired when data is updated
- `@update:page` - Fired when page changes
- `@update:pageSize` - Fired when page size changes
- `@update:sort` - Fired when sort changes
- `@update:filter` - Fired when filter changes
- `@update:group` - Fired when group changes

### Methods

- `events(): SchedulerEvent[]` - Returns all events
- `add(event: Partial<SchedulerEvent>): void` - Adds a new event
- `remove(event: SchedulerEvent | number | string): void` - Removes an event
- `update(event: SchedulerEvent): void` - Updates an event
- `data(): SchedulerEvent[]` - Returns current data
- `total(): number` - Returns total count
- `read(): Promise<void>` - Reads data from source
- `sync(): Promise<void>` - Synchronizes data
- `query(options?: any): void` - Queries data with options

### Schema Model Configuration

The schema model supports field mapping:

```typescript
interface SchedulerDataSourceSchemaModel {
  id?: SchedulerEventFieldConfig | string
  taskId?: SchedulerEventFieldConfig | string
  title?: SchedulerEventFieldConfig | string
  start?: SchedulerEventFieldConfig | string
  end?: SchedulerEventFieldConfig | string
  startTimezone?: SchedulerEventFieldConfig | string
  endTimezone?: SchedulerEventFieldConfig | string
  description?: SchedulerEventFieldConfig | string
  recurrenceId?: SchedulerEventFieldConfig | string
  recurrenceRule?: SchedulerEventFieldConfig | string
  recurrenceException?: SchedulerEventFieldConfig | string
  ownerId?: SchedulerEventFieldConfig | string
  isAllDay?: SchedulerEventFieldConfig | string
  [key: string]: SchedulerEventFieldConfig | string | undefined
}
```

### Timezone Support

Set timezone in schema for proper date handling:

```vue
<script setup lang="ts">
const schema: SchedulerDataSourceSchema = {
  timezone: 'America/New_York',
  model: {
    taskId: { from: 'taskId', type: 'number' },
    title: { from: 'title' },
    start: { from: 'start', type: 'date' },
    end: { from: 'end', type: 'date' },
  },
}
</script>
```

---

## TreeListDataSource Component

The `PantanalTreeListDataSource` component extends the `PantanalDataSource` component and provides specialized support for TreeList data structures. It includes field mapping, hierarchical support with parent-child relationships, and expand/collapse functionality.

### TreeListNode Interface

```typescript
interface TreeListNode {
  id: number | string
  parentId?: number | string | null
  expanded?: boolean
  [key: string]: any
}
```

### Basic Usage

```vue
<script setup lang="ts">
import { 
  PantanalTreeListDataSource, 
  PantanalGrid,
  type TreeListNode 
} from '@pantanal/grid'
import { ref } from 'vue'

const nodes = ref<TreeListNode[]>([
  {
    id: 1,
    parentId: null,
    firstName: 'John',
    lastName: 'Doe',
    position: 'CEO',
    phone: '555-0101',
    expanded: true,
  },
  {
    id: 2,
    parentId: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    position: 'CFO',
    phone: '555-0102',
    expanded: false,
  },
])

const data = ref<TreeListNode[]>([])

function handleChange(newData: TreeListNode[]) {
  data.value = newData
}
</script>

<template>
  <PantanalTreeListDataSource
    :data="nodes"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns"
    key-field="id"
  />
</template>
```

### Schema Configuration

Configure field mapping using schema model:

```vue
<script setup lang="ts">
import { 
  PantanalTreeListDataSource, 
  type TreeListDataSourceSchema 
} from '@pantanal/grid'

const data = [
  {
    EmployeeID: 1,
    ReportsTo: null,
    FirstName: 'John',
    LastName: 'Doe',
    Position: 'CEO',
    Phone: '555-0101',
    Extension: 1001,
  },
  {
    EmployeeID: 2,
    ReportsTo: 1,
    FirstName: 'Jane',
    LastName: 'Smith',
    Position: 'CFO',
    Phone: '555-0102',
    Extension: 1002,
  },
]

const schema: TreeListDataSourceSchema = {
  model: {
    id: { field: 'EmployeeID', type: 'number' },
    parentId: { field: 'ReportsTo', type: 'number', nullable: true },
    expanded: true,
    fields: {
      firstName: { field: 'FirstName', type: 'string' },
      lastName: { field: 'LastName', type: 'string' },
      position: { field: 'Position', type: 'string' },
      phone: { field: 'Phone', type: 'string' },
      extension: { field: 'Extension', type: 'number' },
    },
  },
}
</script>

<template>
  <PantanalTreeListDataSource
    :data="data"
    :schema="schema"
    @change="handleChange"
  />
</template>
```

### Remote TreeListDataSource

Load nodes from a remote API:

```vue
<script setup lang="ts">
import { 
  PantanalTreeListDataSource, 
  type TreeListDataSourceSchema,
  type DataSourceTransport 
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async (options) => {
    const response = await fetch('/api/treelist-nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: options.page,
        pageSize: options.pageSize,
      }),
    })
    return response.json()
  },
}

const schema: TreeListDataSourceSchema = {
  model: {
    id: { field: 'id', type: 'number' },
    parentId: { field: 'parentId', type: 'number', nullable: true },
    expanded: false,
    fields: {
      firstName: { field: 'firstName', type: 'string' },
      lastName: { field: 'lastName', type: 'string' },
      position: { field: 'position', type: 'string' },
      phone: { field: 'phone', type: 'string' },
    },
  },
  data: (response: any) => response.data || response,
  total: (response: any) => response.total || 0,
}
</script>

<template>
  <PantanalTreeListDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
</template>
```

### Standalone Usage

Use TreeListDataSource independently with programmatic access:

```vue
<script setup lang="ts">
import { 
  PantanalTreeListDataSource, 
  type TreeListNode,
  type TreeListDataSourceInstance
} from '@pantanal/grid'
import { ref, computed } from 'vue'

const treeListDataSource = ref<TreeListDataSourceInstance | null>(null)
const nodes = ref<TreeListNode[]>([
  {
    id: 1,
    parentId: null,
    firstName: 'Root',
    lastName: 'Node',
    position: 'Manager',
    expanded: true,
  },
])

const data = ref<TreeListNode[]>([])

const rootNodes = computed(() => {
  if (!treeListDataSource.value) return []
  return treeListDataSource.value.rootNodes()
})

function handleChange(newData: TreeListNode[]) {
  data.value = newData
}

function addNode() {
  if (!treeListDataSource.value) return
  
  const newNode: Partial<TreeListNode> = {
    firstName: `Node${nodes.value.length + 1}`,
    lastName: '',
    position: 'Employee',
    parentId: rootNodes.value.length > 0 ? rootNodes.value[0].id : null,
    expanded: false,
  }
  
  treeListDataSource.value.add(newNode)
}

function expandNode() {
  if (!treeListDataSource.value || rootNodes.value.length === 0) return
  treeListDataSource.value.expand(rootNodes.value[0].id)
}
</script>

<template>
  <PantanalTreeListDataSource
    ref="treeListDataSource"
    :data="nodes"
    @change="handleChange"
  />
  
  <button @click="addNode">Add Node</button>
  <button @click="expandNode">Expand First Root Node</button>
  
  <div>
    <p>Root Nodes: {{ rootNodes.length }}</p>
    <ul>
      <li v-for="node in rootNodes" :key="node.id">
        {{ node.firstName }} {{ node.lastName }} (ID: {{ node.id }}{{ node.expanded ? ', Expanded' : '' }})
      </li>
    </ul>
  </div>
</template>
```

### Props

All props from `PantanalDataSource` are supported, plus:

- `schema?: TreeListDataSourceSchema` - Schema configuration with model field mapping

### Events

All events from `PantanalDataSource` are supported:

- `@change` - Fired when data changes
- `@error` - Fired when an error occurs
- `@requestStart` - Fired when a request starts
- `@requestEnd` - Fired when a request ends
- `@sync` - Fired when data is synchronized
- `@update:data` - Fired when data is updated
- `@update:page` - Fired when page changes
- `@update:pageSize` - Fired when page size changes
- `@update:sort` - Fired when sort changes
- `@update:filter` - Fired when filter changes
- `@update:group` - Fired when group changes

### Methods

- `data(): TreeListNode[]` - Returns all nodes
- `add(node: Partial<TreeListNode>): void` - Adds a new node
- `remove(node: TreeListNode | number | string): void` - Removes a node
- `update(node: TreeListNode): void` - Updates a node
- `rootNodes(): TreeListNode[]` - Returns root nodes (nodes without parent)
- `getNode(id: number | string): TreeListNode | null` - Gets a node by id
- `expand(node: TreeListNode | number | string): void` - Expands a node
- `collapse(node: TreeListNode | number | string): void` - Collapses a node
- `total(): number` - Returns total count
- `read(): Promise<void>` - Reads data from source
- `sync(): Promise<void>` - Synchronizes data
- `query(options?: any): void` - Queries data with options

### Schema Model Configuration

The schema model supports field mapping:

```typescript
interface TreeListDataSourceSchemaModel {
  id?: TreeListFieldConfig | string
  parentId?: TreeListFieldConfig | string
  expanded?: boolean | string | ((item: any) => boolean)
  fields?: Record<string, TreeListFieldConfig>
}
```

### Expanded Configuration

The `expanded` property can be configured in several ways:

- `boolean` - All nodes expanded or collapsed by default
- `string` - Field name that contains the expanded state
- `Function` - Function that returns whether a node should be expanded: `(item: any) => boolean`

---

## Pagination Component

The Pagination component can be used independently without the Grid component. Perfect for custom data displays, lists, or any paginated content.

### Basic Usage

```vue
<script setup lang="ts">
import { Pagination as PantanalPagination } from '@pantanal/grid'
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
const total = ref(100)
</script>

<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="simple"
    :showTotal="true"
    :showText="true"
    :showIcons="true"
    @update:page="page = $event"
  />
</template>
```

### Variants

The Pagination component supports three variants:

#### Simple Variant

Simple pagination with previous/next buttons:

```vue
<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="simple"
    :showTotal="true"
    :showText="true"
    :showIcons="true"
    @update:page="page = $event"
  />
</template>
```

#### Pages Variant

Pagination with numbered page buttons:

```vue
<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="pages"
    :maxPages="7"
    :showTotal="true"
    :showText="true"
    :showIcons="true"
    :showPageSize="true"
    :pageSizeOptions="[5, 10, 20, 50]"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>
```

#### Edges Variant

Pagination with first/last buttons and numbered pages:

```vue
<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="edges"
    :maxPages="5"
    :showTotal="true"
    :showText="false"
    :showIcons="true"
    :showPageSize="true"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>
```

### Custom Content with Pagination

Use Pagination with any custom content:

```vue
<script setup lang="ts">
import { Pagination as PantanalPagination } from '@pantanal/grid'
import { ref, computed } from 'vue'

const products = ref([
  { id: 1, name: 'Product 1', price: 99.99 },
  { id: 2, name: 'Product 2', price: 49.99 },
  // ... more products
])

const page = ref(1)
const pageSize = ref(9)
const total = computed(() => products.value.length)

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return products.value.slice(start, start + pageSize.value)
})
</script>

<template>
  <div>
    <!-- Your custom content -->
    <div class="grid gap-3 md:grid-cols-3">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="p-4 border rounded-lg">
        <h4>{{ product.name }}</h4>
        <p>Price: ${{ product.price.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <PantanalPagination
      :page="page"
      :pageSize="pageSize"
      :total="total"
      variant="pages"
      :maxPages="5"
      :showTotal="true"
      :showText="true"
      :showIcons="true"
      :showPageSize="true"
      @update:page="page = $event"
      @update:pageSize="pageSize = $event"
    />
  </div>
</template>
```

### Dense Variant

Compact pagination for space-constrained layouts:

```vue
<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="pages"
    :maxPages="5"
    :showTotal="true"
    :showText="false"
    :showIcons="true"
    dense
    @update:page="page = $event"
  />
</template>
```

### Internationalization

Pagination supports multiple locales:

```vue
<template>
  <!-- English -->
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="simple"
    locale="en"
    @update:page="page = $event"
  />
  
  <!-- Spanish -->
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="simple"
    locale="es"
    @update:page="page = $event"
  />
  
  <!-- Portuguese -->
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="simple"
    locale="pt"
    @update:page="page = $event"
  />
</template>
```

### Pagination Props

- `page` - `number` - Current page number (required)
- `pageSize` - `number` - Number of items per page (required)
- `total` - `number` - Total number of items (required)
- `variant` - `'simple' | 'pages' | 'edges'` - Pagination variant (default: `'simple'`)
- `showTotal` - `boolean` - Show total items count (default: `true`)
- `maxPages` - `number` - Maximum number of page buttons to show (default: `5`)
- `locale` - `Locale | string` - Locale for translations (default: `'pt'`)
- `messages` - `Partial<Messages>` - Custom messages override
- `showText` - `boolean` - Show text labels on buttons (default: `true`)
- `showIcons` - `boolean` - Show icons on buttons (default: `true`)
- `showPageSize` - `boolean` - Show page size selector (default: `false`)
- `pageSizeOptions` - `number[]` - Available page size options (default: `[10, 20, 50, 100]`)
- `dense` - `boolean` - Use compact/dense layout (default: `false`)
- `tailwind` - `boolean` - Use Tailwind CSS classes (default: `true`)

### Pagination Events

- `update:page` - Emitted when page changes
- `update:pageSize` - Emitted when page size changes

---

## Keyboard Navigation

The keyboard support of the Grid is always available when the `navigatable` prop is enabled. To apply the keyboard shortcuts, focus the Grid by clicking the example area and pressing the `Tab` key.

### Header Shortcuts

The following keyboard shortcuts apply to the header of the Grid:

| Shortcut | Description |
|:--- |:--- |
| `Enter` | Sort by the column |
| `Alt` + `Down` | Opens the filter menu |
| `Esc` | Closes the filter menu |
| `Tab` | (Default browser behavior) Navigates through the elements in the filter menu |
| `Shift` + `Tab` | Same as `Tab`, but in reverse order |
| `Ctrl` + `Left Arrow` | Reorders the column with the previous one |
| `Ctrl` + `Right Arrow` | Reorders the column with the next one |

### Body Shortcuts

The following keyboard shortcuts apply to the data table of the Grid:

| Shortcut | Description |
|:--- |:--- |
| `Arrow Keys` | Navigate over the cells |
| `Enter` | Toggles the expand and collapse state on group row |
| `Page Up` | Navigates to the previous page |
| `Page Down` | Navigates to the next page |
| `Space` | Selects the row which holds the currently highlighted cell |
| `Ctrl` + `Space` | Selects or deselects the current row while persisting the previously selected rows (only for multiple selection mode) |
| `Shift` + `Space` | Performs range selection. Selects all the rows between the last selected one (with `Space` or mouse-click) and the one which holds the focused cell |
| `Shift` + `Arrow Keys` | Adds the row which holds the focused cell to the selection (only for multiple selection mode) |
| `Ctrl` + `Home` | Focuses the first focusable element inside the body |
| `Ctrl` + `End` | Focuses the last focusable cell in the last row |
| `Home` | Focuses the first focusable cell in the row |
| `End` | Focuses the last focusable cell in the row |

### Basic Usage

Enable keyboard navigation by setting the `navigatable` prop to `true`:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :navigatable="true"
    :selectable="'multiple'"
    :sortable="true"
    :pageable="true"
    :filterable="true"
    :enable-column-reorder="true"
    key-field="id"
  />
</template>
```

The focused cell will be highlighted with a green outline. You can navigate through the grid using arrow keys, select rows with `Space`, sort columns with `Enter` in the header, and perform many other operations using keyboard shortcuts.

---

## Events Summary

Pantanal Grid emits the following events for integration with parent components:

### v-model Events
- `update:sort` — Sort descriptors array
- `update:page` — Current page number
- `update:pageSize` — Page size
- `update:filter` — Filter descriptors array

### Data Events
- `databinding` — Fired before data is loaded/bound
- `databound` — Fired after data is loaded/bound

### Operation Events
- `sort` — Fired when sorting changes
- `filter` — Fired when filtering changes
- `group` — Fired when grouping changes
- `groupexpand` — Fired when a group is expanded
- `groupcollapse` — Fired when a group is collapsed

### Interaction Events
- `selectionChange` — Array of selected rows
- `rowClick` — Emits the clicked row
- `columnResize` — `{ field, width }`
- `columnReorder` — `{ from, to }`
- `toggleGroup` — `(key, expanded)`

### Status Events
- `loading` — Boolean flag around asynchronous data-provider calls
- `error` — Fired when an error occurs

For detailed information about Grid events, see the [Grid Events](#grid-events) section above.

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
