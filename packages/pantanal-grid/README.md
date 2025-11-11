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

## RTL Support

Pantanal Grid supports right-to-left (RTL) layouts for languages like Arabic, Hebrew, and Persian. Enable RTL by setting the `rtl` prop to `true`.

### Basic Usage

Enable RTL support by setting the `rtl` prop to `true`:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :rtl="true"
    :sortable="true"
    :filterable="true"
    :pageable="true"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Alpha', price: 9.9 },
  { id: 2, name: 'Beta', price: 19.5 },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
]
</script>
```

### Dynamic RTL Toggle

You can dynamically toggle RTL mode using a reactive prop:

```vue
<template>
  <div>
    <label>
      <input type="checkbox" v-model="rtlEnabled" />
      Enable RTL
    </label>
    
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      :rtl="rtlEnabled"
      key-field="id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rtlEnabled = ref(false)
// ... rows and columns
</script>
```

### RTL Features

When RTL is enabled, the grid automatically:
- Inverts text alignment and layout direction
- Swaps border positions (left/right)
- Adjusts column resizer position
- Mirrors locked columns (left becomes right)
- Adjusts spacing and margins for proper RTL layout
- Works seamlessly with sorting, filtering, grouping, and pagination

---

## Selection

Pantanal Grid supports row selection functionality. You can enable single-row selection, multiple-row selection, and checkbox-based selection.

### Single-Row Selection

Enable single-row selection by setting the `selectable` prop to `"single"`:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'single'"
    key-field="id"
    @selectionChange="selected = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
]

const selected = ref([])
</script>
```

### Multiple-Row Selection

Enable multiple-row selection by setting the `selectable` prop to `"multiple"`:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    key-field="id"
    @selectionChange="selected = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const selected = ref([])
</script>
```

### Selection with Keyboard Navigation

When `navigatable` is enabled, you can use keyboard shortcuts to select rows:

- `Space` - Select/deselect current row
- `Ctrl+Space` - Toggle selection (multiple mode)
- `Shift+Space` - Range selection (multiple mode)
- `Shift+Arrow Keys` - Extend selection (multiple mode)

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    :navigatable="true"
    key-field="id"
    @selectionChange="selected = $event"
  />
</template>
```

### Selection with Paging

Selection works with paging. When you navigate between pages, selected rows are maintained within each page. Use the `persistSelection` prop (when available) to persist selection across pages.

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    :pageable="true"
    :page="page"
    :pageSize="pageSize"
    key-field="id"
    @selectionChange="selected = $event"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>
```

### Programmatic Selection

You can programmatically control selection by listening to `@selectionChange` events and managing the selection state:

```vue
<template>
  <div>
    <button @click="selectAll">Select All</button>
    <button @click="clearSelection">Clear Selection</button>
    
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      :selectable="'multiple'"
      key-field="id"
      @selectionChange="selected = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const selected = ref([])

function selectAll() {
  selected.value = rows.value.map(r => r.id)
}

function clearSelection() {
  selected.value = []
}
</script>
```

### Selection Events

- `selectionChange` - Emitted when selection changes
  ```typescript
  (selectedKeys: unknown[]) => void
  ```
- `rowClick` - Emitted when a row is clicked
  ```typescript
  (row: unknown) => void
  ```

### Selection Modes

- `false` (default) - Selection disabled
- `"single"` - Single-row selection
- `"multiple"` - Multiple-row selection with checkboxes

---

## Persisting the State

You can save and restore the Grid's current state (sorting, filtering, pagination, column order, widths, etc.) using either automatic persistence via the `persistStateKey` prop or manual methods `getOptions()` and `setOptions()`.

### Automatic Persistence

Use the `persistStateKey` prop to automatically save and restore the grid state using localStorage:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :persist-state-key="'my-grid-state'"
    key-field="id"
  />
</template>
```

The grid will automatically:
- Save state changes (sort, filter, page, pageSize, column order, widths, selection if `persistSelection` is enabled) to localStorage
- Restore the saved state when the component mounts

### Manual State Management

For more control over when and how state is saved, use the `getOptions()` and `setOptions()` methods:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid> | null>(null)

const rows = ref([
  { id: 1, ContactName: 'Maria Anders', ContactTitle: 'Sales Representative', CompanyName: 'Alfreds Futterkiste', Country: 'Germany' },
  { id: 2, ContactName: 'Ana Trujillo', ContactTitle: 'Owner', CompanyName: 'Ana Trujillo Emparedados y helados', Country: 'Mexico' },
  // ... more data
])

const columns: ColumnDef[] = [
  { field: 'ContactName', title: 'Contact Name', width: 250, locked: true },
  { field: 'ContactTitle', title: 'Contact Title', width: 350 },
  { field: 'CompanyName', title: 'Company Name', width: 350 },
  { field: 'Country', title: 'Country', width: 450 },
]

