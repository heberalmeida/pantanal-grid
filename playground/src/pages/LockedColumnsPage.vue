<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Locked Columns</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Locked columns allow you to display a grid with a large number of columns on limited viewports.
        A small subset of columns can be made static (locked) while scrolling the rest horizontally to make them visible.
        Set the <code>locked</code> property of the corresponding column to <code>true</code> or <code>'left'</code> to lock it on the left side.
      </p>
    </header>

    <!-- Basic Locked Columns Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Locked Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The following example demonstrates how to implement locked columns. The <strong>OrderID</strong> and <strong>ShipName</strong> columns are locked on the left side.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="orderID"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :groupable="true"
        :enable-column-reorder="true"
        :height="600"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Locked with lockable: false Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Columns with lockable: false</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can prevent users from unlocking a column by setting <code>lockable: false</code>. This is useful for columns that should always remain locked, such as primary keys.
      </p>

      <PantanalGrid
        :rows="lockableRows"
        :columns="lockableColumns as any"
        key-field="orderID"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :height="600"
      />
      <ExampleCode :source="lockableCode" />
    </article>

    <!-- Unlocking Columns Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Unlocking Locked Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        To unlock a locked column, click on the column menu button (three dots) in the column header, then click the <strong>Unlock</strong> button.
        Columns with <code>lockable: false</code> cannot be unlocked.
      </p>

      <PantanalGrid
        :rows="unlockRows"
        :columns="unlockColumns as any"
        key-field="orderID"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :height="600"
      />
      <ExampleCode :source="unlockCode" />
    </article>

    <!-- Locked Left and Right Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Left and Right Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can lock columns on both the left and right sides of the grid. Use <code>locked: 'left'</code> for left-side locks and <code>locked: 'right'</code> for right-side locks.
      </p>

        <PantanalGrid
        :rows="leftRightRows"
        :columns="leftRightColumns as any"
        key-field="orderID"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
          :enable-column-resize="true"
          :enable-column-reorder="true"
        :height="600"
      />
      <ExampleCode :source="leftRightCode" />
    </article>

    <!-- Locked Columns with Many Columns Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Columns with Many Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        This example demonstrates the practical use of locked columns when you have many columns. The ID and Name columns remain visible while scrolling through other columns.
      </p>

        <PantanalGrid
        :rows="manyColumnsRows"
        :columns="manyColumnsColumns as any"
          key-field="id"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
          :enable-column-resize="true"
          :enable-column-reorder="true"
        :height="500"
      />
      <ExampleCode :source="manyColumnsCode" />
    </article>

    <!-- Locked Columns with Grouping Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Columns with Grouping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Locked columns work seamlessly with grouping. The locked columns remain visible while you expand and collapse groups.
      </p>

      <PantanalGrid
        :rows="groupingRows"
        :columns="groupingColumns as any"
        key-field="id"
        :sortable="true"
        :pageable="true"
        :groupable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :height="500"
      />
      <ExampleCode :source="groupingCode" />
    </article>

    <!-- Locked Columns with Filtering Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Columns with Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Locked columns remain visible when filtering. The filter row is also locked for locked columns, making it easy to filter while scrolling.
      </p>

      <PantanalGrid
        :rows="filteringRows"
        :columns="filteringColumns as any"
        key-field="orderID"
        :sortable="true"
        :pageable="true"
        :filterable="true"
          :show-filter-row="true"
        :column-menu="true"
        :enable-column-resize="true"
        :height="500"
      />
      <ExampleCode :source="filteringCode" />
    </article>

    <!-- Locked Columns with Sorting Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Columns with Sorting</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can sort by locked columns just like any other column. The locked columns remain visible while you sort by different columns.
      </p>

      <PantanalGrid
        :rows="sortingRows"
        :columns="sortingColumns as any"
        key-field="employeeID"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :height="500"
      />
      <ExampleCode :source="sortingCode" />
    </article>

    <!-- Locked Columns with Selection Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Locked Columns with Selection</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        When using row selection, the selection checkbox column can be locked along with key data columns for better usability.
      </p>

      <PantanalGrid
        :rows="selectionRows"
        :columns="selectionColumns as any"
        key-field="productID"
        :selectable="'multiple'"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :height="500"
      />
      <ExampleCode :source="selectionCode" />
    </article>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Order {
  orderID: number
  shipCountry: string
  shipCity: string
  shipName: string
  shipAddress: string
  freight: number
  orderDate: string
}

