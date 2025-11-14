<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Groupable Props</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports various properties to control grouping behavior. You can configure grouping at both the grid level and column level.
      </p>
    </header>

    <!-- Column-Level groupable Property -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Column-Level groupable Property</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">groupable</code> property on a column to control whether it can be grouped. 
        Set <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">groupable: false</code> to prevent grouping by that column.
      </p>

      <PantanalGrid
        :rows="groupableRows"
        :columns="groupableColumns as any"
        key-field="productID"
        :group="groupableGroup"
        :groupable="true"
        :height="400"
      />
      <ExampleCode :source="groupableCode" />
    </article>

    <!-- groupableSortDir Property -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">groupableSortDir Property</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">groupableSortDir</code> property to specify the default sort direction for groups. 
        Set to <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">'asc'</code> for ascending or <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">'desc'</code> for descending.
      </p>

      <PantanalGrid
        :rows="sortDirRows"
        :columns="sortDirColumns as any"
        key-field="productID"
        :group="sortDirGroup"
        :height="400"
      />
      <ExampleCode :source="sortDirCode" />
    </article>

    <!-- groupableSortCompare Property -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">groupableSortCompare Property</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">groupableSortCompare</code> property to provide a custom comparison function for sorting groups. 
        This function has the same signature as the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">compare</code> function used by <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Array.sort</code>.
      </p>

      <PantanalGrid
        :rows="sortCompareRows"
        :columns="sortCompareColumns as any"
        key-field="productID"
        :group="sortCompareGroup"
        :height="400"
      />
      <ExampleCode :source="sortCompareCode" />
    </article>

    <!-- showGroupFooters Property -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">showGroupFooters Property</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">showGroupFooters</code> property to control whether group footer rows are displayed. 
        When enabled, group footers remain visible even when the group is collapsed.
      </p>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">With Group Footers (showGroupFooters: true)</h3>
          <PantanalGrid
            :rows="footerRows"
            :columns="footerColumns as any"
            key-field="productID"
            :group="footerGroup"
            :show-group-footers="true"
            :height="400"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Without Group Footers (showGroupFooters: false)</h3>
          <PantanalGrid
            :rows="footerRows"
            :columns="footerColumns as any"
            key-field="productID"
            :group="footerGroup"
            :show-group-footers="false"
            :height="400"
          />
        </div>
      </div>
      <ExampleCode :source="footerCode" />
    </article>

    <!-- Combining Multiple Properties -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Combining Multiple Properties</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can combine multiple groupable properties to create complex grouping configurations.
      </p>

      <PantanalGrid
        :rows="combinedRows"
        :columns="combinedColumns as any"
        key-field="productID"
        :group="combinedGroup"
        :show-group-footers="true"
        :height="400"
      />
      <ExampleCode :source="combinedCode" />
    </article>

    <!-- Grouping with Aggregates -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Grouping with Aggregates</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Combine groupable properties with aggregates to display summary information in group footers.
      </p>

      <PantanalGrid
        :rows="aggregatesRows"
        :columns="aggregatesColumns as any"
        key-field="productID"
        :group="aggregatesGroup"
        :aggregates="aggregatesAggregates"
        :show-group-footers="true"
        :height="400"
      />
      <ExampleCode :source="aggregatesCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  productID: number
  productName: string
  category: string
  supplier: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

// Column-Level groupable Property
const groupableRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', supplier: 'Exotic Liquids', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', category: 'Beverages', supplier: 'Exotic Liquids', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', supplier: 'Exotic Liquids', unitPrice: 10, unitsInStock: 13, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', category: 'Condiments', supplier: 'New Orleans Cajun Delights', unitPrice: 22, unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', category: 'Condiments', supplier: 'New Orleans Cajun Delights', unitPrice: 21.35, unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', category: 'Condiments', supplier: 'Grandma Kelly\'s Homestead', unitPrice: 25, unitsInStock: 120, discontinued: false },
])

const groupableColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150, groupable: true }, // Can be grouped
  { field: 'supplier', title: 'Supplier', width: 200, groupable: false }, // Cannot be grouped
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const groupableGroup = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])

const groupableCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150, groupable: true }, // Can be grouped
  { field: 'supplier', title: 'Supplier', width: 200, groupable: false }, // Cannot be grouped
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const group = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :groupable="true"
    :height="400"
  />
</template>`

// groupableSortDir Property
const sortDirRows = ref<Product[]>([...groupableRows.value])
const sortDirColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150, groupableSortDir: 'desc' }, // Default descending
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const sortDirGroup = ref<GroupDescriptor[]>([{ field: 'category' }]) // Uses column's groupableSortDir

const sortDirCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150, groupableSortDir: 'desc' }, // Default descending
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const group = ref<GroupDescriptor[]>([{ field: 'category' }]) // Uses column's groupableSortDir
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :height="400"
  />
</template>`

// groupableSortCompare Property
const sortCompareRows = ref<Product[]>([...groupableRows.value])
const sortCompareColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { 
    field: 'category', 
    title: 'Category', 
    width: 150,
    groupableSortCompare: (a: any, b: any) => {
      // Custom sort: 'Beverages' first, then others alphabetically
      if (a === 'Beverages' && b !== 'Beverages') return -1
      if (a !== 'Beverages' && b === 'Beverages') return 1
      return a > b ? 1 : a < b ? -1 : 0
    }
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const sortCompareGroup = ref<GroupDescriptor[]>([{ field: 'category' }])

const sortCompareCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { 
    field: 'category', 
    title: 'Category', 
    width: 150,
    groupableSortCompare: (a: any, b: any) => {
      // Custom sort: 'Beverages' first, then others alphabetically
      if (a === 'Beverages' && b !== 'Beverages') return -1
      if (a !== 'Beverages' && b === 'Beverages') return 1
      return a > b ? 1 : a < b ? -1 : 0
    }
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const group = ref<GroupDescriptor[]>([{ field: 'category' }])
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :height="400"
  />
</template>`

// showGroupFooters Property
const footerRows = ref<Product[]>([...groupableRows.value])
const footerColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const footerGroup = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])

const footerCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const group = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])
<\/script>

<template>
  <!-- With Group Footers -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :show-group-footers="true"
    :height="400"
  />

  <!-- Without Group Footers -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :show-group-footers="false"
    :height="400"
  />
</template>`

// Combining Multiple Properties
const combinedRows = ref<Product[]>([...groupableRows.value])
const combinedColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { 
    field: 'category', 
    title: 'Category', 
    width: 150, 
    groupable: true,
    groupableSortDir: 'asc',
    groupableSortCompare: (a: any, b: any) => a > b ? 1 : a < b ? -1 : 0
  },
  { field: 'supplier', title: 'Supplier', width: 200, groupable: false },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const combinedGroup = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])

const combinedCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { 
    field: 'category', 
    title: 'Category', 
    width: 150, 
    groupable: true,
    groupableSortDir: 'asc',
    groupableSortCompare: (a: any, b: any) => a > b ? 1 : a < b ? -1 : 0
  },
  { field: 'supplier', title: 'Supplier', width: 200, groupable: false },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const group = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :show-group-footers="true"
    :height="400"
  />
</template>`

// Grouping with Aggregates
const aggregatesRows = ref<Product[]>([...groupableRows.value])
const aggregatesColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const aggregatesGroup = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])
const aggregatesAggregates: Record<string, AggregateName[]> = {
  unitPrice: ['sum', 'avg'],
  unitsInStock: ['sum', 'avg'],
  productID: ['count'],
}

const aggregatesCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const group = ref<GroupDescriptor[]>([{ field: 'category', dir: 'asc' }])
const aggregates: Record<string, AggregateName[]> = {
  unitPrice: ['sum', 'avg'],
  unitsInStock: ['sum', 'avg'],
  productID: ['count'],
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
    :height="400"
  />
</template>`
</script>