const saveState = () => {
  if (!gridRef.value) return
  const options = gridRef.value.getOptions()
  localStorage.setItem('pantanal-grid-options', JSON.stringify(options))
  alert('Grid state saved successfully!')
}

const loadState = () => {
  if (!gridRef.value) return
  const saved = localStorage.getItem('pantanal-grid-options')
  if (saved) {
    const options = JSON.parse(saved)
    gridRef.value.setOptions(options)
    alert('Grid state loaded successfully!')
  } else {
    alert('No saved state found')
  }
}
</script>

<template>
  <div>
    <button @click="saveState">Save State</button>
    <button @click="loadState">Load State</button>
    
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
      :groupable="true"
      :sortable="true"
      :enable-column-reorder="true"
      :enable-column-resize="true"
      :column-menu="true"
      :filterable-mode="'row'"
      :pageable="true"
      :pageable-page-sizes="true"
    />
  </div>
</template>
```

### State Options

The `getOptions()` method returns an object with the following properties:

- `sort?: SortDescriptor[]` - Current sorting configuration
- `filter?: FilterDescriptor[]` - Current filtering configuration
- `page?: number` - Current page number
- `pageSize?: number` - Current page size
- `order?: number[]` - Column order (from reordering)
- `widths?: (number | undefined)[]` - Column widths (from resizing)
- `selectedKeys?: any[]` - Selected row keys (if `persistSelection` is enabled)

### Notes

- State persistence only works for client-side operations. Server-side sorting, filtering, and pagination should be managed by your data provider.
- Column grouping is controlled via props and cannot be set via `setOptions()`. Manage grouping state separately if needed.
- The `persistSelection` prop enables automatic persistence of selected rows across page navigation.

---

## Custom Commands

The Grid allows you to implement custom command columns with custom buttons and click handlers. You can create buttons with custom text, icons, classes, templates, and click handlers for each row.

### Basic Usage

Add a custom command column by setting the `command` property on a column definition:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
}

const rows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39 },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17 },
])

const columns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: {
      text: 'View Details',
      click: (e: MouseEvent, row: Product) => {
        e.preventDefault()
        alert(`Viewing details for: ${row.productName}`)
        console.log(row)
      },
    },
    title: ' ',
    width: 120,
  },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :resizable="true"
  />
</template>
```

### Multiple Commands

You can add multiple custom commands in a single column by using an array:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name' },
  {
    command: [
      {
        name: 'view',
        text: 'View',
        click: (e: MouseEvent, row: Product) => {
          alert(`Viewing: ${row.productName}`)
        },
      },
      {
        name: 'edit',
        text: 'Edit',
        click: (e: MouseEvent, row: Product) => {
          alert(`Editing: ${row.productName}`)
        },
      },
      {
        name: 'delete',
        text: 'Delete',
        className: 'text-red-600',
        click: (e: MouseEvent, row: Product) => {
          if (confirm(`Delete ${row.productName}?`)) {
            alert(`${row.productName} deleted`)
          }
        },
      },
    ],
    title: 'Actions',
    width: 200,
  },
]
</script>
```

### Command Properties

Each command object supports the following properties:

- `name?: string` - Command name (required for array commands, optional for single object)
- `text?: string` - Button text
- `iconClass?: string` - CSS class for icon (or Unicode character/emoji)
- `className?: string` - Additional CSS classes for the button
- `template?: string | ((row: T) => string)` - Custom HTML template for the button content
- `click?: (e: MouseEvent, row: T) => void` - Click handler function
- `visible?: (row: T) => boolean` - Function to conditionally show/hide the command

### Commands with Icons

You can add icons to commands using CSS classes or Unicode characters:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    command: [
      {
        name: 'view',
        text: ' View',
        iconClass: '🔍',
        click: (e: MouseEvent, row: Product) => {
          alert(`Viewing: ${row.productName}`)
        },
      },
      {
        name: 'edit',
        text: ' Edit',
        iconClass: '✏️',
        click: (e: MouseEvent, row: Product) => {
          alert(`Editing: ${row.productName}`)
        },
      },
    ],
    title: 'Actions',
    width: 180,
  },
]
</script>
```

### Conditional Commands

