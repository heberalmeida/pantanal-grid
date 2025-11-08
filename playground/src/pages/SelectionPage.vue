<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Selection</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports row selection functionality. You can enable single-row selection, multiple-row selection,
      and checkbox-based selection by setting the <code class="bg-gray-100 px-2 py-1 rounded">selectable</code> prop.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Single-Row Selection</h2>
      <p class="text-gray-600 mb-4">
        Enable single-row selection by setting <code class="bg-gray-100 px-2 py-1 rounded">selectable</code> to <code class="bg-gray-100 px-2 py-1 rounded">"single"</code>.
        Click on a row or use the checkbox to select it. Only one row can be selected at a time.
      </p>
      
      <div class="mb-4">
        <p class="text-sm text-gray-500 mb-2">
          Selected: {{ singleSelected.length > 0 ? `Row ${singleSelected[0]}` : 'None' }}
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="singleRows"
          :columns="singleColumns"
          :selectable="'single'"
          responsive="table"
          key-field="productID"
          @selectionChange="singleSelected = $event"
        />
      </div>

      <ExampleCode :source="singleCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Multiple-Row Selection</h2>
      <p class="text-gray-600 mb-4">
        Enable multiple-row selection by setting <code class="bg-gray-100 px-2 py-1 rounded">selectable</code> to <code class="bg-gray-100 px-2 py-1 rounded">"multiple"</code>.
        You can select multiple rows using checkboxes or by clicking on rows while holding Ctrl/Cmd or Shift keys.
      </p>
      
      <div class="mb-4">
        <p class="text-sm text-gray-500 mb-2">
          Selected: {{ multipleSelected.length }} row(s) - IDs: {{ multipleSelected.join(', ') || 'None' }}
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="multipleRows"
          :columns="multipleColumns"
          :selectable="'multiple'"
          responsive="table"
          key-field="productID"
          @selectionChange="multipleSelected = $event"
        />
      </div>

      <ExampleCode :source="multipleCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Selection with Keyboard Navigation</h2>
      <p class="text-gray-600 mb-4">
        When <code class="bg-gray-100 px-2 py-1 rounded">navigatable</code> is enabled, you can use keyboard shortcuts to select rows:
      </p>
      <ul class="list-disc list-inside text-gray-600 mb-4 space-y-1">
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">Space</code> - Select/deselect current row</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">Ctrl+Space</code> - Toggle selection (multiple mode)</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">Shift+Space</code> - Range selection (multiple mode)</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">Shift+Arrow Keys</code> - Extend selection (multiple mode)</li>
      </ul>
      
      <div class="mb-4">
        <p class="text-sm text-gray-500 mb-2">
          Selected: {{ keyboardSelected.length }} row(s) - IDs: {{ keyboardSelected.join(', ') || 'None' }}
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="keyboardRows"
          :columns="keyboardColumns"
          :selectable="'multiple'"
          :navigatable="true"
          responsive="table"
          key-field="productID"
          @selectionChange="keyboardSelected = $event"
        />
      </div>

      <ExampleCode :source="keyboardCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Selection with Paging</h2>
      <p class="text-gray-600 mb-4">
        Selection works with paging. When you navigate between pages, selected rows are maintained.
        Note: Selection is per-page by default. Use the <code class="bg-gray-100 px-2 py-1 rounded">persistSelection</code> prop to persist selection across pages.
      </p>
      
      <div class="mb-4">
        <p class="text-sm text-gray-500 mb-2">
          Selected: {{ pagingSelected.length }} row(s) - IDs: {{ pagingSelected.join(', ') || 'None' }}
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="pagingRows"
          :columns="pagingColumns"
          :selectable="'multiple'"
          :pageable="true"
          :page="pagingPage"
          :pageSize="pagingPageSize"
          responsive="table"
          key-field="productID"
          @selectionChange="pagingSelected = $event"
          @update:page="pagingPage = $event"
          @update:pageSize="pagingPageSize = $event"
        />
      </div>

      <ExampleCode :source="pagingCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Selection Events</h2>
      <p class="text-gray-600 mb-4">
        Listen to <code class="bg-gray-100 px-2 py-1 rounded">@selectionChange</code> events to track selection changes.
        The event emits an array of selected row keys.
      </p>
      
      <div class="mb-4">
        <p class="text-sm text-gray-500 mb-2">
          Selected: {{ eventSelected.length }} row(s) - IDs: {{ eventSelected.join(', ') || 'None' }}
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="eventRows"
          :columns="eventColumns"
          :selectable="'multiple'"
          responsive="table"
          key-field="productID"
          @selectionChange="eventSelected = $event"
          @rowClick="handleRowClick"
        />
      </div>

      <ExampleCode :source="eventCode" />
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
  category: string
  unitsInStock: number
  discontinued: boolean
}

// Single Row Selection
const singleRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, category: 'Condiments', unitsInStock: 120, discontinued: false },
])

const singleColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const singleSelected = ref<unknown[]>([])

// Multiple Row Selection
const multipleRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, category: 'Beverages', unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, category: 'Condiments', unitsInStock: 13, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, category: 'Condiments', unitsInStock: 120, discontinued: false },
])

const multipleColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

const multipleSelected = ref<unknown[]>([])

// Keyboard Navigation
const keyboardRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, category: 'Beverages', unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, category: 'Condiments', unitsInStock: 13, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, category: 'Condiments', unitsInStock: 120, discontinued: false },
])

const keyboardColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
]

const keyboardSelected = ref<unknown[]>([])

// Selection with Paging
const pagingRows = ref<Product[]>(
  Array.from({ length: 20 }, (_, i) => ({
    productID: i + 1,
    productName: `Product ${i + 1}`,
    unitPrice: (i + 1) * 10,
    category: i % 2 === 0 ? 'Beverages' : 'Condiments',
    unitsInStock: (i + 1) * 5,
    discontinued: i % 3 === 0,
  }))
)

const pagingColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
]

const pagingPage = ref(1)
const pagingPageSize = ref(10)
const pagingSelected = ref<unknown[]>([])

// Selection Events
const eventRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, category: 'Beverages', unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, category: 'Condiments', unitsInStock: 13, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, category: 'Condiments', unitsInStock: 120, discontinued: false },
])

const eventColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
]

const eventSelected = ref<unknown[]>([])

function handleRowClick(row: unknown) {
  console.log('Row clicked:', row)
}

const singleCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'single'"
    key-field="productID"
    @selectionChange="selected = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const selected = ref([])
&lt;/script&gt;`

const multipleCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    key-field="productID"
    @selectionChange="selected = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const selected = ref([])
&lt;/script&gt;`

const keyboardCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    :navigatable="true"
    key-field="productID"
    @selectionChange="selected = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const selected = ref([])
&lt;/script&gt;`

const pagingCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    :pageable="true"
    :page="page"
    :pageSize="pageSize"
    key-field="productID"
    @selectionChange="selected = $event"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const page = ref(1)
const pageSize = ref(10)
const selected = ref([])
&lt;/script&gt;`

const eventCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :selectable="'multiple'"
    key-field="productID"
    @selectionChange="selected = $event"
    @rowClick="handleRowClick"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const selected = ref([])

function handleRowClick(row: unknown) {
  console.log('Row clicked:', row)
}
&lt;/script&gt;`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

