<template>
  <PantanalGanttDataSource
    ref="ganttDataSource"
    :data="tasks"
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
  type GanttDataSourceInstance
} from '@pantanal/grid'

const tasks: GanttTask[] = [
  {
    id: 1,
    title: 'Project Planning',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-15'),
    percentComplete: 100,
    parentId: null,
  },
  {
    id: 2,
    title: 'Design Phase',
    start: new Date('2024-01-16'),
    end: new Date('2024-02-15'),
    percentComplete: 75,
    parentId: null,
  },
]

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

