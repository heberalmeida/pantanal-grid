<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">CSV and Word Export</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports exporting data to CSV and Word (DOCX) formats. You can export the current page or all pages,
      customize the file name, and use these formats for different use cases.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">CSV Export</h2>
      <p class="text-gray-600 mb-4">
        CSV export is useful for data analysis in spreadsheet applications. Add <code class="bg-gray-100 px-2 py-1 rounded">'csv'</code> to the toolbar to enable CSV export.
        By default, only the current page is exported.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="csvRows"
          :columns="csvColumns"
          :toolbar="['csv']"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="csvCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Word (DOCX) Export</h2>
      <p class="text-gray-600 mb-4">
        Word export creates a formatted table in a Word document. Add <code class="bg-gray-100 px-2 py-1 rounded">'docx'</code> to the toolbar to enable Word export.
        <strong>Note:</strong> You need to install <code class="bg-gray-100 px-2 py-1 rounded">docx</code> and <code class="bg-gray-100 px-2 py-1 rounded">file-saver</code> packages.
      </p>
      
      <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p class="text-sm text-yellow-800">
          <strong>Installation:</strong> <code class="bg-yellow-100 px-2 py-1 rounded">npm install docx file-saver</code>
        </p>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="docxRows"
          :columns="docxColumns"
          :toolbar="['docx']"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="docxCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Export All Pages</h2>
      <p class="text-gray-600 mb-4">
        Set <code class="bg-gray-100 px-2 py-1 rounded">excelAllPages</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>
        to export all data pages instead of just the current page. This works for both CSV and DOCX exports.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="allPagesRows"
          :columns="allPagesColumns"
          :toolbar="['csv', 'docx']"
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
      <h2 class="text-2xl font-semibold mb-4">Custom File Names</h2>
      <p class="text-gray-600 mb-4">
        Specify custom file names using the <code class="bg-gray-100 px-2 py-1 rounded">excelFileName</code> prop.
        The file extension will be automatically adjusted based on the export format.
      </p>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">File name:</label>
        <input
          v-model="customFileName"
          type="text"
          class="border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Enter file name (e.g., my-export)"
        />
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customFileNameRows"
          :columns="customFileNameColumns"
          :toolbar="['csv', 'docx']"
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
        The grid will automatically fetch all pages from the server.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="[]"
          :columns="serverColumns"
          :toolbar="['csv', 'docx']"
          :excelAllPages="true"
          :excelFileName="'server-export'"
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
      <h2 class="text-2xl font-semibold mb-4">Combined Export Options</h2>
      <p class="text-gray-600 mb-4">
        You can include multiple export formats in the toolbar. Users can choose the format that best suits their needs.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="combinedRows"
          :columns="combinedColumns"
          :toolbar="['excel', 'csv', 'docx', 'pdf']"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="combinedCode" />
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

// CSV Export
const csvRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
])

const csvColumns: ColumnDef[] = [
  { field: 'productID', title: 'Product ID', width: 120 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
]

// DOCX Export
const docxRows = ref<Product[]>([...csvRows.value])
const docxColumns: ColumnDef[] = [...csvColumns]

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

const allPagesColumns: ColumnDef[] = [...csvColumns]

// Custom File Name
const customFileName = ref('my-products-export')
const customFileNameRows = ref<Product[]>([...csvRows.value])
const customFileNameColumns: ColumnDef[] = [...csvColumns]

// Server-Side Export
const serverPage = ref(1)
const serverPageSize = ref(20)

const serverSideSampleData: Product[] = Array.from({ length: 100 }, (_, i) => ({
  productID: i + 1,
  productName: `Product ${i + 1}`,
  unitPrice: Math.floor(Math.random() * 100) + 10,
  unitsInStock: Math.floor(Math.random() * 100),
  discontinued: i % 5 === 0,
  category: ['Beverages', 'Condiments', 'Confections', 'Dairy Products', 'Grains'][i % 5],
}))

const serverDataProvider: any = async (args: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  const filtered = serverSideSampleData.slice(start, end)
  const total = serverSideSampleData.length
  
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

// Combined Export
const combinedRows = ref<Product[]>([...csvRows.value])
const combinedColumns: ColumnDef[] = [...csvColumns]

const csvCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['csv']"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const docxCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['docx']"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Note: Requires docx and file-saver packages
// npm install docx file-saver

const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const allPagesCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['csv', 'docx']"
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
      :toolbar="['csv', 'docx']"
      :excelFileName="fileName"
      key-field="productID"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const fileName = ref('my-products-export')
const rows = ref([...])
const columns: ColumnDef[] = [...]
<\/script>`

const serverSideCode = `<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    :toolbar="['csv', 'docx']"
    :excelAllPages="true"
    excelFileName="server-export"
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
  const response = await fetch(\`/api/products?page=\${args.page}&pageSize=\${args.pageSize}\`)
  const data = await response.json()
  return {
    rows: data.items,
    total: data.total,
  }
}
<\/script>`

const combinedCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :toolbar="['excel', 'csv', 'docx', 'pdf']"
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