Commands can be conditionally visible based on row data:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    command: [
      {
        name: 'restock',
        text: 'Restock',
        visible: (row: Product) => row.unitsInStock < 20,
        click: (e: MouseEvent, row: Product) => {
          alert(`Restocking ${row.productName}`)
        },
      },
      {
        name: 'discontinue',
        text: 'Discontinue',
        visible: (row: Product) => !row.discontinued,
        click: (e: MouseEvent, row: Product) => {
          if (confirm(`Discontinue ${row.productName}?`)) {
            alert(`${row.productName} discontinued`)
          }
        },
      },
    ],
    title: 'Actions',
    width: 150,
  },
]
</script>
```

### Custom Templates

Commands can use custom templates for more complex button rendering:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    command: {
      name: 'custom',
      template: (row: Product) => {
        const stockStatus = row.unitsInStock > 20 ? '✅ In Stock' : '⚠️ Low Stock'
        return `<span style="color: ${row.unitsInStock > 20 ? 'green' : 'orange'}; font-weight: bold;">${stockStatus}</span>`
      },
      click: (e: MouseEvent, row: Product) => {
        alert(`Stock status for ${row.productName}: ${row.unitsInStock} units`)
      },
    },
    title: 'Stock Status',
    width: 150,
  },
]
</script>
```

### Built-in Commands

The Grid also supports built-in commands for editing:

- `'edit'` - Edit button (switches between Edit/Update/Cancel based on editing state)
- `'destroy'` - Delete button
- `'save'` - Save button
- `'cancel'` - Cancel button

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name' },
  {
    command: ['edit', 'destroy'],
    title: 'Actions',
    width: 120,
  },
]
</script>
```

Built-in commands work with the Grid's editing functionality. See the [Editing](#editing) section for more details.

---

## Foreign-Key Columns

Foreign-key columns allow you to display and edit relationships between data using dropdown lists. The grid automatically creates a dropdown editor when you define the `values` property on a column.

### Basic Usage

Define a foreign-key column by setting the `values` property with an array of `{ value, text }` objects:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  categoryID: number
  discontinued: boolean
}

const rows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 1, discontinued: false },
  { productID: 4, productName: 'Chef Anton', unitPrice: 22, categoryID: 2, discontinued: false },
])

const categories = [
  { value: 1, text: 'Beverages' },
  { value: 2, text: 'Condiments' },
  { value: 3, text: 'Confections' },
  { value: 4, text: 'Dairy Products' },
  { value: 5, text: 'Grains/Cereals' },
]

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    values: categories,
    editable: true,
  },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :editable="true"
    :toolbar="['create', 'save', 'cancel']"
  />
</template>
```

### How It Works

1. **Display**: The grid automatically displays the `text` from the `values` array that matches the `value` stored in the data.
2. **Editing**: When editing, the grid automatically creates a dropdown (`<select>`) with all available options from the `values` array.
3. **Storage**: The grid stores the `value` (not the `text`) in the data when a selection is made.

### Custom Editor

You can also provide a custom editor function for more control over the dropdown rendering:

```vue
<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    editable: true,
    editor: (container: HTMLElement, options: { field: string; value: any; row: Product }) => {
      const select = document.createElement('select')
      select.className = 'v3grid__editor'
      select.style.width = '100%'
      
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = String(cat.value)
        option.textContent = cat.text
        if (cat.value === options.value) {
          option.selected = true
        }
        select.appendChild(option)
      })
      
      container.appendChild(select)
      return select
    },
  },
]
</script>
```

### Validation

Foreign-key columns can include validation to ensure the selected value is valid:

```vue
<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    values: categories,
    editable: true,
    validation: {
      required: true,
      validator: (value: any) => {
        if (value == null || value === '') {
          return 'Category is required'
        }
        const validValues = categories.map(c => c.value)
        if (!validValues.includes(value)) {
          return 'Invalid category selected'
        }
        return true
      },
    },
  },
]
</script>
```

### Value Types

The `value` property in the `values` array should match the type of the field in your data. For example:

- **Numbers**: `{ value: 1, text: 'Beverages' }` for `categoryID: number`
- **Strings**: `{ value: 'active', text: 'Active' }` for `status: string`
- **Mixed types**: The grid will handle type conversion automatically when possible

### Notes

- The `values` property is optional. If not provided, the column will display the raw value.
- When `values` is provided, the grid automatically transforms the display value (shows `text` instead of `value`).
- The grid creates a dropdown editor automatically when `values` is defined and the column is editable.
- You can override the automatic dropdown by providing a custom `editor` function.

---

## Locked Columns

Locked columns allow you to display a grid with a large number of columns on limited viewports. A small subset of columns can be made static (locked) while scrolling the rest horizontally to make them visible.

### Basic Usage

To lock a column, set the `locked` property to `true` or `'left'` for left-side locks, or `'right'` for right-side locks:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Order {
  orderID: number
  shipCountry: string
  shipCity: string
  shipName: string
  shipAddress: string
  freight: number
  orderDate: string
}

const rows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
])

