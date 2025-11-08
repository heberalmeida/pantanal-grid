<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">GanttDataSource</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The GanttDataSource extends the DataSource component and provides specialized support for Gantt task data structures.
        It includes field mapping, date handling, and hierarchical task support.
      </p>
    </header>

    <!-- Local GanttDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Local GanttDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use GanttDataSource with local data. Tasks are automatically normalized to ensure proper structure.
      </p>

      <PantanalGanttDataSource
        ref="localGanttDataSource"
        :data="localTasks"
        @change="handleLocalChange"
      />
      <PantanalGrid
        :rows="localData"
        :columns="ganttColumns as any"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="localCode" />
    </article>

    <!-- GanttDataSource with Model Mapping Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">GanttDataSource with Model Field Mapping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Map fields from different data structures using the schema model configuration.
      </p>

      <PantanalGanttDataSource
        ref="mappedGanttDataSource"
        :data="mappedTasks as any"
        :schema="mappedSchema"
        @change="handleMappedChange"
      />
      <PantanalGrid
        :rows="mappedData"
        :columns="ganttColumns as any"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="mappedCode" />
    </article>

    <!-- Remote GanttDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Remote GanttDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Connect to a remote API endpoint for Gantt tasks. The component handles field mapping automatically.
      </p>

      <PantanalGanttDataSource
        ref="remoteGanttDataSource"
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
        :columns="ganttColumns as any"
        key-field="id"
        :striped="true"
        server-side
        :total="remoteTotal"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
      />
      <ExampleCode :source="remoteCode" />
    </article>

    <!-- Standalone GanttDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Standalone GanttDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use GanttDataSource independently to manage task data with programmatic access.
      </p>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="addTask"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Task
          </button>
          <button
            @click="removeTask"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="standaloneData.length === 0"
          >
            Remove Last Task
          </button>
        </div>
        <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">Tasks ({{ standaloneData.length }}):</p>
          <ul class="space-y-1 text-sm">
            <li v-for="task in standaloneData" :key="task.id">
              {{ task.title }} ({{ formatDate(task.start) }} - {{ formatDate(task.end) }})
            </li>
          </ul>
        </div>
      </div>

      <PantanalGanttDataSource
        ref="standaloneGanttDataSource"
        :data="standaloneTasks"
        @change="handleStandaloneChange"
        @update:data="handleUpdateData"
        :auto-sync="false"
      />
      <ExampleCode :source="standaloneCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { 
  PantanalGrid, 
  PantanalGanttDataSource,
  type ColumnDef,
  type GanttTask,
  type GanttDataSourceSchema,
  type GanttDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localCodeSource from './GanttDataSourcePage.local-code.vue?raw'
import mappedCodeSource from './GanttDataSourcePage.mapped-code.vue?raw'
import remoteCodeSource from './GanttDataSourcePage.remote-code.vue?raw'
import standaloneCodeSource from './GanttDataSourcePage.standalone-code.vue?raw'

const localCode = localCodeSource
const mappedCode = mappedCodeSource
const remoteCode = remoteCodeSource
const standaloneCode = standaloneCodeSource

// Local GanttDataSource
const localTasks: GanttTask[] = [
  {
    id: 1,
    title: 'Project Planning',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-15'),
    percentComplete: 100,
    parentId: null,
    summary: false,
    expanded: true,
  },
  {
    id: 2,
    title: 'Design Phase',
    start: new Date('2024-01-16'),
    end: new Date('2024-02-15'),
    percentComplete: 75,
    parentId: null,
    summary: false,
    expanded: true,
  },
  {
    id: 3,
    title: 'UI Design',
    start: new Date('2024-01-16'),
    end: new Date('2024-02-01'),
    percentComplete: 80,
    parentId: 2,
    summary: false,
    expanded: true,
  },
  {
    id: 4,
    title: 'UX Design',
    start: new Date('2024-02-02'),
    end: new Date('2024-02-15'),
    percentComplete: 70,
    parentId: 2,
    summary: false,
    expanded: true,
  },
]

const localGanttDataSource = ref<GanttDataSourceInstance | null>(null)
const localData = ref<GanttTask[]>([])

function handleLocalChange(data: GanttTask[]) {
  localData.value = data
}

