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
  },
  {
    ProductID: 7,
    ProductName: 'Alice Mutton',
    UnitPrice: 39,
    UnitsInStock: 0,
    Discontinued: true,
    Category: 'Meat/Poultry'
  },
  {
    ProductID: 8,
    ProductName: 'Aniseed Syrup',
    UnitPrice: 10,
    UnitsInStock: 13,
    Discontinued: false,
    Category: 'Condiments'
  }
])

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'Category', title: 'Category', width: 180 },
  { field: 'Discontinued', title: 'Discontinued', width: 120 }
]
</script>

<template>
  <div class="grouping-basics-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Drag column headers to the drop zone above the grid to group by that column.
      You can group by multiple columns and reorder groups by dragging the badges.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      groupable
      key-field="ProductID"
      locale="en"
      :height="400"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.grouping-basics-example {
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

