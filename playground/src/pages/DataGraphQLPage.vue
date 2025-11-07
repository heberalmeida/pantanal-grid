<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Data Binding — GraphQL</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid can be bound to GraphQL services. GraphQL provides a single endpoint for all data operations
        and allows you to specify exactly what data you need.
      </p>
    </header>

    <!-- GraphQL Endpoint Info -->
    <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <p class="text-sm text-slate-600 dark:text-slate-400">
        This example uses a public GraphQL API endpoint. The Grid sends GraphQL queries and receives JSON responses.
      </p>
    </div>

    <!-- Grid -->
    <PantanalGrid
      :rows="[]"
      :columns="columns as any"
      key-field="productID"
      :data-provider="dataProvider"
      :auto-bind="true"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      persist-state-key="pantanal-demo-data-graphql"
      :enable-column-resize="true"
      :enable-column-reorder="true"
      locale="en"
    />

    <ExampleCode :source="codeSnippet" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  PantanalGrid,
  type SortDescriptor,
  type FilterDescriptor,
  type DataProvider,
  type DataProviderArgs,
  type ColumnDef
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './DataGraphQLPage.vue?raw'

type Product = { productID: number; productName: string; unitPrice: number }

const columns: ColumnDef<Product>[] = [
  { field: 'productID', title: 'ID', width: 100, sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'productName', title: 'Product Name', sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'unitPrice', title: 'Unit Price', sortable: true, resizable: true, reorderable: true, format: (v: number) => `$ ${v.toFixed(2)}` },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)

const endpoint = 'https://graphqlzero.almansi.me/api'

const dataProvider: DataProvider<Product> = async ({ page, pageSize, filter, signal }: DataProviderArgs) => {
  const name = String(filter.find(f => f.field === 'productName')?.value ?? '').trim() || null

  const query = `
    query ($page:Int!, $limit:Int!, $q:String) {
      posts(options:{ paginate:{ page:$page, limit:$limit }, search:{ q:$q } }) {
        data { id title }
        meta { totalCount }
      }
    }`

  const body = JSON.stringify({
    query,
    variables: { page, limit: pageSize, q: name }
  })

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    const data = json?.data?.posts?.data ?? []
    const total = Number(json?.data?.posts?.meta?.totalCount ?? 0)

    const rows: Product[] = data.map((p: { id: number | string; title: string }) => ({
      productID: Number(p.id),
      productName: p.title,
      unitPrice: (Number(p.id) % 90) + 10
    }))

    return { rows, total }
  } catch (err: any) {
    if (err?.name === 'AbortError') return { rows: [], total: 0 }
    throw err
  }
}

const codeSnippet = exampleSource
</script>
