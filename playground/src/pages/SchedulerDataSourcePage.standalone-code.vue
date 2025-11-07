<template>
  <PantanalSchedulerDataSource
    ref="schedulerDataSource"
    :data="events"
    @change="handleChange"
    @update:data="handleUpdateData"
  />
  
  <button @click="addEvent">Add Event</button>
  <button @click="removeEvent">Remove Last Event</button>
  
  <div>
    <p>Events: {{ data.length }}</p>
    <ul>
      <li v-for="event in data" :key="event.id || event.taskId">
        {{ event.title }} ({{ formatDate(event.start) }} - {{ formatDate(event.end) }})
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalSchedulerDataSource, 
  type SchedulerEvent,
  type SchedulerDataSourceInstance
} from '@pantanal/grid'

const schedulerDataSource = ref<SchedulerDataSourceInstance | null>(null)
const events = ref<SchedulerEvent[]>([
  {
    taskId: 1,
    id: 1,
    title: 'Event 1',
    start: new Date('2024-02-01T09:00:00'),
    end: new Date('2024-02-01T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  },
])

const data = ref<SchedulerEvent[]>([])

function handleChange(newData: SchedulerEvent[]) {
  data.value = newData
}

function handleUpdateData(newData: SchedulerEvent[]) {
  events.value = newData
}

function addEvent() {
  if (!schedulerDataSource.value) return
  
  const newEvent: Partial<SchedulerEvent> = {
    title: `Event ${events.value.length + 1}`,
    start: new Date('2024-02-01T09:00:00'),
    end: new Date('2024-02-01T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  }
  
  schedulerDataSource.value.add(newEvent)
}

function removeEvent() {
  if (!schedulerDataSource.value || data.value.length === 0) return
  
  const lastEvent = data.value[data.value.length - 1]
  const eventId = lastEvent.taskId || lastEvent.id
  if (eventId) {
    schedulerDataSource.value.remove(eventId)
  }
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString()
}
</script>

