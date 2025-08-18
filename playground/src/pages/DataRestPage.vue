<script setup lang="ts">
import { ref } from 'vue'
import {
  PantanalGrid,
  type SortDescriptor,
  type FilterDescriptor,
  type DataProvider,
  type DataProviderArgs
} from '@pantanal/grid'

type Product = { id: number; title: string; price: number }

const columns = [
  { field:'id', title:'ID', width: 80, sortable:true, filterable:true, resizable:true, reorderable:true },
  { field:'title', title:'Title', sortable:true, filterable:true, resizable:true, reorderable:true },
  { field:'price', title:'Price', sortable:true, resizable:true, reorderable:true, format:(v:number)=>`$ ${v.toFixed(2)}` },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)

const dataProvider: DataProvider<Product> = async (args: DataProviderArgs<Product>) => {
  const { page, pageSize, filter, signal } = args
  const title = String(filter.find(f => f.field === 'title')?.value ?? '')
  const base = title ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products'
  const url = new URL(base)
  url.searchParams.set('limit', String(pageSize))
  url.searchParams.set('skip', String((page - 1) * pageSize))
  if (title) url.searchParams.set('q', title)
  url.searchParams.set('select', 'id,title,price')

  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return { rows: json.products, total: json.total }
}
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Data Binding — REST</h2>
    <PantanalGrid
      :rows="[]"
      :columns="columns as any"
      key-field="id"
      :data-provider="dataProvider"
      :auto-bind="true"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      persist-state-key="pantanal-demo-data-rest"
      :enable-column-resize="true"
      :enable-column-reorder="true"
      locale="en"
    />
  </section>
</template>
