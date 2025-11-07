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