// Mapped GanttDataSource
const mappedTasks = [
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

const mappedSchema: GanttDataSourceSchema = {
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

const mappedGanttDataSource = ref<GanttDataSourceInstance | null>(null)
const mappedData = ref<GanttTask[]>([])

function handleMappedChange(data: GanttTask[]) {
  mappedData.value = data
}

// Remote GanttDataSource
const remoteTransport: DataSourceTransport = {
  read: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: [
        {
          id: 1,
          title: 'Remote Task 1',
          start: '2024-01-01',
          end: '2024-01-15',
          percentComplete: 60,
          parentId: null,
        },
        {
          id: 2,
          title: 'Remote Task 2',
          start: '2024-01-16',
          end: '2024-01-30',
          percentComplete: 40,
          parentId: 1,
        },
      ],
      total: 2,
    }
  },
}

const remoteSchema: GanttDataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

const remoteGanttDataSource = ref<GanttDataSourceInstance | null>(null)
const remoteData = ref<GanttTask[]>([])
const remoteTotal = ref(0)
const remotePage = ref(1)
const remotePageSize = ref(10)

function handleRemoteChange(data: GanttTask[]) {
  remoteData.value = data
  if (remoteGanttDataSource.value) {
    remoteTotal.value = remoteGanttDataSource.value.total()
  }
}

// Standalone GanttDataSource
const standaloneTasks = ref<GanttTask[]>([
  {
    id: 1,
    title: 'Task 1',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-10'),
    percentComplete: 50,
    parentId: null,
    summary: false,
    expanded: true,
  },
  {
    id: 2,
    title: 'Task 2',
    start: new Date('2024-01-11'),
    end: new Date('2024-01-20'),
    percentComplete: 30,
    parentId: null,
    summary: false,
    expanded: true,
  },
])

const standaloneGanttDataSource = ref<GanttDataSourceInstance | null>(null)
const standaloneData = ref<GanttTask[]>([])
const isUpdatingData = ref(false)

function handleStandaloneChange(data: GanttTask[]) {
  if (!isUpdatingData.value) {
    standaloneData.value = data
  }
}

function handleUpdateData(data: GanttTask[]) {
  // Always update when update:data is emitted
  // This ensures the component stays in sync
  standaloneTasks.value = data
}

async function addTask() {
  // Generate a unique ID for the new task
  const maxId = standaloneTasks.value.length > 0 
    ? Math.max(...standaloneTasks.value.map(t => {
        const id = t.id
        return typeof id === 'number' ? id : (typeof id === 'string' ? parseInt(id) || 0 : 0)
      }))
    : 0
  
  const newTask: GanttTask = {
    id: maxId + 1,
    title: `Task ${standaloneTasks.value.length + 1}`,
    start: new Date('2024-02-01'),
    end: new Date('2024-02-10'),
    percentComplete: 0,
    parentId: null,
    summary: false,
    expanded: true,
  }
  
  // Update the data directly - this will trigger reactivity
  standaloneTasks.value = [...standaloneTasks.value, newTask]
  
  // Wait for Vue to process the update
  await nextTick()
  
  // Force DataSource to refresh by calling read()
  if (standaloneGanttDataSource.value) {
    await standaloneGanttDataSource.value.read()
  }
}

async function removeTask() {
  // Check both standaloneData and standaloneTasks to find the last task
  const dataToCheck = standaloneData.value.length > 0 ? standaloneData.value : standaloneTasks.value
  if (dataToCheck.length === 0) return
  
  const lastTask = dataToCheck[dataToCheck.length - 1]
  if (!lastTask?.id) return
  
  const taskId = lastTask.id
  
  // Update the data directly - this will trigger reactivity
  standaloneTasks.value = standaloneTasks.value.filter(t => {
    const tid = t.id
    if (typeof tid === 'number' && typeof taskId === 'number') {
      return tid !== taskId
    }
    return String(tid) !== String(taskId)
  })
  
  // Wait for Vue to process the update
  await nextTick()
  
  // Force DataSource to refresh by calling read()
  if (standaloneGanttDataSource.value) {
    await standaloneGanttDataSource.value.read()
  }
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString()
}

// Grid columns
const ganttColumns: ColumnDef<GanttTask>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'start', title: 'Start', width: 120, format: (value) => formatDate(value) },
  { field: 'end', title: 'End', width: 120, format: (value) => formatDate(value) },
  { field: 'percentComplete', title: 'Progress', width: 100, format: (value) => `${value}%` },
  { field: 'parentId', title: 'Parent ID', width: 100 },
]
</script>