const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true, // Lock on left side
    lockable: false, // Cannot be unlocked
    width: 120,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'shipCity',
    title: 'Ship City',
    width: 180,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true, // Lock on left side
    width: 240,
  },
  {
    field: 'shipAddress',
    title: 'Ship Address',
    lockable: false, // Cannot be locked (even if user tries via column menu)
    width: 240,
  },
  {
    field: 'freight',
    title: 'Freight',
    width: 120,
    format: '{0:c}',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
  },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="orderID"
    :sortable="true"
    :pageable="true"
    :column-menu="true"
    :filterable="true"
    :enable-column-resize="true"
    :groupable="true"
    :enable-column-reorder="true"
    :height="600"
  />
</template>
```

### Locked Left and Right

You can lock columns on both the left and right sides of the grid:

```vue
<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: 'left', // Lock on left side
    width: 120,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
    locked: 'right', // Lock on right side
  },
]
</script>
```

### Lockable Property

The `lockable` property controls whether a column can be locked or unlocked by the user via the column menu:

- `lockable: true` (default): The column can be locked/unlocked by the user
- `lockable: false`: The column cannot be locked/unlocked by the user (useful for primary keys that should always remain locked)

```vue
<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false, // Cannot be unlocked
    width: 120,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    lockable: true, // Can be unlocked via column menu
    width: 240,
  },
]
</script>
```

### How It Works

1. **Locked Left Columns**: Columns with `locked: true` or `locked: 'left'` are rendered in a fixed left panel that doesn't scroll horizontally.
2. **Locked Right Columns**: Columns with `locked: 'right'` are rendered in a fixed right panel that doesn't scroll horizontally.
3. **Unlocked Columns**: Columns without the `locked` property are rendered in the scrollable middle section.
4. **Synchronized Scrolling**: Locked columns scroll vertically in sync with the unlocked columns.
5. **Column Menu**: Users can lock/unlock columns via the column menu (if `lockable: true`).

### Unlocking Columns

To unlock a locked column:

1. **Via Column Menu**: Click the column menu button (three dots) in the column header, then click the "Unlock" button.
2. **Programmatically**: Update the column definition to remove the `locked` property or set it to `false`.

**Note**: Columns with `lockable: false` cannot be unlocked via the column menu.

```vue
<script setup lang="ts">
// To unlock programmatically, update the columns array
const columns = ref<ColumnDef<Order>[]>([
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true, // Initially locked
    lockable: true, // Can be unlocked
    width: 120,
  },
  // ... other columns
])

// To unlock a column programmatically:
function unlockColumn(field: string) {
  const col = columns.value.find(c => c.field === field)
  if (col && col.lockable !== false) {
    col.locked = undefined // Remove locked property
  }
}
</script>
```

### Notes

- Locked columns are useful for displaying key data (like IDs or names) that should always be visible while scrolling through many columns.
- The `lockable` property prevents users from changing the lock state of certain columns (useful for primary keys).
- Locked columns work independently of pinned columns (`pinned` property).
- Locked columns do not overlap the footer, making them ideal for financial dashboards and reports with summaries.
- To unlock a column via UI, use the column menu (three dots button) and click "Unlock".

---

## Column Menu

The Column Menu allows users to perform column operations such as sorting, filtering, showing/hiding columns, and locking/unlocking columns. Enable it by setting the `columnMenu` prop to `true`.

### Basic Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :column-menu="true"
    :sortable="true"
    :filterable="true"
    key-field="id"
  />
</template>
```

### Column Menu Features

The column menu includes the following features:

1. **Show/Hide Columns**: Users can show or hide columns by checking/unchecking them in the menu.
2. **Sorting**: Users can sort columns ascending, descending, or remove sorting (if `sortableAllowUnsort` is enabled).
3. **Filtering**: Users can filter columns (opens filter dialog).
4. **Lock/Unlock**: Users can lock or unlock columns (if `lockable` is not `false`).

### Configuration Options

#### `columnMenu`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable or disable the column menu.

```vue
<PantanalGrid :column-menu="true" />
```

#### `columnMenuColumns`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Show or hide the column visibility section in the menu.

```vue
<PantanalGrid :column-menu="true" :column-menu-columns="true" />
```

#### `columnMenuSortable`

- **Type**: `boolean`
- **Default**: `undefined` (inherits from `sortable`)
- **Description**: Show or hide sorting options in the menu. If `undefined`, it inherits from the `sortable` prop.

```vue
<PantanalGrid :column-menu="true" :sortable="true" :column-menu-sortable="true" />
```

#### `columnMenuFilterable`

- **Type**: `boolean`
- **Default**: `undefined` (inherits from `filterable`)
- **Description**: Show or hide filtering options in the menu. If `undefined`, it inherits from the `filterable` prop.

```vue
<PantanalGrid :column-menu="true" :filterable="true" :column-menu-filterable="true" />
```

### Column-Level Configuration

You can disable specific operations for individual columns:

