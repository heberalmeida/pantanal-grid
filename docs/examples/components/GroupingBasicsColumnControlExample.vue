<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    ProductID: 1,
    ProductName: 'Chai',
    UnitPrice: 18,
    UnitsInStock: 39,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 4,
    ProductName: 'Chef Anton',
    UnitPrice: 22,
    UnitsInStock: 53,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 5,
    ProductName: 'Chef Gumbo Mix',
    UnitPrice: 21.35,
    UnitsInStock: 0,
    Discontinued: true,
    Category: 'Dairy Products'
  },
  {
    ProductID: 6,
    ProductName: 'Boysenberry Spread',
    UnitPrice: 25,
    UnitsInStock: 120,
    Discontinued: false,
    Category: 'Condiments'
  }
])

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}`, groupable: false }, // Cannot be grouped
  { field: 'Category', title: 'Category', width: 180 },
  { field: 'Discontinued', title: 'Discontinued', width: 120 }
]
</script>

<template>
  <div class="grouping-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Notice that "Unit Price" column cannot be dragged to the drop zone because it has <code>groupable: false</code>.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      groupable
      key-field="ProductID"
      locale="en"
      :height="350"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.grouping-example {
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

code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.dark code {
  background-color: #374151;
}
</style>

