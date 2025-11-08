<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-4">Grid Column API</h1>
    <p class="text-gray-600 mb-6 content-text">
      The Grid Column API provides extensive configuration options for customizing column behavior, appearance, and functionality.
    </p>

    <!-- Column Templates -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Templates</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">template</code> prop to customize how column values are rendered.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="templateRows"
          :columns="templateColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="templateCode" />
    </div>

    <!-- Column Values (Enum/Transform) -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Values (Enum/Transform)</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">values</code> prop to transform column values (e.g., display text for enum values).
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="valuesRows"
          :columns="valuesColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="valuesCode" />
    </div>

    <!-- Custom Commands -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Commands</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">command</code> prop with custom objects to create custom command buttons with icons, templates, and click handlers.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="customCommandRows"
          :columns="customCommandColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="customCommandCode" />
    </div>

    <!-- Column Formatting -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Formatting</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">format</code> prop to format column values (currency, date, number, etc.).
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="formatRows"
          :columns="formatColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="formatCode" />
    </div>

    <!-- Column Attributes -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Attributes</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">attributes</code>, <code class="bg-gray-100 px-2 py-1 rounded">headerAttributes</code>, and <code class="bg-gray-100 px-2 py-1 rounded">footerAttributes</code> to add HTML attributes to column cells.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="attributesRows"
          :columns="attributesColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="attributesCode" />
    </div>

    <!-- Column Encoding -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Encoding</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">encoded</code> prop to control HTML encoding of column values (default: <code class="bg-gray-100 px-2 py-1 rounded">true</code>).
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="encodingRows"
          :columns="encodingColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="encodingCode" />
    </div>

    <!-- Column Visibility -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Visibility</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">hidden</code>, <code class="bg-gray-100 px-2 py-1 rounded">media</code>, and <code class="bg-gray-100 px-2 py-1 rounded">minScreenWidth</code> to control column visibility.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="visibilityRows"
          :columns="visibilityColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="visibilityCode" />
    </div>

    <!-- Column Resizing -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Resizing</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">resizable</code> and <code class="bg-gray-100 px-2 py-1 rounded">minResizableWidth</code> to control column resizing behavior.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="resizeRows"
          :columns="resizeColumns as any"
          key-field="id"
          :enable-column-resize="true"
          responsive="table"
        />
      </div>
      <ExampleCode :source="resizeCode" />
    </div>

    <!-- Column Sorting Options -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Sorting Options</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">sortable</code>, <code class="bg-gray-100 px-2 py-1 rounded">sortableAllowUnsort</code>, <code class="bg-gray-100 px-2 py-1 rounded">sortableCompare</code>, and <code class="bg-gray-100 px-2 py-1 rounded">sortableInitialDirection</code> to customize sorting behavior.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="sortableRows"
          :columns="sortableColumns as any"
          key-field="id"
          :sortable="true"
          responsive="table"
        />
      </div>
      <ExampleCode :source="sortableCode" />
    </div>

    <!-- Column Grouping Options -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Column Grouping Options</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">groupable</code>, <code class="bg-gray-100 px-2 py-1 rounded">groupableSortCompare</code>, and <code class="bg-gray-100 px-2 py-1 rounded">groupableSortDir</code> to customize grouping behavior.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="groupableRows"
          :columns="groupableColumns as any"
          key-field="id"
          :group="[{ field: 'category', dir: 'asc' }]"
          responsive="table"
        />
      </div>
      <ExampleCode :source="groupableCode" />
    </div>

    <!-- Header Templates -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Header Templates</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">headerTemplate</code> to customize column header rendering.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="headerTemplateRows"
          :columns="headerTemplateColumns as any"
          key-field="id"
          responsive="table"
        />
      </div>
      <ExampleCode :source="headerTemplateCode" />
    </div>

    <!-- Group Header Templates -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Group Header Templates</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">groupHeaderTemplate</code> and <code class="bg-gray-100 px-2 py-1 rounded">groupHeaderColumnTemplate</code> to customize group header rendering.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="groupHeaderTemplateRows"
          :columns="groupHeaderTemplateColumns as any"
          key-field="id"
          :group="[{ field: 'category', dir: 'asc' }]"
          responsive="table"
        />
      </div>
      <ExampleCode :source="groupHeaderTemplateCode" />
    </div>

    <!-- Group Footer Templates -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Group Footer Templates</h2>
      <p class="text-gray-600 mb-4 content-text">
        Use <code class="bg-gray-100 px-2 py-1 rounded">groupFooterTemplate</code> to customize group footer rendering with aggregates.
      </p>
      <div class="mb-6">
        <PantanalGrid
          :rows="groupFooterTemplateRows"
          :columns="groupFooterTemplateColumns as any"
          key-field="id"
          :group="[{ field: 'category', dir: 'asc' }]"
          :aggregates="{ price: ['sum', 'avg'] }"
          :show-group-footers="true"
          responsive="table"
        />
      </div>
      <ExampleCode :source="groupFooterTemplateCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product {
  id: number
  name: string
  category: string
  price: number
  inStock: boolean
  status: number
  description: string
  htmlContent: string
  orderDate: string
}

