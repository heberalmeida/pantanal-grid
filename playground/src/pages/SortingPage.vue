<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Sorting</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports sorting functionality to sort data by one or multiple columns. 
      By default, sorting is disabled. Enable it by setting the <code class="bg-gray-100 px-2 py-1 rounded">sortable</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Sorting (Single Column)</h2>
      <p class="text-gray-600 mb-4">
        Enable single-column sorting by setting <code class="bg-gray-100 px-2 py-1 rounded">sortable</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
        Click on a column header to sort by that column.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :sortable="true"
          :sortableMode="'single'"
          :sort="basicSort"
          responsive="table"
          key-field="orderID"
          @update:sort="basicSort = $event"
          @sort="handleSort"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Multi-Column Sorting</h2>
      <p class="text-gray-600 mb-4">
        Enable multi-column sorting by setting <code class="bg-gray-100 px-2 py-1 rounded">sortableMode</code> to <code class="bg-gray-100 px-2 py-1 rounded">'multiple'</code>.
        You can sort by multiple columns by clicking on different column headers.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="multiRows"
          :columns="multiColumns"
          :sortable="true"
          :sortableMode="'multiple'"
          :sort="multiSort"
          :sortableShowIndexes="true"
          responsive="table"
          key-field="orderID"
          @update:sort="multiSort = $event"
        />
      </div>

      <ExampleCode :source="multiCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Sorting with Allow Unsort</h2>
      <p class="text-gray-600 mb-4">
        Control whether users can remove sorting by setting <code class="bg-gray-100 px-2 py-1 rounded">sortableAllowUnsort</code>.
        When <code class="bg-gray-100 px-2 py-1 rounded">false</code>, clicking a sorted column cycles between ascending, descending, and back to ascending.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="unsortRows"
          :columns="unsortColumns"
          :sortable="true"
          :sortableMode="'single'"
          :sortableAllowUnsort="false"
          :sort="unsortSort"
          responsive="table"
          key-field="orderID"
          @update:sort="unsortSort = $event"
        />
      </div>

      <ExampleCode :source="unsortCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Server-Side Sorting</h2>
      <p class="text-gray-600 mb-4">
        For large datasets, use server-side sorting by setting <code class="bg-gray-100 px-2 py-1 rounded">serverSide</code> to <code class="bg-gray-100 px-2 py-1 rounded">true</code>
        and providing a <code class="bg-gray-100 px-2 py-1 rounded">dataProvider</code> function that handles sorting.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="[]"
          :columns="serverColumns"
          :sortable="true"
          :sortableMode="'multiple'"
          :sort="serverSort"
          :serverSide="true"
          :pageable="true"
          :page="serverPage"
          :pageSize="serverPageSize"
          :total="serverTotal"
          responsive="table"
          key-field="orderID"
          @update:sort="serverSort = $event"
          @update:page="serverPage = $event"
          @update:pageSize="serverPageSize = $event"
          :dataProvider="serverDataProvider as any"
        />
      </div>

      <ExampleCode :source="serverCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column-Level Sortable</h2>
      <p class="text-gray-600 mb-4">
        Control sorting per column by setting <code class="bg-gray-100 px-2 py-1 rounded">sortable</code> on individual columns.
        Only columns with <code class="bg-gray-100 px-2 py-1 rounded">sortable: true</code> will be sortable.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="columnRows"
          :columns="columnColumns"
          :sort="columnSort"
          responsive="table"
          key-field="orderID"
          @update:sort="columnSort = $event"
        />
      </div>

      <ExampleCode :source="columnCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Sorting in Card Mode (Mobile)</h2>
      <p class="text-gray-600 mb-4">
        When the grid displays in card mode (mobile/responsive), sorting controls appear above the cards.
        Use the dropdowns to select a column and sort direction. In multi-column mode, badges show active sorts.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="cardRows"
          :columns="cardColumns"
          :sortable="true"
          :sortableMode="'multiple'"
          :sort="cardSort"
          responsive="cards"
          key-field="orderID"
          @update:sort="cardSort = $event"
        />
      </div>

      <ExampleCode :source="cardCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type DataProvider } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Order extends Record<string, unknown> {
  orderID: number
  shipName: string
  shipCountry: string
  shipCity: string
  freight: number
  orderDate: string
}