// Basic Locked Columns Example
const basicRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', shipAddress: 'Rua do Paço, 67', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', shipAddress: '2, rue du Commerce', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', shipAddress: 'Boulevard Tirou, 255', freight: 51.3, orderDate: '1996-07-09' },
  { orderID: 10253, shipCountry: 'France', shipCity: 'Strasbourg', shipName: 'Hanari Carnes', shipAddress: '54, rue Royale', freight: 58.17, orderDate: '1996-07-10' },
  { orderID: 10254, shipCountry: 'Brazil', shipCity: 'Sao Paulo', shipName: 'Chop-suey Chinese', shipAddress: 'Av. dos Lusíadas, 23', freight: 22.98, orderDate: '1996-07-11' },
  { orderID: 10255, shipCountry: 'Switzerland', shipCity: 'Bern', shipName: 'Richter Supermarkt', shipAddress: 'Grenzacherweg 237', freight: 148.33, orderDate: '1996-07-12' },
  { orderID: 10256, shipCountry: 'Brazil', shipCity: 'Sao Paulo', shipName: 'Wellington Importadora', shipAddress: 'Rua do Mercado, 12', freight: 13.97, orderDate: '1996-07-15' },
  { orderID: 10257, shipCountry: 'UK', shipCity: 'London', shipName: 'HILARIÓN-Abastos', shipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35', freight: 81.91, orderDate: '1996-07-16' },
  { orderID: 10258, shipCountry: 'Germany', shipCity: 'Köln', shipName: 'Ernst Handel', shipAddress: 'Kirchgasse 6', freight: 140.51, orderDate: '1996-07-17' },
  { orderID: 10259, shipCountry: 'France', shipCity: 'Toulouse', shipName: 'Centro comercial Moctezuma', shipAddress: 'Sierras de Granada 9993', freight: 3.25, orderDate: '1996-07-18' },
  { orderID: 10260, shipCountry: 'Argentina', shipCity: 'Buenos Aires', shipName: 'Ottilies Käseladen', shipAddress: 'Mehrheimerstr. 369', freight: 55.09, orderDate: '1996-07-19' },
  { orderID: 10261, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Que Delícia', shipAddress: 'Rua da Panificadora, 12', freight: 3.05, orderDate: '1996-07-19' },
  { orderID: 10262, shipCountry: 'USA', shipCity: 'Albuquerque', shipName: 'Rattlesnake Canyon Grocery', shipAddress: '2817 Milton Dr.', freight: 48.29, orderDate: '1996-07-22' },
  { orderID: 10263, shipCountry: 'Austria', shipCity: 'Graz', shipName: 'Ernst Handel', shipAddress: 'Kirchgasse 6', freight: 146.06, orderDate: '1996-07-23' },
  { orderID: 10264, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Folk och fä HB', shipAddress: 'Åkergatan 24', freight: 3.67, orderDate: '1996-07-24' },
  { orderID: 10265, shipCountry: 'USA', shipCity: 'Lander', shipName: 'Blondel père et fils', shipAddress: '24, place Kléber', freight: 55.28, orderDate: '1996-07-25' },
  { orderID: 10266, shipCountry: 'Germany', shipCity: 'München', shipName: 'Wartian Herkku', shipAddress: 'Torikatu 38', freight: 25.73, orderDate: '1996-07-26' },
  { orderID: 10267, shipCountry: 'France', shipCity: 'Marseille', shipName: 'Frankenversand', shipAddress: 'Berliner Platz 43', freight: 208.58, orderDate: '1996-07-29' },
  { orderID: 10268, shipCountry: 'Germany', shipCity: 'Köln', shipName: 'GROSELLA-Restaurante', shipAddress: '5ª Ave. Los Palos Grandes', freight: 66.29, orderDate: '1996-07-30' },
  { orderID: 10269, shipCountry: 'Italy', shipCity: 'Torino', shipName: 'White Clover Markets', shipAddress: '305 - 14th Ave. S. Suite 3B', freight: 4.56, orderDate: '1996-07-31' },
  { orderID: 10270, shipCountry: 'France', shipCity: 'Nantes', shipName: 'Wartian Herkku', shipAddress: 'Torikatu 38', freight: 136.54, orderDate: '1996-08-01' },
  { orderID: 10271, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Split Rail Beer & Ale', shipAddress: 'P.O. Box 555', freight: 4.54, orderDate: '1996-08-01' },
  { orderID: 10272, shipCountry: 'USA', shipCity: 'Albuquerque', shipName: 'Rattlesnake Canyon Grocery', shipAddress: '2817 Milton Dr.', freight: 98.03, orderDate: '1996-08-02' },
  { orderID: 10273, shipCountry: 'France', shipCity: 'Reims', shipName: 'QUICK-Stop', shipAddress: 'Taucherstraße 10', freight: 76.07, orderDate: '1996-08-05' },
  { orderID: 10274, shipCountry: 'Germany', shipCity: 'München', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 6.01, orderDate: '1996-08-06' },
  { orderID: 10275, shipCountry: 'Sweden', shipCity: 'Luleå', shipName: 'Magazzini Alimentari Riuniti', shipAddress: 'Via Ludovico il Moro 22', freight: 26.93, orderDate: '1996-08-07' },
  { orderID: 10276, shipCountry: 'UK', shipCity: 'London', shipName: 'Tortuga Restaurante', shipAddress: 'Avda. Azteca 123', freight: 13.84, orderDate: '1996-08-08' },
  { orderID: 10277, shipCountry: 'Argentina', shipCity: 'Buenos Aires', shipName: 'Morgenstern Gesundkost', shipAddress: 'Heerstr. 22', freight: 125.77, orderDate: '1996-08-09' },
])

const basicColumns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false,
    width: 120,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'shipCity',
    title: 'Ship City',
    width: 180,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    width: 240,
  },
  {
    field: 'shipAddress',
    title: 'Ship Address',
    lockable: false,
    width: 240,
  },
  {
    field: 'freight',
    title: 'Freight',
    width: 120,
    format: '{0:c}',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
  },
]

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Order {
  orderID: number
  shipCountry: string
  shipCity: string
  shipName: string
  shipAddress: string
  freight: number
  orderDate: string
}

