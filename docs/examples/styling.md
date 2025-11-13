# Styling

Demonstrates custom styling and theming options.

<ExamplePreview>
  <StylingCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import StylingCompleteExample from './components/StylingCompleteExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' }
]
</script>

<template>
  <div class="custom-grid-container">
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
      density="compact"
      locale="en"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.custom-grid-container {
  padding: 1rem;
}

:deep(.v3grid) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v3grid__headercell) {
  background: #f3f4f6;
  font-weight: 600;
}

:deep(.v3grid__row:hover) {
  background: #f9fafb;
}
</style>
```

## Features

- Striped rows
- Compact density
- Custom CSS styling
- Hover effects