// Basic Sorting
const basicRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', shipCountry: 'Belgium', shipCity: 'Charleroi', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 58.17, orderDate: '1996-07-11' },
  { orderID: 7, shipName: 'Chop-suey Chinese', shipCountry: 'Switzerland', shipCity: 'Bern', freight: 22.98, orderDate: '1996-07-12' },
  { orderID: 8, shipName: 'Richter Supermarkt', shipCountry: 'Switzerland', shipCity: 'Genève', freight: 148.33, orderDate: '1996-07-15' },
])

const basicColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'shipCity', title: 'Ship City', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const basicSort = ref<SortDescriptor[]>([])

function handleSort(event: { sort: SortDescriptor[] }) {
  console.log('Sort changed:', event.sort)
}

// Multi-Column Sorting
const multiRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', shipCountry: 'Belgium', shipCity: 'Charleroi', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 58.17, orderDate: '1996-07-11' },
  { orderID: 7, shipName: 'Chop-suey Chinese', shipCountry: 'Switzerland', shipCity: 'Bern', freight: 22.98, orderDate: '1996-07-12' },
  { orderID: 8, shipName: 'Richter Supermarkt', shipCountry: 'Switzerland', shipCity: 'Genève', freight: 148.33, orderDate: '1996-07-15' },
])

const multiColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'shipCity', title: 'Ship City', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const multiSort = ref<SortDescriptor[]>([])

// Allow Unsort
const unsortRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
])

const unsortColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const unsortSort = ref<SortDescriptor[]>([])

// Server-Side Sorting
const serverPage = ref(1)
const serverPageSize = ref(20)
const serverSort = ref<SortDescriptor[]>([])
const serverTotal = ref(100)

