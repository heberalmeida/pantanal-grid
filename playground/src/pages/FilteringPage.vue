<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Grid Filtering</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports various filtering modes including filter row, filter menu, and custom filter UIs.
        This page demonstrates the filtering capabilities of the Grid component.
      </p>
    </header>

    <!-- Filter Row Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Filter Row</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Enable filter row to show filter inputs directly in the column headers. The Grid automatically uses
        appropriate input types based on column data type.
      </p>

      <PantanalGrid
        :rows="filterRowRows"
        :columns="filterRowColumns as any"
        key-field="productID"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="filterRowFilters"
        @filter="onFilterRowFilter"
      />
      <ExampleCode :source="filterRowCode" />
    </article>

    <!-- Advanced Filter Row with Different Types -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Advanced Filter Row (Different Types)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Filter row with support for different input types: text, number, date, and boolean.
      </p>

      <PantanalGrid
        :rows="advancedFilterRows"
        :columns="advancedFilterColumns as any"
        key-field="orderID"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="advancedFilters"
        @filter="onAdvancedFilter"
      />
      <ExampleCode :source="advancedFilterCode" />
    </article>

    <!-- Filter Operators Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Filter Operators</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Configure default filter operators for columns. Available operators: contains, eq, neq, gt, gte, lt, lte, startswith, endswith.
      </p>

      <PantanalGrid
        :rows="operatorsRows"
        :columns="operatorsColumns as any"
        key-field="productID"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="operatorsFilters"
        @filter="onOperatorsFilter"
      />
      <ExampleCode :source="operatorsCode" />
    </article>

    <!-- Numeric Filter Example (Greater Than, Less Than) -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Numeric Filters (Greater Than, Less Than)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Filter numeric columns using comparison operators. Try filtering unit price greater than 15 or units in stock less than 20.
      </p>

      <PantanalGrid
        :rows="numericFilterRows"
        :columns="numericFilterColumns as any"
        key-field="productID"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="numericFilters"
        @filter="onNumericFilter"
      />
      <ExampleCode :source="numericFilterCode" />
    </article>

    <!-- Multi-word Search Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Multi-word Search</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Search for multiple words in any order. For example, typing "Almeida Heber" will find "Heber Moura de Almeida".
        The search matches all words regardless of their position in the text.
      </p>

      <PantanalGrid
        :rows="multiWordRows"
        :columns="multiWordColumns as any"
        key-field="id"
        :show-filter-row="true"
        :sortable="true"
        v-model:filter="multiWordFilters"
        @filter="onMultiWordFilter"
      />
      <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
        <strong>Try it:</strong> Type "Almeida Heber" or "Moura Almeida" in the Name filter to see multi-word search in action.
      </div>
      <ExampleCode :source="multiWordCode" />
    </article>

    <!-- Custom Filter Options Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Filter Options</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use custom filter options with dropdown selects. The boolean filters are automatically translated (Yes/No, Sim/Não, etc.),
        and you can provide custom options for any column.
      </p>

      <PantanalGrid
        :rows="customFilterRows"
        :columns="customFilterColumns as any"
        key-field="id"
        :show-filter-row="true"
        :sortable="true"
        locale="en"
        v-model:filter="customFilters"
        @filter="onCustomFilter"
      />
      <ExampleCode :source="customFilterCode" />
    </article>

    <!-- Server-side Filtering Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Server-side Filtering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use server-side filtering with a dataProvider to filter data on the server.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="serverFilterColumns as any"
        key-field="productID"
        :show-filter-row="true"
        :data-provider="serverFilterProvider"
        :auto-bind="true"
        server-side
        v-model:filter="serverFilters"
        v-model:page="serverPage"
        v-model:pageSize="serverPageSize"
        @filter="onServerFilter"
      />
      <ExampleCode :source="serverFilterCode" />
    </article>

    <!-- Current Filters Display -->
    <div v-if="activeFilters.length > 0" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h3 class="font-semibold mb-2">Active Filters:</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="(filter, index) in activeFilters" :key="index">
          <strong>{{ filter.field }}</strong>: {{ filter.operator }} 
          <code class="bg-white dark:bg-slate-800 px-1 rounded">{{ String(filter.value) }}</code>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor, type DataProvider, type DataProviderArgs } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Filter Row Example
const filterRowRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, category: 'Condiments' },
  { productID: 6, productName: "Grandma's Boysenberry Spread", unitPrice: 25, unitsInStock: 120, category: 'Confections' },
])

const filterRowColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, filterable: true, sortable: true },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true, sortable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true, sortable: true, type: 'number' },
  { field: 'category', title: 'Category', width: 150, filterable: true, sortable: true },
]

const filterRowFilters = ref<FilterDescriptor[]>([])
function onFilterRowFilter(data: { filter: FilterDescriptor[] }) {
  filterRowFilters.value = data.filter
}

// Advanced Filter Row
const advancedFilterRows = ref([
  { orderID: 1, customerName: 'John Doe', orderDate: new Date('2024-01-15'), freight: 32.38, shipped: true },
  { orderID: 2, customerName: 'Jane Smith', orderDate: new Date('2024-01-20'), freight: 11.61, shipped: false },
  { orderID: 3, customerName: 'Bob Johnson', orderDate: new Date('2024-02-01'), freight: 65.83, shipped: true },
  { orderID: 4, customerName: 'Alice Brown', orderDate: new Date('2024-02-10'), freight: 41.34, shipped: true },
  { orderID: 5, customerName: 'Charlie Wilson', orderDate: new Date('2024-02-15'), freight: 51.3, shipped: false },
])

const advancedFilterColumns: ColumnDef[] = [
  { field: 'orderID', title: 'Order ID', width: 100, filterable: true, sortable: true, type: 'number' },
  { field: 'customerName', title: 'Customer', width: 180, filterable: true, sortable: true, type: 'string' },
  { field: 'orderDate', title: 'Order Date', width: 150, filterable: true, sortable: true, type: 'date', format: (v: Date) => v.toLocaleDateString() },
  { field: 'freight', title: 'Freight', width: 120, filterable: true, sortable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'shipped', title: 'Shipped', width: 100, filterable: true, sortable: true, type: 'boolean', format: (v: boolean) => v ? 'Yes' : 'No' },
]

const advancedFilters = ref<FilterDescriptor[]>([])
function onAdvancedFilter(data: { filter: FilterDescriptor[] }) {
  advancedFilters.value = data.filter
}

// Filter Operators Example
const operatorsRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39 },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40 },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13 },
])

const operatorsColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, filterable: true, filterableDefaultOperator: 'eq' },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true, filterableDefaultOperator: 'startswith' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true, type: 'number', filterableDefaultOperator: 'gte', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true, type: 'number', filterableDefaultOperator: 'gte' },
]

const operatorsFilters = ref<FilterDescriptor[]>([])
function onOperatorsFilter(data: { filter: FilterDescriptor[] }) {
  operatorsFilters.value = data.filter
}

// Numeric Filter Example
const numericFilterRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, category: 'Condiments' },
  { productID: 6, productName: "Grandma's Boysenberry Spread", unitPrice: 25, unitsInStock: 120, category: 'Confections' },
  { productID: 7, productName: 'Uncle Bob\'s Organic Dried Pears', unitPrice: 30, unitsInStock: 15, category: 'Produce' },
  { productID: 8, productName: 'Northwoods Cranberry Sauce', unitPrice: 40, unitsInStock: 6, category: 'Condiments' },
])

const numericFilterColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, filterable: true, sortable: true, type: 'number' },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true, sortable: true, type: 'number', filterableDefaultOperator: 'gte', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true, sortable: true, type: 'number', filterableDefaultOperator: 'gte' },
  { field: 'category', title: 'Category', width: 150, filterable: true, sortable: true },
]

const numericFilters = ref<FilterDescriptor[]>([])
function onNumericFilter(data: { filter: FilterDescriptor[] }) {
  numericFilters.value = data.filter
}

