<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Column Menu</h1>
      <p class="text-slate-600 dark:text-slate-400">
        You can trigger column operations by rendering a column menu. Enable the built-in column menu by setting the <code>columnMenu</code> prop to <code>true</code>. 
        When activated, the column menu allows you to sort, filter, change column visibility, and lock/unlock columns. 
        The column menu detects whether a column operation is disabled through the column definition and excludes the corresponding UI from its rendering.
      </p>
    </header>

    <!-- Basic Column Menu Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Column Menu</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Enable the column menu by setting <code>columnMenu</code> to <code>true</code>. 
        Click on the menu icon (three dots) in the column header to open the menu.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="productID"
        :sortable="true"
        :filterable="true"
        :column-menu="true"
        :height="400"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Column with filterable: false Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Menu with Disabled Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The column menu detects when a column operation is disabled through the column definition. 
        In this example, the <strong>Category</strong> column has <code>filterable: false</code>, so the filter option is excluded from the menu for that column.
      </p>

      <PantanalGrid
        :rows="filterableRows"
        :columns="filterableColumns as any"
        key-field="productID"
        :sortable="true"
        :filterable="true"
        :column-menu="true"
        :height="400"
      />
      <ExampleCode :source="filterableCode" />
    </article>

    <!-- Column Menu with Show/Hide Columns -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Show/Hide Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The column menu allows users to show and hide columns by default. 
        You can disable this feature by setting <code>columnMenuColumns</code> to <code>false</code>.
      </p>

      <PantanalGrid
        :rows="columnsRows"
        :columns="columnsColumns as any"
        key-field="productID"
        :column-menu="true"
        :column-menu-columns="true"
        :sortable="true"
        :filterable="true"
        :height="400"
      />
      <ExampleCode :source="columnsCode" />
    </article>

    <!-- Column Menu with Sorting -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Menu with Sorting</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        When <code>sortable</code> is enabled, the column menu includes sorting options (Sort Ascending, Sort Descending, None). 
        You can control this by setting <code>columnMenuSortable</code>. 
        The menu respects column-level <code>sortable: false</code> settings.
      </p>

      <PantanalGrid
        :rows="sortingRows"
        :columns="sortingColumns as any"
        key-field="productID"
        :column-menu="true"
        :sortable="true"
        :column-menu-sortable="true"
        :sortable-allow-unsort="true"
        :height="400"
      />
      <ExampleCode :source="sortingCode" />
    </article>

    <!-- Column Menu with Filtering -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Menu with Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        When <code>filterable</code> is enabled, the column menu includes filtering options. 
        You can control this by setting <code>columnMenuFilterable</code>. 
        The menu respects column-level <code>filterable: false</code> settings.
      </p>

      <PantanalGrid
        :rows="filteringRows"
        :columns="filteringColumns as any"
        key-field="productID"
        :column-menu="true"
        :filterable="true"
        :column-menu-filterable="true"
        :height="400"
      />
      <ExampleCode :source="filteringCode" />
    </article>

    <!-- Custom Column Menu Configuration -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Column Menu Configuration</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can customize which features appear in the column menu by combining the various column menu props. 
        In this example, sorting and column visibility are enabled, but filtering is disabled in the menu.
      </p>

      <PantanalGrid
        :rows="customRows"
        :columns="customColumns as any"
        key-field="productID"
        :column-menu="true"
        :column-menu-columns="true"
        :sortable="true"
        :column-menu-sortable="true"
        :filterable="true"
        :column-menu-filterable="false"
        :height="400"
      />
      <ExampleCode :source="customCode" />
    </article>

    <!-- Column Menu with Lock/Unlock -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column Menu with Lock/Unlock</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The column menu allows users to lock and unlock columns. 
        Columns with <code>lockable: false</code> cannot be locked/unlocked via the menu.
      </p>

      <PantanalGrid
        :rows="lockRows"
        :columns="lockColumns as any"
        key-field="orderID"
        :column-menu="true"
        :sortable="true"
        :filterable="true"
        :enable-column-reorder="true"
        :height="400"
      />
      <ExampleCode :source="lockCode" />
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
  category: string
}

