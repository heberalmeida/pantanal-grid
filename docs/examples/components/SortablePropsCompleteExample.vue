<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

// Single mode with allow unsort
const singleRows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books' },
  { id: 4, name: 'Product D', price: 79.99, category: 'Electronics' }
])

const singleColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true }
]

const singleSort = ref<SortDescriptor[]>([])

// Multiple mode with indexes
const multipleRows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books', stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, category: 'Electronics', stock: 75 }
])

const multipleColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true },
  { field: 'stock', title: 'Stock', sortable: true }
]

const multipleSort = ref<SortDescriptor[]>([])

// No unsort mode
const noUnsortRows = ref([...singleRows.value])
const noUnsortColumns: ColumnDef[] = [...singleColumns]
const noUnsortSort = ref<SortDescriptor[]>([])

// Initial direction
const initialDirRows = ref([
  { id: 1, name: 'Product A', price: 99.99, date: '2024-01-15' },
  { id: 2, name: 'Product B', price: 49.99, date: '2024-02-20' },
  { id: 3, name: 'Product C', price: 19.99, date: '2024-03-10' },
  { id: 4, name: 'Product D', price: 79.99, date: '2024-01-05' }
])

const initialDirColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { 
    field: 'date', 
    title: 'Date (Initial Desc)', 
    sortable: true,
    sortableInitialDirection: 'desc'
  }
]

const initialDirSort = ref<SortDescriptor[]>([])
</script>

<template>
  <div class="space-y-8">
    <!-- Single Mode with Allow Unsort -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Single Mode with Allow Unsort</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Default behavior: Clicking a sorted column cycles through ascending → descending → unsorted.
      </p>
      <PantanalGrid
        :rows="singleRows"
        :columns="singleColumns"
        key-field="id"
        :sortable="true"
        sortable-mode="single"
        :sortable-allow-unsort="true"
        v-model:sort="singleSort"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Multiple Mode with Indexes -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Multiple Mode with Indexes</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Sort by multiple columns. The numbers show the sort priority order.
      </p>
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
        responsive="table"
      />
    </div>

    <!-- No Unsort Mode -->
    <div>
      <h3 class="text-lg font-semibold mb-2">No Unsort Mode</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        When <code>sortable-allow-unsort</code> is <code>false</code>, clicking cycles between ascending and descending only.
      </p>
      <PantanalGrid
        :rows="noUnsortRows"
        :columns="noUnsortColumns"
        key-field="id"
        :sortable="true"
        sortable-mode="single"
        :sortable-allow-unsort="false"
        v-model:sort="noUnsortSort"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Initial Direction -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Initial Sort Direction</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        The Date column has <code>sortableInitialDirection: 'desc'</code>, so it starts descending when first clicked.
      </p>
      <PantanalGrid
        :rows="initialDirRows"
        :columns="initialDirColumns"
        key-field="id"
        :sortable="true"
        sortable-mode="single"
        :sortable-allow-unsort="true"
        v-model:sort="initialDirSort"
        locale="en"
        responsive="table"
      />
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
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
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>

