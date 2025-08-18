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

type Product = { productID: number; productName: string; unitPrice: number }

const columns: ColumnDef<Product>[] = [
  { field:'productID',  title:'ID',           width:100, sortable:true, filterable:true, resizable:true, reorderable:true },
  { field:'productName', title:'Product Name',            sortable:true, filterable:true, resizable:true, reorderable:true },
  { field:'unitPrice',   title:'Unit Price',              sortable:true,                resizable:true, reorderable:true, format:(v:number)=>`$ ${v.toFixed(2)}` },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)

const endpoint = 'https://graphqlzero.almansi.me/api'

const dataProvider: DataProvider<Product> = async ({ page, pageSize, filter /*, signal*/ }: DataProviderArgs<Product>) => {
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
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type':'application/json' }, body })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    const data = json?.data?.posts?.data ?? []
    const total = Number(json?.data?.posts?.meta?.totalCount ?? 0)

    const rows: Product[] = data.map((p: { id: number|string; title: string }) => ({
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
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Data Binding — GraphQL</h2>
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
  </section>
</template>
