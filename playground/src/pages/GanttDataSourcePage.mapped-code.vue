<template>
  <PantanalGanttDataSource
    ref="ganttDataSource"
    :data="tasks"
    :schema="schema"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns"
    key-field="id"
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
  type GanttDataSourceInstance
} from '@pantanal/grid'

const tasks = [
  {
    ID: 1,
    Title: 'Mapped Task 1',
    Start: '2024-01-01',
    End: '2024-01-10',
    ParentID: null,
    PercentComplete: 50,
  },
  {
    ID: 2,
    Title: 'Mapped Task 2',
    Start: '2024-01-11',
    End: '2024-01-20',
    ParentID: 1,
    PercentComplete: 30,
  },
]

const schema: GanttDataSourceSchema = {
  model: {
    id: 'id',
    fields: {
      id: { from: 'ID', type: 'number' },
      parentId: { from: 'ParentID', type: 'number', defaultValue: null },
      start: { from: 'Start', type: 'date' },
      end: { from: 'End', type: 'date' },
      title: { from: 'Title', type: 'string' },
      percentComplete: { from: 'PercentComplete', type: 'number', defaultValue: 0 },
      summary: { from: 'Summary', type: 'boolean', defaultValue: false },
      expanded: { from: 'Expanded', type: 'boolean', defaultValue: true },
    },
  },
}

const ganttDataSource = ref<GanttDataSourceInstance | null>(null)
const data = ref<GanttTask[]>([])

function handleChange(newData: GanttTask[]) {
  data.value = newData
}

const columns: ColumnDef<GanttTask>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'start', title: 'Start', width: 120 },
  { field: 'end', title: 'End', width: 120 },
  { field: 'percentComplete', title: 'Progress', width: 100 },
]
</script>

