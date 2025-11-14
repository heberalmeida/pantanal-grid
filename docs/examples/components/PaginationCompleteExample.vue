<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const allRows = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3]
}))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' }
]

// Simple Variant
const simplePage = ref(1)
const simplePageSize = ref(10)

// Pages Variant (Numeric)
const pagesPage = ref(1)
const pagesPageSize = ref(10)

// Edges Variant
const edgesPage = ref(1)
const edgesPageSize = ref(10)

// With Page Input
const inputPage = ref(1)
const inputPageSize = ref(10)
</script>

<template>
  <div class="space-y-8">
    <!-- Simple Variant -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Simple Variant</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Default pagination style with previous/next buttons and page size selector.
      </p>
      <PantanalGrid
        :rows="allRows"
        :columns="columns"
        key-field="id"
        v-model:page="simplePage"
        v-model:pageSize="simplePageSize"
        pagination-variant="simple"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Pages Variant (Numeric) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Pages Variant (Numeric)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Shows numeric page buttons with ellipsis for large page counts.
      </p>
      <PantanalGrid
        :rows="allRows"
        :columns="columns"
        key-field="id"
        v-model:page="pagesPage"
        v-model:pageSize="pagesPageSize"
        pagination-variant="pages"
        :pageable-numeric="true"
        :pageable-button-count="5"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Edges Variant -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Edges Variant</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Shows first/last page buttons along with previous/next.
      </p>
      <PantanalGrid
        :rows="allRows"
        :columns="columns"
        key-field="id"
        v-model:page="edgesPage"
        v-model:pageSize="edgesPageSize"
        pagination-variant="edges"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With Page Input -->
    <div>
      <h3 class="text-lg font-semibold mb-2">With Page Input</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Allow users to type page number directly.
      </p>
      <PantanalGrid
        :rows="allRows"
        :columns="columns"
        key-field="id"
        v-model:page="inputPage"
        v-model:pageSize="inputPageSize"
        :pageable-input="true"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
</style>