// Sample data for server-side sorting
const serverSideSortingData: Order[] = [
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', shipCountry: 'Belgium', shipCity: 'Charleroi', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 58.17, orderDate: '1996-07-11' },
  { orderID: 7, shipName: 'Chop-suey Chinese', shipCountry: 'Switzerland', shipCity: 'Bern', freight: 22.98, orderDate: '1996-07-12' },
  { orderID: 8, shipName: 'Richter Supermarkt', shipCountry: 'Switzerland', shipCity: 'Genève', freight: 148.33, orderDate: '1996-07-15' },
  { orderID: 9, shipName: 'Wellington Importadora', shipCountry: 'Brazil', shipCity: 'Resende', freight: 13.97, orderDate: '1996-07-16' },
  { orderID: 10, shipName: 'HILARIÓN-Abastos', shipCountry: 'Venezuela', shipCity: 'San Cristóbal', freight: 81.91, orderDate: '1996-07-17' },
  { orderID: 11, shipName: 'Ernst Handel', shipCountry: 'Austria', shipCity: 'Graz', freight: 140.51, orderDate: '1996-07-18' },
  { orderID: 12, shipName: 'Centro comercial Moctezuma', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 3.25, orderDate: '1996-07-19' },
  { orderID: 13, shipName: 'Ottilies Käseladen', shipCountry: 'Germany', shipCity: 'Köln', freight: 55.09, orderDate: '1996-07-22' },
  { orderID: 14, shipName: 'Que Delícia', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 3.05, orderDate: '1996-07-23' },
  { orderID: 15, shipName: 'Rattlesnake Canyon Grocery', shipCountry: 'USA', shipCity: 'Albuquerque', freight: 48.29, orderDate: '1996-07-24' },
  { orderID: 16, shipName: 'Ernst Handel', shipCountry: 'Austria', shipCity: 'Graz', freight: 146.06, orderDate: '1996-07-25' },
  { orderID: 17, shipName: 'Folk och fä HB', shipCountry: 'Sweden', shipCity: 'Bräcke', freight: 3.67, orderDate: '1996-07-26' },
  { orderID: 18, shipName: 'Reggiani Caseifici', shipCountry: 'Italy', shipCity: 'Reggio Emilia', freight: 55.28, orderDate: '1996-07-29' },
  { orderID: 19, shipName: 'Maison Dewey', shipCountry: 'Belgium', shipCity: 'Bruxelles', freight: 25.36, orderDate: '1996-07-30' },
  { orderID: 20, shipName: 'Island Trading', shipCountry: 'UK', shipCity: 'Cowes', freight: 18.69, orderDate: '1996-07-31' },
  { orderID: 21, shipName: 'Wartian Herkku', shipCountry: 'Finland', shipCity: 'Oulu', freight: 58.88, orderDate: '1996-08-01' },
  { orderID: 22, shipName: 'Simons bistro', shipCountry: 'Denmark', shipCity: 'København', freight: 13.75, orderDate: '1996-08-02' },
  { orderID: 23, shipName: 'QUICK-Stop', shipCountry: 'Germany', shipCity: 'Cunewalde', freight: 62.74, orderDate: '1996-08-05' },
  { orderID: 24, shipName: 'Wilman Kala', shipCountry: 'Finland', shipCity: 'Helsinki', freight: 12.69, orderDate: '1996-08-06' },
  { orderID: 25, shipName: 'Berglunds snabbköp', shipCountry: 'Sweden', shipCity: 'Luleå', freight: 10.96, orderDate: '1996-08-07' },
  { orderID: 26, shipName: 'Alfreds Futterkiste', shipCountry: 'Germany', shipCity: 'Berlin', freight: 45.08, orderDate: '1996-08-08' },
  { orderID: 27, shipName: 'Bottom-Dollar Marketse', shipCountry: 'Canada', shipCity: 'Tsawassen', freight: 25.91, orderDate: '1996-08-09' },
  { orderID: 28, shipName: 'Blauer See Delikatessen', shipCountry: 'Germany', shipCity: 'Mannheim', freight: 11.26, orderDate: '1996-08-12' },
  { orderID: 29, shipName: 'Cactus Comidas para llevar', shipCountry: 'Argentina', shipCity: 'Buenos Aires', freight: 47.30, orderDate: '1996-08-13' },
  { orderID: 30, shipName: 'Great Lakes Food Market', shipCountry: 'USA', shipCity: 'Eugene', freight: 17.68, orderDate: '1996-08-14' },
  { orderID: 31, shipName: 'Bon app\'', shipCountry: 'France', shipCity: 'Marseille', freight: 83.93, orderDate: '1996-08-15' },
  { orderID: 32, shipName: 'Ranchères du monde', shipCountry: 'France', shipCity: 'Lyon', freight: 68.26, orderDate: '1996-08-16' },
  { orderID: 33, shipName: 'Split Rail Beer & Ale', shipCountry: 'USA', shipCity: 'Lander', freight: 87.03, orderDate: '1996-08-19' },
  { orderID: 34, shipName: 'Princesa Isabel Vinhoss', shipCountry: 'Portugal', shipCity: 'Lisboa', freight: 191.27, orderDate: '1996-08-20' },
  { orderID: 35, shipName: 'Franchi S.p.A.', shipCountry: 'Italy', shipCity: 'Torino', freight: 51.83, orderDate: '1996-08-21' },
  { orderID: 36, shipName: 'Gourmet Lanchonetes', shipCountry: 'Brazil', shipCity: 'Campinas', freight: 1.15, orderDate: '1996-08-22' },
  { orderID: 37, shipName: 'Mère Paillarde', shipCountry: 'Canada', shipCity: 'Montréal', freight: 4.78, orderDate: '1996-08-23' },
  { orderID: 38, shipName: 'La corne d\'abondance', shipCountry: 'France', shipCity: 'Versailles', freight: 136.54, orderDate: '1996-08-26' },
  { orderID: 39, shipName: 'LILA-Supermercado', shipCountry: 'Venezuela', shipCity: 'Barquisimeto', freight: 83.49, orderDate: '1996-08-27' },
  { orderID: 40, shipName: 'LINO-Delicateses', shipCountry: 'Venezuela', shipCity: 'I. de Margarita', freight: 149.47, orderDate: '1996-08-28' },
  { orderID: 41, shipName: 'Around the Horn', shipCountry: 'UK', shipCity: 'London', freight: 146.32, orderDate: '1996-08-29' },
  { orderID: 42, shipName: 'Vaffeljernet', shipCountry: 'Denmark', shipCity: 'Århus', freight: 55.26, orderDate: '1996-08-30' },
  { orderID: 43, shipName: 'Tradição Hipermercados', shipCountry: 'Brazil', shipCity: 'São Paulo', freight: 25.41, orderDate: '1996-09-02' },
  { orderID: 44, shipName: 'Wartian Herkku', shipCountry: 'Finland', shipCity: 'Oulu', freight: 29.46, orderDate: '1996-09-03' },
  { orderID: 45, shipName: 'Tortuga Restaurante', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 12.76, orderDate: '1996-09-04' },
  { orderID: 46, shipName: 'Trail\'s Head Gourmet Provisioners', shipCountry: 'USA', shipCity: 'Kirkland', freight: 142.08, orderDate: '1996-09-05' },
  { orderID: 47, shipName: 'Save-a-lot Markets', shipCountry: 'USA', shipCity: 'Boise', freight: 3.10, orderDate: '1996-09-06' },
  { orderID: 48, shipName: 'Lazy K Kountry Store', shipCountry: 'USA', shipCity: 'Walla Walla', freight: 23.65, orderDate: '1996-09-09' },
  { orderID: 49, shipName: 'Let\'s Stop N Shop', shipCountry: 'USA', shipCity: 'San Francisco', freight: 4.78, orderDate: '1996-09-10' },
  { orderID: 50, shipName: 'White Clover Markets', shipCountry: 'USA', shipCity: 'Seattle', freight: 12.69, orderDate: '1996-09-11' },
  { orderID: 51, shipName: 'Mère Paillarde', shipCountry: 'Canada', shipCity: 'Montréal', freight: 10.09, orderDate: '1996-09-12' },
  { orderID: 52, shipName: 'Consolidated Holdings', shipCountry: 'UK', shipCity: 'London', freight: 130.94, orderDate: '1996-09-13' },
  { orderID: 53, shipName: 'Blauer See Delikatessen', shipCountry: 'Germany', shipCity: 'Mannheim', freight: 1.93, orderDate: '1996-09-16' },
  { orderID: 54, shipName: 'Drachenblut Delikatessend', shipCountry: 'Germany', shipCity: 'Aachen', freight: 0.40, orderDate: '1996-09-17' },
  { orderID: 55, shipName: 'Eastern Connection', shipCountry: 'UK', shipCity: 'London', freight: 146.69, orderDate: '1996-09-18' },
  { orderID: 56, shipName: 'Antonio Moreno Taquería', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 3.53, orderDate: '1996-09-19' },
  { orderID: 57, shipName: 'Galería del gastrónomo', shipCountry: 'Spain', shipCity: 'Barcelona', freight: 120.27, orderDate: '1996-09-20' },
  { orderID: 58, shipName: 'Magazzini Alimentari Riuniti', shipCountry: 'Italy', shipCity: 'Bergamo', freight: 236.80, orderDate: '1996-09-23' },
  { orderID: 59, shipName: 'Königlich Essen', shipCountry: 'Germany', shipCity: 'Brandenburg', freight: 77.63, orderDate: '1996-09-24' },
  { orderID: 60, shipName: 'La maison d\'Asie', shipCountry: 'France', shipCity: 'Toulouse', freight: 28.76, orderDate: '1996-09-25' },
  { orderID: 61, shipName: 'Familia Arquibaldo', shipCountry: 'Brazil', shipCity: 'São Paulo', freight: 12.69, orderDate: '1996-09-26' },
  { orderID: 62, shipName: 'Die Wandernde Kuh', shipCountry: 'Germany', shipCity: 'Stuttgart', freight: 22.57, orderDate: '1996-09-27' },
  { orderID: 63, shipName: 'Frankenversand', shipCountry: 'Germany', shipCity: 'München', freight: 76.56, orderDate: '1996-09-30' },
  { orderID: 64, shipName: 'Tortuga Restaurante', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 36.56, orderDate: '1996-10-01' },
  { orderID: 65, shipName: 'Antonio Moreno Taquería', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 4.98, orderDate: '1996-10-02' },
  { orderID: 66, shipName: 'Save-a-lot Markets', shipCountry: 'USA', shipCity: 'Boise', freight: 145.45, orderDate: '1996-10-03' },
  { orderID: 67, shipName: 'Blondesddsl père et fils', shipCountry: 'France', shipCity: 'Strasbourg', freight: 33.93, orderDate: '1996-10-04' },
  { orderID: 68, shipName: 'Old World Delicatessen', shipCountry: 'USA', shipCity: 'Anchorage', freight: 96.78, orderDate: '1996-10-07' },
  { orderID: 69, shipName: 'Great Lakes Food Market', shipCountry: 'USA', shipCity: 'Eugene', freight: 0.87, orderDate: '1996-10-08' },
  { orderID: 70, shipName: 'Maison Dewey', shipCountry: 'Belgium', shipCity: 'Bruxelles', freight: 8.53, orderDate: '1996-10-09' },
  { orderID: 71, shipName: 'LILA-Supermercado', shipCountry: 'Venezuela', shipCity: 'Barquisimeto', freight: 64.19, orderDate: '1996-10-10' },
  { orderID: 72, shipName: 'Lazy K Kountry Store', shipCountry: 'USA', shipCity: 'Walla Walla', freight: 42.11, orderDate: '1996-10-11' },
  { orderID: 73, shipName: 'Ernst Handel', shipCountry: 'Austria', shipCity: 'Graz', freight: 73.79, orderDate: '1996-10-14' },
  { orderID: 74, shipName: 'Reggiani Caseifici', shipCountry: 'Italy', shipCity: 'Reggio Emilia', freight: 68.52, orderDate: '1996-10-15' },
  { orderID: 75, shipName: 'Bólido Comidas preparadas', shipCountry: 'Spain', shipCity: 'Madrid', freight: 87.68, orderDate: '1996-10-16' },
  { orderID: 76, shipName: 'Comércio Mineiro', shipCountry: 'Brazil', shipCity: 'São Paulo', freight: 38.28, orderDate: '1996-10-17' },
  { orderID: 77, shipName: 'Frankenversand', shipCountry: 'Germany', shipCity: 'München', freight: 53.30, orderDate: '1996-10-18' },
  { orderID: 78, shipName: 'White Clover Markets', shipCountry: 'USA', shipCity: 'Seattle', freight: 75.89, orderDate: '1996-10-21' },
  { orderID: 79, shipName: 'Lehmanns Marktstand', shipCountry: 'Germany', shipCity: 'Frankfurt a.M.', freight: 3.01, orderDate: '1996-10-22' },
  { orderID: 80, shipName: 'LILA-Supermercado', shipCountry: 'Venezuela', shipCity: 'Barquisimeto', freight: 19.64, orderDate: '1996-10-23' },
  { orderID: 81, shipName: 'Lonesome Pine Restaurant', shipCountry: 'USA', shipCity: 'Portland', freight: 8.53, orderDate: '1996-10-24' },
  { orderID: 82, shipName: 'Ana Trujillo Emparedados y helados', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 1.40, orderDate: '1996-10-25' },
  { orderID: 83, shipName: 'Around the Horn', shipCountry: 'UK', shipCity: 'London', freight: 64.45, orderDate: '1996-10-28' },
  { orderID: 84, shipName: 'Vaffeljernet', shipCountry: 'Denmark', shipCity: 'Århus', freight: 54.42, orderDate: '1996-10-29' },
  { orderID: 85, shipName: 'The Big Cheese', shipCountry: 'USA', shipCity: 'Portland', freight: 42.74, orderDate: '1996-10-30' },
  { orderID: 86, shipName: 'QUICK-Stop', shipCountry: 'Germany', shipCity: 'Cunewalde', freight: 110.37, orderDate: '1996-10-31' },
  { orderID: 87, shipName: 'Hungry Coyote Import Store', shipCountry: 'USA', shipCity: 'Elgin', freight: 249.06, orderDate: '1996-11-01' },
  { orderID: 88, shipName: 'The Big Cheese', shipCountry: 'USA', shipCity: 'Portland', freight: 142.08, orderDate: '1996-11-04' },
  { orderID: 89, shipName: 'QUICK-Stop', shipCountry: 'Germany', shipCity: 'Cunewalde', freight: 3.10, orderDate: '1996-11-05' },
  { orderID: 90, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 23.65, orderDate: '1996-11-06' },
  { orderID: 91, shipName: 'Hungry Owl All-Night Grocers', shipCountry: 'USA', shipCity: 'Butte', freight: 69.53, orderDate: '1996-11-07' },
  { orderID: 92, shipName: 'Lonesome Pine Restaurant', shipCountry: 'USA', shipCity: 'Portland', freight: 124.98, orderDate: '1996-11-08' },
  { orderID: 93, shipName: 'Rattlesnake Canyon Grocery', shipCountry: 'USA', shipCity: 'Albuquerque', freight: 92.69, orderDate: '1996-11-11' },
  { orderID: 94, shipName: 'Ernst Handel', shipCountry: 'Austria', shipCity: 'Graz', freight: 63.36, orderDate: '1996-11-12' },
  { orderID: 95, shipName: 'Folk och fä HB', shipCountry: 'Sweden', shipCity: 'Bräcke', freight: 126.38, orderDate: '1996-11-13' },
  { orderID: 96, shipName: 'Island Trading', shipCountry: 'UK', shipCity: 'Cowes', freight: 154.68, orderDate: '1996-11-14' },
  { orderID: 97, shipName: 'Comércio Mineiro', shipCountry: 'Brazil', shipCity: 'São Paulo', freight: 110.87, orderDate: '1996-11-15' },
  { orderID: 98, shipName: 'Tortuga Restaurante', shipCountry: 'Mexico', shipCity: 'México D.F.', freight: 1.63, orderDate: '1996-11-18' },
  { orderID: 99, shipName: 'Trail\'s Head Gourmet Provisioners', shipCountry: 'USA', shipCity: 'Kirkland', freight: 126.56, orderDate: '1996-11-19' },
  { orderID: 100, shipName: 'Blauer See Delikatessen', shipCountry: 'Germany', shipCity: 'Mannheim', freight: 79.30, orderDate: '1996-11-20' },
]

