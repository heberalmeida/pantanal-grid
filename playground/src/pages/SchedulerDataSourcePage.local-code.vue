<template>
  <PantanalSchedulerDataSource
    :data="events"
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
import { PantanalGrid, PantanalSchedulerDataSource, type SchedulerEvent } from '@pantanal/grid'

const events = ref<SchedulerEvent[]>([
  {
    taskId: 1,
    id: 1,
    title: 'Meeting',
    start: new Date('2024-01-15T09:00:00'),
    end: new Date('2024-01-15T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  },
])

const data = ref<SchedulerEvent[]>([])

function handleChange(newData: SchedulerEvent[]) {
  data.value = newData
}
</script>

