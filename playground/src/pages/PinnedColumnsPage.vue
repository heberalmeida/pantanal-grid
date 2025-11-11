<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Pinned Columns</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Pinned columns stick to the viewport while scrolling horizontally. They remain visible at all times and can overlap the footer.
        Set the <code>pinned</code> property of the corresponding column to <code>true</code>, <code>'left'</code>, or <code>'right'</code> to pin it.
      </p>
    </header>

    <!-- Basic Pinned Columns Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Pinned Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The following example demonstrates how to implement pinned columns. The <strong>ID</strong> and <strong>Name</strong> columns are pinned on the left side.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="id"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Pinned Left and Right Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned Left and Right Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can pin columns on both the left and right sides of the grid. Use <code>pinned: 'left'</code> for left-side pins and <code>pinned: 'right'</code> for right-side pins.
      </p>

      <PantanalGrid
        :rows="leftRightRows"
        :columns="leftRightColumns as any"
        key-field="id"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="leftRightCode" />
    </article>

    <!-- Pinned Columns with Many Columns Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned Columns with Many Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        This example demonstrates the practical use of pinned columns when you have many columns. The ID and Name columns remain visible while scrolling through other columns.
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
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="manyColumnsCode" />
    </article>

    <!-- Pinned Columns with Grouping Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned Columns with Grouping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Pinned columns work seamlessly with grouping. The pinned columns remain visible while you expand and collapse groups.
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
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="groupingCode" />
    </article>

    <!-- Pinned Columns with Filtering Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned Columns with Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Pinned columns remain visible when filtering. The filter row is also pinned for pinned columns, making it easy to filter while scrolling.
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
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="filteringCode" />
    </article>

    <!-- Pinned Columns with Selection Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned Columns with Selection</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        When using row selection, the selection checkbox column can be pinned along with key data columns for better usability.
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
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="selectionCode" />
    </article>

    <!-- Pinned Columns with Shadows Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned Columns with Shadows</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Enable shadows on pinned columns to create a visual separation between pinned and scrollable columns. Use the <code>pinned-shadows</code> prop.
      </p>

      <PantanalGrid
        :rows="shadowsRows"
        :columns="shadowsColumns as any"
        key-field="id"
        :sortable="true"
        :pageable="true"
        :column-menu="true"
        :filterable="true"
        :enable-column-resize="true"
        :pinned-shadows="true"
        :height="500"
      />
      <ExampleCode :source="shadowsCode" />
    </article>

    <!-- Difference: Pinned vs Locked -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Pinned vs Locked Columns</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        <strong>Pinned columns</strong> stick to the viewport and can overlap the footer. They are ideal for keeping important data visible while scrolling.
        <strong>Locked columns</strong> stay fixed without overlapping the footer, making them ideal for financial dashboards with summaries.
      </p>
      <div class="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
        <h3 class="font-semibold mb-2">Key Differences:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li><strong>Pinned:</strong> Sticks to viewport, can overlap footer, uses CSS <code>position: sticky</code></li>
          <li><strong>Locked:</strong> Fixed position, never overlaps footer, uses separate containers</li>
          <li><strong>Pinned:</strong> Better for general use cases with simple data</li>
          <li><strong>Locked:</strong> Better for financial dashboards with footers and summaries</li>
        </ul>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Basic Pinned Columns Example
interface BasicRow {
  id: number
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  status: string
}

const basicRows = ref<BasicRow[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', department: 'Engineering', position: 'Tech Lead', salary: 120000, status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', department: 'Product', position: 'Product Manager', salary: 110000, status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104', department: 'Design', position: 'Design Director', salary: 130000, status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-0105', department: 'Marketing', position: 'Marketing Manager', salary: 85000, status: 'Active' },
])

const basicColumns: ColumnDef<BasicRow>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'status', title: 'Status', width: 100 },
]

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Row {
  id: number
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  status: string
}

const rows = ref<Row[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, status: 'Active' },
  // ... more rows
])

const columns: ColumnDef<Row>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'status', title: 'Status', width: 100 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :pageable="true"
    :pinned-shadows="true"
    :height="500"
  />
</template>`

// Left and Right Pinned Example
const leftRightRows = ref<BasicRow[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', department: 'Engineering', position: 'Tech Lead', salary: 120000, status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', department: 'Product', position: 'Product Manager', salary: 110000, status: 'Active' },
])

const leftRightColumns: ColumnDef<BasicRow>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'status', title: 'Status', pinned: 'right', width: 100 },
]

const leftRightCode = `<script setup lang="ts">
const columns: ColumnDef<Row>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'status', title: 'Status', pinned: 'right', width: 100 },
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
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
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
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  // ... more columns
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
])

