<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Excel Export</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports exporting data to Excel format. You can export the current page or all pages,
      customize the file name, and use a proxy for browsers that don't support direct file downloads.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
      <p class="text-gray-600 mb-4">
        Add <code class="bg-gray-100 px-2 py-1 rounded">'excel'</code> to the toolbar to enable Excel export.
        By default, only the current page is exported.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :toolbar="['excel']"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Export All Pages</h2>
      <p class="text-gray-600 mb-4">
        Set <code class="bg-gray-100 px-2 py-1 rounded">excelAllPages</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>
        to export all data pages instead of just the current page.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="allPagesRows"
          :columns="allPagesColumns"
          :toolbar="['excel']"
          :excelAllPages="true"
          :pageable="true"
          :pageSize="10"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="allPagesCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom File Name</h2>
      <p class="text-gray-600 mb-4">
        Specify a custom file name using the <code class="bg-gray-100 px-2 py-1 rounded">excelFileName</code> prop.
        The file will be exported as CSV format (which Excel opens correctly).
      </p>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">File name:</label>
        <input
          v-model="customFileName"
          type="text"
          class="border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Enter file name (e.g., my-export.csv)"
        />
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customFileNameRows"
          :columns="customFileNameColumns"
          :toolbar="['excel']"
          :excelFileName="customFileName"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="customFileNameCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Server-Side Export</h2>
      <p class="text-gray-600 mb-4">
        For server-side data, the export will include all pages when <code class="bg-gray-100 px-2 py-1 rounded">excelAllPages</code> is enabled.
        You can also call your API to generate the Excel file on the server.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="[]"
          :columns="serverColumns"
          :toolbar="['excel']"
          :excelAllPages="true"
          :excelFileName="'server-export.csv'"
          :dataProvider="serverDataProvider as any"
          :page="serverPage"
          :pageSize="serverPageSize"
          :serverSide="true"
          :pageable="true"
          :autoBind="true"
          responsive="table"
          key-field="productID"
          @update:page="serverPage = $event"
          @update:pageSize="serverPageSize = $event"
        />
      </div>

      <ExampleCode :source="serverSideCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Export with Filtering</h2>
      <p class="text-gray-600 mb-4">
        When <code class="bg-gray-100 px-2 py-1 rounded">excelFilterable</code> is enabled (default),
        the exported Excel file will have autofilter enabled on all columns, allowing users to filter data directly in Excel.
        The exported data will respect any filters applied in the Grid.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="filterableRows"
          :columns="filterableColumns"
          :toolbar="['excel']"
          :excelFilterable="true"
          :filterable="true"
          :showFilterRow="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="filterableCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Export with Proxy</h2>
      <p class="text-gray-600 mb-4">
        For browsers that don't support direct file downloads (like IE9 or Safari),
        you can use a proxy server. Set <code class="bg-gray-100 px-2 py-1 rounded">excelProxyUrl</code>
        to the URL of your proxy endpoint.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="proxyRows"
          :columns="proxyColumns"
          :toolbar="['excel']"
          :excelForceProxy="false"
          excelProxyUrl="/api/excel-proxy"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="proxyCode" />
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
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
])

const basicColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]

// Export All Pages
const allPagesRows = ref<Product[]>(
  Array.from({ length: 50 }, (_, i) => ({
    productID: i + 1,
    productName: `Product ${i + 1}`,
    unitPrice: Math.floor(Math.random() * 100) + 10,
    unitsInStock: Math.floor(Math.random() * 100),
    discontinued: i % 5 === 0,
    category: ['Beverages', 'Condiments', 'Confections', 'Dairy Products', 'Grains'][i % 5],
  }))
)

const allPagesColumns: ColumnDef[] = [...basicColumns]

// Custom File Name
const customFileName = ref('my-products-export.csv')
const customFileNameRows = ref<Product[]>([...basicRows.value])
const customFileNameColumns: ColumnDef[] = [...basicColumns]

// Server-Side Export
const serverPage = ref(1)
const serverPageSize = ref(20)

// Simulated server data
const serverSideSampleData: Product[] = Array.from({ length: 100 }, (_, i) => ({
  productID: i + 1,
  productName: `Product ${i + 1}`,
  unitPrice: Math.floor(Math.random() * 100) + 10,
  unitsInStock: Math.floor(Math.random() * 100),
  discontinued: i % 5 === 0,
  category: ['Beverages', 'Condiments', 'Confections', 'Dairy Products', 'Grains'][i % 5],
}))

const serverDataProvider: any = async (args: any) => {
  console.log('serverDataProvider called with:', args)
  
  // Simulate server delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  const filtered = serverSideSampleData.slice(start, end)
  const total = serverSideSampleData.length
  
  console.log('serverDataProvider returning:', { rows: filtered.length, total, firstRow: filtered[0] })
  
  return {
    rows: filtered,
    total: total,
  }
}

const serverColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]

// Filterable
const filterableRows = ref<Product[]>([...basicRows.value])
const filterableColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120, filterable: true },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, filterable: true, type: 'boolean' },
  { field: 'category', title: 'Category', width: 150, filterable: true },
]

// Proxy
const proxyRows = ref<Product[]>([...basicRows.value])
const proxyColumns: ColumnDef[] = [...basicColumns]

const basicCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['excel']"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const allPagesCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['excel']"
    :excelAllPages="true"
    :pageable="true"
    :pageSize="10"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const customFileNameCode = `<template>
  <div>
    <input
      v-model="fileName"
      type="text"
      placeholder="Enter file name"
      class="border rounded px-3 py-2 mb-4"
    />
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      :toolbar="['excel']"
      :excelFileName="fileName"
      key-field="productID"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const fileName = ref('my-products-export.csv')
const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const filterableCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['excel']"
    :excelFilterable="true"
    :filterable="true"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const proxyCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['excel']"
    :excelForceProxy="false"
    excelProxyUrl="/api/excel-proxy"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const serverSideCode = `<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :toolbar="['excel']"
    :excelAllPages="true"
    excelFileName="server-export.csv"
    :dataProvider="dataProvider"
    :page="page"
    :pageSize="pageSize"
    :serverSide="true"
    :pageable="true"
    key-field="productID"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(20)

const dataProvider: DataProvider = async (args) => {
  // Fetch data from your API
  const response = await fetch(\`/api/products?page=\${args.page}&pageSize=\${args.pageSize}\`)
  const data = await response.json()
  return {
    rows: data.items,
    total: data.total,
  }
}

const columns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120 },
  { field: 'productName', title: 'Product Name', width: 200 },
  // ...
]
<\/script>`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

