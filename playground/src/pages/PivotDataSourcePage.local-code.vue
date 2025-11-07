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
  { Country: 'USA', CompanyName: 'Company A', ContactTitle: 'Manager', CustomerID: 1 },
  { Country: 'USA', CompanyName: 'Company B', ContactTitle: 'Manager', CustomerID: 2 },
  { Country: 'UK', CompanyName: 'Company C', ContactTitle: 'Director', CustomerID: 3 },
]

const schema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Country: { caption: 'All Countries' },
      CompanyName: { caption: 'All Companies' },
      ContactTitle: { caption: 'All Titles' },
    },
    measures: {
      'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
    },
  },
}

const columns: PivotColumn[] = [
  { name: 'Country', expand: true },
]

const rows: PivotRow[] = [
  { name: 'ContactTitle' },
]

const measures = ['Contacts Count']

const pivotDataSource = ref<PivotDataSourceInstance | null>(null)

function handleChange(result: PivotResult) {
  console.log('Pivot data changed:', result)
}
</script>