// Multi-word Search Example
const multiWordRows = ref([
  { id: 1, name: 'Heber Moura de Almeida', email: 'heber@example.com', department: 'Engineering' },
  { id: 2, name: 'Maria Silva Santos', email: 'maria@example.com', department: 'Marketing' },
  { id: 3, name: 'João Pedro Oliveira', email: 'joao@example.com', department: 'Sales' },
  { id: 4, name: 'Ana Paula Almeida Costa', email: 'ana@example.com', department: 'Engineering' },
  { id: 5, name: 'Carlos Eduardo Moura', email: 'carlos@example.com', department: 'HR' },
  { id: 6, name: 'Fernanda Almeida Silva', email: 'fernanda@example.com', department: 'Marketing' },
  { id: 7, name: 'Roberto Moura de Oliveira', email: 'roberto@example.com', department: 'Sales' },
  { id: 8, name: 'Patricia Santos Almeida', email: 'patricia@example.com', department: 'Engineering' },
])

const multiWordColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, filterable: true, sortable: true, type: 'number' },
  { field: 'name', title: 'Name', width: 250, filterable: true, sortable: true, filterableDefaultOperator: 'contains' },
  { field: 'email', title: 'Email', width: 200, filterable: true, sortable: true, filterableDefaultOperator: 'contains' },
  { field: 'department', title: 'Department', width: 150, filterable: true, sortable: true },
]

const multiWordFilters = ref<FilterDescriptor[]>([])
function onMultiWordFilter(data: { filter: FilterDescriptor[] }) {
  multiWordFilters.value = data.filter
}

// Custom Filter Options Example
const customFilterRows = ref([
  { id: 1, name: 'Product A', status: 'active', priority: 'high', category: 'electronics' },
  { id: 2, name: 'Product B', status: 'inactive', priority: 'medium', category: 'electronics' },
  { id: 3, name: 'Product C', status: 'active', priority: 'low', category: 'clothing' },
  { id: 4, name: 'Product D', status: 'pending', priority: 'high', category: 'food' },
  { id: 5, name: 'Product E', status: 'active', priority: 'medium', category: 'electronics' },
])

const customFilterColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, filterable: true, sortable: true, type: 'number' },
  { field: 'name', title: 'Name', width: 200, filterable: true, sortable: true },
  { 
    field: 'status', 
    title: 'Status', 
    width: 120, 
    filterable: true, 
    sortable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ]
  },
  { 
    field: 'priority', 
    title: 'Priority', 
    width: 120, 
    filterable: true, 
    sortable: true,
    filterableUI: 'dropdown',
    filterableOptions: () => [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ]
  },
  { 
    field: 'category', 
    title: 'Category', 
    width: 150, 
    filterable: true, 
    sortable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'food', label: 'Food' },
    ]
  },
]

const customFilters = ref<FilterDescriptor[]>([])
function onCustomFilter(data: { filter: FilterDescriptor[] }) {
  customFilters.value = data.filter
}

// Server-side Filtering
const serverPage = ref(1)
const serverPageSize = ref(10)
const serverFilters = ref<FilterDescriptor[]>([])

const allServerData = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, category: 'Condiments' },
  { productID: 6, productName: "Grandma's Boysenberry Spread", unitPrice: 25, category: 'Confections' },
  { productID: 7, productName: 'Uncle Bob\'s Organic Dried Pears', unitPrice: 30, category: 'Produce' },
  { productID: 8, productName: 'Northwoods Cranberry Sauce', unitPrice: 40, category: 'Condiments' },
  { productID: 9, productName: 'Mishi Kobe Niku', unitPrice: 97, category: 'Meat/Poultry' },
  { productID: 10, productName: 'Ikura', unitPrice: 31, category: 'Seafood' },
])

const serverFilterColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, filterable: true, sortable: true },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true, sortable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150, filterable: true, sortable: true },
]

