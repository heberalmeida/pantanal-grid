<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Pageable Props</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports extensive pagination configuration through various <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageable</code> props. You can customize the pager appearance, behavior, and messages.
      </p>
    </header>

    <!-- Default Pagination -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Default Pagination</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        By default, the Grid displays pagination controls with previous/next buttons.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :height="400"
      />
      <ExampleCode :source="defaultCode" />
    </article>

    <!-- Always Visible -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Always Visible</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Control whether the pager is always visible using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageableAlwaysVisible</code>.
      </p>

      <PantanalGrid
        :rows="smallProducts"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :pageable-always-visible="true"
        :height="400"
      />
      <ExampleCode :source="alwaysVisibleCode" />
    </article>

    <!-- Previous/Next Buttons -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Previous/Next Buttons</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Show first/last page buttons using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageablePreviousNext</code>.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :pageable-previous-next="true"
        pagination-variant="edges"
        :height="400"
      />
      <ExampleCode :source="previousNextCode" />
    </article>

    <!-- Numeric Pager -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Numeric Pager</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Display numeric page buttons using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageableNumeric</code>.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :pageable-numeric="true"
        :pageable-button-count="5"
        :height="400"
      />
      <ExampleCode :source="numericCode" />
    </article>

    <!-- Page Input -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Page Input</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Allow users to type a page number using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageableInput</code>.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :pageable-input="true"
        pagination-variant="edges"
        :height="400"
      />
      <ExampleCode :source="inputCode" />
    </article>

    <!-- Refresh Button -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Refresh Button</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Display a refresh button using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageableRefresh</code>.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :pageable-refresh="true"
        @refresh="handleRefresh"
        :height="400"
      />
      <ExampleCode :source="refreshCode" />
    </article>

    <!-- Page Sizes -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Page Sizes</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize available page sizes using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageablePageSizes</code>.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="20"
        :pageable-page-sizes="[5, 10, 20, 50, 100]"
        :height="400"
      />
      <ExampleCode :source="pageSizesCode" />
    </article>

    <!-- Page Info -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Page Info</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Display pagination information using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">pageableInfo</code>.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :pageable-info="true"
        :messages="customMessages"
        :height="400"
      />
      <ExampleCode :source="infoCode" />
    </article>

    <!-- Custom Messages -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Messages</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize pagination messages using the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages</code> prop.
      </p>

      <PantanalGrid
        :rows="products"
        :columns="columns as any"
        key-field="productID"
        :page-size="10"
        :messages="customMessages"
        :height="400"
      />
      <ExampleCode :source="messagesCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product {
  productID: number
  productName: string
  category: string
  unitPrice: number
  unitsInStock: number
}

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const products = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39 },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17 },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13 },
  { productID: 4, productName: 'Chef Anton\'s Cajun Seasoning', category: 'Condiments', unitPrice: 22, unitsInStock: 53 },
  { productID: 5, productName: 'Chef Anton\'s Gumbo Mix', category: 'Condiments', unitPrice: 21.35, unitsInStock: 0 },
  { productID: 6, productName: 'Grandma\'s Boysenberry Spread', category: 'Condiments', unitPrice: 25, unitsInStock: 120 },
  { productID: 7, productName: 'Uncle Bob\'s Organic Dried Pears', category: 'Produce', unitPrice: 30, unitsInStock: 15 },
  { productID: 8, productName: 'Northwoods Cranberry Sauce', category: 'Condiments', unitPrice: 40, unitsInStock: 6 },
  { productID: 9, productName: 'Mishi Kobe Niku', category: 'Meat/Poultry', unitPrice: 97, unitsInStock: 29 },
  { productID: 10, productName: 'Ikura', category: 'Seafood', unitPrice: 31, unitsInStock: 31 },
  { productID: 11, productName: 'Queso Cabrales', category: 'Dairy Products', unitPrice: 21, unitsInStock: 22 },
  { productID: 12, productName: 'Queso Manchego La Pastora', category: 'Dairy Products', unitPrice: 38, unitsInStock: 86 },
  { productID: 13, productName: 'Konbu', category: 'Seafood', unitPrice: 6, unitsInStock: 24 },
  { productID: 14, productName: 'Tofu', category: 'Produce', unitPrice: 23.25, unitsInStock: 35 },
  { productID: 15, productName: 'Pavlova', category: 'Confections', unitPrice: 17.45, unitsInStock: 29 },
  { productID: 16, productName: 'Carnarvon Tigers', category: 'Seafood', unitPrice: 62.5, unitsInStock: 42 },
  { productID: 17, productName: 'Teatime Chocolate Biscuits', category: 'Confections', unitPrice: 9.2, unitsInStock: 25 },
  { productID: 18, productName: 'Marmalade', category: 'Confections', unitPrice: 81, unitsInStock: 40 },
  { productID: 19, productName: 'Scones', category: 'Confections', unitPrice: 10, unitsInStock: 3 },
  { productID: 20, productName: 'Beer', category: 'Beverages', unitPrice: 14, unitsInStock: 52 },
  { productID: 21, productName: 'Chocolate', category: 'Confections', unitPrice: 12.75, unitsInStock: 15 },
  { productID: 22, productName: 'Coffee', category: 'Beverages', unitPrice: 16, unitsInStock: 17 },
  { productID: 23, productName: 'Tea', category: 'Beverages', unitPrice: 18, unitsInStock: 39 },
  { productID: 24, productName: 'Milk', category: 'Dairy Products', unitPrice: 19, unitsInStock: 17 },
  { productID: 25, productName: 'Butter', category: 'Dairy Products', unitPrice: 20, unitsInStock: 27 },
])