const rows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  // ... more rows
])

const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false,
    width: 120,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'shipCity',
    title: 'Ship City',
    width: 180,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    width: 240,
  },
  {
    field: 'shipAddress',
    title: 'Ship Address',
    lockable: false,
    width: 240,
  },
  {
    field: 'freight',
    title: 'Freight',
    width: 120,
    format: '{0:c}',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="orderID"
    :sortable="true"
    :pageable="true"
    :column-menu="true"
    :filterable="true"
    :enable-column-resize="true"
    :groupable="true"
    :enable-column-reorder="true"
    :height="600"
  />
</template>`

// Lockable: false Example
const lockableRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', shipAddress: 'Rua do Paço, 67', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', shipAddress: '2, rue du Commerce', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', shipAddress: 'Boulevard Tirou, 255', freight: 51.3, orderDate: '1996-07-09' },
])

const lockableColumns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false, // Cannot be unlocked
    width: 120,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    lockable: true, // Can be unlocked via column menu
    width: 240,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'shipCity',
    title: 'Ship City',
    width: 180,
  },
  {
    field: 'shipAddress',
    title: 'Ship Address',
    width: 240,
  },
  {
    field: 'freight',
    title: 'Freight',
    width: 120,
    format: '{0:c}',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
  },
]

const lockableCode = `<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false, // Cannot be unlocked
    width: 120,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    lockable: true, // Can be unlocked via column menu
    width: 240,
  },
  // ... other columns
]
<\/script>`

// Unlocking Example
const unlockRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', shipAddress: 'Rua do Paço, 67', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', shipAddress: '2, rue du Commerce', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', shipAddress: 'Boulevard Tirou, 255', freight: 51.3, orderDate: '1996-07-09' },
])

const unlockColumns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false, // Cannot be unlocked
    width: 120,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    lockable: true, // Can be unlocked - click menu button and select "Unlock"
    width: 240,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'shipCity',
    title: 'Ship City',
    width: 180,
  },
  {
    field: 'shipAddress',
    title: 'Ship Address',
    width: 240,
  },
  {
    field: 'freight',
    title: 'Freight',
    width: 120,
    format: '{0:c}',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
  },
]

const unlockCode = `<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: true,
    lockable: false, // Cannot be unlocked
    width: 120,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    locked: true,
    lockable: true, // Can be unlocked via column menu
    width: 240,
  },
  // ... other columns
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="orderID"
    :column-menu="true"
    :height="600"
  />
</template>

<!-- 
  To unlock a column:
  1. Click the column menu button (three dots) in the column header
  2. Click the "Unlock" button in the menu
  3. The column will be unlocked and moved to the scrollable area
