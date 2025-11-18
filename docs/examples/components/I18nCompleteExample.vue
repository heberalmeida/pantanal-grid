<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
  { field: 'price', title: 'Price', width: 120, sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150, filterable: true },
  { field: 'stock', title: 'Stock', width: 100, sortable: true },
]

// English
const localeEn = ref('en')

// Spanish
const localeEs = ref('es')

// Portuguese
const localePt = ref('pt')

// Custom Messages
const customMessages = ref({
  noRecords: 'No hay datos disponibles',
  filter: 'Filtrar',
  clear: 'Limpiar',
  page: 'Página',
  of: 'de',
  itemsPerPage: 'Elementos por página',
  first: 'Primero',
  previous: 'Anterior',
  next: 'Siguiente',
  last: 'Último',
})
</script>

<template>
  <div class="space-y-8">
    <!-- English (en) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">English (en)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Default English locale. All UI text is displayed in English.
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        locale="en"
        :pageable="true"
        :show-filter-row="true"
        :height="300"
        responsive="table"
      />
    </div>

    <!-- Spanish (es) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Spanish (es)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Spanish locale. All UI text is displayed in Spanish (página, siguiente, anterior, etc.).
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        locale="es"
        :pageable="true"
        :show-filter-row="true"
        :height="300"
        responsive="table"
      />
    </div>

    <!-- Portuguese (pt) -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Portuguese (pt)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Portuguese locale. All UI text is displayed in Portuguese (página, próximo, anterior, etc.).
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        locale="pt"
        :pageable="true"
        :show-filter-row="true"
        :height="300"
        responsive="table"
      />
    </div>

    <!-- Custom Messages -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Messages</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Override default messages by providing a custom <code>messages</code> object. You can customize any UI text.
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        :messages="customMessages"
        :pageable="true"
        :show-filter-row="true"
        :height="300"
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
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>