```vue
<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', filterable: false }, // Filtering disabled
  { field: 'unitPrice', title: 'Unit Price', sortable: false }, // Sorting disabled
  { field: 'category', title: 'Category', lockable: false }, // Locking disabled
]
</script>
```

### Disabled Operations

The column menu automatically detects when a column operation is disabled and excludes the corresponding UI:

- If `column.filterable === false`, the filter option is not shown for that column.
- If `column.sortable === false`, the sort options are not shown for that column.
- If `column.lockable === false`, the lock/unlock option is not shown for that column.

### Events

The column menu emits the following events:

- `columnmenuopen`: Fired when the column menu is opened.
- `columnmenuinit`: Fired when the column menu is initialized (allows customization).
- `columnlock`: Fired when a column is locked.
- `columnunlock`: Fired when a column is unlocked.

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :column-menu="true"
    @columnmenuopen="handleColumnMenuOpen"
    @columnlock="handleColumnLock"
    @columnunlock="handleColumnUnlock"
  />
</template>

<script setup lang="ts">
function handleColumnMenuOpen(event: { column: ColumnDef; field: string }) {
  console.log('Column menu opened for:', event.field)
}

function handleColumnLock(event: { column: ColumnDef; field: string }) {
  console.log('Column locked:', event.field)
}

function handleColumnUnlock(event: { column: ColumnDef; field: string }) {
  console.log('Column unlocked:', event.field)
}
</script>
```

### Customization

You can customize the column menu by listening to the `columnmenuinit` event and modifying the menu container:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :column-menu="true"
    @columnmenuinit="handleColumnMenuInit"
  />
</template>

<script setup lang="ts">
function handleColumnMenuInit(event: { column: ColumnDef; field: string; container: HTMLElement }) {
  // Add custom menu items or modify the menu
  const customButton = document.createElement('button')
  customButton.textContent = 'Custom Action'
  customButton.onclick = () => {
    console.log('Custom action for column:', event.field)
  }
  event.container.appendChild(customButton)
}
</script>
```

### Examples

#### Basic Column Menu

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :column-menu="true"
    :sortable="true"
    :filterable="true"
    key-field="productID"
  />
</template>
```

#### Column Menu with Disabled Filtering

```vue
<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'category', title: 'Category', width: 180, filterable: false },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :column-menu="true"
    :sortable="true"
    :filterable="true"
    key-field="productID"
  />
</template>
```

#### Custom Column Menu Configuration

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :column-menu="true"
    :column-menu-columns="true"
    :sortable="true"
    :column-menu-sortable="true"
    :filterable="true"
    :column-menu-filterable="false"
    key-field="productID"
  />
</template>
```

### Notes

- The column menu button appears in the column header when `columnMenu` is enabled.
- The menu respects column-level configurations (e.g., `filterable: false`, `sortable: false`, `lockable: false`).
- You can customize the menu by listening to events and modifying the menu container.
- The menu automatically closes when clicking outside of it.

---

## Multi-Column Headers

The Grid supports multi-column headers by specifying column groups which incorporate inner column structures. You can nest columns by using the `columns` property of a column definition.

### Basic Usage

To create multi-column headers, nest column definitions using the `columns` property:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :sortable="true"
    :filterable="true"
    :height="400"
  />
