<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Scrollable Virtual (10k rows)</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Virtual scrolling with 10,000 rows using <code>scrollable-virtual</code> prop.
      Only visible rows are rendered for optimal performance. Scroll through the data to see smooth performance.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      scrollable-virtual
      :height="420"
      :row-height="44"
      locale="en"
      sortable
      filterable
    />
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './ScrollableVirtualPage.vue?raw'

const rows = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories', 'Home', 'Sports'][i % 5]
})))

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true }
]

const codeSnippet = exampleSource
</script>

<style scoped>
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
.mb-4 {
  margin-bottom: 1rem;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>

