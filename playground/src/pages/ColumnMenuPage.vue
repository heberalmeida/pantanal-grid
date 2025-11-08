<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Column Menu</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports column menu functionality that allows users to show/hide columns, filter, sort, and lock/unlock columns.
      Enable it by setting the <code class="bg-gray-100 px-2 py-1 rounded">columnMenu</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
      <p class="text-gray-600 mb-4">
        Enable the column menu by setting <code class="bg-gray-100 px-2 py-1 rounded">columnMenu</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
        Click on the menu icon (three dots) in the column header to open the menu.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :columnMenu="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Menu with Show/Hide Columns</h2>
      <p class="text-gray-600 mb-4">
        The column menu allows users to show and hide columns by default. You can disable this feature by setting
        <code class="bg-gray-100 px-2 py-1 rounded">columnMenuColumns</code> to <code class="bg-gray-100 px-2 py-1 rounded">false</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="columnsRows"
          :columns="columnsColumns"
          :columnMenu="true"
          :columnMenuColumns="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="columnsCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Menu with Sorting</h2>
      <p class="text-gray-600 mb-4">
        When <code class="bg-gray-100 px-2 py-1 rounded">sortable</code> is enabled, the column menu includes sorting options.
        You can control this by setting <code class="bg-gray-100 px-2 py-1 rounded">columnMenuSortable</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="sortingRows"
          :columns="sortingColumns"
          :columnMenu="true"
          :sortable="true"
          :columnMenuSortable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="sortingCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Menu with Filtering</h2>
      <p class="text-gray-600 mb-4">
        When <code class="bg-gray-100 px-2 py-1 rounded">filterable</code> is enabled, the column menu includes filtering options.
        You can control this by setting <code class="bg-gray-100 px-2 py-1 rounded">columnMenuFilterable</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="filteringRows"
          :columns="filteringColumns"
          :columnMenu="true"
          :filterable="true"
          :columnMenuFilterable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="filteringCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Column Menu Configuration</h2>
      <p class="text-gray-600 mb-4">
        You can customize which features appear in the column menu by combining the various column menu props.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customRows"
          :columns="customColumns"
          :columnMenu="true"
          :columnMenuColumns="true"
          :sortable="true"
          :columnMenuSortable="true"
          :filterable="true"
          :columnMenuFilterable="false"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="customCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
  category: string
}

// Basic Usage
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
])

const basicColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]

// Columns Show/Hide
const columnsRows = ref<Product[]>([...basicRows.value])
const columnsColumns: ColumnDef[] = [...basicColumns]

// Sorting
const sortingRows = ref<Product[]>([...basicRows.value])
const sortingColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120, sortable: true },
  { field: 'productName', title: 'Product Name', width: 200, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, sortable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true },
  { field: 'category', title: 'Category', width: 150, sortable: true },
]

// Filtering
const filteringRows = ref<Product[]>([...basicRows.value])
const filteringColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120, filterable: true },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, filterable: true, type: 'boolean' },
  { field: 'category', title: 'Category', width: 150, filterable: true },
]

// Custom
const customRows = ref<Product[]>([...basicRows.value])
const customColumns: ColumnDef[] = [...sortingColumns]

const basicCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :columnMenu="true"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const columnsCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :columnMenu="true"
    :columnMenuColumns="true"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const sortingCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :columnMenu="true"
    :sortable="true"
    :columnMenuSortable="true"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', sortable: true },
  { field: 'productName', title: 'Product Name', sortable: true },
  // ...
]
<\/script>`

const filteringCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :columnMenu="true"
    :filterable="true"
    :columnMenuFilterable="true"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', filterable: true },
  { field: 'productName', title: 'Product Name', filterable: true },
  // ...
]
<\/script>`

const customCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :columnMenu="true"
    :columnMenuColumns="true"
    :sortable="true"
    :columnMenuSortable="true"
    :filterable="true"
    :columnMenuFilterable="false"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

