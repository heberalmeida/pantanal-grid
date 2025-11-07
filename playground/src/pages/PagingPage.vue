<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Paging</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports paging functionality to split content into pages. By default, paging is enabled when you set
      the <code class="bg-gray-100 px-2 py-1 rounded">pageable</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
      <p class="text-gray-600 mb-4">
        To enable paging, set <code class="bg-gray-100 px-2 py-1 rounded">pageable</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>,
        specify the <code class="bg-gray-100 px-2 py-1 rounded">pageSize</code>, and handle the total number of records.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :page="basicPage"
          :pageSize="basicPageSize"
          :pageable="true"
          key-field="orderID"
          @update:page="basicPage = $event"
          @update:pageSize="basicPageSize = $event"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Server-Side Paging</h2>
      <p class="text-gray-600 mb-4">
        For large datasets, use server-side paging by setting <code class="bg-gray-100 px-2 py-1 rounded">serverSide</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>
        and providing a <code class="bg-gray-100 px-2 py-1 rounded">dataProvider</code> function.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="[]"
          :columns="serverColumns"
          :page="serverPage"
          :pageSize="serverPageSize"
          :serverSide="true"
          :pageable="true"
          key-field="orderID"
          @update:page="serverPage = $event"
          @update:pageSize="serverPageSize = $event"
          :dataProvider="(serverDataProvider as unknown) as DataProvider"
        />
      </div>

      <ExampleCode :source="serverCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Pager Visibility</h2>
      <p class="text-gray-600 mb-4">
        Control pager visibility with <code class="bg-gray-100 px-2 py-1 rounded">pageableAlwaysVisible</code>.
        When set to <code class="bg-gray-100 px-2 py-1 rounded">false</code>, the pager is hidden when all items fit on a single page.
      </p>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Small dataset (less than pageSize):</label>
        <PantanalGrid
          :rows="smallRows"
          :columns="smallColumns"
          :page="smallPage"
          :pageSize="smallPageSize"
          :pageable="true"
          :pageableAlwaysVisible="false"
          key-field="id"
          @update:page="smallPage = $event"
          @update:pageSize="smallPageSize = $event"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Large dataset (greater than pageSize):</label>
        <PantanalGrid
          :rows="largeRows"
          :columns="largeColumns"
          :page="largePage"
          :pageSize="largePageSize"
          :pageable="true"
          :pageableAlwaysVisible="false"
          key-field="id"
          @update:page="largePage = $event"
          @update:pageSize="largePageSize = $event"
        />
      </div>

      <ExampleCode :source="visibilityCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Page Sizes</h2>
      <p class="text-gray-600 mb-4">
        Customize available page sizes using the <code class="bg-gray-100 px-2 py-1 rounded">pageablePageSizes</code> prop.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customRows"
          :columns="customColumns"
          :page="customPage"
          :pageSize="customPageSize"
          :pageable="true"
          :pageablePageSizes="[5, 10, 20, 50, 100]"
          key-field="id"
          @update:page="customPage = $event"
          @update:pageSize="customPageSize = $event"
        />
      </div>

      <ExampleCode :source="customPageSizesCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Order extends Record<string, unknown> {
  orderID: number
  shipName: string
  freight: number
  orderDate: string
}

interface Product extends Record<string, unknown> {
  id: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

// Basic Usage
const basicRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Hanari Carnes', freight: 58.17, orderDate: '1996-07-11' },
  { orderID: 7, shipName: 'Chop-suey Chinese', freight: 22.98, orderDate: '1996-07-12' },
  { orderID: 8, shipName: 'Richter Supermarkt', freight: 148.33, orderDate: '1996-07-15' },
  { orderID: 9, shipName: 'Wellington Importadora', freight: 13.97, orderDate: '1996-07-16' },
  { orderID: 10, shipName: 'HILARIÓN-Abastos', freight: 81.91, orderDate: '1996-07-17' },
  { orderID: 11, shipName: 'Ernst Handel', freight: 140.51, orderDate: '1996-07-18' },
  { orderID: 12, shipName: 'Centro comercial Moctezuma', freight: 3.25, orderDate: '1996-07-19' },
  { orderID: 13, shipName: 'Ottilies Käseladen', freight: 55.09, orderDate: '1996-07-22' },
  { orderID: 14, shipName: 'Que Delícia', freight: 3.05, orderDate: '1996-07-23' },
  { orderID: 15, shipName: 'Rattlesnake Canyon Grocery', freight: 48.29, orderDate: '1996-07-24' },
  { orderID: 16, shipName: 'Ernst Handel', freight: 146.06, orderDate: '1996-07-25' },
  { orderID: 17, shipName: 'Folk och fä HB', freight: 3.67, orderDate: '1996-07-26' },
  { orderID: 18, shipName: 'Reggiani Caseifici', freight: 55.28, orderDate: '1996-07-29' },
  { orderID: 19, shipName: 'Maison Dewey', freight: 25.36, orderDate: '1996-07-30' },
  { orderID: 20, shipName: 'Island Trading', freight: 18.69, orderDate: '1996-07-31' },
])

const basicColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 180, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const basicPage = ref(1)
const basicPageSize = ref(10)

// Server-Side Paging
const serverPage = ref(1)
const serverPageSize = ref(20)

// Simulated server data
const allServerData: Order[] = Array.from({ length: 100 }, (_, i) => ({
  orderID: i + 1,
  shipName: `Ship ${i + 1}`,
  freight: Math.random() * 200,
  orderDate: `1996-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
}))

const serverDataProvider: DataProvider<Order> = async (args) => {
  console.log('serverDataProvider called:', args)
  // Simulate server delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  const filtered = allServerData.slice(start, end)
  
  console.log('serverDataProvider returning:', { rows: filtered.length, total: allServerData.length, firstRow: filtered[0] })
  
  return {
    rows: filtered,
    total: allServerData.length,
  }
}

const serverColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 180 },
  { field: 'shipName', title: 'Ship Name', width: 240 },
  { field: 'freight', title: 'Freight', width: 180 },
  { field: 'orderDate', title: 'Order Date', width: 180 },
]

// Pager Visibility
const smallRows = ref<Product[]>([
  { id: 1, productName: 'Product 1', unitPrice: 10, unitsInStock: 5, discontinued: false },
  { id: 2, productName: 'Product 2', unitPrice: 20, unitsInStock: 10, discontinued: false },
])

const smallColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 150 },
  { field: 'discontinued', title: 'Discontinued', width: 150 },
]

const smallPage = ref(1)
const smallPageSize = ref(10)

const largeRows = ref<Product[]>(
  Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    productName: `Product ${i + 1}`,
    unitPrice: (i + 1) * 10,
    unitsInStock: (i + 1) * 5,
    discontinued: i % 3 === 0,
  }))
)

const largeColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 150 },
  { field: 'discontinued', title: 'Discontinued', width: 150 },
]

const largePage = ref(1)
const largePageSize = ref(10)

// Custom Page Sizes
const customRows = ref<Product[]>(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    productName: `Product ${i + 1}`,
    unitPrice: (i + 1) * 10,
    unitsInStock: (i + 1) * 5,
    discontinued: i % 3 === 0,
  }))
)

const customColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 150 },
  { field: 'unitsInStock', title: 'Units In Stock', width: 150 },
  { field: 'discontinued', title: 'Discontinued', width: 150 },
]

const customPage = ref(1)
const customPageSize = ref(10)

const basicCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :page="page"
    :pageSize="pageSize"
    :pageable="true"
    key-field="orderID"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', freight: 32.38, orderDate: '1996-07-04' },
  // ... more rows
])

const columns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 180 },
  { field: 'shipName', title: 'Ship Name', width: 240 },
  { field: 'freight', title: 'Freight', width: 180 },
  { field: 'orderDate', title: 'Order Date', width: 180 },
]

const page = ref(1)
const pageSize = ref(10)
&lt;/script&gt;`

const serverCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="[]"
    :columns="columns"
    :page="page"
    :pageSize="pageSize"
    :serverSide="true"
    :pageable="true"
    :dataProvider="dataProvider"
    key-field="orderID"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(20)

const dataProvider: DataProvider = async (args) => {
  // Fetch data from server
  const response = await fetch(\`/api/orders?page=\${args.page}&pageSize=\${args.pageSize}\`)
  const data = await response.json()
  return {
    rows: data.items,
    total: data.total,
  }
}
&lt;/script&gt;`

const visibilityCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :page="page"
    :pageSize="pageSize"
    :pageable="true"
    :pageableAlwaysVisible="false"
    key-field="id"
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
&lt;/script&gt;`

const customPageSizesCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :page="page"
    :pageSize="pageSize"
    :pageable="true"
    :pageablePageSizes="[5, 10, 20, 50, 100]"
    key-field="id"
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
&lt;/script&gt;`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

