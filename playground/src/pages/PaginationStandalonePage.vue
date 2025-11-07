<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Pagination Component (Standalone)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-200">
        The Pagination component can be used independently without the Grid component. Perfect for custom data displays, lists, or any paginated content.
      </p>
    </header>

    <!-- Simple Variant -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Simple Variant</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Simple pagination with previous/next buttons, text labels, and icons.
      </p>
      
      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ simplePage }} / {{ Math.ceil(simpleTotal / simplePageSize) }}</p>
        <p class="text-sm">Showing items {{ (simplePage - 1) * simplePageSize + 1 }} to {{ Math.min(simplePage * simplePageSize, simpleTotal) }} of {{ simpleTotal }}</p>
      </div>

      <PantanalPagination
        :page="simplePage"
        :pageSize="simplePageSize"
        :total="simpleTotal"
        variant="simple"
        :showTotal="true"
        :showText="true"
        :showIcons="true"
        @update:page="simplePage = $event"
      />
      
      <ExampleCode :source="simplePaginationCode" />
    </article>

    <!-- Pages Variant -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Pages Variant</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Pagination with numbered page buttons. Perfect for navigating through multiple pages.
      </p>
      
      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ pagesPage }} / {{ Math.ceil(pagesTotal / pagesPageSize) }}</p>
        <div class="space-y-2">
          <div v-for="item in paginatedItems" :key="item.id" class="text-sm p-2 bg-white dark:bg-slate-700 rounded">
            Item {{ item.id }}: {{ item.name }}
          </div>
        </div>
      </div>

      <PantanalPagination
        :page="pagesPage"
        :pageSize="pagesPageSize"
        :total="pagesTotal"
        variant="pages"
        :maxPages="7"
        :showTotal="true"
        :showText="true"
        :showIcons="true"
        :showPageSize="true"
        :pageSizeOptions="[5, 10, 20, 50]"
        @update:page="pagesPage = $event"
        @update:pageSize="pagesPageSize = $event"
      />
      
      <ExampleCode :source="pagesPaginationCode" />
    </article>

    <!-- Edges Variant -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Edges Variant</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Pagination with first/last buttons and numbered pages. Best for large datasets.
      </p>
      
      <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p class="text-sm mb-2">Current page: {{ edgesPage }} / {{ Math.ceil(edgesTotal / edgesPageSize) }}</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div v-for="item in paginatedEdgesItems" :key="item.id" class="text-xs p-2 bg-white dark:bg-slate-700 rounded">
            #{{ item.id }}
          </div>
        </div>
      </div>

      <PantanalPagination
        :page="edgesPage"
        :pageSize="edgesPageSize"
        :total="edgesTotal"
        variant="edges"
        :maxPages="5"
        :showTotal="true"
        :showText="false"
        :showIcons="true"
        :showPageSize="true"
        @update:page="edgesPage = $event"
        @update:pageSize="edgesPageSize = $event"
      />
      
      <ExampleCode :source="edgesPaginationCode" />
    </article>

    <!-- Custom Content with Pagination -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Custom Content with Pagination</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Use Pagination with any custom content. Here's an example with cards.
      </p>
      
      <div class="mb-4 grid gap-3 md:grid-cols-3">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h4 class="font-semibold mb-2">{{ product.name }}</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Price: ${{ product.price.toFixed(2) }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Category: {{ product.category }}
          </p>
        </div>
      </div>

      <PantanalPagination
        :page="customPage"
        :pageSize="customPageSize"
        :total="customTotal"
        variant="pages"
        :maxPages="5"
        :showTotal="true"
        :showText="true"
        :showIcons="true"
        :showPageSize="true"
        @update:page="customPage = $event"
        @update:pageSize="customPageSize = $event"
      />
      
      <ExampleCode :source="customPaginationCode" />
    </article>

    <!-- Dense Variant -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Dense Variant</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Compact pagination for space-constrained layouts.
      </p>
      
      <PantanalPagination
        :page="densePage"
        :pageSize="densePageSize"
        :total="denseTotal"
        variant="pages"
        :maxPages="5"
        :showTotal="true"
        :showText="false"
        :showIcons="true"
        dense
        @update:page="densePage = $event"
      />
      
      <ExampleCode :source="densePaginationCode" />
    </article>

    <!-- Different Locales -->
    <article
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100">
      <h3 class="text-lg font-semibold mb-4">Internationalization</h3>
      <p class="text-sm text-slate-600 dark:text-slate-200 mb-4">
        Pagination supports multiple locales. Available: English, Spanish, and Portuguese.
      </p>
      
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium mb-2">English (en)</p>
          <PantanalPagination
            :page="localePage"
            :pageSize="localePageSize"
            :total="localeTotal"
            variant="simple"
            :showTotal="true"
            :showText="true"
            :showIcons="true"
            locale="en"
            @update:page="localePage = $event"
          />
        </div>
        
        <div>
          <p class="text-sm font-medium mb-2">Spanish (es)</p>
          <PantanalPagination
            :page="localePage"
            :pageSize="localePageSize"
            :total="localeTotal"
            variant="simple"
            :showTotal="true"
            :showText="true"
            :showIcons="true"
            locale="es"
            @update:page="localePage = $event"
          />
        </div>
        
        <div>
          <p class="text-sm font-medium mb-2">Portuguese (pt)</p>
          <PantanalPagination
            :page="localePage"
            :pageSize="localePageSize"
            :total="localeTotal"
            variant="simple"
            :showTotal="true"
            :showText="true"
            :showIcons="true"
            locale="pt"
            @update:page="localePage = $event"
          />
        </div>
      </div>
      
      <ExampleCode :source="localePaginationCode" />
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import simplePaginationCode from './PaginationStandalonePage.simple-code.vue?raw'
import pagesPaginationCode from './PaginationStandalonePage.pages-code.vue?raw'
import edgesPaginationCode from './PaginationStandalonePage.edges-code.vue?raw'
import customPaginationCode from './PaginationStandalonePage.custom-code.vue?raw'
import densePaginationCode from './PaginationStandalonePage.dense-code.vue?raw'
import localePaginationCode from './PaginationStandalonePage.locale-code.vue?raw'

type Item = { id: number; name: string }
type Product = { id: number; name: string; price: number; category: string }

// Simple Variant
const simplePage = ref(1)
const simplePageSize = ref(10)
const simpleTotal = ref(100)

// Pages Variant
const pagesPage = ref(1)
const pagesPageSize = ref(10)
const pagesTotal = ref(150)

const items = ref<Item[]>(
  Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }))
)

const paginatedItems = computed(() => {
  const start = (pagesPage.value - 1) * pagesPageSize.value
  return items.value.slice(start, start + pagesPageSize.value)
})

// Edges Variant
const edgesPage = ref(1)
const edgesPageSize = ref(12)
const edgesTotal = ref(120)

const edgesItems = ref<Item[]>(
  Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }))
)

const paginatedEdgesItems = computed(() => {
  const start = (edgesPage.value - 1) * edgesPageSize.value
  return edgesItems.value.slice(start, start + edgesPageSize.value)
})

// Custom Products
const customPage = ref(1)
const customPageSize = ref(9)
const customTotal = ref(45)

const products = ref<Product[]>(
  Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: +(Math.random() * 500).toFixed(2),
    category: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'][i % 5],
  }))
)

const paginatedProducts = computed(() => {
  const start = (customPage.value - 1) * customPageSize.value
  return products.value.slice(start, start + customPageSize.value)
})

// Dense Variant
const densePage = ref(1)
const densePageSize = ref(20)
const denseTotal = ref(200)

// Locale Examples
const localePage = ref(1)
const localePageSize = ref(10)
const localeTotal = ref(100)
</script>