const smallProducts = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39 },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17 },
])

const customMessages = {
  pageableDisplay: 'Displaying {0}-{1} of {2} items',
  pageableEmpty: 'No items to display',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'Items per page',
  pageableFirst: 'First',
  pageableLast: 'Last',
  pageableNext: 'Next',
  pageablePrevious: 'Previous',
  pageableRefresh: 'Refresh',
  pageableMorePages: 'More pages',
}

function handleRefresh() {
  console.log('Refresh clicked')
  // In a real application, you would reload data here
}

const defaultCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :height="400"
/>`

const alwaysVisibleCode = `<PantanalGrid
  :rows="smallProducts"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :pageable-always-visible="true"
  :height="400"
/>`

const previousNextCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :pageable-previous-next="true"
  pagination-variant="edges"
  :height="400"
/>`

const numericCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :pageable-numeric="true"
  :pageable-button-count="5"
  :height="400"
/>`

const inputCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :pageable-input="true"
  pagination-variant="edges"
  :height="400"
/>`

const refreshCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :pageable-refresh="true"
  @refresh="handleRefresh"
  :height="400"
/>`

const pageSizesCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="20"
  :pageable-page-sizes="[5, 10, 20, 50, 100]"
  :height="400"
/>`

const infoCode = `<PantanalGrid
  :rows="products"
  :columns="columns"
  key-field="productID"
  :page-size="10"
  :pageable-info="true"
  :messages="customMessages"
  :height="400"
/>`

const messagesCode = `<script setup lang="ts">
const customMessages = {
  pageableDisplay: 'Displaying {0}-{1} of {2} items',
  pageableEmpty: 'No items to display',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'Items per page',
  pageableFirst: 'First',
  pageableLast: 'Last',
  pageableNext: 'Next',
  pageablePrevious: 'Previous',
  pageableRefresh: 'Refresh',
  pageableMorePages: 'More pages',
}
</` + `script>

<template>
  <PantanalGrid
    :rows="products"
    :columns="columns"
    key-field="productID"
    :page-size="10"
    :messages="customMessages"
    :height="400"
  />
</template>`
</script>