</template>
```

### How It Works

1. **Column Groups**: Columns with a `columns` property are treated as group columns and don't have a `field` property.
2. **Leaf Columns**: Columns with a `field` property are leaf columns that display actual data.
3. **Header Levels**: The grid automatically calculates the number of header levels based on the nesting depth.
4. **Header Rendering**: Multi-level headers are rendered using HTML table structure with proper `colspan` and `rowspan` attributes.

### Nested Column Groups

You can nest column groups to create multiple levels of headers:

```vue
<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      {
        title: 'Pricing',
        columns: [
          { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
        ]
      },
      {
        title: 'Inventory',
        columns: [
          { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
          { field: 'unitsOnOrder', title: 'Units On Order', width: 120 },
        ]
      },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
]
</script>
```

### Features

Multi-column headers support all standard grid features:

- **Sorting**: You can sort by leaf columns (columns with `field` property).
- **Filtering**: You can filter by leaf columns.
- **Column Menu**: Column menu works with leaf columns.
- **Column Resize**: You can resize leaf columns.
- **Column Reorder**: Column reordering works with leaf columns.
- **Grouping**: You can group by leaf columns.

### Notes

- Only columns with a `field` property are rendered in the grid body (leaf columns).
- Group columns (columns with `columns` property) are only displayed in the header.
- The grid automatically calculates the header structure based on the nesting depth.
- Multi-column headers work with all grid features (sorting, filtering, grouping, etc.).
- Column operations (sort, filter, etc.) only apply to leaf columns.

---

## Pinned Columns

Pinned columns stick to the viewport while scrolling horizontally. They remain visible at all times and can overlap the footer. This is different from locked columns, which do not overlap the footer.

### Basic Usage

To pin a column, set the `pinned` property to `true`, `'left'`, or `'right'`:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Row {
  id: number
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  status: string
}

const rows = ref<Row[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', department: 'Engineering', position: 'Tech Lead', salary: 120000, status: 'Active' },
])

const columns: ColumnDef<Row>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'status', title: 'Status', width: 100 },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :pageable="true"
    :pinned-shadows="true"
    :height="500"
  />
</template>
```

### Pinned Left and Right

You can pin columns on both the left and right sides of the grid:

```vue
<script setup lang="ts">
const columns: ColumnDef<Row>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'status', title: 'Status', pinned: 'right', width: 100 },
]
</script>
```

### Pinned Shadows

Enable shadows on pinned columns to create a visual separation between pinned and scrollable columns:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :pinned-shadows="true"
    :height="500"
  />
</template>
```

### How It Works

1. **Pinned Left Columns**: Columns with `pinned: true` or `pinned: 'left'` are rendered with `position: sticky` and stick to the left side of the viewport.
2. **Pinned Right Columns**: Columns with `pinned: 'right'` are rendered with `position: sticky` and stick to the right side of the viewport.
3. **Overlapping Footer**: Pinned columns can overlap the footer when scrolling, unlike locked columns.
4. **Shadows**: The `pinned-shadows` prop adds visual shadows to indicate the pinned columns.

### Pinned vs Locked Columns

- **Pinned Columns**: Use CSS `position: sticky`, can overlap footer, simpler implementation, better for general use cases.
- **Locked Columns**: Use separate containers, never overlap footer, more complex implementation, better for financial dashboards with summaries.

### Notes

- Pinned columns are useful for keeping important data visible while scrolling through many columns.
- Pinned columns work with all grid features (sorting, filtering, grouping, etc.).
- The `pinned-shadows` prop adds visual separation between pinned and scrollable columns.
- Pinned columns can overlap the footer, which may not be desirable for dashboards with summaries.

---

## Column Menu

The Grid supports a column menu that provides quick access to column operations such as showing/hiding columns, filtering, sorting, and locking/unlocking columns.

### Basic Usage

Enable the column menu by setting the `columnMenu` prop to `true`:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import { ref } from 'vue'

const rows = ref([
  { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :columnMenu="true"
    key-field="id"
  />
</template>
```

### Column Menu Features

The column menu supports the following features:

#### Show/Hide Columns

By default, the column menu allows users to show and hide columns. Control this with the `columnMenuColumns` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :columnMenu="true"
  :columnMenuColumns="true"
  key-field="id"
/>
```

#### Sorting

When `sortable` is enabled, the column menu includes sorting options. Control this with the `columnMenuSortable` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :columnMenu="true"
  :sortable="true"
  :columnMenuSortable="true"
  key-field="id"
/>
```

#### Filtering

When `filterable` is enabled, the column menu includes filtering options. Control this with the `columnMenuFilterable` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :columnMenu="true"
  :filterable="true"
  :columnMenuFilterable="true"
  key-field="id"
/>
```

### Column Menu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnMenu` | `boolean` | `false` | Enable/disable the column menu |
| `columnMenuColumns` | `boolean` | `true` | Show/hide the column visibility option in the menu |
| `columnMenuFilterable` | `boolean \| undefined` | `undefined` | Show/hide the filter option in the menu. If `undefined`, follows `filterable` prop |
| `columnMenuSortable` | `boolean \| undefined` | `undefined` | Show/hide the sort option in the menu. If `undefined`, follows `sortable` prop |

### Column Menu Messages

Customize the column menu messages using the `messages` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :columnMenu="true"
  :messages="{
    columnMenuColumns: 'Colunas',
    columnMenuFilter: 'Filtrar',
    columnMenuSortAscending: 'Ordenar Crescente',
    columnMenuSortDescending: 'Ordenar Decrescente',
    columnMenuSettings: 'Configurações',
    columnMenuDone: 'Concluído',
    columnMenuLock: 'Travar',
    columnMenuUnlock: 'Destravar',
  }"
  key-field="id"
/>
```

### Custom Column Menu Configuration

Combine the various column menu props to customize which features appear in the menu:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :columnMenu="true"
  :columnMenuColumns="true"
  :sortable="true"
  :columnMenuSortable="true"
  :filterable="true"
  :columnMenuFilterable="false"
  key-field="id"
/>
```

## Excel Export

Pantanal Grid supports exporting data to Excel format. You can export the current page or all pages, customize the file name, and use a proxy for browsers that don't support direct file downloads.

### Basic Usage