// Column Templates
const templateRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: 'A great product', htmlContent: '<strong>Bold</strong> text', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: 'Another product', htmlContent: '<em>Italic</em> text', orderDate: '2024-02-20' },
  { id: 3, name: 'Product 3', category: 'Books', price: 19.99, inStock: true, status: 1, description: 'Yet another product', htmlContent: '<u>Underlined</u> text', orderDate: '2024-03-10' },
])

const templateColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    template: (ctx) => {
      const value = ctx?.value ?? 0
      return h('span', { style: { color: value > 50 ? 'green' : 'red', fontWeight: 'bold' } }, `$${value.toFixed(2)}`)
    },
  },
  {
    field: 'inStock',
    title: 'In Stock',
    width: 100,
    template: (ctx) => {
      const value = ctx?.value ?? false
      return h('span', {
        class: value ? 'text-green-600' : 'text-red-600',
        style: { fontWeight: 'bold' }
      }, value ? '✓ Yes' : '✗ No')
    },
  },
]

// Column Values (Enum/Transform)
const valuesRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product 3', category: 'Books', price: 19.99, inStock: true, status: 0, description: '', htmlContent: '', orderDate: '2024-03-10' },
])

const valuesColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'status',
    title: 'Status',
    width: 120,
    values: [
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 },
      { text: 'Pending', value: 2 },
    ],
  },
  {
    field: 'category',
    title: 'Category',
    width: 150,
    values: [
      { text: 'Electronics & Tech', value: 'Electronics' },
      { text: 'Clothing & Apparel', value: 'Clothing' },
      { text: 'Books & Media', value: 'Books' },
    ],
  },
]

// Custom Commands
const customCommandRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product 3', category: 'Books', price: 19.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
])

const customCommandColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120 },
  {
    title: 'Actions',
    width: 200,
    command: [
      {
        name: 'view',
        text: 'View',
        className: 'v3grid__btn--view',
        click: (_e, row) => {
          alert(`Viewing product: ${row.name}`)
        },
      },
      {
        name: 'delete',
        text: 'Delete',
        className: 'v3grid__btn--delete',
        visible: (row) => row.id !== 2, // Hide for row with id 2
        click: (_e, row) => {
          if (confirm(`Delete ${row.name}?`)) {
            alert(`Deleted: ${row.name}`)
          }
        },
      },
    ],
  },
]

// Column Formatting
const formatRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product 3', category: 'Books', price: 19.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
])

const formatColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    format: '{0:c}', // Currency format
    type: 'number',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    width: 150,
    format: 'MM/dd/yyyy',
    type: 'date',
  },
  {
    field: 'price',
    title: 'Price (Formatted)',
    width: 150,
    format: (value: number) => `$${value.toFixed(2)}`,
  },
]

// Column Attributes
const attributesRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
])

const attributesColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'name',
    title: 'Name',
    width: 200,
    attributes: { 'data-testid': 'product-name' },
    headerAttributes: { 'data-testid': 'name-header', class: 'font-bold' },
  },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120 },
]

// Column Encoding
const encodingRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '<strong>Bold</strong> & <em>Italic</em>', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '<div>XSS Example</div>', orderDate: '2024-02-20' },
])

const encodingColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'htmlContent',
    title: 'HTML (Encoded)',
    width: 200,
    encoded: true, // Default: HTML will be encoded
  },
  {
    field: 'htmlContent',
    title: 'HTML (Not Encoded)',
    width: 200,
    encoded: false, // HTML will be rendered as-is
  },
]

// Column Visibility
const visibilityRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product 3', category: 'Books', price: 19.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
])

const visibilityColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'category',
    title: 'Category (Hidden)',
    width: 150,
    hidden: true, // This column will be hidden
  },
  {
    field: 'price',
    title: 'Price (Min Width)',
    width: 150,
    minScreenWidth: 768, // Hidden below 768px
  },
  {
    field: 'inStock',
    title: 'In Stock (Media)',
    width: 120,
    media: '(min-width: 1024px)', // Hidden below 1024px
  },
]

// Column Resizing
const resizeRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
])

const resizeColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, resizable: true },
  {
    field: 'name',
    title: 'Name (Min 100px)',
    width: 200,
    resizable: true,
    minResizableWidth: 100,
  },
  {
    field: 'category',
    title: 'Category (Not Resizable)',
    width: 150,
    resizable: false,
  },
  { field: 'price', title: 'Price', width: 120, resizable: true },
]

// Column Sorting Options
const sortableRows = ref<Product[]>([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product C', category: 'Books', price: 19.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
])

const sortableColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  {
    field: 'name',
    title: 'Name (Custom Compare)',
    width: 200,
    sortable: true,
    sortableCompare: (a: string, b: string) => {
      // Case-insensitive sort
      return a.toLowerCase().localeCompare(b.toLowerCase())
    },
  },
  {
    field: 'price',
    title: 'Price (No Unsort)',
    width: 120,
    sortable: true,
    sortableAllowUnsort: false, // Cannot unsort this column
  },
  {
    field: 'orderDate',
    title: 'Date (Initial Desc)',
    width: 150,
    sortable: true,
    sortableInitialDirection: 'desc',
  },
]

// Column Grouping Options
const groupableRows = ref<Product[]>([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product B', category: 'Electronics', price: 149.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product C', category: 'Clothing', price: 49.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
  { id: 4, name: 'Product D', category: 'Clothing', price: 79.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-04-05' },
])

const groupableColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'category',
    title: 'Category',
    width: 150,
    groupable: true,
    groupableSortDir: 'asc',
  },
  {
    field: 'name',
    title: 'Name',
    width: 200,
    groupable: false, // Cannot group by this column
  },
  { field: 'price', title: 'Price', width: 120 },
]

const templateCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    template: (ctx) => {
      const value = ctx?.value ?? 0
      return h('span', { 
        style: { color: value > 50 ? 'green' : 'red' } 
      }, \`$\${value.toFixed(2)}\`)
    },
  },
]
&lt;/script&gt;`

const valuesCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'status',
    title: 'Status',
    width: 120,
    values: [
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 },
      { text: 'Pending', value: 2 },
    ],
  },
]
&lt;/script&gt;`

const customCommandCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    title: 'Actions',
    width: 200,
    command: [
      {
        name: 'view',
        text: 'View',
        click: (e, row) => {
          alert(\`Viewing: \${row.name}\`)
        },
      },
      {
        name: 'delete',
        text: 'Delete',
        visible: (row) => row.id !== 2,
        click: (e, row) => {
          if (confirm(\`Delete \${row.name}?\`)) {
            // Handle delete
          }
        },
      },
    ],
  },
]
&lt;/script&gt;`

const formatCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...])

const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    format: '{0:c}', // Currency format
    type: 'number',
  },
  {
    field: 'orderDate',
    title: 'Order Date',
    format: 'MM/dd/yyyy',
    type: 'date',
  },
  {
    field: 'price',
    title: 'Price (Custom)',
    format: (value: number) => \`$\${value.toFixed(2)}\`,
  },
]
&lt;/script&gt;`

const attributesCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    attributes: { 'data-testid': 'product-name' },
    headerAttributes: { 'data-testid': 'name-header', class: 'font-bold' },
  },
]
&lt;/script&gt;`

const encodingCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'htmlContent',
    title: 'HTML (Encoded)',
    encoded: true, // HTML will be encoded (default)
  },
  {
    field: 'htmlContent',
    title: 'HTML (Not Encoded)',
    encoded: false, // HTML will be rendered as-is
  },
]
&lt;/script&gt;`

const visibilityCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    hidden: true, // Always hidden
  },
  {
    field: 'price',
    title: 'Price',
    minScreenWidth: 768, // Hidden below 768px
  },
  {
    field: 'inStock',
    title: 'In Stock',
    media: '(min-width: 1024px)', // Hidden below 1024px
  },
]
&lt;/script&gt;`

const resizeCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :enable-column-resize="true"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    resizable: true,
    minResizableWidth: 100, // Minimum width when resizing
  },
  {
    field: 'category',
    title: 'Category',
    resizable: false, // Cannot resize this column
  },
]
&lt;/script&gt;`

const sortableCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :sortable="true"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    sortable: true,
    sortableCompare: (a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase())
    },
  },
  {
    field: 'price',
    title: 'Price',
    sortable: true,
    sortableAllowUnsort: false, // Cannot unsort
  },
  {
    field: 'orderDate',
    title: 'Date',
    sortable: true,
    sortableInitialDirection: 'desc',
  },
]
&lt;/script&gt;`

const groupableCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :group="[{ field: 'category', dir: 'asc' }]"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    groupable: true,
    groupableSortDir: 'asc',
  },
  {
    field: 'name',
    title: 'Name',
    groupable: false, // Cannot group by this column
  },
]
&lt;/script&gt;`

// Header Templates
const headerTemplateRows = ref<Product[]>([
  { id: 1, name: 'Product 1', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 49.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
])

const headerTemplateColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'name',
    title: 'Product Name',
    width: 200,
    headerTemplate: (column) => {
      return `<strong style="color: #3b82f6;">${column.title}</strong> <span style="font-size: 0.75rem; color: #6b7280;">(Required)</span>`
    },
  },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    headerTemplate: () => {
      return '<span style="display: flex; align-items: center; gap: 0.25rem;"><span>💰</span> <span>Price (USD)</span></span>'
    },
  },
  { field: 'category', title: 'Category', width: 150 },
]

// Group Header Templates
const groupHeaderTemplateRows = ref<Product[]>([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product B', category: 'Electronics', price: 149.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product C', category: 'Clothing', price: 49.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
  { id: 4, name: 'Product D', category: 'Clothing', price: 79.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-04-05' },
])

const groupHeaderTemplateColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'category',
    title: 'Category',
    width: 150,
    groupHeaderColumnTemplate: (group, column) => {
      return `<strong style="color: #10b981; font-size: 1.1em;">📁 ${group.value}</strong> <span style="font-size: 0.875rem; color: #6b7280;">(${group.items.length} items)</span>`
    },
  },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
]

// Group Footer Templates
const groupFooterTemplateRows = ref<Product[]>([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-01-15' },
  { id: 2, name: 'Product B', category: 'Electronics', price: 149.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-02-20' },
  { id: 3, name: 'Product C', category: 'Clothing', price: 49.99, inStock: true, status: 1, description: '', htmlContent: '', orderDate: '2024-03-10' },
  { id: 4, name: 'Product D', category: 'Clothing', price: 79.99, inStock: false, status: 2, description: '', htmlContent: '', orderDate: '2024-04-05' },
])

const groupFooterTemplateColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    aggregates: ['sum', 'avg'],
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        const sum = priceAgg.sum ?? 0
        const avg = priceAgg.avg ?? 0
        return `<strong style="color: #3b82f6;">Total: $${sum.toFixed(2)} | Avg: $${avg.toFixed(2)}</strong>`
      }
      return ''
    },
  },
]

const headerTemplateCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Product Name',
    headerTemplate: (column) => \`&lt;strong style="color: #3b82f6;"&gt;\${column.title}&lt;/strong&gt; &lt;span style="font-size: 0.75rem;"&gt;(Required)&lt;/span&gt;\`,
  },
  {
    field: 'price',
    title: 'Price',
    headerTemplate: () => '&lt;span&gt;💰 Price (USD)&lt;/span&gt;',
  },
]
&lt;/script&gt;`

const groupHeaderTemplateCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :group="[{ field: 'category', dir: 'asc' }]"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    groupHeaderColumnTemplate: (group, column) => \`&lt;strong&gt;📁 \${group.value}&lt;/strong&gt; (\${group.items.length} items)\`,
  },
]
&lt;/script&gt;`

const groupFooterTemplateCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :group="[{ field: 'category', dir: 'asc' }]"
    :aggregates="{ price: ['sum', 'avg'] }"
    :show-group-footers="true"
    key-field="id"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    aggregates: ['sum', 'avg'],
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        const sum = priceAgg.sum ?? 0
        const avg = priceAgg.avg ?? 0
        return \`&lt;strong&gt;Total: $\${sum.toFixed(2)} | Avg: $\${avg.toFixed(2)}&lt;/strong&gt;\`
      }
      return ''
    },
  },
]
&lt;/script&gt;`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}

.content-text {
  @apply dark:text-gray-300;
}
</style>

