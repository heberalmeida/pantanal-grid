<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

// Basic aggregates
const basicRows = ref([
  { id: 1, name: 'Product A', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, stock: 75 }
])

const basicColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const basicAggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}

// Group footers with aggregates
const groupRows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Clothing', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', category: 'Clothing', price: 39.99, stock: 75 }
])

const groupColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

const groupAggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}

// Custom templates
const customRows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Clothing', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', category: 'Clothing', price: 39.99, stock: 75 }
])

const customColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    format: (v: number) => `$${v.toFixed(2)}`,
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        const sum = priceAgg.sum ?? 0
        const avg = priceAgg.avg ?? 0
        return `<strong style="color: #3b82f6;">Total: $${sum.toFixed(2)} | Avg: $${avg.toFixed(2)}</strong>`
      }
      return ''
    }
  },
  { 
    field: 'stock', 
    title: 'Stock',
    aggregates: ['sum', 'min', 'max'],
    groupFooterTemplate: (group) => {
      const stockAgg = group.aggregates?.stock
      if (stockAgg) {
        return `Sum: ${stockAgg.sum} | Min: ${stockAgg.min} | Max: ${stockAgg.max}`
      }
      return ''
    }
  }
]

const customAggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum', 'min', 'max']
}

// All aggregate types - only sum in table
const allAggRows = ref([
  { id: 1, name: 'Product A', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, stock: 75 }
])

const allAggColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const allAggSumOnly: Record<string, AggregateName[]> = {
  price: ['sum'],
  stock: ['sum'],
  id: ['count']
}

// Translated example
const translatedRows = ref([
  { id: 1, name: 'Produto A', price: 99.99, stock: 50 },
  { id: 2, name: 'Produto B', price: 49.99, stock: 100 },
  { id: 3, name: 'Produto C', price: 19.99, stock: 25 },
  { id: 4, name: 'Produto D', price: 79.99, stock: 75 }
])

const translatedColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Nome' },
  { field: 'price', title: 'Preço', format: (v: number) => `R$ ${v.toFixed(2)}` },
  { field: 'stock', title: 'Estoque' }
]

const translatedAggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Aggregates -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Aggregates</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Calculate sum, average, and count for numeric fields.
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="id"
        :aggregates="basicAggregates"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Group Footers with Aggregates -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Group Footers with Aggregates</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Display aggregates in group footer rows when using grouping.
      </p>
      <PantanalGrid
        :rows="groupRows"
        :columns="groupColumns"
        key-field="id"
        :group="group"
        :aggregates="groupAggregates"
        :show-group-footers="true"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom Group Footer Templates -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Group Footer Templates</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Customize how aggregates are displayed using templates.
      </p>
      <PantanalGrid
        :rows="customRows"
        :columns="customColumns"
        key-field="id"
        :group="group"
        :aggregates="customAggregates"
        :show-group-footers="true"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- All Aggregate Types -->
    <div>
      <h3 class="text-lg font-semibold mb-2">All Aggregate Types</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing only Sum in the table footer. Other aggregates can be displayed outside the table.
      </p>
      <PantanalGrid
        :rows="allAggRows"
        :columns="allAggColumns"
        key-field="id"
        :aggregates="allAggSumOnly"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Translated Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Exemplo Traduzido (Português)</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Labels dos aggregates traduzidos automaticamente conforme o locale.
      </p>
      <PantanalGrid
        :rows="translatedRows"
        :columns="translatedColumns"
        key-field="id"
        :aggregates="translatedAggregates"
        locale="pt"
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

