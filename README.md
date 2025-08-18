# Pantanal Grid (Vue 3 + Tailwind)

A modern data grid for **Vue 3**, styled to play nicely with **Tailwind**. Ships with a Vite-based playground and supports sorting, filtering, selection, client/server pagination, column resize & reorder, keyboard navigation, **virtual scroll**, and **i18n** (pt/en/es).

**Live demo:** [https://heberalmeida.github.io/pantanal-grid/](https://heberalmeida.github.io/pantanal-grid/)

## layout
- `packages/pantanal-grid` — the **@pantanal/grid** library package
- `playground` — Vite app with example pages: `/basic`, `/i18n/en`, `/i18n/es`, `/virtual`, `/server`, `/grouping`, `/table-only`, `/pagination`, `/locked`

## Core features
- Sorting (asc/desc) and per-column **filter row**
- Selection (single/multiple) with **select-all** per page/viewport
- Client-side **and** server-side pagination (server mode expects `:total`)
- Column **resize** (drag) & **reorder** (drag & drop)
- **Keyboard navigation** (← → ↑ ↓) with visible focus
- **Virtual scroll** for large datasets
- **i18n** (pt / en / es) with overridable `messages`
- Optional **state persistence** (sort/page/pageSize/filters/order/widths) via `persistStateKey`
- **Pinned/Locked columns** (left/right) com scroll horizontal; cabeçalho/filtro/células “pinned” ficam sticky; **footer não rola** horizontalmente

## Requirements
- **Node.js** >= 18
- **Yarn v1** (workspaces)

## Development (playground)
```bash
yarn
yarn dev   # http://localhost:5173
```
The playground aliases `@pantanal/grid` to the local source and uses Tailwind.

## Install (in your app)
```bash
yarn add @pantanal/grid
# peer deps in your app:
# yarn add vue@^3
# yarn add -D tailwindcss postcss autoprefixer
```

## Minimal usage
```vue
<script setup lang="ts">
import { PantanalGrid } from '@pantanal/grid'

const rows = [{ id: 1, name: 'Alpha', price: 9.9 }]
const columns = [
  { field: 'id',    title: 'ID',    width: 80, sortable: true, filterable: true },
  { field: 'name',  title: 'Name',  sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true }
]
</script>

<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
</template>
```

## i18n
```vue
<PantanalGrid locale="pt" />
<PantanalGrid locale="en" />
<PantanalGrid locale="es" />
<!-- You can override labels with :messages="{ next: 'Next »', previous: '« Prev', ... }" -->
```

## Virtual scroll
```vue
<PantanalGrid
  :rows="bigRows"
  :virtual="true"
  :height="420"
  :row-height="44"
/>
```

## Grouping & Aggregations

Pantanal Grid supports **multi-level grouping** with optional **aggregations** and **expand/collapse**.  
This works fully on the client. For server-side grouping, pre-aggregate on your API and feed the grid already grouped.

### Quick start
```vue
<script setup lang="ts">
import { PantanalGrid, type GroupDescriptor } from '@pantanal/grid'
import '@pantanal/grid/styles.css'

const rows = [
  { id: 1, title: 'Airpods',  brand: 'Apple',  category: 'mobile-accessories', price: 129.99 },
  { id: 2, title: 'CK One',   brand: 'Calvin Klein', category: 'fragrances', price: 49.99 },
  // ...
]

const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand', filterable:true },
  { field:'category', title:'Category', filterable:true },
  // tip: format your currency/decimal columns to avoid long floating outputs
  { field:'price', title:'Price', sortable:true, format:(v:number)=>`$ ${v.toFixed(2)}` }
]

// multi-level grouping: Category -> Brand
const group: GroupDescriptor[] = [
  { field:'category', dir:'asc' },
  { field:'brand',    dir:'asc' }
]

// per-field aggregation names: 'sum' | 'avg' | 'min' | 'max' | 'count'
const aggregates = {
  price: ['sum','avg'],
  id:    ['count']
} as const
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

### How it renders
- Each **group header** occupies the full row and shows its **field/value** plus the number of items.
- A small **expander** (▶/▼) indicates collapsed/expanded state. You can expand/collapse all with helper buttons in the footer.
- When `showGroupFooters` is true, a **group footer** appears after each group with the selected aggregations (e.g., *Sum*, *Average*).
- Row **selection** honors grouping: the header checkbox only selects **data rows** on the current page.

### Props & events
- `group: Array<{ field: string; dir?: 'asc' | 'desc' }>` — order defines the grouping hierarchy.
- `aggregates: Record<string, Array<'sum'|'avg'|'min'|'max'|'count'>>` — which metrics to compute per numeric field.
- `showGroupFooters?: boolean` — show/hide footers (default: `true`).
- Emits `toggleGroup(key: string, open: boolean)` whenever a group is expanded/collapsed.

### Tips
- For currency/decimal fields, prefer a column `format` (e.g., `toFixed(2)`) so values like `229.98000000000002` render as `$ 229.98`.
- Client-side grouping works with **filters**, **sorting**, and **pagination**. In `serverSide` mode, perform grouping/aggregation on the server and pass preprocessed rows.

## Server-side mode (generic)
In **serverSide** mode the grid does not sort/filter/paginate locally; it only **emits models** (`update:page`, `update:pageSize`, `update:filter`, `update:sort`). Your app performs the fetch and passes the current page `:rows` plus the remote `:total` count.

### Generic pager util
Works with any API that returns `{ <rowsKey>: [...], <totalKey>: number }`.
```ts
// fetchers.ts
export type FetchPagedOptions = {
  baseUrl: string
  page: number
  pageSize: number
  query?: string
  rowsKey: string
  totalKey: string
  paramMap?: { limit?: string; skip?: string; query?: string }
  extraParams?: Record<string,string|number|boolean>
  mapRows?<TIn,TOut>(rows: TIn[]): TOut[]
}

export async function fetchPaged<T = any>(opts: FetchPagedOptions): Promise<{ rows: T[]; total: number; raw: any }> {
  const { baseUrl, page, pageSize, query, rowsKey, totalKey, paramMap = {}, extraParams = {}, mapRows } = opts
  const limitKey = paramMap.limit ?? 'limit'
  const skipKey  = paramMap.skip  ?? 'skip'
  const queryKey = paramMap.query ?? 'q'

  const url = new URL(baseUrl)
  url.searchParams.set(limitKey, String(pageSize))
  url.searchParams.set(skipKey, String((page - 1) * pageSize))
  if (query != null && query !== '') url.searchParams.set(queryKey, String(query))
  for (const [k, v] of Object.entries(extraParams)) url.searchParams.set(k, String(v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  const json = await res.json()
  const rawRows = (json as any)[rowsKey] ?? []
  const rows = mapRows ? mapRows(rawRows) : rawRows
  const total = Number((json as any)[totalKey] ?? rawRows.length)
  return { rows, total, raw: json }
}
```

### Example adapter: DummyJSON
Their payload: `{ products: [...], total, skip, limit }`.
```ts
// dummyjson.ts
import { fetchPaged } from './fetchers'

export interface Product { id: number; title: string; price: number; brand?: string; category?: string }

export async function fetchProducts(page: number, pageSize: number, query?: string) {
  const base = query ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products'
  const { rows, total } = await fetchPaged<Product>({
    baseUrl: base,
    page, pageSize, query,
    rowsKey: 'products',
    totalKey: 'total',
    paramMap: { limit: 'limit', skip: 'skip', query: 'q' },
    extraParams: { select: 'id,title,price,brand,category' }
  })
  return { rows, total }
}
```

### Wiring the grid (server-side page)
```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type FilterDescriptor, type SortDescriptor } from '@pantanal/grid'
import { fetchProducts, type Product } from './dummyjson'

const rows = ref<Product[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const filter = ref<FilterDescriptor[]>([])
const sort = ref<SortDescriptor[]>([]) // use when your API supports sorting

const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand' },
  { field:'category', title:'Category' },
  { field:'price', title:'Price' }
]

watchEffect(async () => {
  const q = (filter.value.find(f => f.field === 'title')?.value as string) || ''
  const { rows: data, total: t } = await fetchProducts(page.value, pageSize.value, q)
  rows.value = data
  total.value = t
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns as any"
    key-field="id"
    :server-side="true"
    :total="total"
    v-model:filter="filter"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
  />
</template>
```

## Essential props
- `rows: any[]`, `columns: ColumnDef[]`, `keyField`
- `sort`, `filter`, `page`, `pageSize` (all via `v-model`)
- `selectable`: `'single' | 'multiple' | false`
- `locale: 'pt' | 'en' | 'es'`, `messages?: Partial<Messages>`
- `virtual`, `height`, `rowHeight`
- `enableColumnResize`, `enableColumnReorder`
- `persistStateKey`
- `serverSide`, `total`

## Events
- `update:sort`, `update:filter`, `update:page`, `update:pageSize`
- `selectionChange`, `rowClick`
- `columnResize`, `columnReorder`

## Scripts
- `yarn dev` — run playground
- `yarn build` — build the library
- `yarn test` — run Vitest (jsdom env)

## Playground demo routes
- `/basic` — core features + persistence
- `/i18n/en` and `/i18n/es` — internationalization
- `/virtual` — virtual scroll (thousands of rows)
- `/server` — server-side pagination with DummyJSON
- `/basic` — core features + persistence
- `/i18n/en` and `/i18n/es` — internationalization
- `/virtual` — virtual scroll (thousands of rows)
- `/server` — server-side pagination with DummyJSON
- `/grouping` — grouping & aggregations
- `/table-only` — force table layout (no cards)
- `/pagination` — pagination variants
- `/locked` — pinned/locked columns + horizontal scroll

## Contributing
PRs welcome! Please run `yarn test` before pushing. The playground uses **vue-router**: one page per demo.

## License
MIT