-->`

// Locked Left and Right Example
const leftRightRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', shipAddress: 'Rua do Paço, 67', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', shipAddress: '2, rue du Commerce', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', shipAddress: 'Boulevard Tirou, 255', freight: 51.3, orderDate: '1996-07-09' },
])

const leftRightColumns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: 'left',
    width: 120,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'shipCity',
    title: 'Ship City',
    width: 180,
  },
  {
    field: 'shipName',
    title: 'Ship Name',
    width: 240,
  },
  {
    field: 'shipAddress',
    title: 'Ship Address',
    width: 240,
  },
  {
    field: 'freight',
    title: 'Freight',
    width: 120,
    format: '{0:c}',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
    locked: 'right',
  },
]

const leftRightCode = `<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  {
    field: 'orderID',
    title: 'Order ID',
    locked: 'left', // Lock on left side
    width: 120,
  },
  {
    field: 'shipCountry',
    title: 'Ship Country',
    width: 180,
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: '{0:MM/dd/yyyy}',
    width: 180,
    locked: 'right', // Lock on right side
  },
]
<\/script>`

// Many Columns Example
const manyColumnsRows = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, hireDate: '2020-01-15', status: 'Active', location: 'New York', manager: 'Jane Smith', projects: 5, skills: 'JavaScript, Vue, TypeScript' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', department: 'Engineering', position: 'Tech Lead', salary: 120000, hireDate: '2018-03-20', status: 'Active', location: 'San Francisco', manager: 'Bob Johnson', projects: 8, skills: 'React, Node.js, AWS' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', department: 'Product', position: 'Product Manager', salary: 110000, hireDate: '2019-06-10', status: 'Active', location: 'Seattle', manager: 'Alice Brown', projects: 12, skills: 'Product Strategy, UX, Agile' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104', department: 'Design', position: 'Design Director', salary: 130000, hireDate: '2017-09-05', status: 'Active', location: 'Los Angeles', manager: null, projects: 15, skills: 'UI/UX, Figma, Design Systems' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-0105', department: 'Marketing', position: 'Marketing Manager', salary: 85000, hireDate: '2021-02-14', status: 'Active', location: 'Chicago', manager: 'Alice Brown', projects: 6, skills: 'Digital Marketing, SEO, Analytics' },
])

const manyColumnsColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', locked: true, lockable: false, width: 80 },
  { field: 'name', title: 'Name', locked: true, width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'hireDate', title: 'Hire Date', width: 120 },
  { field: 'status', title: 'Status', width: 100 },
  { field: 'location', title: 'Location', width: 120 },
  { field: 'manager', title: 'Manager', width: 150 },
  { field: 'projects', title: 'Projects', width: 100 },
  { field: 'skills', title: 'Skills', width: 250 },
]

const manyColumnsCode = `<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', locked: true, lockable: false, width: 80 },
  { field: 'name', title: 'Name', locked: true, width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'hireDate', title: 'Hire Date', width: 120 },
  { field: 'status', title: 'Status', width: 100 },
  { field: 'location', title: 'Location', width: 120 },
  { field: 'manager', title: 'Manager', width: 150 },
  { field: 'projects', title: 'Projects', width: 100 },
  { field: 'skills', title: 'Skills', width: 250 },
]
<\/script>`

// Grouping Example
interface GroupingProduct {
  id: number
  productName: string
  category: string
  unitPrice: number
  unitsInStock: number
  supplier: string
  discontinued: boolean
}

const groupingRows = ref<GroupingProduct[]>([
  { id: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39, supplier: 'Exotic Liquids', discontinued: false },
  { id: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17, supplier: 'Exotic Liquids', discontinued: false },
  { id: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13, supplier: 'New Orleans Cajun Delights', discontinued: false },
  { id: 4, productName: 'Chef Anton\'s Cajun Seasoning', category: 'Condiments', unitPrice: 22, unitsInStock: 53, supplier: 'New Orleans Cajun Delights', discontinued: false },
  { id: 5, productName: 'Chef Anton\'s Gumbo Mix', category: 'Condiments', unitPrice: 21.35, unitsInStock: 0, supplier: 'New Orleans Cajun Delights', discontinued: true },
  { id: 6, productName: 'Grandma\'s Boysenberry Spread', category: 'Confections', unitPrice: 25, unitsInStock: 120, supplier: 'Grandma Kelly\'s Homestead', discontinued: false },
  { id: 7, productName: 'Uncle Bob\'s Organic Dried Pears', category: 'Produce', unitPrice: 30, unitsInStock: 15, supplier: 'Grandma Kelly\'s Homestead', discontinued: false },
  { id: 8, productName: 'Northwoods Cranberry Sauce', category: 'Condiments', unitPrice: 40, unitsInStock: 6, supplier: 'Grandma Kelly\'s Homestead', discontinued: false },
])

const groupingColumns: ColumnDef<GroupingProduct>[] = [
  { field: 'id', title: 'ID', locked: true, lockable: false, width: 80 },
  { field: 'productName', title: 'Product Name', locked: true, width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'supplier', title: 'Supplier', width: 200 },
  { field: 'discontinued', title: 'Discontinued', width: 120, type: 'boolean' },
]

const groupingCode = `<script setup lang="ts">
const columns: ColumnDef<GroupingProduct>[] = [
  { field: 'id', title: 'ID', locked: true, lockable: false, width: 80 },
  { field: 'productName', title: 'Product Name', locked: true, width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'supplier', title: 'Supplier', width: 200 },
  { field: 'discontinued', title: 'Discontinued', width: 120, type: 'boolean' },
]
<\/script>`

// Filtering Example
const filteringRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', shipAddress: 'Rua do Paço, 67', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', shipAddress: '2, rue du Commerce', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', shipAddress: 'Boulevard Tirou, 255', freight: 51.3, orderDate: '1996-07-09' },
  { orderID: 10253, shipCountry: 'France', shipCity: 'Strasbourg', shipName: 'Hanari Carnes', shipAddress: '54, rue Royale', freight: 58.17, orderDate: '1996-07-10' },
  { orderID: 10254, shipCountry: 'Brazil', shipCity: 'Sao Paulo', shipName: 'Chop-suey Chinese', shipAddress: 'Av. dos Lusíadas, 23', freight: 22.98, orderDate: '1996-07-11' },
  { orderID: 10255, shipCountry: 'Switzerland', shipCity: 'Bern', shipName: 'Richter Supermarkt', shipAddress: 'Grenzacherweg 237', freight: 148.33, orderDate: '1996-07-12' },
])

const filteringColumns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', locked: true, lockable: false, width: 120, filterable: true },
  { field: 'shipName', title: 'Ship Name', locked: true, width: 240, filterable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, filterable: true },
  { field: 'shipCity', title: 'Ship City', width: 180, filterable: true },
  { field: 'shipAddress', title: 'Ship Address', width: 240, filterable: true },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}', filterable: true, type: 'number' },
  { field: 'orderDate', title: 'Order Date', format: '{0:MM/dd/yyyy}', width: 180, filterable: true, type: 'date' },
]

const filteringCode = `<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', locked: true, lockable: false, width: 120, filterable: true },
  { field: 'shipName', title: 'Ship Name', locked: true, width: 240, filterable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, filterable: true },
  { field: 'shipCity', title: 'Ship City', width: 180, filterable: true },
  { field: 'shipAddress', title: 'Ship Address', width: 240, filterable: true },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}', filterable: true, type: 'number' },
  { field: 'orderDate', title: 'Order Date', format: '{0:MM/dd/yyyy}', width: 180, filterable: true, type: 'date' },
]
<\/script>`

// Sorting Example
interface Employee {
  employeeID: number
  firstName: string
  lastName: string
  title: string
  department: string
  salary: number
  hireDate: string
  email: string
  phone: string
}

const sortingRows = ref<Employee[]>([
  { employeeID: 1, firstName: 'Nancy', lastName: 'Davolio', title: 'Sales Representative', department: 'Sales', salary: 3500, hireDate: '1992-05-01', email: 'nancy@northwind.com', phone: '(206) 555-9857' },
  { employeeID: 2, firstName: 'Andrew', lastName: 'Fuller', title: 'Vice President, Sales', department: 'Sales', salary: 6500, hireDate: '1992-08-14', email: 'andrew@northwind.com', phone: '(206) 555-9482' },
  { employeeID: 3, firstName: 'Janet', lastName: 'Leverling', title: 'Sales Representative', department: 'Sales', salary: 3500, hireDate: '1992-04-01', email: 'janet@northwind.com', phone: '(206) 555-3412' },
  { employeeID: 4, firstName: 'Margaret', lastName: 'Peacock', title: 'Sales Representative', department: 'Sales', salary: 3500, hireDate: '1993-05-03', email: 'margaret@northwind.com', phone: '(206) 555-8122' },
  { employeeID: 5, firstName: 'Steven', lastName: 'Buchanan', title: 'Sales Manager', department: 'Sales', salary: 5500, hireDate: '1993-10-17', email: 'steven@northwind.com', phone: '(71) 555-4848' },
  { employeeID: 6, firstName: 'Michael', lastName: 'Suyama', title: 'Sales Representative', department: 'Sales', salary: 3500, hireDate: '1993-10-17', email: 'michael@northwind.com', phone: '(71) 555-7773' },
  { employeeID: 7, firstName: 'Robert', lastName: 'King', title: 'Sales Representative', department: 'Sales', salary: 3500, hireDate: '1994-01-02', email: 'robert@northwind.com', phone: '(71) 555-5598' },
  { employeeID: 8, firstName: 'Laura', lastName: 'Callahan', title: 'Inside Sales Coordinator', department: 'Sales', salary: 4000, hireDate: '1994-03-05', email: 'laura@northwind.com', phone: '(206) 555-1189' },
])

const sortingColumns: ColumnDef<Employee>[] = [
  { field: 'employeeID', title: 'ID', locked: true, lockable: false, width: 80, sortable: true },
  { field: 'firstName', title: 'First Name', locked: true, width: 120, sortable: true },
  { field: 'lastName', title: 'Last Name', locked: true, width: 120, sortable: true },
  { field: 'title', title: 'Title', width: 200, sortable: true },
  { field: 'department', title: 'Department', width: 150, sortable: true },
  { field: 'salary', title: 'Salary', width: 120, format: '{0:c}', sortable: true },
  { field: 'hireDate', title: 'Hire Date', width: 120, sortable: true },
  { field: 'email', title: 'Email', width: 200, sortable: true },
  { field: 'phone', title: 'Phone', width: 150, sortable: true },
]

const sortingCode = `<script setup lang="ts">
const columns: ColumnDef<Employee>[] = [
  { field: 'employeeID', title: 'ID', locked: true, lockable: false, width: 80, sortable: true },
  { field: 'firstName', title: 'First Name', locked: true, width: 120, sortable: true },
  { field: 'lastName', title: 'Last Name', locked: true, width: 120, sortable: true },
  { field: 'title', title: 'Title', width: 200, sortable: true },
  { field: 'department', title: 'Department', width: 150, sortable: true },
  { field: 'salary', title: 'Salary', width: 120, format: '{0:c}', sortable: true },
  { field: 'hireDate', title: 'Hire Date', width: 120, sortable: true },
  { field: 'email', title: 'Email', width: 200, sortable: true },
  { field: 'phone', title: 'Phone', width: 150, sortable: true },
]
<\/script>`

// Selection Example
interface SelectionProduct {
  productID: number
  productName: string
  category: string
  unitPrice: number
  unitsInStock: number
  supplier: string
  discontinued: boolean
}

const selectionRows = ref<SelectionProduct[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39, supplier: 'Exotic Liquids', discontinued: false },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17, supplier: 'Exotic Liquids', discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13, supplier: 'New Orleans Cajun Delights', discontinued: false },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', category: 'Condiments', unitPrice: 22, unitsInStock: 53, supplier: 'New Orleans Cajun Delights', discontinued: false },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', category: 'Condiments', unitPrice: 21.35, unitsInStock: 0, supplier: 'New Orleans Cajun Delights', discontinued: true },
  { productID: 6, productName: 'Grandma\'s Boysenberry Spread', category: 'Confections', unitPrice: 25, unitsInStock: 120, supplier: 'Grandma Kelly\'s Homestead', discontinued: false },
])

const selectionColumns: ColumnDef<SelectionProduct>[] = [
  { field: 'productID', title: 'ID', locked: true, lockable: false, width: 80 },
  { field: 'productName', title: 'Product Name', locked: true, width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'supplier', title: 'Supplier', width: 200 },
  { field: 'discontinued', title: 'Discontinued', width: 120, type: 'boolean' },
]

const selectionCode = `<script setup lang="ts">
const columns: ColumnDef<SelectionProduct>[] = [
  { field: 'productID', title: 'ID', locked: true, lockable: false, width: 80 },
  { field: 'productName', title: 'Product Name', locked: true, width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'supplier', title: 'Supplier', width: 200 },
  { field: 'discontinued', title: 'Discontinued', width: 120, type: 'boolean' },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :selectable="'multiple'"
    :sortable="true"
    :pageable="true"
    :height="500"
  />
</template>`

</script>
