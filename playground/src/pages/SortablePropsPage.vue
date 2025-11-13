<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Sortable Props</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Comprehensive examples demonstrating all sortable props: allow-unsort, show-indexes, initial-direction, and mode.
    </p>
    
    <div class="space-y-6">
      <!-- Single Mode with Allow Unsort -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Single Mode with Allow Unsort</h3>
        <PantanalGrid
          :rows="singleRows"
          :columns="singleColumns"
          key-field="id"
          :sortable="true"
          sortable-mode="single"
          :sortable-allow-unsort="true"
          v-model:sort="singleSort"
          locale="en"
        />
        <ExampleCode :source="singleCode" />
      </div>

      <!-- Multiple Mode with Indexes -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Multiple Mode with Indexes</h3>
        <PantanalGrid
          :rows="multipleRows"
          :columns="multipleColumns"
          key-field="id"
          :sortable="true"
          sortable-mode="multiple"
          :sortable-show-indexes="true"
          :sortable-allow-unsort="true"
          v-model:sort="multipleSort"
          locale="en"
        />
        <ExampleCode :source="multipleCode" />
      </div>

      <!-- No Unsort -->
      <div>
        <h3 class="text-lg font-semibold mb-2">No Unsort Mode</h3>
        <PantanalGrid
          :rows="noUnsortRows"
          :columns="noUnsortColumns"
          key-field="id"
          :sortable="true"
          sortable-mode="single"
          :sortable-allow-unsort="false"
          v-model:sort="noUnsortSort"
          locale="en"
        />
        <ExampleCode :source="noUnsortCode" />
      </div>

      <!-- Initial Direction -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Initial Sort Direction</h3>
        <PantanalGrid
          :rows="initialDirRows"
          :columns="initialDirColumns"
          key-field="id"
          :sortable="true"
          sortable-mode="single"
          :sortable-allow-unsort="true"
          sortable-initial-direction="desc"
          v-model:sort="initialDirSort"
          locale="en"
        />
        <ExampleCode :source="initialDirCode" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './SortablePropsPage.vue?raw'

// Single mode
const singleRows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books' }
])

const singleColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true }
]

const singleSort = ref<SortDescriptor[]>([])

// Multiple mode
const multipleRows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books', stock: 25 }
])

const multipleColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true },
  { field: 'stock', title: 'Stock', sortable: true }
]

const multipleSort = ref<SortDescriptor[]>([])

// No unsort
const noUnsortRows = ref([...singleRows.value])
const noUnsortColumns: ColumnDef[] = [...singleColumns]
const noUnsortSort = ref<SortDescriptor[]>([])

// Initial direction
const initialDirRows = ref([
  { id: 1, name: 'Product A', price: 99.99, date: '2024-01-15' },
  { id: 2, name: 'Product B', price: 49.99, date: '2024-02-20' },
  { id: 3, name: 'Product C', price: 19.99, date: '2024-03-10' }
])

const initialDirColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { 
    field: 'date', 
    title: 'Date', 
    sortable: true,
    sortableInitialDirection: 'desc'
  }
]

const initialDirSort = ref<SortDescriptor[]>([])

const singleCode = exampleSource
const multipleCode = exampleSource
const noUnsortCode = exampleSource
const initialDirCode = exampleSource
</script>

<style scoped>
.space-y-3 > * + * {
  margin-top: 0.75rem;
}
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
.text-xl {
  font-size: 1.25rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
</style>

