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
  type PivotResult
} from '@pantanal/grid'

const data = [
  { Region: 'North', Product: 'A', Sales: 1000 },
  { Region: 'North', Product: 'B', Sales: 1500 },
  { Region: 'South', Product: 'A', Sales: 1200 },
  { Region: 'South', Product: 'B', Sales: 1800 },
]

const schema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Region: { caption: 'All Regions' },
      Product: { caption: 'All Products' },
    },
    measures: {
      'Total Sales': { field: 'Sales', aggregate: 'sum' },
    },
  },
}

const columns = ref<PivotColumn[]>([
  { name: 'Region' },
])

const rows = ref<PivotRow[]>([
  { name: 'Product' },
])

const measures = ['Total Sales']

const pivotDataSource = ref<PivotDataSourceInstance | null>(null)

function handleChange(result: PivotResult) {
  console.log('Pivot data changed:', result)
}

// Update columns programmatically
async function updateColumns() {
  columns.value = [{ name: 'Product' }]
  rows.value = [{ name: 'Region' }]
  await pivotDataSource.value?.read()
}

// Get axes
function getAxes() {
  return pivotDataSource.value?.axes()
}

// Get measures
function getMeasures() {
  return pivotDataSource.value?.measures()
}
</script>

