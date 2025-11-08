<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">SchedulerDataSource</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The SchedulerDataSource extends the DataSource component and provides specialized support for Scheduler event data structures.
        It includes field mapping, date handling, timezone support, and recurrence support.
      </p>
    </header>

    <!-- Local SchedulerDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Local SchedulerDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use SchedulerDataSource with local data. Events are automatically normalized to ensure proper structure.
      </p>

      <PantanalSchedulerDataSource
        ref="localSchedulerDataSource"
        :data="localEvents"
        @change="handleLocalChange"
      />
      <PantanalGrid
        :rows="localData"
        :columns="schedulerColumns as any"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="localCode" />
    </article>

    <!-- SchedulerDataSource with Model Mapping Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">SchedulerDataSource with Model Field Mapping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Map fields from different data structures using the schema model configuration.
      </p>

      <PantanalSchedulerDataSource
        ref="mappedSchedulerDataSource"
        :data="mappedEvents as any"
        :schema="mappedSchema"
        @change="handleMappedChange"
      />
      <PantanalGrid
        :rows="mappedData"
        :columns="schedulerColumns as any"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="mappedCode" />
    </article>

    <!-- Remote SchedulerDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Remote SchedulerDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Connect to a remote API endpoint for Scheduler events. The component handles field mapping automatically.
      </p>

      <PantanalSchedulerDataSource
        ref="remoteSchedulerDataSource"
        type="remote"
        :transport="remoteTransport"
        :schema="remoteSchema"
        :server-paging="true"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
        @change="handleRemoteChange"
      />
      <PantanalGrid
        :rows="remoteData"
        :columns="schedulerColumns as any"
        key-field="id"
        :striped="true"
        server-side
        :total="remoteTotal"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
      />
      <ExampleCode :source="remoteCode" />
    </article>

    <!-- Standalone SchedulerDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Standalone SchedulerDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use SchedulerDataSource independently to manage event data with programmatic access.
      </p>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="addEvent"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Event
          </button>
          <button
            @click="removeEvent"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="standaloneData.length === 0"
          >
            Remove Last Event
          </button>
        </div>
        <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">Events ({{ standaloneData.length }}):</p>
          <ul class="space-y-1 text-sm">
            <li v-for="event in standaloneData" :key="event.id || event.taskId">
              {{ event.title }} ({{ formatDate(event.start) }} - {{ formatDate(event.end) }})
            </li>
          </ul>
        </div>
      </div>

      <PantanalSchedulerDataSource
        ref="standaloneSchedulerDataSource"
        :data="standaloneEvents"
        @change="handleStandaloneChange"
        @update:data="handleUpdateData"
        :auto-sync="false"
      />
      <ExampleCode :source="standaloneCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { 
  PantanalGrid, 
  PantanalSchedulerDataSource,
  type ColumnDef,
  type SchedulerEvent,
  type SchedulerDataSourceSchema,
  type SchedulerDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localCode from './SchedulerDataSourcePage.local-code.vue?raw'
import mappedCode from './SchedulerDataSourcePage.mapped-code.vue?raw'
import remoteCode from './SchedulerDataSourcePage.remote-code.vue?raw'
import standaloneCode from './SchedulerDataSourcePage.standalone-code.vue?raw'

