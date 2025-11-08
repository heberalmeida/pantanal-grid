<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Copy to Clipboard</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports copying data to the clipboard. Enable copy functionality by setting the
      <code class="bg-gray-100 px-2 py-1 rounded">allowCopy</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
      Press <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+C</code> (or <code class="bg-gray-100 px-2 py-1 rounded">Cmd+C</code> on Mac) to copy selected cells or rows.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Copy (TSV Format)</h2>
      <p class="text-gray-600 mb-4">
        Enable copy by setting <code class="bg-gray-100 px-2 py-1 rounded">allowCopy</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
        By default, data is copied in TSV (Tab-Separated Values) format. Select text in the grid and press <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+C</code> to copy.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :allowCopy="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Copy with CSV Delimiter</h2>
      <p class="text-gray-600 mb-4">
        Change the delimiter to comma by setting <code class="bg-gray-100 px-2 py-1 rounded">allowCopyDelimiter</code> to <code class="bg-gray-100 px-2 py-1 rounded">","</code>.
        This is useful for copying data to spreadsheet applications that expect CSV format.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="csvRows"
          :columns="csvColumns"
          :allowCopy="true"
          allowCopyDelimiter=","
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="csvCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Copy Selected Rows</h2>
      <p class="text-gray-600 mb-4">
        When selection is enabled, pressing <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+C</code> without selecting text will copy all selected rows.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="selectionRows"
          :columns="selectionColumns"
          :allowCopy="true"
          :selectable="'multiple'"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="selectionCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Copy with Keyboard Navigation</h2>
      <p class="text-gray-600 mb-4">
        When keyboard navigation is enabled, you can copy the focused cell by pressing <code class="bg-gray-100 px-2 py-1 rounded">Ctrl+C</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="keyboardRows"
          :columns="keyboardColumns"
          :allowCopy="true"
          :navigatable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="keyboardCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Delimiter</h2>
      <p class="text-gray-600 mb-4">
        You can use any delimiter string. Here we use a pipe character (<code class="bg-gray-100 px-2 py-1 rounded">|</code>) as the delimiter.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customRows"
          :columns="customColumns"
          :allowCopy="true"
          allowCopyDelimiter=" | "
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
  category: string
  unitsInStock: number
  discontinued: boolean
}

// Basic Copy
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, category: 'Condiments', unitsInStock: 120, discontinued: false },
])

const basicColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

// CSV Format
const csvRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, category: 'Condiments', unitsInStock: 120, discontinued: false },
])

const csvColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
]

// Copy Selected Rows
const selectionRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, category: 'Beverages', unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, category: 'Condiments', unitsInStock: 13, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
])

const selectionColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
]

// Keyboard Navigation
const keyboardRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
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

// Custom Delimiter
const customRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages', unitsInStock: 39, discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, category: 'Condiments', unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, category: 'Condiments', unitsInStock: 0, discontinued: true },
])

const customColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]

const basicCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`

const csvCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    allowCopyDelimiter=","
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`

const selectionCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    :selectable="'multiple'"
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`

const keyboardCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    :navigatable="true"
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`

const customCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :allowCopy="true"
    allowCopyDelimiter=" | "
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

