<template>
  <PantanalPivotDataSource
    ref="pivotDataSource"
    type="local"
    :data="data"
    :schema="schema"
    :columns="columns"
    :rows="rows"
    :measures="measures"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalPivotDataSource,
  type PivotDataSourceInstance,
  type PivotDataSourceSchema,
  type PivotColumn,
  type PivotRow,
  type PivotMeasure,
  type PivotResult
} from '@pantanal/grid'

const data = [
  { Category: 'Electronics', Product: 'Laptop', Year: 2023, Sales: 15000, Quantity: 50 },
  { Category: 'Electronics', Product: 'Phone', Year: 2023, Sales: 12000, Quantity: 80 },
  { Category: 'Clothing', Product: 'Shirt', Year: 2023, Sales: 5000, Quantity: 200 },
]

const schema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Category: { caption: 'All Categories' },
      Product: { caption: 'All Products' },
      Year: { caption: 'All Years' },
    },
    measures: {
      'Total Sales': { field: 'Sales', aggregate: 'sum', format: 'currency' },
      'Total Quantity': { field: 'Quantity', aggregate: 'sum' },
    },
  },
}

const columns: PivotColumn[] = [
  { name: 'Year' },
]

const rows: PivotRow[] = [
  { name: 'Category' },
  { name: 'Product' },
]

const measures: string[] = ['Total Sales', 'Total Quantity']

const pivotDataSource = ref<PivotDataSourceInstance | null>(null)

function handleChange(result: PivotResult) {
  console.log('Pivot data changed:', result)
}
</script>

