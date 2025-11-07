<template>
  <PantanalGanttDependencyDataSource
    ref="dependencyDataSource"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns"
    key-field="id"
    server-side
    :total="total"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGrid, 
  PantanalGanttDependencyDataSource,
  type ColumnDef,
  type GanttDependency,
  type GanttDependencyDataSourceSchema,
  type GanttDependencyDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async () => {
    const res = await fetch('https://api.example.com/gantt/dependencies')
    return res.json()
  },
}

const schema: GanttDependencyDataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

const dependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const data = ref<GanttDependency[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

function handleChange(newData: GanttDependency[]) {
  data.value = newData
  if (dependencyDataSource.value) {
    total.value = dependencyDataSource.value.total()
  }
}

const columns: ColumnDef<GanttDependency>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'predecessorId', title: 'Predecessor ID', width: 140 },
  { field: 'successorId', title: 'Successor ID', width: 140 },
  { field: 'type', title: 'Type', width: 100 },
]
</script>