// Local SchedulerDataSource
const localEvents = ref<SchedulerEvent[]>([
  {
    taskId: 1,
    id: 1,
    title: 'Meeting',
    start: new Date('2024-01-15T09:00:00'),
    end: new Date('2024-01-15T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  },
  {
    taskId: 2,
    id: 2,
    title: 'Conference',
    start: new Date('2024-01-16T14:00:00'),
    end: new Date('2024-01-16T17:00:00'),
    ownerId: 2,
    isAllDay: false,
  },
])

const localSchedulerDataSource = ref<SchedulerDataSourceInstance | null>(null)
const localData = ref<SchedulerEvent[]>([])

function handleLocalChange(data: SchedulerEvent[]) {
  localData.value = data
}

// Mapped SchedulerDataSource
const mappedEvents = ref<any[]>([
  {
    TaskID: 1,
    Title: 'Team Meeting',
    Start: '2024-01-17T10:00:00',
    End: '2024-01-17T11:00:00',
    OwnerID: 1,
    IsAllDay: false,
  },
  {
    TaskID: 2,
    Title: 'Project Review',
    Start: '2024-01-18T14:00:00',
    End: '2024-01-18T16:00:00',
    OwnerID: 2,
    IsAllDay: false,
  },
])

const mappedSchema: SchedulerDataSourceSchema = {
  model: {
    taskId: { from: 'TaskID', type: 'number' },
    title: { from: 'Title', defaultValue: 'No title' },
    start: { from: 'Start', type: 'date' },
    end: { from: 'End', type: 'date' },
    ownerId: { from: 'OwnerID', type: 'number', defaultValue: 1 },
    isAllDay: { from: 'IsAllDay', type: 'boolean' },
  },
}

const mappedSchedulerDataSource = ref<SchedulerDataSourceInstance | null>(null)
const mappedData = ref<SchedulerEvent[]>([])

function handleMappedChange(data: SchedulerEvent[]) {
  mappedData.value = data
}

// Remote SchedulerDataSource
const remoteTransport: DataSourceTransport = {
  read: async (options) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const page = (options as any).page || 1
    const pageSize = (options as any).pageSize || 10
    
    const allEvents: SchedulerEvent[] = Array.from({ length: 25 }, (_, i) => ({
      taskId: i + 1,
      id: i + 1,
      title: `Remote Event ${i + 1}`,
      start: new Date(2024, 0, 15 + i, 9 + (i % 8), 0),
      end: new Date(2024, 0, 15 + i, 10 + (i % 8), 0),
      ownerId: (i % 3) + 1,
      isAllDay: false,
    }))
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const rows = allEvents.slice(start, end)
    
    return {
      data: rows,
      total: allEvents.length,
    }
  },
}

const remoteSchema: SchedulerDataSourceSchema = {
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

const remoteSchedulerDataSource = ref<SchedulerDataSourceInstance | null>(null)
const remoteData = ref<SchedulerEvent[]>([])
const remotePage = ref(1)
const remotePageSize = ref(10)
const remoteTotal = ref(0)

function handleRemoteChange(data: SchedulerEvent[]) {
  remoteData.value = data
  if (remoteSchedulerDataSource.value) {
    remoteTotal.value = remoteSchedulerDataSource.value.total()
  }
}

onMounted(async () => {
  if (remoteSchedulerDataSource.value) {
    await remoteSchedulerDataSource.value.read()
  }
})

// Standalone SchedulerDataSource
const standaloneEvents = ref<SchedulerEvent[]>([
  {
    taskId: 1,
    id: 1,
    title: 'Event 1',
    start: new Date('2024-02-01T09:00:00'),
    end: new Date('2024-02-01T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  },
  {
    taskId: 2,
    id: 2,
    title: 'Event 2',
    start: new Date('2024-02-02T14:00:00'),
    end: new Date('2024-02-02T15:00:00'),
    ownerId: 2,
    isAllDay: false,
  },
])

const standaloneSchedulerDataSource = ref<SchedulerDataSourceInstance | null>(null)
const standaloneData = ref<SchedulerEvent[]>([])
const isUpdatingData = ref(false)

function handleStandaloneChange(data: SchedulerEvent[]) {
  if (!isUpdatingData.value) {
    standaloneData.value = data
  }
}

function handleUpdateData(data: SchedulerEvent[]) {
  // Always update when update:data is emitted
  // This ensures the component stays in sync
  standaloneEvents.value = data
}

async function addEvent() {
  // Generate a unique ID for the new event
  const maxId = standaloneEvents.value.length > 0 
    ? Math.max(...standaloneEvents.value.map(e => {
        const id = e.taskId || e.id
        return typeof id === 'number' ? id : (typeof id === 'string' ? parseInt(id) || 0 : 0)
      }))
    : 0
  
  const newEvent: SchedulerEvent = {
    taskId: maxId + 1,
    id: maxId + 1,
    title: `Event ${standaloneEvents.value.length + 1}`,
    start: new Date('2024-02-01T09:00:00'),
    end: new Date('2024-02-01T10:00:00'),
    ownerId: 1,
    isAllDay: false,
  }
  
  // Update the data directly - this will trigger reactivity
  standaloneEvents.value = [...standaloneEvents.value, newEvent]
  
  // Wait for Vue to process the update
  await nextTick()
  
  // Force DataSource to refresh by calling read()
  if (standaloneSchedulerDataSource.value) {
    await standaloneSchedulerDataSource.value.read()
  }
}

async function removeEvent() {
  // Check both standaloneData and standaloneEvents to find the last event
  const dataToCheck = standaloneData.value.length > 0 ? standaloneData.value : standaloneEvents.value
  if (dataToCheck.length === 0) return
  
  const lastEvent = dataToCheck[dataToCheck.length - 1]
  if (!lastEvent?.id && !lastEvent?.taskId) return
  
  const eventId = lastEvent.taskId || lastEvent.id
  
  // Update the data directly - this will trigger reactivity
  standaloneEvents.value = standaloneEvents.value.filter(e => {
    const eId = e.taskId || e.id
    if (typeof eId === 'number' && typeof eventId === 'number') {
      return eId !== eventId
    }
    return String(eId) !== String(eventId)
  })
  
  // Wait for Vue to process the update
  await nextTick()
  
  // Force DataSource to refresh by calling read()
  if (standaloneSchedulerDataSource.value) {
    await standaloneSchedulerDataSource.value.read()
  }
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Grid columns
const schedulerColumns: ColumnDef<SchedulerEvent>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'start', title: 'Start', width: 180, format: (value) => formatDate(value) },
  { field: 'end', title: 'End', width: 180, format: (value) => formatDate(value) },
  { field: 'ownerId', title: 'Owner ID', width: 100 },
  { field: 'isAllDay', title: 'All Day', width: 100, format: (value) => value ? 'Yes' : 'No' },
]
</script>

