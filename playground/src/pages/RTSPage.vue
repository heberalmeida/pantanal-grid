<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">RTL Support</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports right-to-left (RTL) layouts for languages like Arabic, Hebrew, and Persian.
      Enable RTL by setting the <code class="bg-gray-100 px-2 py-1 rounded">rtl</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic RTL Grid</h2>
      <p class="text-gray-600 mb-4">
        Enable RTL support by setting the <code class="bg-gray-100 px-2 py-1 rounded">rtl</code> prop to <code class="bg-gray-100 px-2 py-1 rounded">true</code>.
        The grid will automatically adjust text alignment, borders, and layout direction.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          :rtl="true"
          :sortable="true"
          :filterable="true"
          :pageable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="basicCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">RTL with Sorting and Filtering</h2>
      <p class="text-gray-600 mb-4">
        RTL works seamlessly with sorting, filtering, and other grid features.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="sortFilterRows"
          :columns="sortFilterColumns"
          :rtl="true"
          :sortable="true"
          :sortableMode="'multiple'"
          :filterable="true"
          :showFilterRow="true"
          :pageable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="sortFilterCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">RTL with Grouping</h2>
      <p class="text-gray-600 mb-4">
        RTL support extends to grouping functionality as well.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="groupRows"
          :columns="groupColumns"
          :rtl="true"
          :group="group"
          :sortable="true"
          :pageable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="groupCode" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Toggle RTL</h2>
      <p class="text-gray-600 mb-4">
        You can dynamically toggle RTL mode using a reactive prop.
      </p>
      
      <div class="mb-4">
        <label class="flex items-center gap-2">
          <input 
            type="checkbox" 
            v-model="rtlEnabled"
            class="w-4 h-4"
          />
          <span>Enable RTL</span>
        </label>
      </div>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="toggleRows"
          :columns="toggleColumns"
          :rtl="rtlEnabled"
          :sortable="true"
          :filterable="true"
          :pageable="true"
          responsive="table"
          key-field="productID"
        />
      </div>

      <ExampleCode :source="toggleCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
  category: string
}

// Basic RTL
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, unitsInStock: 120, discontinued: false, category: 'Condiments' },
  { productID: 7, productName: 'Uncle Bob\'s Organic Dried Pears', unitPrice: 30, unitsInStock: 15, discontinued: false, category: 'Produce' },
  { productID: 8, productName: 'Northwoods Cranberry Sauce', unitPrice: 40, unitsInStock: 6, discontinued: false, category: 'Condiments' },
  { productID: 9, productName: 'Mishi Kobe Niku', unitPrice: 97, unitsInStock: 29, discontinued: true, category: 'Meat/Poultry' },
  { productID: 10, productName: 'Ikura', unitPrice: 31, unitsInStock: 31, discontinued: false, category: 'Seafood' },
])

const basicColumns: ColumnDef[] = [
  { field: 'productName', title: 'اسم المنتج', width: 200, sortable: true, filterable: true },
  { field: 'unitPrice', title: 'سعر الوحدة', width: 120, sortable: true, filterable: true },
  { field: 'category', title: 'الفئة', width: 150, sortable: true, filterable: true },
  { field: 'unitsInStock', title: 'الوحدات في المخزن', width: 130, sortable: true, filterable: true },
  { field: 'discontinued', title: 'متوقف', width: 120, sortable: true, filterable: true },
]

// RTL with Sorting and Filtering
const sortFilterRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, unitsInStock: 120, discontinued: false, category: 'Condiments' },
  { productID: 7, productName: 'Uncle Bob\'s Organic Dried Pears', unitPrice: 30, unitsInStock: 15, discontinued: false, category: 'Produce' },
  { productID: 8, productName: 'Northwoods Cranberry Sauce', unitPrice: 40, unitsInStock: 6, discontinued: false, category: 'Condiments' },
])

const sortFilterColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200, sortable: true, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true, filterable: true },
  { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130, sortable: true, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true, filterable: true },
]

// RTL with Grouping
const groupRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false, category: 'Condiments' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, unitsInStock: 120, discontinued: false, category: 'Condiments' },
  { productID: 7, productName: 'Uncle Bob\'s Organic Dried Pears', unitPrice: 30, unitsInStock: 15, discontinued: false, category: 'Produce' },
  { productID: 8, productName: 'Northwoods Cranberry Sauce', unitPrice: 40, unitsInStock: 6, discontinued: false, category: 'Condiments' },
  { productID: 9, productName: 'Mishi Kobe Niku', unitPrice: 97, unitsInStock: 29, discontinued: true, category: 'Meat/Poultry' },
  { productID: 10, productName: 'Ikura', unitPrice: 31, unitsInStock: 31, discontinued: false, category: 'Seafood' },
])

const groupColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true },
  { field: 'category', title: 'Category', width: 150, sortable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130, sortable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true },
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

// Toggle RTL
const rtlEnabled = ref(false)
const toggleRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', unitPrice: 22, unitsInStock: 53, discontinued: false, category: 'Condiments' },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, unitsInStock: 0, discontinued: true, category: 'Condiments' },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, unitsInStock: 120, discontinued: false, category: 'Condiments' },
])

const toggleColumns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200, sortable: true, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true, filterable: true },
  { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
  { field: 'unitsInStock', title: 'Units In Stock', width: 130, sortable: true, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true, filterable: true },
]

const basicCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :rtl="true"
    :sortable="true"
    :filterable="true"
    :pageable="true"
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, category: 'Beverages' },
  // ... more rows
])

const columns: ColumnDef[] = [
  { field: 'productName', title: 'Product Name', width: 200, sortable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true },
  // ... more columns
]
&lt;/script&gt;`

const sortFilterCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :rtl="true"
    :sortable="true"
    :sortableMode="'multiple'"
    :filterable="true"
    :showFilterRow="true"
    :pageable="true"
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`

const groupCode = `&lt;template&gt;
  &lt;PantanalGrid
    :rows="rows"
    :columns="columns"
    :rtl="true"
    :group="group"
    :sortable="true"
    :pageable="true"
    key-field="productID"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns

const group = ref&lt;GroupDescriptor[]&gt;([
  { field: 'category', dir: 'asc' }
])
&lt;/script&gt;`

const toggleCode = `&lt;template&gt;
  &lt;div&gt;
    &lt;label&gt;
      &lt;input type="checkbox" v-model="rtlEnabled" /&gt;
      Enable RTL
    &lt;/label&gt;
    
    &lt;PantanalGrid
      :rows="rows"
      :columns="columns"
      :rtl="rtlEnabled"
      :sortable="true"
      :filterable="true"
      :pageable="true"
      key-field="productID"
    /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rtlEnabled = ref(false)
const rows = ref([...]) // Your data
const columns: ColumnDef[] = [...] // Your columns
&lt;/script&gt;`
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

