<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'ProductID', title: 'ID', width: 80 },
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'UnitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'Discontinued', width: 120 },
]

onMounted(() => {
  rows.value = [
    { ProductID: 1, ProductName: 'Chai', UnitPrice: 18, UnitsInStock: 39, Discontinued: false },
    { ProductID: 2, ProductName: 'Chang', UnitPrice: 17, UnitsInStock: 40, Discontinued: false },
    { ProductID: 3, ProductName: 'Aniseed Syrup', UnitPrice: 10, UnitsInStock: 13, Discontinued: false },
    { ProductID: 4, ProductName: 'Chef Anton', UnitPrice: 22, UnitsInStock: 53, Discontinued: false },
    { ProductID: 5, ProductName: 'Chef Gumbo Mix', UnitPrice: 21.35, UnitsInStock: 0, Discontinued: true },
    { ProductID: 6, ProductName: 'Boysenberry Spread', UnitPrice: 25, UnitsInStock: 120, Discontinued: false },
  ]
})
</script>

<template>
  <div class="data-binding-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Simple example with local data array. All operations (sorting, filtering, pagination) are performed client-side.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="ProductID"
      locale="en"
      :height="350"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.data-binding-example {
  padding: 1rem;
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

.mb-4 {
  margin-bottom: 1rem;
}
</style>


