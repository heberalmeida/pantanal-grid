<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Filterable Props API</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports extensive filtering configuration through filterableProps API,
      including custom messages, operators, and filter modes.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Filter Messages</h2>
      <p class="text-gray-600 mb-4">
        Customize filter menu messages using <code class="bg-gray-100 px-2 py-1 rounded">filterableMessages-*</code> props.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customMessagesRows"
          :columns="customMessagesColumns as any"
          :show-filter-row="true"
          :filterable="true"
          :messages="customMessages"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="customMessagesCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Custom Filter Operators</h2>
      <p class="text-gray-600 mb-4">
        Customize operator labels using <code class="bg-gray-100 px-2 py-1 rounded">filterableOperators</code> prop.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="customOperatorsRows"
          :columns="customOperatorsColumns as any"
          :show-filter-row="true"
          :filterable="true"
          :filterableOperators="customOperators"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="customOperatorsCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Filter Mode: Row and Menu</h2>
      <p class="text-gray-600 mb-4">
        Enable both row and menu filtering modes using <code class="bg-gray-100 px-2 py-1 rounded">filterableMode="menu, row"</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="filterModeRows"
          :columns="filterModeColumns as any"
          :filterable="true"
          :filterableMode="'menu, row'"
          :show-filter-row="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="filterModeCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Boolean Filter Messages</h2>
      <p class="text-gray-600 mb-4">
        Customize boolean filter labels using <code class="bg-gray-100 px-2 py-1 rounded">filterableMessagesIsTrue</code> and <code class="bg-gray-100 px-2 py-1 rounded">filterableMessagesIsFalse</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="booleanFilterRows"
          :columns="booleanFilterColumns as any"
          :show-filter-row="true"
          :filterable="true"
          :messages="booleanMessages"
          responsive="table"
          key-field="id"
        />
      </div>

      <ExampleCode :source="booleanFilterCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Internationalization</h2>
      <p class="text-gray-600 mb-4">
        Filter messages are automatically translated based on the <code class="bg-gray-100 px-2 py-1 rounded">locale</code> prop.
      </p>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Select Language:</label>
        <select v-model="selectedLocale" class="border rounded px-3 py-2 mb-4">
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
        </select>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="i18nRows"
          :columns="i18nColumns as any"
          :show-filter-row="true"
          :filterable="true"
          :locale="selectedLocale"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="i18nCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

// Custom Messages Example
const customMessagesRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: true },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true },
])

const customMessagesColumns: ColumnDef<Product>[] = [
  { field: 'productID', title: 'ID', width: 80, filterable: true },
  { field: 'productName', title: 'Product Name', width: 200, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, filterable: true, type: 'number' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, filterable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, filterable: true, type: 'boolean' },
]

const customMessages: Partial<Messages> = {
  filterableMessagesAnd: 'AND',
  filterableMessagesOr: 'OR',
  filterableMessagesClear: 'Clear Filters',
  filterableMessagesFilter: 'Apply Filter',
  filterableMessagesInfo: 'Show items where',
  filterableMessagesIsTrue: 'Yes',
  filterableMessagesIsFalse: 'No',
  filterPlaceholder: 'Search',
}

// Custom Operators Example
const customOperatorsRows = ref<Product[]>([...customMessagesRows.value])
const customOperatorsColumns: ColumnDef<Product>[] = [...customMessagesColumns]

const customOperators = {
  string: {
    eq: 'Equals',
    neq: 'Not equals',
    contains: 'Contains',
    startswith: 'Starts with',
    endswith: 'Ends with',
    isnull: 'Is null',
    isnotnull: 'Is not null',
    isempty: 'Is empty',
    isnotempty: 'Is not empty',
  },
  number: {
    eq: 'Equals',
    neq: 'Not equals',
    gt: 'Greater than',
    gte: 'Greater than or equal',
    lt: 'Less than',
    lte: 'Less than or equal',
    isnull: 'Is null',
    isnotnull: 'Is not null',
  },
  date: {
    eq: 'Equals',
    neq: 'Not equals',
    gt: 'After',
    gte: 'On or after',
    lt: 'Before',
    lte: 'On or before',
    isnull: 'Is null',
    isnotnull: 'Is not null',
  },
  boolean: {
    eq: 'Equals',
    neq: 'Not equals',
  },
  enums: {
    eq: 'Equals',
    neq: 'Not equals',
    isnull: 'Is null',
    isnotnull: 'Is not null',
  },
}

