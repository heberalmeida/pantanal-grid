<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

interface Order {
  orderID: number
  shipName: string
  shipCountry: string
  shipCity: string
  freight: number
  orderDate: string
}

// Basic Single Column Sorting
const basicRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', shipCountry: 'Belgium', shipCity: 'Charleroi', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Chop-suey Chinese', shipCountry: 'Switzerland', shipCity: 'Bern', freight: 22.98, orderDate: '1996-07-12' },
])

const basicColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
]

const basicSort = ref<SortDescriptor[]>([])

// Multiple Column Sorting
const multiRows = ref<Order[]>([...basicRows.value])
const multiColumns: ColumnDef[] = [...basicColumns]
const multiSort = ref<SortDescriptor[]>([])

// Column-Level Sortable
const columnRows = ref<Order[]>([...basicRows.value])
const columnColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: false },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 120, sortable: false },
]
const columnSort = ref<SortDescriptor[]>([])
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Single Column Sorting -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Single Column Sorting</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click column headers to sort. Click again to reverse, click a third time to remove sort.
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="orderID"
        :sortable="true"
        :sortable-mode="'single'"
        v-model:sort="basicSort"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Multiple Column Sorting -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Multiple Column Sorting</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Enable multiple column sorting. Click multiple column headers to sort by multiple columns. Sort indexes are shown.
      </p>
      <PantanalGrid
        :rows="multiRows"
        :columns="multiColumns"
        key-field="orderID"
        :sortable="true"
        :sortable-mode="'multiple'"
        :sortable-show-indexes="true"
        v-model:sort="multiSort"
        :height="300"
        locale="en"
        responsive="table"
      />
      <div v-if="multiSort.length > 0" class="mt-2 text-sm">
        <strong>Sort order:</strong>
        <span v-for="(s, idx) in multiSort" :key="idx" class="ml-2">
          {{ idx + 1 }}. {{ s.field }} ({{ s.dir }})
        </span>
      </div>
    </div>

    <!-- Column-Level Sortable -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Column-Level Sortable</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Control sorting per column. Only columns with <code>sortable: true</code> can be sorted.
      </p>
      <PantanalGrid
        :rows="columnRows"
        :columns="columnColumns"
        key-field="orderID"
        v-model:sort="columnSort"
        :height="300"
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
.mt-2 {
  margin-top: 0.5rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>







