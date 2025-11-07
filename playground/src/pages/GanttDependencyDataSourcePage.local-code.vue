<template>
  <PantanalGanttDependencyDataSource
    ref="dependencyDataSource"
    :data="dependencies"
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
  PantanalGanttDependencyDataSource,
  type ColumnDef,
  type GanttDependency,
  type GanttDependencyDataSourceInstance
} from '@pantanal/grid'

const dependencies: GanttDependency[] = [
  {
    id: 1,
    predecessorId: 1,
    successorId: 2,
    type: 0,
  },
  {
    id: 2,
    predecessorId: 2,
    successorId: 3,
    type: 0,
  },
]

const dependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const data = ref<GanttDependency[]>([])

function handleChange(newData: GanttDependency[]) {
  data.value = newData
}

const columns: ColumnDef<GanttDependency>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'predecessorId', title: 'Predecessor ID', width: 140 },
  { field: 'successorId', title: 'Successor ID', width: 140 },
  { field: 'type', title: 'Type', width: 100 },
]
</script>

