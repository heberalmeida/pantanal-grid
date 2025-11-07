<template>
  <PantanalSchedulerDataSource
    :data="events"
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
  PantanalSchedulerDataSource, 
  type SchedulerEvent,
  type SchedulerDataSourceSchema
} from '@pantanal/grid'

const events = ref([
  {
    TaskID: 1,
    Title: 'Team Meeting',
    Start: '2024-01-17T10:00:00',
    End: '2024-01-17T11:00:00',
    OwnerID: 1,
    IsAllDay: false,
  },
])

const schema: SchedulerDataSourceSchema = {
  model: {
    taskId: { from: 'TaskID', type: 'number' },
    title: { from: 'Title', defaultValue: 'No title' },
    start: { from: 'Start', type: 'date' },
    end: { from: 'End', type: 'date' },
    ownerId: { from: 'OwnerID', type: 'number', defaultValue: 1 },
    isAllDay: { from: 'IsAllDay', type: 'boolean' },
  },
}

const data = ref<SchedulerEvent[]>([])

function handleChange(newData: SchedulerEvent[]) {
  data.value = newData
}
</script>