const serverDataProvider: DataProvider<Order> = async (args) => {
  console.log('SortingPage: serverDataProvider called with:', { 
    page: args.page, 
    pageSize: args.pageSize,
    sort: args.sort 
  })
  
  // Simulate server delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Copy data array for sorting (simulating fresh server data)
  let data = [...serverSideSortingData]
  
  // Apply sorting on server
  if (args.sort && args.sort.length > 0) {
    data.sort((a, b) => {
      for (const s of args.sort!) {
        const av = (a as any)[s.field]
        const bv = (b as any)[s.field]
        
        // Handle different types
        if (av === bv) continue
        
        let result: number
        if (typeof av === 'string' && typeof bv === 'string') {
          result = av.localeCompare(bv)
        } else if (typeof av === 'number' && typeof bv === 'number') {
          result = av - bv
        } else {
          result = av > bv ? 1 : -1
        }
        
        const dir = s.dir === 'asc' ? 1 : -1
        const finalResult = result * dir
        if (finalResult !== 0) return finalResult
      }
      return 0
    })
  }
  
  // Apply pagination
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  const paginatedData = data.slice(start, end)
  
  console.log('SortingPage: serverDataProvider returning:', { 
    rows: paginatedData.length, 
    total: data.length,
    firstRow: paginatedData[0]
  })
  
  serverTotal.value = data.length
  
  return {
    rows: paginatedData,
    total: data.length,
  }
}

const serverColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

// Column-Level Sortable
const columnRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
])

const columnColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: false },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: false },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const columnSort = ref<SortDescriptor[]>([])

// Card Mode Sorting
const cardRows = ref<Order[]>([
  { orderID: 1, shipName: 'Vins et alcools Chevalier', shipCountry: 'France', shipCity: 'Reims', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 2, shipName: 'Toms Spezialitäten', shipCountry: 'Germany', shipCity: 'Münster', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 3, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 4, shipName: 'Victuailles en stock', shipCountry: 'France', shipCity: 'Lyon', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 5, shipName: 'Suprêmes délices', shipCountry: 'Belgium', shipCity: 'Charleroi', freight: 51.3, orderDate: '1996-07-10' },
  { orderID: 6, shipName: 'Hanari Carnes', shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', freight: 58.17, orderDate: '1996-07-11' },
])

const cardColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  { field: 'shipCity', title: 'Ship City', width: 180, sortable: true },
  { field: 'freight', title: 'Freight', width: 180, sortable: true },
  { field: 'orderDate', title: 'Order Date', width: 180, sortable: true },
]

const cardSort = ref<SortDescriptor[]>([])

const basicCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    :sortableMode="'single'"
    :sort="sort"
    @update:sort="sort = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  // ... more columns
]