Add `'excel'` to the toolbar to enable Excel export:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import { ref } from 'vue'

const rows = ref([
  { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['excel']"
    key-field="id"
  />
</template>
```

### Export All Pages

Set `excelAllPages` to `true` to export all data pages instead of just the current page:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['excel']"
  :excelAllPages="true"
  :pageable="true"
  :pageSize="10"
  key-field="id"
/>
```

### Custom File Name

Specify a custom file name using the `excelFileName` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['excel']"
  excelFileName="products-export.xlsx"
  key-field="id"
/>
```

### Export with Proxy

For browsers that don't support direct file downloads (like IE9 or Safari), you can use a proxy server:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :toolbar="['excel']"
  :excelForceProxy="false"
  excelProxyUrl="/api/excel-proxy"
  key-field="id"
/>
```

The proxy should accept a `POST` request with the following parameters in the request body:

- `contentType` - The MIME type of the file
- `base64` - The base-64 encoded file content
- `fileName` - The file name as requested by the caller

The proxy is expected to return the decoded file with a `Content-Disposition` header set to `attachment; filename="<fileName.xlsx>"`.

### Excel Export Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `excelAllPages` | `boolean` | `false` | Export all pages instead of just the current page |
| `excelFileName` | `string` | `'export.xlsx'` | File name for the exported Excel file |
| `excelFilterable` | `boolean` | `true` | Enable autofilter in the Excel file (adds filter dropdowns to column headers) |
| `excelForceProxy` | `boolean` | `false` | Force use of proxy even if browser supports local file saving |
| `excelProxyUrl` | `string` | `undefined` | URL of the server-side proxy for file download |

### How It Works

1. **Current Page Export**: By default, only the current page is exported. The exported data respects any filters and sorting applied in the Grid.
2. **All Pages Export**: When `excelAllPages` is `true`, all filtered/sorted data is exported (client-side) or all pages are fetched (server-side). Filters applied in the Grid are respected.
3. **File Format**: The export uses the SheetJS library (xlsx) to generate true Excel files (.xlsx format). If xlsx is not installed, it falls back to CSV format.
4. **Autofilter**: When `excelFilterable` is `true` (default), the exported Excel file will have autofilter enabled on all columns, allowing users to filter data directly in Excel.
5. **Proxy Support**: For browsers that don't support direct downloads, a proxy can be used.

### Notes

- The export uses the SheetJS library (xlsx) to generate true Excel files (.xlsx format)
- Install `xlsx` as a peer dependency: `npm install xlsx`
- If `xlsx` is not available, the export will fallback to CSV format
- Server-side export with `excelAllPages` may require multiple API calls to fetch all pages
- The proxy is only used for browsers that don't support direct file downloads (IE9, Safari) or when `excelForceProxy` is enabled

---

## Copy to Clipboard

Pantanal Grid supports copying data to the clipboard. Enable copy functionality by setting the `allowCopy` prop to `true`.

### Basic Usage

Enable copy by setting the `allowCopy` prop to `true`. By default, data is copied in TSV (Tab-Separated Values) format:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
]
</script>
```

### Custom Delimiter

Change the delimiter by setting the `allowCopyDelimiter` prop. For example, to use CSV format:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    allowCopyDelimiter=","
    key-field="id"
  />
</template>
```

### Copy Selected Rows

When selection is enabled, pressing `Ctrl+C` (or `Cmd+C` on Mac) without selecting text will copy all selected rows:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    :selectable="'multiple'"
    key-field="id"
  />
</template>
```

### Copy with Keyboard Navigation

When keyboard navigation is enabled, you can copy the focused cell by pressing `Ctrl+C`:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    :navigatable="true"
    key-field="id"
  />
</template>
```

### How It Works

1. **Text Selection**: Select text in the grid and press `Ctrl+C` (or `Cmd+C` on Mac) to copy the selected cells
2. **Selected Rows**: If rows are selected (with `selectable` enabled), pressing `Ctrl+C` copies all selected rows
3. **Focused Cell**: If keyboard navigation is enabled and no text is selected, pressing `Ctrl+C` copies the focused cell

### Props

- `allowCopy` (boolean, default: `false`) - Enable copy functionality
- `allowCopyDelimiter` (string, default: `'\t'`) - Delimiter between items on the same row (TSV format by default)

---

## Filterable Props API

Pantanal Grid provides extensive filtering configuration through the `filterableProps` API, allowing you to customize filter messages, operators, and filter modes.

### Filterable Messages

Customize all filter-related messages using the `messages` prop:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :messages="customMessages"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { PantanalGrid, type Messages } from '@pantanal/grid'

const customMessages: Partial<Messages> = {
  filterableMessagesAnd: 'AND',
  filterableMessagesOr: 'OR',
  filterableMessagesClear: 'Clear Filters',
  filterableMessagesFilter: 'Apply Filter',
  filterableMessagesInfo: 'Show items where',
  filterableMessagesTitle: 'Filter',
  filterableMessagesIsTrue: 'Yes',
  filterableMessagesIsFalse: 'No',
  filterableMessagesSearch: 'Search...',
  filterableMessagesSelectValue: 'Select a value',
  filterableMessagesCancel: 'Cancel',
  filterableMessagesSelectedItemsFormat: '{0} item(s) selected',
  filterableMessagesOperator: 'Operator',
  filterableMessagesValue: 'Value',
  filterableMessagesCheckAll: 'Check all',
}
</script>
```

### Filter Operators

Customize operator labels for different data types:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :filterableOperators="customOperators"
    key-field="id"
  />
</template>

<script setup lang="ts">
const customOperators = {
  string: {
    eq: 'Equals',
    neq: 'Not equals',
    contains: 'Contains',
    startswith: 'Starts with',
    endswith: 'Ends with',
    isnull: 'Is null',
    isnotnull: 'Is not null',
    isempty: 'Is empty',
    isnotempty: 'Is not empty',
  },
  number: {
    eq: 'Equals',
    neq: 'Not equals',
    gt: 'Greater than',
    gte: 'Greater than or equal',
    lt: 'Less than',
    lte: 'Less than or equal',
    isnull: 'Is null',
    isnotnull: 'Is not null',
  },
  date: {
    eq: 'Equals',
    neq: 'Not equals',
    gt: 'After',
    gte: 'On or after',
    lt: 'Before',
    lte: 'On or before',
    isnull: 'Is null',
    isnotnull: 'Is not null',
  },
  boolean: {
    eq: 'Equals',
    neq: 'Not equals',
  },
  enums: {
    eq: 'Equals',
    neq: 'Not equals',
    isnull: 'Is null',
    isnotnull: 'Is not null',
  },
}
</script>
```

### Filter Mode

Control how filtering is displayed using the `filterableMode` prop:

```vue
<template>
  <!-- Row mode: Filter inputs in a row below headers -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :filterable="true"
    :filterableMode="'row'"
    :show-filter-row="true"
    key-field="id"
  />

  <!-- Menu mode: Filter menu accessible via header -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :filterable="true"
    :filterableMode="'menu'"
    key-field="id"
  />

  <!-- Both modes: Row and menu filtering enabled -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :filterable="true"
    :filterableMode="'menu, row'"
    :show-filter-row="true"
    key-field="id"
  />
</template>
```

### Filter Extra

Enable an extra filter criterion using the `filterableExtra` prop:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :filterable="true"
    :filterableExtra="true"
    key-field="id"
  />
</template>
```

### Internationalization

Filter messages are automatically translated based on the `locale` prop:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :locale="locale"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const locale = ref<'en' | 'pt' | 'es'>('en')
</script>
```

Supported locales include:
- `'en'` - English (default)
- `'pt'` - Portuguese
- `'es'` - Spanish

### Filterable Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filterable` | `boolean` | `false` | Enable/disable filtering |
| `filterableMode` | `'row' \| 'menu' \| 'menu, row' \| false` | `false` | Filter display mode |
| `filterableExtra` | `boolean` | `false` | Enable extra filter criterion |
| `filterableOperators` | `object` | `undefined` | Custom operator labels for string, number, date, boolean, and enums |
| `showFilterRow` | `boolean` | `true` | Show filter row (when filterableMode includes 'row') |

### Filterable Messages Reference

| Message | Type | Description |
|---------|------|-------------|
| `filterableMessagesAnd` | `string` | Text for "And" logical operation |
| `filterableMessagesOr` | `string` | Text for "Or" logical operation |
| `filterableMessagesClear` | `string` | Text for clear button |
| `filterableMessagesFilter` | `string` | Text for filter button |
| `filterableMessagesInfo` | `string` | Information message at top of filter menu |
| `filterableMessagesTitle` | `string` | Title attribute of filter menu form |
| `filterableMessagesIsTrue` | `string` | Text for true values (boolean filters) |
| `filterableMessagesIsFalse` | `string` | Text for false values (boolean filters) |
| `filterableMessagesSearch` | `string` | Placeholder for search input |
| `filterableMessagesSelectValue` | `string` | Text for dropdown list |
| `filterableMessagesCancel` | `string` | Text for cancel button (mobile mode) |
| `filterableMessagesSelectedItemsFormat` | `string` | Format string for selected items count |
| `filterableMessagesOperator` | `string` | Text for operator item (mobile mode) |
| `filterableMessagesValue` | `string` | Text for value item (mobile mode) |
| `filterableMessagesCheckAll` | `string` | Label for "Check all" checkbox |

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
