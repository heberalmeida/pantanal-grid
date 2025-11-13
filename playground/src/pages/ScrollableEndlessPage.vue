<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Scrollable Endless (5k rows)</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Endless scrolling with 5,000 rows using <code>scrollable-endless</code> prop.
      Scroll to the bottom to automatically load more items. No pagination controls needed.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      scrollable-endless
      :height="420"
      :row-height="44"
      :page-size="20"
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
import exampleSource from './ScrollableEndlessPage.vue?raw'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  status: ['Active', 'Inactive', 'Pending'][i % 3],
  priority: ['High', 'Medium', 'Low'][i % 3]
})))

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'description', title: 'Description' },
  { field: 'status', title: 'Status', filterable: true },
  { field: 'priority', title: 'Priority', width: 100 }
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

