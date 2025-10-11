<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './BasicPage.vue?raw'

const rows = ref(Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Accessories', 'Office', 'Hardware'][i % 3]
})))

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true, resizable: true, reorderable: true },
  { field: 'price', title: 'Price', sortable: true, filterable: true, resizable: true, reorderable: true, format: (v:any) => `$ ${Number(v).toFixed(2)}` },
  { field: 'category', title: 'Category', sortable: true, filterable: true, resizable: true, reorderable: true }
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(20)
const codeSnippet = exampleSource
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Basic grid (en-US)</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="id"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      persist-state-key="pantanal-demo-basic"
      :enable-column-resize="true"
      :enable-column-reorder="true"
      locale="en"
    />
    <ExampleCode :source="codeSnippet" />
  </section>
</template>
