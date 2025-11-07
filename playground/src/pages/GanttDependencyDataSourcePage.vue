<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">GanttDependencyDataSource</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The GanttDependencyDataSource extends the DataSource component and provides specialized support for Gantt dependency data structures.
        Dependencies represent relationships between tasks (predecessor and successor).
      </p>
    </header>

    <!-- Local GanttDependencyDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Local GanttDependencyDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use GanttDependencyDataSource with local data. Dependencies are automatically normalized to ensure proper structure.
      </p>

      <PantanalGanttDependencyDataSource
        ref="localGanttDependencyDataSource"
        :data="localDependencies"
        @change="handleLocalChange"
      />
      <PantanalGrid
        :rows="localData"
        :columns="dependencyColumns"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="localCode" />
    </article>

    <!-- GanttDependencyDataSource with Model Mapping Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">GanttDependencyDataSource with Model Field Mapping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Map fields from different data structures using the schema model configuration.
      </p>

      <PantanalGanttDependencyDataSource
        ref="mappedGanttDependencyDataSource"
        :data="mappedDependencies"
        :schema="mappedSchema"
        @change="handleMappedChange"
      />
      <PantanalGrid
        :rows="mappedData"
        :columns="dependencyColumns"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="mappedCode" />
    </article>

    <!-- Remote GanttDependencyDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Remote GanttDependencyDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Connect to a remote API endpoint for Gantt dependencies. The component handles field mapping automatically.
      </p>

      <PantanalGanttDependencyDataSource
        ref="remoteGanttDependencyDataSource"
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
        :columns="dependencyColumns"
        key-field="id"
        :striped="true"
        server-side
        :total="remoteTotal"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
      />
      <ExampleCode :source="remoteCode" />
    </article>

    <!-- Standalone GanttDependencyDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Standalone GanttDependencyDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use GanttDependencyDataSource independently to manage dependency data with programmatic access.
      </p>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="addDependency"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Dependency
          </button>
          <button
            @click="removeDependency"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="standaloneData.length === 0"
          >
            Remove Last Dependency
          </button>
        </div>
        <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">Dependencies ({{ standaloneData.length }}):</p>
          <ul class="space-y-1 text-sm">
            <li v-for="dep in standaloneData" :key="dep.id">
              Task {{ dep.predecessorId }} → Task {{ dep.successorId }} (Type: {{ dep.type }})
            </li>
          </ul>
        </div>
      </div>

      <PantanalGanttDependencyDataSource
        ref="standaloneGanttDependencyDataSource"
        :data="standaloneDependencies"
        @change="handleStandaloneChange"
      />
      <ExampleCode :source="standaloneCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGrid, 
  PantanalGanttDependencyDataSource,
  type ColumnDef,
  type GanttDependency,
  type GanttDependencyDataSourceSchema,
  type GanttDependencyDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localCodeSource from './GanttDependencyDataSourcePage.local-code.vue?raw'
import mappedCodeSource from './GanttDependencyDataSourcePage.mapped-code.vue?raw'
import remoteCodeSource from './GanttDependencyDataSourcePage.remote-code.vue?raw'
import standaloneCodeSource from './GanttDependencyDataSourcePage.standalone-code.vue?raw'

const localCode = localCodeSource
const mappedCode = mappedCodeSource
const remoteCode = remoteCodeSource
const standaloneCode = standaloneCodeSource

// Local GanttDependencyDataSource
const localDependencies: GanttDependency[] = [
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
  {
    id: 3,
    predecessorId: 3,
    successorId: 4,
    type: 1,
  },
]

const localGanttDependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const localData = ref<GanttDependency[]>([])

function handleLocalChange(data: GanttDependency[]) {
  localData.value = data
}

// Mapped GanttDependencyDataSource
const mappedDependencies = [
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

const mappedSchema: GanttDependencyDataSourceSchema = {
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

const mappedGanttDependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const mappedData = ref<GanttDependency[]>([])

function handleMappedChange(data: GanttDependency[]) {
  mappedData.value = data
}

// Remote GanttDependencyDataSource
const remoteTransport: DataSourceTransport = {
  read: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: [
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
          type: 1,
        },
      ],
      total: 2,
    }
  },
}

const remoteSchema: GanttDependencyDataSourceSchema = {
  data: (response: any) => response.data || [],
  total: (response: any) => response.total || 0,
}

const remoteGanttDependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const remoteData = ref<GanttDependency[]>([])
const remoteTotal = ref(0)
const remotePage = ref(1)
const remotePageSize = ref(10)

function handleRemoteChange(data: GanttDependency[]) {
  remoteData.value = data
  if (remoteGanttDependencyDataSource.value) {
    remoteTotal.value = remoteGanttDependencyDataSource.value.total()
  }
}

// Standalone GanttDependencyDataSource
const standaloneDependencies = ref<GanttDependency[]>([
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
])

const standaloneGanttDependencyDataSource = ref<GanttDependencyDataSourceInstance | null>(null)
const standaloneData = ref<GanttDependency[]>([])

function handleStandaloneChange(data: GanttDependency[]) {
  standaloneData.value = data
}

function addDependency() {
  if (standaloneGanttDependencyDataSource.value) {
    const newDependency: Partial<GanttDependency> = {
      predecessorId: standaloneDependencies.value.length + 1,
      successorId: standaloneDependencies.value.length + 2,
      type: 0,
    }
    standaloneGanttDependencyDataSource.value.add(newDependency)
    // Update local data
    const currentData = standaloneGanttDependencyDataSource.value.dependencies()
    standaloneDependencies.value = currentData
  }
}

function removeDependency() {
  if (standaloneGanttDependencyDataSource.value && standaloneData.value.length > 0) {
    const lastDep = standaloneData.value[standaloneData.value.length - 1]
    standaloneGanttDependencyDataSource.value.remove(lastDep.id)
    // Update local data
    const currentData = standaloneGanttDependencyDataSource.value.dependencies()
    standaloneDependencies.value = currentData
  }
}

// Grid columns
const dependencyColumns: ColumnDef<GanttDependency>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'predecessorId', title: 'Predecessor ID', width: 140 },
  { field: 'successorId', title: 'Successor ID', width: 140 },
  { field: 'type', title: 'Type', width: 100, format: (value) => {
    const types: Record<number, string> = {
      0: 'Finish to Start',
      1: 'Start to Start',
      2: 'Finish to Finish',
      3: 'Start to Finish',
    }
    return types[value] || `Type ${value}`
  }},
]
</script>