interface Order extends Record<string, unknown> {
  orderID: number
  shipName: string
  shipCountry: string
  shipCity: string
  freight: number
}

// Basic Usage
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
  { productID: 6, productName: "Boysenberry Spread", unitPrice: 25, unitsInStock: 120, discontinued: false, category: 'Condiments' },
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
  category: string
}

const rows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
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
    :sortable="true"
    :filterable="true"
    :column-menu="true"
    :height="400"
  />
</template>`

// Filterable: false example
const filterableRows = ref<Product[]>([...basicRows.value])

const filterableColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'category', title: 'Category', width: 180, filterable: false },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const filterableCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'category', title: 'Category', width: 180, filterable: false },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :sortable="true"
    :filterable="true"
    :column-menu="true"
    :height="400"
  />
</template>

<!-- 
  The Category column has filterable: false, so the filter option 
  is excluded from the column menu for that column.
-->`

// Columns Show/Hide
const columnsRows = ref<Product[]>([...basicRows.value])
const columnsColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]

const columnsCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :column-menu="true"
    :column-menu-columns="true"
    :sortable="true"
    :filterable="true"
    :height="400"
  />
</template>`

// Sorting
const sortingRows = ref<Product[]>([...basicRows.value])
const sortingColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', sortable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120, sortable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: false },
  { field: 'category', title: 'Category', width: 150, sortable: true },
]

const sortingCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', sortable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120, sortable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: false },
  { field: 'category', title: 'Category', width: 150, sortable: true },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :column-menu="true"
    :sortable="true"
    :column-menu-sortable="true"
    :sortable-allow-unsort="true"
    :height="400"
  />
</template>

<!-- 
  The Discontinued column has sortable: false, so sorting options 
  are excluded from the column menu for that column.
-->`

// Filtering
const filteringRows = ref<Product[]>([...basicRows.value])
const filteringColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', filterable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, filterable: true, type: 'boolean' },
  { field: 'category', title: 'Category', width: 150, filterable: true },
]

const filteringCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', filterable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, filterable: true, type: 'boolean' },
  { field: 'category', title: 'Category', width: 150, filterable: true },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :column-menu="true"
    :filterable="true"
    :column-menu-filterable="true"
    :height="400"
  />
</template>`

// Custom
const customRows = ref<Product[]>([...basicRows.value])
const customColumns: ColumnDef<Product>[] = [...sortingColumns]

const customCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', sortable: true },
  // ... other columns
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :column-menu="true"
    :column-menu-columns="true"
    :sortable="true"
    :column-menu-sortable="true"
    :filterable="true"
    :column-menu-filterable="false"
    :height="400"
  />
</template>

<!-- 
  In this example, sorting and column visibility are enabled in the menu, 
  but filtering is disabled (columnMenuFilterable: false).
-->`

// Lock/Unlock
const lockRows = ref<Order[]>([
  { orderID: 10248, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38 },
  { orderID: 10249, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'München', freight: 11.61 },
  { orderID: 10250, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83 },
  { orderID: 10251, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34 },
  { orderID: 10252, shipName: 'Suprêmes délices', shipCountry: 'Belgium', shipCity: 'Charleroi', freight: 51.3 },
])

const lockColumns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', width: 120, lockable: false },
  { field: 'shipName', title: 'Ship Name', width: 240 },
  { field: 'shipCountry', title: 'Ship Country', width: 180 },
  { field: 'shipCity', title: 'Ship City', width: 180 },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}' },
]

const lockCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Order {
  orderID: number
  shipName: string
  shipCountry: string
  shipCity: string
  freight: number
}

const columns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', width: 120, lockable: false },
  { field: 'shipName', title: 'Ship Name', width: 240 },
  { field: 'shipCountry', title: 'Ship Country', width: 180 },
  { field: 'shipCity', title: 'Ship City', width: 180 },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}' },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="orderID"
    :column-menu="true"
    :sortable="true"
    :filterable="true"
    :enable-column-reorder="true"
    :height="400"
  />
</template>

<!-- 
  The Order ID column has lockable: false, so it cannot be locked/unlocked via the menu.
  Other columns can be locked/unlocked through the column menu.
-->`

</script>
