<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Virtual scroll (5k rows)</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      :virtual="true"
      :height="420"
      :row-height="44"
      locale="en"
    />
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './VirtualPage.vue?raw'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Row ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100
})))

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, filterable: true }
]

const codeSnippet = exampleSource
</script>
