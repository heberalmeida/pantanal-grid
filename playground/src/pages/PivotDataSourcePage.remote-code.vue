<template>
  <PantanalPivotDataSource
    ref="pivotDataSource"
    type="odata"
    :transport="transport"
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
  type PivotDataSourceTransport,
  type PivotColumn,
  type PivotRow,
  type PivotResult
} from '@pantanal/grid'

const transport: PivotDataSourceTransport = {
  read: async (options: any) => {
    const res = await fetch('https://api.example.com/pivot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        columns: options.columns,
        rows: options.rows,
        measures: options.measures,
      }),
    })
    return res.json()
  },
}

const schema: PivotDataSourceSchema = {
  data: (response: any) => response,
}

const columns: PivotColumn[] = [
  { name: 'Year' },
]

const rows: PivotRow[] = [
  { name: 'ContactTitle' },
]

const measures = ['Count']

const pivotDataSource = ref<PivotDataSourceInstance | null>(null)

function handleChange(result: PivotResult) {
  console.log('Pivot data changed:', result)
}
</script>

