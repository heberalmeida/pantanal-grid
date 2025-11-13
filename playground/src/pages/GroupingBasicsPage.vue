<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import type { ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

const rows = ref([
  {
    ProductID: 1,
    ProductName: 'Chai',
    UnitPrice: 18,
    UnitsInStock: 39,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 4,
    ProductName: 'Chef Anton',
    UnitPrice: 22,
    UnitsInStock: 53,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 5,
    ProductName: 'Chef Gumbo Mix',
    UnitPrice: 21.35,
    UnitsInStock: 0,
    Discontinued: true,
    Category: 'Dairy Products'
  },
  {
    ProductID: 6,
    ProductName: 'Boysenberry Spread',
    UnitPrice: 25,
    UnitsInStock: 120,
    Discontinued: false,
    Category: 'Condiments'
  }
])

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'Category', title: 'Category', width: 180 },
  { field: 'Discontinued', title: 'Discontinued', width: 120 }
]

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    ProductID: 1,
    ProductName: 'Chai',
    UnitPrice: 18,
    UnitsInStock: 39,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 4,
    ProductName: 'Chef Anton',
    UnitPrice: 22,
    UnitsInStock: 53,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 5,
    ProductName: 'Chef Gumbo Mix',
    UnitPrice: 21.35,
    UnitsInStock: 0,
    Discontinued: true,
    Category: 'Dairy Products'
  },
  {
    ProductID: 6,
    ProductName: 'Boysenberry Spread',
    UnitPrice: 25,
    UnitsInStock: 120,
    Discontinued: false,
    Category: 'Condiments'
  }
])

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => \`$\${v.toFixed(2)}\` },
  { field: 'Category', title: 'Category', width: 180 },
  { field: 'Discontinued', title: 'Discontinued', width: 120 }
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    groupable
    key-field="ProductID"
    locale="en"
  />
<\/template>`
</script>

<template>
  <section class="space-y-6 px-4 py-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Grouping Basics</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Enable grouping by setting <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">groupable</code> to <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">true</code>.
        Drag column headers to the drop zone above the grid to group by that column.
        You can group by multiple columns by dragging additional columns.
      </p>
    </header>

    <!-- Basic Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Grouping</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Drag a column header to the drop zone above the grid to group by that column.
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        groupable
        key-field="ProductID"
        locale="en"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="basicCode" />
    </div>
  </section>
</template>

