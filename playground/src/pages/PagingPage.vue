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
          responsive="table"
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
          :total="serverTotal"
          responsive="table"
          key-field="orderID"
          @update:page="serverPage = $event"
          @update:pageSize="serverPageSize = $event"
          :dataProvider="serverDataProvider as any"
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
          responsive="table"
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
          responsive="table"
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
          responsive="table"
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
const serverTotal = ref(100)

// Sample data for server-side paging
const serverSideSampleData: Order[] = [
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
  { orderID: 21, shipName: 'Wartian Herkku', freight: 58.88, orderDate: '1996-08-01' },
  { orderID: 22, shipName: 'Simons bistro', freight: 13.75, orderDate: '1996-08-02' },
  { orderID: 23, shipName: 'QUICK-Stop', freight: 62.74, orderDate: '1996-08-05' },
  { orderID: 24, shipName: 'Wilman Kala', freight: 12.69, orderDate: '1996-08-06' },
  { orderID: 25, shipName: 'Berglunds snabbköp', freight: 10.96, orderDate: '1996-08-07' },
  { orderID: 26, shipName: 'Alfreds Futterkiste', freight: 45.08, orderDate: '1996-08-08' },
  { orderID: 27, shipName: 'Bottom-Dollar Marketse', freight: 25.91, orderDate: '1996-08-09' },
  { orderID: 28, shipName: 'Blauer See Delikatessen', freight: 11.26, orderDate: '1996-08-12' },
  { orderID: 29, shipName: 'Cactus Comidas para llevar', freight: 47.30, orderDate: '1996-08-13' },
  { orderID: 30, shipName: 'Great Lakes Food Market', freight: 17.68, orderDate: '1996-08-14' },
  { orderID: 31, shipName: 'Bon app\'', freight: 83.93, orderDate: '1996-08-15' },
  { orderID: 32, shipName: 'Ranchères du monde', freight: 68.26, orderDate: '1996-08-16' },
  { orderID: 33, shipName: 'Split Rail Beer & Ale', freight: 87.03, orderDate: '1996-08-19' },
  { orderID: 34, shipName: 'Princesa Isabel Vinhoss', freight: 191.27, orderDate: '1996-08-20' },
  { orderID: 35, shipName: 'Franchi S.p.A.', freight: 51.83, orderDate: '1996-08-21' },
  { orderID: 36, shipName: 'Gourmet Lanchonetes', freight: 1.15, orderDate: '1996-08-22' },
  { orderID: 37, shipName: 'Mère Paillarde', freight: 4.78, orderDate: '1996-08-23' },
  { orderID: 38, shipName: 'La corne d\'abondance', freight: 136.54, orderDate: '1996-08-26' },
  { orderID: 39, shipName: 'LILA-Supermercado', freight: 83.49, orderDate: '1996-08-27' },
  { orderID: 40, shipName: 'LINO-Delicateses', freight: 149.47, orderDate: '1996-08-28' },
  { orderID: 41, shipName: 'Around the Horn', freight: 146.32, orderDate: '1996-08-29' },
  { orderID: 42, shipName: 'Vaffeljernet', freight: 55.26, orderDate: '1996-08-30' },
  { orderID: 43, shipName: 'Tradição Hipermercados', freight: 25.41, orderDate: '1996-09-02' },
  { orderID: 44, shipName: 'Wartian Herkku', freight: 29.46, orderDate: '1996-09-03' },
  { orderID: 45, shipName: 'Tortuga Restaurante', freight: 12.76, orderDate: '1996-09-04' },
  { orderID: 46, shipName: 'Trail\'s Head Gourmet Provisioners', freight: 142.08, orderDate: '1996-09-05' },
  { orderID: 47, shipName: 'Save-a-lot Markets', freight: 3.10, orderDate: '1996-09-06' },
  { orderID: 48, shipName: 'Lazy K Kountry Store', freight: 23.65, orderDate: '1996-09-09' },
  { orderID: 49, shipName: 'Let\'s Stop N Shop', freight: 4.78, orderDate: '1996-09-10' },
  { orderID: 50, shipName: 'White Clover Markets', freight: 12.69, orderDate: '1996-09-11' },
  { orderID: 51, shipName: 'Mère Paillarde', freight: 10.09, orderDate: '1996-09-12' },
  { orderID: 52, shipName: 'Consolidated Holdings', freight: 130.94, orderDate: '1996-09-13' },
  { orderID: 53, shipName: 'Blauer See Delikatessen', freight: 1.93, orderDate: '1996-09-16' },
  { orderID: 54, shipName: 'Drachenblut Delikatessend', freight: 0.40, orderDate: '1996-09-17' },
  { orderID: 55, shipName: 'Eastern Connection', freight: 146.69, orderDate: '1996-09-18' },
  { orderID: 56, shipName: 'Antonio Moreno Taquería', freight: 3.53, orderDate: '1996-09-19' },
  { orderID: 57, shipName: 'Galería del gastrónomo', freight: 120.27, orderDate: '1996-09-20' },
  { orderID: 58, shipName: 'Magazzini Alimentari Riuniti', freight: 236.80, orderDate: '1996-09-23' },
  { orderID: 59, shipName: 'Königlich Essen', freight: 77.63, orderDate: '1996-09-24' },
  { orderID: 60, shipName: 'La maison d\'Asie', freight: 28.76, orderDate: '1996-09-25' },
  { orderID: 61, shipName: 'Familia Arquibaldo', freight: 12.69, orderDate: '1996-09-26' },
  { orderID: 62, shipName: 'Die Wandernde Kuh', freight: 22.57, orderDate: '1996-09-27' },
  { orderID: 63, shipName: 'Frankenversand', freight: 76.56, orderDate: '1996-09-30' },
  { orderID: 64, shipName: 'Tortuga Restaurante', freight: 36.56, orderDate: '1996-10-01' },
  { orderID: 65, shipName: 'Antonio Moreno Taquería', freight: 4.98, orderDate: '1996-10-02' },
  { orderID: 66, shipName: 'Save-a-lot Markets', freight: 145.45, orderDate: '1996-10-03' },
  { orderID: 67, shipName: 'Blondesddsl père et fils', freight: 33.93, orderDate: '1996-10-04' },
  { orderID: 68, shipName: 'Old World Delicatessen', freight: 96.78, orderDate: '1996-10-07' },
  { orderID: 69, shipName: 'Great Lakes Food Market', freight: 0.87, orderDate: '1996-10-08' },
  { orderID: 70, shipName: 'Maison Dewey', freight: 8.53, orderDate: '1996-10-09' },
  { orderID: 71, shipName: 'LILA-Supermercado', freight: 64.19, orderDate: '1996-10-10' },
  { orderID: 72, shipName: 'Lazy K Kountry Store', freight: 42.11, orderDate: '1996-10-11' },
  { orderID: 73, shipName: 'Ernst Handel', freight: 73.79, orderDate: '1996-10-14' },
  { orderID: 74, shipName: 'Reggiani Caseifici', freight: 68.52, orderDate: '1996-10-15' },
  { orderID: 75, shipName: 'Bólido Comidas preparadas', freight: 87.68, orderDate: '1996-10-16' },
  { orderID: 76, shipName: 'Comércio Mineiro', freight: 38.28, orderDate: '1996-10-17' },
  { orderID: 77, shipName: 'Frankenversand', freight: 53.30, orderDate: '1996-10-18' },
  { orderID: 78, shipName: 'White Clover Markets', freight: 75.89, orderDate: '1996-10-21' },
  { orderID: 79, shipName: 'Lehmanns Marktstand', freight: 3.01, orderDate: '1996-10-22' },
  { orderID: 80, shipName: 'LILA-Supermercado', freight: 19.64, orderDate: '1996-10-23' },
  { orderID: 81, shipName: 'Lonesome Pine Restaurant', freight: 8.53, orderDate: '1996-10-24' },
  { orderID: 82, shipName: 'Ana Trujillo Emparedados y helados', freight: 1.40, orderDate: '1996-10-25' },
  { orderID: 83, shipName: 'Around the Horn', freight: 64.45, orderDate: '1996-10-28' },
  { orderID: 84, shipName: 'Vaffeljernet', freight: 54.42, orderDate: '1996-10-29' },
  { orderID: 85, shipName: 'The Big Cheese', freight: 42.74, orderDate: '1996-10-30' },
  { orderID: 86, shipName: 'QUICK-Stop', freight: 110.37, orderDate: '1996-10-31' },
  { orderID: 87, shipName: 'Hungry Coyote Import Store', freight: 249.06, orderDate: '1996-11-01' },
  { orderID: 88, shipName: 'The Big Cheese', freight: 142.08, orderDate: '1996-11-04' },
  { orderID: 89, shipName: 'QUICK-Stop', freight: 3.10, orderDate: '1996-11-05' },
  { orderID: 90, shipName: 'Vins et alcools Chevalier', freight: 23.65, orderDate: '1996-11-06' },
  { orderID: 91, shipName: 'Hungry Owl All-Night Grocers', freight: 69.53, orderDate: '1996-11-07' },
  { orderID: 92, shipName: 'Lonesome Pine Restaurant', freight: 124.98, orderDate: '1996-11-08' },
  { orderID: 93, shipName: 'Rattlesnake Canyon Grocery', freight: 92.69, orderDate: '1996-11-11' },
  { orderID: 94, shipName: 'Ernst Handel', freight: 63.36, orderDate: '1996-11-12' },
  { orderID: 95, shipName: 'Folk och fä HB', freight: 126.38, orderDate: '1996-11-13' },
  { orderID: 96, shipName: 'Island Trading', freight: 154.68, orderDate: '1996-11-14' },
  { orderID: 97, shipName: 'Comércio Mineiro', freight: 110.87, orderDate: '1996-11-15' },
  { orderID: 98, shipName: 'Tortuga Restaurante', freight: 1.63, orderDate: '1996-11-18' },
  { orderID: 99, shipName: 'Trail\'s Head Gourmet Provisioners', freight: 126.56, orderDate: '1996-11-19' },
  { orderID: 100, shipName: 'Blauer See Delikatessen', freight: 79.30, orderDate: '1996-11-20' },
]

const serverDataProvider: DataProvider<Order> = async (args) => {
  console.log('PagingPage: serverDataProvider called with:', { page: args.page, pageSize: args.pageSize })
  
  // Simulate server delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Apply pagination to sample data
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  const paginatedData = serverSideSampleData.slice(start, end)
  
  console.log('PagingPage: serverDataProvider returning:', { 
    rows: paginatedData.length, 
    total: serverSideSampleData.length,
    start,
    end 
  })
  
  serverTotal.value = serverSideSampleData.length
  
  return {
    rows: paginatedData,
    total: serverSideSampleData.length,
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

