<template>
  <PantanalGanttDependencyDataSource
    ref="dependencyDataSource"
    :data="dependencies"
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
  PantanalGanttDependencyDataSource,
  type ColumnDef,
  type GanttDependency,
  type GanttDependencyDataSourceSchema,
  type GanttDependencyDataSourceInstance
} from '@pantanal/grid'

const dependencies = [
  {
    ID: 1,
    PredecessorID: 1,
    SuccessorID: 2,
    Type: 0,
  },
  {
    ID: 2,
    PredecessorID: 2,
    SuccessorID: 3,
    Type: 1,
  },
]

const schema: GanttDependencyDataSourceSchema = {
  model: {
    id: 'id',
    fields: {
      id: { from: 'ID', type: 'number' },
      predecessorId: { from: 'PredecessorID', type: 'number' },
      successorId: { from: 'SuccessorID', type: 'number' },
      type: { from: 'Type', type: 'number', defaultValue: 0 },
    },
  },
}

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