const groupingColumns: ColumnDef<GroupingProduct>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'productName', title: 'Product Name', pinned: 'left', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'supplier', title: 'Supplier', width: 200 },
  { field: 'discontinued', title: 'Discontinued', width: 120, type: 'boolean' },
]

const groupingCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'productName', title: 'Product Name', pinned: 'left', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  // ... other columns
]
<\/script>`

// Filtering Example
interface Order {
  orderID: number
  shipCountry: string
  shipCity: string
  shipName: string
  shipAddress: string
  freight: number
  orderDate: string
}

const filteringRows = ref<Order[]>([
  { orderID: 10248, shipCountry: 'France', shipCity: 'Reims', shipName: 'Vins et alcools Chevalier', shipAddress: '59 rue de l\'Abbaye', freight: 32.38, orderDate: '1996-07-04' },
  { orderID: 10249, shipCountry: 'Germany', shipCity: 'München', shipName: 'Toms Spezialitäten', shipAddress: 'Luisenstr. 48', freight: 11.61, orderDate: '1996-07-05' },
  { orderID: 10250, shipCountry: 'Brazil', shipCity: 'Rio de Janeiro', shipName: 'Hanari Carnes', shipAddress: 'Rua do Paço, 67', freight: 65.83, orderDate: '1996-07-08' },
  { orderID: 10251, shipCountry: 'France', shipCity: 'Lyon', shipName: 'Victuailles en stock', shipAddress: '2, rue du Commerce', freight: 41.34, orderDate: '1996-07-08' },
  { orderID: 10252, shipCountry: 'Belgium', shipCity: 'Charleroi', shipName: 'Suprêmes délices', shipAddress: 'Boulevard Tirou, 255', freight: 51.3, orderDate: '1996-07-09' },
])

const filteringColumns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', pinned: 'left', width: 120, filterable: true },
  { field: 'shipName', title: 'Ship Name', pinned: 'left', width: 240, filterable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, filterable: true },
  { field: 'shipCity', title: 'Ship City', width: 180, filterable: true },
  { field: 'shipAddress', title: 'Ship Address', width: 240, filterable: true },
  { field: 'freight', title: 'Freight', width: 120, format: '{0:c}', filterable: true, type: 'number' },
  { field: 'orderDate', title: 'Order Date', format: '{0:MM/dd/yyyy}', width: 180, filterable: true, type: 'date' },
]

const filteringCode = `<script setup lang="ts">
const columns: ColumnDef<Order>[] = [
  { field: 'orderID', title: 'Order ID', pinned: 'left', width: 120, filterable: true },
  { field: 'shipName', title: 'Ship Name', pinned: 'left', width: 240, filterable: true },
  { field: 'shipCountry', title: 'Ship Country', width: 180, filterable: true },
  // ... other columns
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
  { field: 'productID', title: 'ID', pinned: 'left', width: 80 },
  { field: 'productName', title: 'Product Name', pinned: 'left', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130 },
  { field: 'supplier', title: 'Supplier', width: 200 },
  { field: 'discontinued', title: 'Discontinued', width: 120, type: 'boolean' },
]

const selectionCode = `<script setup lang="ts">
const columns: ColumnDef<Product>[] = [
  { field: 'productID', title: 'ID', pinned: 'left', width: 80 },
  { field: 'productName', title: 'Product Name', pinned: 'left', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  // ... other columns
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
    :pinned-shadows="true"
    :height="500"
  />
</template>`

// Shadows Example
const shadowsRows = ref<BasicRow[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', department: 'Engineering', position: 'Tech Lead', salary: 120000, status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', department: 'Product', position: 'Product Manager', salary: 110000, status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104', department: 'Design', position: 'Design Director', salary: 130000, status: 'Active' },
])

const shadowsColumns: ColumnDef<BasicRow>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  { field: 'email', title: 'Email', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'department', title: 'Department', width: 130 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'salary', title: 'Salary', width: 100, format: '{0:c}' },
  { field: 'status', title: 'Status', pinned: 'right', width: 100 },
]

const shadowsCode = `<script setup lang="ts">
const columns: ColumnDef<Row>[] = [
  { field: 'id', title: 'ID', pinned: 'left', width: 80 },
  { field: 'name', title: 'Name', pinned: 'left', width: 150 },
  // ... other columns
  { field: 'status', title: 'Status', pinned: 'right', width: 100 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :pinned-shadows="true"
    :height="500"
  />
</template>`
</script>

