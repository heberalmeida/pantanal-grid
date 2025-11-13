<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Column Resizing</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports column resizing functionality. You can enable column resizing by setting the 
        <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">enableColumnResize</code> prop to 
        <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">true</code>. 
        Users can resize columns by dragging the resize handle that appears on the right edge of column headers.
      </p>
    </header>

    <!-- Basic Column Resizing Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Column Resizing</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The following example demonstrates basic column resizing. Hover over the right edge of any column header and drag to resize.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :height="400"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Column Resizing with Sorting -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Resizing with Sorting</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Column resizing works seamlessly with sorting. You can resize columns and sort by any column independently.
      </p>

      <PantanalGrid
        :rows="sortRows"
        :columns="sortColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :sortable="true"
        :height="400"
      />
      <ExampleCode :source="sortCode" />
    </article>

    <!-- Column Resizing with Filtering -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Resizing with Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Column resizing also works with filtering. Resize columns and filter data independently.
      </p>

      <PantanalGrid
        :rows="filterRows"
        :columns="filterColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :filterable="true"
        :show-filter-row="true"
        :height="400"
      />
      <ExampleCode :source="filterCode" />
    </article>

    <!-- Column Resizing with Reordering -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Resizing with Reordering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Combine column resizing with column reordering for maximum flexibility.
      </p>

      <PantanalGrid
        :rows="reorderRows"
        :columns="reorderColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :height="400"
      />
      <ExampleCode :source="reorderCode" />
    </article>

    <!-- Column Resizing Event Handling -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Resizing Event Handling</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Listen to the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">columnResize</code> event 
        to track column resizing changes.
      </p>

      <div v-if="lastResizeEvent" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
          Last resize: Column "{{ lastResizeEvent.field }}" resized to {{ lastResizeEvent.width }}px
        </p>
      </div>

      <PantanalGrid
        :rows="eventRows"
        :columns="eventColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :height="400"
        @column-resize="handleColumnResize"
      />
      <ExampleCode :source="eventCode" />
    </article>

    <!-- Column-Level Resizable Control -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column-Level Resizable Control</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Control resizing on a per-column basis using the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">resizable</code> property. 
        Set <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">resizable: false</code> to disable resizing for specific columns.
      </p>

      <PantanalGrid
        :rows="columnControlRows"
        :columns="columnControlColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :height="400"
      />
      <ExampleCode :source="columnControlCode" />
    </article>

    <!-- Column Resizing with Locked Columns -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Resizing with Locked Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Locked columns can also be resized. The resize handle appears on locked columns as well.
      </p>

      <PantanalGrid
        :rows="lockedRows"
        :columns="lockedColumns as any"
        key-field="orderID"
        :enable-column-resize="true"
        :height="400"
      />
      <ExampleCode :source="lockedCode" />
    </article>

    <!-- Minimum Column Width -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Minimum Column Width</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Columns have a minimum width of 60px to prevent them from becoming too narrow. Try resizing a column to see this limit in action.
      </p>

      <PantanalGrid
        :rows="minWidthRows"
        :columns="minWidthColumns as any"
        key-field="productID"
        :enable-column-resize="true"
        :height="400"
      />
      <ExampleCode :source="minWidthCode" />
    </article>
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
}

interface Order extends Record<string, unknown> {
  orderID: number
  shipCountry: string
  shipCity: string
  shipName: string
  freight: number
  orderDate: string
}

// Basic Column Resizing
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true },
  { productID: 6, productName: "Boysenberry Spread", unitPrice: 25, unitsInStock: 120, discontinued: false },
])

const basicColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

const rows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  // ... more rows
])

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :height="400"
  />
</template>`

// Column Resizing with Sorting
const sortRows = ref<Product[]>([...basicRows.value])
const sortColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const sortCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :sortable="true"
    :height="400"
  />
</template>`

// Column Resizing with Filtering
const filterRows = ref<Product[]>([...basicRows.value])
const filterColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const filterCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :filterable="true"
    :show-filter-row="true"
    :height="400"
  />
</template>`

// Column Resizing with Reordering
const reorderRows = ref<Product[]>([...basicRows.value])
const reorderColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const reorderCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :enable-column-reorder="true"
    :height="400"
  />
</template>`

// Column Resizing Event Handling
const eventRows = ref<Product[]>([...basicRows.value])
const eventColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const lastResizeEvent = ref<{ field: string; width: number } | null>(null)

function handleColumnResize(event: { field: string; width: number }) {
  lastResizeEvent.value = event
  console.log('Column resized:', event)
}

const eventCode = `<script setup lang="ts">
import { ref } from 'vue'

const lastResizeEvent = ref<{ field: string; width: number } | null>(null)

function handleColumnResize(event: { field: string; width: number }) {
  lastResizeEvent.value = event
  console.log('Column resized:', event)
}
<\/script>

<template>
  <div v-if="lastResizeEvent" class="mb-4 p-4 bg-blue-50 rounded-lg">
    <p class="text-sm font-medium">
      Last resize: Column "{{ lastResizeEvent.field }}" resized to {{ lastResizeEvent.width }}px
    </p>
  </div>

  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :height="400"
    @column-resize="handleColumnResize"
  />
</template>`

// Column-Level Resizable Control
const columnControlRows = ref<Product[]>([...basicRows.value])
const columnControlColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, resizable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', resizable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120, resizable: false }, // Not resizable
  { field: 'discontinued', title: 'Discontinued', width: 120, resizable: true },
]

const columnControlCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, resizable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', resizable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120, resizable: false }, // Not resizable
  { field: 'discontinued', title: 'Discontinued', width: 120, resizable: true },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :height="400"
  />
</template>`

// Column Resizing with Locked Columns
const lockedRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'Münster', shipName: 'Toms Spezialitäten', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', freight: 51.3, orderDate: '1996-07-09' },
  { orderID: 10253, shipCountry: 'France', shipCity: 'Strasbourg', shipName: 'Hanari Carnes', freight: 58.17, orderDate: '1996-07-10' },
])

const lockedColumns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', width: 120, locked: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180 },
  { field: 'shipCity', title: 'Ship City', width: 180 },
  { field: 'shipName', title: 'Ship Name', width: 240 },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}' },
  { field: 'orderDate', title: 'Order Date', width: 180 },
]

const lockedCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Order {
  orderID: number
  shipCountry: string
  shipCity: string
  shipName: string
  freight: number
  orderDate: string
}

const rows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', freight: 32.38, orderDate: '1996-07-04' },
  // ... more rows
])

const columns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', width: 120, locked: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180 },
  { field: 'shipCity', title: 'Ship City', width: 180 },
  { field: 'shipName', title: 'Ship Name', width: 240 },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}' },
  { field: 'orderDate', title: 'Order Date', width: 180 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="orderID"
    :enable-column-resize="true"
    :height="400"
  />
</template>`

// Minimum Column Width
const minWidthRows = ref<Product[]>([...basicRows.value])
const minWidthColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 100 },
  { field: 'unitPrice', title: 'Unit Price', width: 80, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 70 },
  { field: 'discontinued', title: 'Discontinued', width: 60 },
]

const minWidthCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 100 },
  { field: 'unitPrice', title: 'Unit Price', width: 80, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 70 },
  { field: 'discontinued', title: 'Discontinued', width: 60 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :enable-column-resize="true"
    :height="400"
  />
</template>`
</script>