const sort = ref&lt;SortDescriptor[]&gt;([])
&lt;/script&gt;`

const multiCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    :sortableMode="'multiple'"
    :sortableShowIndexes="true"
    :sort="sort"
    @update:sort="sort = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  // ... more columns
]

const sort = ref&lt;SortDescriptor[]&gt;([])
&lt;/script&gt;`

const unsortCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    :sortableMode="'single'"
    :sortableAllowUnsort="false"
    :sort="sort"
    @update:sort="sort = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
const sort = ref&lt;SortDescriptor[]&gt;([])
&lt;/script&gt;`

const serverCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="[]"
    :columns="columns"
    :sortable="true"
    :sortableMode="'multiple'"
    :serverSide="true"
    :pageable="true"
    :sort="sort"
    :dataProvider="dataProvider"
    @update:sort="sort = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type DataProvider } from '@pantanal/grid'

const sort = ref&lt;SortDescriptor[]&gt;([])

const dataProvider: DataProvider = async (args) => {
  // Apply sorting on server
  let data = [...allData]
  if (args.sort && args.sort.length > 0) {
    data.sort((a, b) => {
      for (const s of args.sort!) {
        const av = a[s.field]
        const bv = b[s.field]
        if (av === bv) continue
        const dir = s.dir === 'asc' ? 1 : -1
        return av > bv ? dir : -dir
      }
      return 0
    })
  }
  
  // Apply pagination
  const start = (args.page - 1) * args.pageSize
  const end = start + args.pageSize
  
  return {
    rows: data.slice(start, end),
    total: data.length,
  }
}
&lt;/script&gt;`

const columnCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :sort="sort"
    @update:sort="sort = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: false },
  { field: 'shipCountry', title: 'Ship Country', width: 180, sortable: true },
  // ... more columns
]

const sort = ref&lt;SortDescriptor[]&gt;([])
&lt;/script&gt;`

const cardCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    :sortableMode="'multiple'"
    responsive="cards"
    :sort="sort"
    @update:sort="sort = $event"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 120, sortable: true },
  { field: 'shipName', title: 'Ship Name', width: 240, sortable: true },
  // ... more columns
]

const sort = ref&lt;SortDescriptor[]&gt;([])
&lt;/script&gt;`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>


