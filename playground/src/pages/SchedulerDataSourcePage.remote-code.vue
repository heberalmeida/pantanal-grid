<template>
  <PantanalSchedulerDataSource
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
    :columns="columns as any"
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
  PantanalSchedulerDataSource, 
  type SchedulerEvent,
  type SchedulerDataSourceSchema,
  type DataSourceTransport
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async (options) => {
    const response = await fetch('/api/scheduler-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: options.page,
        pageSize: options.pageSize,
      }),
    })
    return response.json()
  },
}

const schema: SchedulerDataSourceSchema = {
  model: {
    taskId: { from: 'taskId', type: 'number' },
    title: { from: 'title', defaultValue: 'No title' },
    start: { from: 'start', type: 'date' },
    end: { from: 'end', type: 'date' },
    ownerId: { from: 'ownerId', type: 'number' },
    isAllDay: { from: 'isAllDay', type: 'boolean' },
  },
  data: (response: any) => response.data || response,
  total: (response: any) => response.total || 0,
}

const data = ref<SchedulerEvent[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function handleChange(newData: SchedulerEvent[]) {
  data.value = newData
}

const columns: any[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'start', title: 'Start', width: 150 },
  { field: 'end', title: 'End', width: 150 },
]
</script>