// Filter Mode Example
const filterModeRows = ref<Product[]>([...customMessagesRows.value])
const filterModeColumns: ColumnDef<Product>[] = [...customMessagesColumns]

// Boolean Filter Messages
interface BooleanProduct {
  id: number
  name: string
  inStock: boolean
  active: boolean
}

const booleanFilterRows = ref<BooleanProduct[]>([
  { id: 1, name: 'Product A', inStock: true, active: true },
  { id: 2, name: 'Product B', inStock: false, active: true },
  { id: 3, name: 'Product C', inStock: true, active: false },
  { id: 4, name: 'Product D', inStock: false, active: false },
])

const booleanFilterColumns: ColumnDef<BooleanProduct>[] = [
  { field: 'id', title: 'ID', width: 80, filterable: true },
  { field: 'name', title: 'Name', width: 200, filterable: true },
  { field: 'inStock', title: 'In Stock', width: 120, filterable: true, type: 'boolean' },
  { field: 'active', title: 'Active', width: 120, filterable: true, type: 'boolean' },
]

const booleanMessages: Partial<Messages> = {
  filterableMessagesIsTrue: 'Available',
  filterableMessagesIsFalse: 'Unavailable',
}

// Internationalization
const selectedLocale = ref<'en' | 'pt' | 'es'>('en')
const i18nRows = ref<Product[]>([...customMessagesRows.value])
const i18nColumns: ColumnDef<Product>[] = [...customMessagesColumns]

const customMessagesCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :messages="customMessages"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const customMessages: Partial<Messages> = {
  filterableMessagesAnd: 'AND',
  filterableMessagesOr: 'OR',
  filterableMessagesClear: 'Clear Filters',
  filterableMessagesFilter: 'Apply Filter',
  filterableMessagesInfo: 'Show items where',
  filterableMessagesIsTrue: 'Yes',
  filterableMessagesIsFalse: 'No',
  filterPlaceholder: 'Search',
}
<\/script>`

const customOperatorsCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :filterableOperators="customOperators"
    key-field="productID"
  />
</template>

<script setup lang="ts">
const customOperators = {
  string: {
    eq: 'Equals',
    neq: 'Not equals',
    contains: 'Contains',
    startswith: 'Starts with',
    endswith: 'Ends with',
  },
  number: {
    eq: 'Equals',
    gt: 'Greater than',
    gte: 'Greater than or equal',
    lt: 'Less than',
    lte: 'Less than or equal',
  },
  date: {
    eq: 'Equals',
    gt: 'After',
    gte: 'On or after',
    lt: 'Before',
    lte: 'On or before',
  },
}
<\/script>`

const filterModeCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :filterable="true"
    :filterableMode="'menu, row'"
    :show-filter-row="true"
    key-field="productID"
  />
</template>

<script setup lang="ts">
// filterableMode can be:
// - 'row' - Filter row only
// - 'menu' - Filter menu only
// - 'menu, row' - Both modes enabled
// - false - Filtering disabled
<\/script>`

const booleanFilterCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :messages="booleanMessages"
    key-field="id"
  />
</template>

<script setup lang="ts">
const booleanMessages: Partial<Messages> = {
  filterableMessagesIsTrue: 'Available',
  filterableMessagesIsFalse: 'Unavailable',
}
<\/script>`

const i18nCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :show-filter-row="true"
    :filterable="true"
    :locale="locale"
    key-field="productID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const locale = ref<'en' | 'pt' | 'es'>('en')

// Filter messages are automatically translated based on locale
// - 'en': English (default)
// - 'pt': Portuguese
// - 'es': Spanish
<\/script>`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

