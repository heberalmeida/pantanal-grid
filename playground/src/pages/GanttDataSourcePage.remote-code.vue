<template>
  <PantanalGanttDataSource
    ref="ganttDataSource"
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
  PantanalGanttDataSource,
  type ColumnDef,
  type GanttTask,
  type GanttDataSourceSchema,
  type GanttDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async () => {
    const res = await fetch('https://api.example.com/gantt/tasks')
    return res.json()
  },
}

const schema: GanttDataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

const ganttDataSource = ref<GanttDataSourceInstance | null>(null)
const data = ref<GanttTask[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

function handleChange(newData: GanttTask[]) {
  data.value = newData
  if (ganttDataSource.value) {
    total.value = ganttDataSource.value.total()
  }
}

const columns: ColumnDef<GanttTask>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'start', title: 'Start', width: 120 },
  { field: 'end', title: 'End', width: 120 },
  { field: 'percentComplete', title: 'Progress', width: 100 },
]
</script>

