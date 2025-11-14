<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Multi-Column Headers</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports multi-column headers by specifying column groups which incorporate inner column structures. 
        You can nest columns by using the <code>columns</code> property of a column definition.
      </p>
    </header>

    <!-- Basic Multi-Column Headers Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Multi-Column Headers</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The following example demonstrates how to nest columns in the <strong>Product Details</strong> column which are rendered through an array of column definitions.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="productID"
        :groupable="true"
        :sortable="true"
        :resizable="true"
        :enable-column-reorder="true"
        :height="400"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Nested Column Groups Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Nested Column Groups</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can nest column groups to create multiple levels of headers. In this example, the <strong>Product Details</strong> column contains nested groups: <strong>Pricing</strong> and <strong>Inventory</strong>.
      </p>

      <PantanalGrid
        :rows="nestedRows"
        :columns="nestedColumns as any"
        key-field="productID"
        :sortable="true"
        :filterable="true"
        :resizable="true"
        :enable-column-reorder="true"
        :height="400"
      />
      <ExampleCode :source="nestedCode" />
    </article>

    <!-- Multi-Column Headers with Sorting and Filtering -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Multi-Column Headers with Sorting and Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Multi-column headers support all standard grid features. You can sort and filter by leaf columns (columns with <code>field</code> property).
      </p>

      <PantanalGrid
        :rows="sortFilterRows"
        :columns="sortFilterColumns as any"
        key-field="productID"
        :sortable="true"
        :filterable="true"
        :show-filter-row="true"
        :resizable="true"
        :column-menu="true"
        :height="400"
      />
      <ExampleCode :source="sortFilterCode" />
    </article>

    <!-- Multi-Column Headers with Column Menu -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Multi-Column Headers with Column Menu</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The column menu works with leaf columns in multi-column headers. You can show/hide, sort, filter, and lock/unlock leaf columns.
      </p>

      <PantanalGrid
        :rows="menuRows"
        :columns="menuColumns as any"
        key-field="productID"
        :sortable="true"
        :filterable="true"
        :column-menu="true"
        :column-menu-columns="true"
        :resizable="true"
        :enable-column-reorder="true"
        :height="400"
      />
      <ExampleCode :source="menuCode" />
    </article>

    <!-- Multi-Column Headers with Grouping -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Multi-Column Headers with Grouping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can group by leaf columns in multi-column headers. Grouping works the same way as with regular columns.
      </p>

      <PantanalGrid
        :rows="groupingRows"
        :columns="groupingColumns as any"
        key-field="productID"
        :groupable="true"
        :sortable="true"
        :resizable="true"
        :height="400"
      />
      <ExampleCode :source="groupingCode" />
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
  unitsOnOrder: number
  discontinued: boolean
  category: string
}

// Basic Multi-Column Headers
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, unitsOnOrder: 0, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, unitsOnOrder: 40, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, unitsOnOrder: 70, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, unitsOnOrder: 0, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, unitsOnOrder: 0, discontinued: true, category: 'Condiments' },
  { productID: 6, productName: "Boysenberry Spread", unitPrice: 25, unitsInStock: 120, unitsOnOrder: 0, discontinued: false, category: 'Condiments' },
])

const basicColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
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
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :groupable="true"
    :sortable="true"
    :resizable="true"
    :enable-column-reorder="true"
    :height="400"
  />
</template>`

// Nested Column Groups
const nestedRows = ref<Product[]>([...basicRows.value])

const nestedColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      {
        title: 'Pricing',
        columns: [
          { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
        ]
      },
      {
        title: 'Inventory',
        columns: [
          { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
          { field: 'unitsOnOrder', title: 'Units On Order', width: 120 },
        ]
      },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
]

const nestedCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      {
        title: 'Pricing',
        columns: [
          { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
        ]
      },
      {
        title: 'Inventory',
        columns: [
          { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
          { field: 'unitsOnOrder', title: 'Units On Order', width: 120 },
        ]
      },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :sortable="true"
    :filterable="true"
    :resizable="true"
    :enable-column-reorder="true"
    :height="400"
  />
</template>`

// Sorting and Filtering
const sortFilterRows = ref<Product[]>([...basicRows.value])

const sortFilterColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120, sortable: true, filterable: true },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120, sortable: true, filterable: true },
      { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true, filterable: true, type: 'boolean' },
    ]
  },
  { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
]

const sortFilterCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120, sortable: true, filterable: true },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120, sortable: true, filterable: true },
      { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true, filterable: true, type: 'boolean' },
    ]
  },
  { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :sortable="true"
    :filterable="true"
    :show-filter-row="true"
    :resizable="true"
    :column-menu="true"
    :height="400"
  />
</template>`

// Column Menu
const menuRows = ref<Product[]>([...basicRows.value])

const menuColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
  { field: 'category', title: 'Category', width: 150 },
]

const menuCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
  { field: 'category', title: 'Category', width: 150 },
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
    :column-menu-columns="true"
    :resizable="true"
    :enable-column-reorder="true"
    :height="400"
  />
</template>`

// Grouping
const groupingRows = ref<Product[]>([...basicRows.value])

const groupingColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
  { field: 'category', title: 'Category', width: 150 },
]

const groupingCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  {
    title: 'Product Details',
    columns: [
      { field: 'unitPrice', title: 'Unit Price', format: '{0:c}', width: 120 },
      { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
      { field: 'discontinued', title: 'Discontinued', width: 120 },
    ]
  },
  { field: 'category', title: 'Category', width: 150 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :groupable="true"
    :sortable="true"
    :resizable="true"
    :height="400"
  />
</template>`

</script>

