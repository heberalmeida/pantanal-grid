<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Aggregates</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Display aggregate calculations (sum, avg, min, max, count) in group footers or column footers.
    </p>
    
    <div class="space-y-6">
      <!-- Basic Aggregates -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Basic Aggregates</h3>
        <PantanalGrid
          :rows="basicRows"
          :columns="basicColumns"
          key-field="id"
          :aggregates="basicAggregates"
          locale="en"
        />
        <ExampleCode :source="basicCode" />
      </div>

      <!-- Group Footers with Aggregates -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Group Footers with Aggregates</h3>
        <PantanalGrid
          :rows="groupRows"
          :columns="groupColumns"
          key-field="id"
          :group="group"
          :aggregates="groupAggregates"
          :show-group-footers="true"
          locale="en"
        />
        <ExampleCode :source="groupCode" />
      </div>

      <!-- Custom Templates -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Custom Group Footer Templates</h3>
        <PantanalGrid
          :rows="customRows"
          :columns="customColumns"
          key-field="id"
          :group="group"
          :aggregates="customAggregates"
          :show-group-footers="true"
          locale="en"
        />
        <ExampleCode :source="customCode" />
      </div>

      <!-- All Aggregate Types -->
      <div>
        <h3 class="text-lg font-semibold mb-2">All Aggregate Types</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Showing only Sum in the table footer. Other aggregates displayed below.
        </p>
        <PantanalGrid
          :rows="allAggRows"
          :columns="allAggColumns"
          key-field="id"
          :aggregates="allAggSumOnly"
          locale="en"
        />
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 class="font-semibold mb-2">All Calculated Aggregates:</h4>
          <div class="text-sm space-y-1">
            <div><strong>Price:</strong> {{ allAggResults.price }}</div>
            <div><strong>Stock:</strong> {{ allAggResults.stock }}</div>
            <div><strong>ID:</strong> {{ allAggResults.id }}</div>
          </div>
        </div>
        <ExampleCode :source="allAggCode" />
      </div>

      <!-- Translated Example -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Exemplo Traduzido (Português)</h3>
        <PantanalGrid
          :rows="translatedRows"
          :columns="translatedColumns"
          key-field="id"
          :aggregates="translatedAggregates"
          locale="pt"
        />
        <ExampleCode :source="translatedCode" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

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

// Group footers
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
const customRows = ref([...groupRows.value])
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
const allAggRows = ref([...basicRows.value])
const allAggColumns: ColumnDef[] = [...basicColumns]
const allAggSumOnly: Record<string, AggregateName[]> = {
  price: ['sum'],
  stock: ['sum'],
  id: ['count']
}

// Calculate all aggregates for display outside table
const allAggResults = computed(() => {
  // Manual calculation since computeAggregates is not exported
  const rows = allAggRows.value as any[]
  const priceValues = rows.map(r => r.price).filter(v => v != null) as number[]
  const stockValues = rows.map(r => r.stock).filter(v => v != null) as number[]
  
  const priceSum = priceValues.reduce((a, b) => a + b, 0)
  const priceAvg = priceValues.length ? priceSum / priceValues.length : 0
  const priceMin = priceValues.length ? Math.min(...priceValues) : 0
  const priceMax = priceValues.length ? Math.max(...priceValues) : 0
  
  const stockSum = stockValues.reduce((a, b) => a + b, 0)
  const stockAvg = stockValues.length ? stockSum / stockValues.length : 0
  const stockMin = stockValues.length ? Math.min(...stockValues) : 0
  const stockMax = stockValues.length ? Math.max(...stockValues) : 0
  const stockCount = stockValues.length
  
  return {
    price: `Sum: ${priceSum.toFixed(2)}, Average: ${priceAvg.toFixed(2)}, Min: ${priceMin.toFixed(2)}, Max: ${priceMax.toFixed(2)}`,
    stock: `Sum: ${stockSum}, Average: ${stockAvg.toFixed(1)}, Min: ${stockMin}, Max: ${stockMax}, Count: ${stockCount}`,
    id: `Count: ${rows.length}`
  }
})

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

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => \`$\${v.toFixed(2)}\` },
  { field: 'stock', title: 'Stock' }
]

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :aggregates="aggregates"
    locale="en"
  />
<\/template>`

const groupCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Clothing', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', category: 'Clothing', price: 39.99, stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { field: 'price', title: 'Price', format: (v: number) => \`$\${v.toFixed(2)}\` },
  { field: 'stock', title: 'Stock' }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
    locale="en"
  />
<\/template>`

const customCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Clothing', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', category: 'Clothing', price: 39.99, stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    format: (v: number) => \`$\${v.toFixed(2)}\`,
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        const sum = priceAgg.sum ?? 0
        const avg = priceAgg.avg ?? 0
        return \`<strong style="color: #3b82f6;">Total: $\${sum.toFixed(2)} | Avg: $\${avg.toFixed(2)}</strong>\`
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
        return \`Sum: \${stockAgg.sum} | Min: \${stockAgg.min} | Max: \${stockAgg.max}\`
      }
      return ''
    }
  }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum', 'min', 'max']
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
    locale="en"
  />
<\/template>`

const allAggCode = `<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type ColumnDef, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => \`$\${v.toFixed(2)}\` },
  { field: 'stock', title: 'Stock' }
]

// Only sum in table
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum'],
  stock: ['sum'],
  id: ['count']
}

// Calculate all aggregates for display outside table
const allAggResults = computed(() => {
  const priceValues = rows.value.map(r => r.price).filter(v => v != null) as number[]
  const stockValues = rows.value.map(r => r.stock).filter(v => v != null) as number[]
  
  const priceSum = priceValues.reduce((a, b) => a + b, 0)
  const priceAvg = priceValues.length ? priceSum / priceValues.length : 0
  const priceMin = priceValues.length ? Math.min(...priceValues) : 0
  const priceMax = priceValues.length ? Math.max(...priceValues) : 0
  
  const stockSum = stockValues.reduce((a, b) => a + b, 0)
  const stockAvg = stockValues.length ? stockSum / stockValues.length : 0
  const stockMin = stockValues.length ? Math.min(...stockValues) : 0
  const stockMax = stockValues.length ? Math.max(...stockValues) : 0
  const stockCount = stockValues.length
  
  return {
    price: \`Sum: \${priceSum.toFixed(2)}, Average: \${priceAvg.toFixed(2)}, Min: \${priceMin.toFixed(2)}, Max: \${priceMax.toFixed(2)}\`,
    stock: \`Sum: \${stockSum}, Average: \${stockAvg.toFixed(1)}, Min: \${stockMin}, Max: \${stockMax}, Count: \${stockCount}\`,
    id: \`Count: \${rows.value.length}\`
  }
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :aggregates="aggregates"
    locale="en"
  />
  <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <h4 class="font-semibold mb-2">All Calculated Aggregates:</h4>
    <div class="text-sm space-y-1">
      <div><strong>Price:</strong> {{ allAggResults.price }}</div>
      <div><strong>Stock:</strong> {{ allAggResults.stock }}</div>
      <div><strong>ID:</strong> {{ allAggResults.id }}</div>
    </div>
  </div>
<\/template>`

const translatedCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Produto A', price: 99.99, stock: 50 },
  { id: 2, name: 'Produto B', price: 49.99, stock: 100 },
  { id: 3, name: 'Produto C', price: 19.99, stock: 25 },
  { id: 4, name: 'Produto D', price: 79.99, stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Nome' },
  { field: 'price', title: 'Preço', format: (v: number) => \`R$ \${v.toFixed(2)}\` },
  { field: 'stock', title: 'Estoque' }
]

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :aggregates="aggregates"
    locale="pt"
  />
<\/template>`
</script>

<style scoped>
.space-y-3 > * + * {
  margin-top: 0.75rem;
}
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
.text-xl {
  font-size: 1.25rem;
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