const serverFilterProvider: DataProvider = async ({ page, pageSize, filter, signal }: DataProviderArgs) => {
  // Simulate server-side filtering
  let filteredData = [...allServerData.value]
  
  if (filter && filter.length > 0) {
    filteredData = filteredData.filter(row => {
      return filter.every(f => {
        const value = (row as any)[f.field]
        switch (f.operator) {
          case 'contains':
            return String(value ?? '').toLowerCase().includes(String(f.value ?? '').toLowerCase())
          case 'eq':
            return value === f.value
          case 'neq':
            return value !== f.value
          case 'gt':
            return Number(value) > Number(f.value)
          case 'gte':
            return Number(value) >= Number(f.value)
          case 'lt':
            return Number(value) < Number(f.value)
          case 'lte':
            return Number(value) <= Number(f.value)
          case 'startswith':
            return String(value ?? '').toLowerCase().startsWith(String(f.value ?? '').toLowerCase())
          case 'endswith':
            return String(value ?? '').toLowerCase().endsWith(String(f.value ?? '').toLowerCase())
          default:
            return true
        }
      })
    })
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = filteredData.slice(start, end)
  
  return {
    rows: paginated,
    total: filteredData.length,
  }
}

function onServerFilter(data: { filter: FilterDescriptor[] }) {
  serverFilters.value = data.filter
}

// Active filters display
const activeFilters = computed(() => {
  return [
    ...filterRowFilters.value,
    ...advancedFilters.value,
    ...operatorsFilters.value,
    ...numericFilters.value,
    ...multiWordFilters.value,
    ...serverFilters.value,
  ]
})

// Code snippets
const filterRowCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :show-filter-row="true"
    v-model:filter="filters"
    @filter="onFilter"
  />
</template>`

const advancedFilterCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="orderID"
    :show-filter-row="true"
    v-model:filter="filters"
  />
</template>

<script setup>
const columns = [
  { field: 'orderID', title: 'Order ID', filterable: true, type: 'number' },
  { field: 'customerName', title: 'Customer', filterable: true, type: 'string' },
  { field: 'orderDate', title: 'Order Date', filterable: true, type: 'date' },
  { field: 'freight', title: 'Freight', filterable: true, type: 'number' },
  { field: 'shipped', title: 'Shipped', filterable: true, type: 'boolean' },
]
<\/script>`

const operatorsCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :show-filter-row="true"
    v-model:filter="filters"
  />
</template>

<script setup>
const columns = [
  { 
    field: 'productID', 
    title: 'ID', 
    filterable: true, 
    filterableDefaultOperator: 'eq' 
  },
  { 
    field: 'productName', 
    title: 'Product Name', 
    filterable: true, 
    filterableDefaultOperator: 'startswith' 
  },
  { 
    field: 'unitPrice', 
    title: 'Unit Price', 
    filterable: true, 
    type: 'number',
    filterableDefaultOperator: 'gte' 
  },
]
<\/script>`

const numericFilterCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :show-filter-row="true"
    v-model:filter="filters"
  />
</template>

<script setup>
const columns = [
  { 
    field: 'unitPrice', 
    title: 'Unit Price', 
    filterable: true, 
    type: 'number',
    filterableDefaultOperator: 'gte'  // Greater than or equal
  },
  { 
    field: 'unitsInStock', 
    title: 'Units In Stock', 
    filterable: true, 
    type: 'number',
    filterableDefaultOperator: 'gte'  // Greater than or equal
  },
]
<\/script>`

const multiWordCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :show-filter-row="true"
    v-model:filter="filters"
  />
</template>

<script setup>
const columns = [
  { 
    field: 'name', 
    title: 'Name', 
    filterable: true,
    filterableDefaultOperator: 'contains'  // Multi-word search
  },
]
<\/script>

<!-- 
Multi-word search: Type "Almeida Heber" to find "Heber Moura de Almeida"
The search matches all words regardless of order.
-->`

const customFilterCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :show-filter-row="true"
    locale="en"
    v-model:filter="filters"
  />
</template>

<script setup>
const columns = [
  { 
    field: 'status', 
    title: 'Status', 
    filterable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ]
  },
  { 
    field: 'shipped', 
    title: 'Shipped', 
    filterable: true,
    type: 'boolean'  // Automatically uses translated Yes/No
  },
]
<\/script>`

const serverFilterCode = `<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :show-filter-row="true"
    :data-provider="dataProvider"
    :auto-bind="true"
    server-side
    v-model:filter="filters"
  />
</template>

<script setup>
const dataProvider = async ({ page, pageSize, filter }) => {
  // Apply filters on server
  const response = await fetch(\`/api/products?page=\${page}&pageSize=\${pageSize}\`)
  const data = await response.json()
  return { rows: data.items, total: data.total }
}
<\/script>`
</script>

