<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">TreeListDataSource</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The TreeListDataSource extends the DataSource component and provides specialized support for TreeList data structures.
        It includes field mapping, hierarchical support with parent-child relationships, and expand/collapse functionality.
      </p>
    </header>

    <!-- Local TreeListDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Local TreeListDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use TreeListDataSource with local data. Nodes are automatically normalized to ensure proper structure.
      </p>

      <PantanalTreeListDataSource
        ref="localTreeListDataSource"
        :data="localNodes"
        @change="handleLocalChange"
      />
      <PantanalGrid
        :rows="localData"
        :columns="treeListColumns as any"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="localCode" />
    </article>

    <!-- TreeListDataSource with Model Mapping Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">TreeListDataSource with Model Field Mapping</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Map fields from different data structures using the schema model configuration.
      </p>

      <PantanalTreeListDataSource
        ref="mappedTreeListDataSource"
        :data="mappedNodes as any"
        :schema="mappedSchema"
        @change="handleMappedChange"
      />
      <PantanalGrid
        :rows="mappedData"
        :columns="treeListColumns as any"
        key-field="id"
        :striped="true"
      />
      <ExampleCode :source="mappedCode" />
    </article>

    <!-- Remote TreeListDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Remote TreeListDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Connect to a remote API endpoint for TreeList nodes. The component handles field mapping automatically.
      </p>

      <PantanalTreeListDataSource
        ref="remoteTreeListDataSource"
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
        :columns="treeListColumns as any"
        key-field="id"
        :striped="true"
        server-side
        :total="remoteTotal"
        v-model:page="remotePage"
        v-model:pageSize="remotePageSize"
      />
      <ExampleCode :source="remoteCode" />
    </article>

    <!-- Standalone TreeListDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Standalone TreeListDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use TreeListDataSource independently to manage node data with programmatic access.
      </p>

      <div class="space-y-4">
        <div class="flex gap-2 flex-wrap">
          <button
            @click="addNode"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Node
          </button>
          <button
            @click="removeNode"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="standaloneData.length === 0"
          >
            Remove Last Node
          </button>
          <button
            @click="expandFirstNode"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            :disabled="standaloneRootNodes.length === 0"
          >
            Expand First Root Node
          </button>
          <button
            @click="collapseFirstNode"
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            :disabled="standaloneRootNodes.length === 0"
          >
            Collapse First Root Node
          </button>
        </div>
        <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">Root Nodes ({{ standaloneRootNodes.length }}):</p>
          <ul class="space-y-1 text-sm">
            <li v-for="node in standaloneRootNodes" :key="node.id">
              {{ node.firstName || node.name || 'Node' }} {{ node.lastName || '' }} (ID: {{ node.id }}{{ node.expanded ? ', Expanded' : '' }})
            </li>
          </ul>
        </div>
        <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">All Nodes ({{ standaloneData.length }}):</p>
          <ul class="space-y-1 text-sm">
            <li v-for="node in standaloneData" :key="node.id">
              {{ node.firstName || node.name || 'Node' }} {{ node.lastName || '' }} 
              (ID: {{ node.id }}, Parent: {{ node.parentId || 'None' }})
            </li>
          </ul>
        </div>
      </div>

      <PantanalTreeListDataSource
        ref="standaloneTreeListDataSource"
        :data="standaloneNodes"
        @change="handleStandaloneChange"
        @update:data="handleUpdateData"
        :auto-sync="false"
      />
      <ExampleCode :source="standaloneCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { 
  PantanalGrid, 
  PantanalTreeListDataSource,
  type ColumnDef,
  type TreeListNode,
  type TreeListDataSourceSchema,
  type TreeListDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localCode from './TreeListDataSourcePage.local-code.vue?raw'
import mappedCode from './TreeListDataSourcePage.mapped-code.vue?raw'
import remoteCode from './TreeListDataSourcePage.remote-code.vue?raw'
import standaloneCode from './TreeListDataSourcePage.standalone-code.vue?raw'

// Local TreeListDataSource
const localNodes = ref<TreeListNode[]>([
  {
    id: 1,
    parentId: null,
    firstName: 'John',
    lastName: 'Doe',
    position: 'CEO',
    phone: '555-0101',
    expanded: true,
  },
  {
    id: 2,
    parentId: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    position: 'CFO',
    phone: '555-0102',
    expanded: false,
  },
  {
    id: 3,
    parentId: 1,
    firstName: 'Bob',
    lastName: 'Johnson',
    position: 'CTO',
    phone: '555-0103',
    expanded: false,
  },
  {
    id: 4,
    parentId: 2,
    firstName: 'Alice',
    lastName: 'Williams',
    position: 'Accountant',
    phone: '555-0104',
    expanded: false,
  },
])

const localTreeListDataSource = ref<TreeListDataSourceInstance | null>(null)
const localData = ref<TreeListNode[]>([])

function handleLocalChange(data: TreeListNode[]) {
  localData.value = data
}

// Mapped TreeListDataSource
const mappedNodes = ref<any[]>([
  {
    EmployeeID: 1,
    ReportsTo: null,
    FirstName: 'John',
    LastName: 'Doe',
    Position: 'CEO',
    Phone: '555-0101',
    Extension: 1001,
  },
  {
    EmployeeID: 2,
    ReportsTo: 1,
    FirstName: 'Jane',
    LastName: 'Smith',
    Position: 'CFO',
    Phone: '555-0102',
    Extension: 1002,
  },
  {
    EmployeeID: 3,
    ReportsTo: 1,
    FirstName: 'Bob',
    LastName: 'Johnson',
    Position: 'CTO',
    Phone: '555-0103',
    Extension: 1003,
  },
])

const mappedSchema: TreeListDataSourceSchema = {
  model: {
    id: { field: 'EmployeeID', type: 'number' },
    parentId: { field: 'ReportsTo', type: 'number', nullable: true },
    expanded: true,
    fields: {
      firstName: { field: 'FirstName', type: 'string' },
      lastName: { field: 'LastName', type: 'string' },
      position: { field: 'Position', type: 'string' },
      phone: { field: 'Phone', type: 'string' },
      extension: { field: 'Extension', type: 'number' },
    },
  },
}

const mappedTreeListDataSource = ref<TreeListDataSourceInstance | null>(null)
const mappedData = ref<TreeListNode[]>([])

function handleMappedChange(data: TreeListNode[]) {
  mappedData.value = data
}

// Remote TreeListDataSource
const remoteTransport: DataSourceTransport = {
  read: async (options) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const page = (options as any).page || 1
    const pageSize = (options as any).pageSize || 10
    
    const allNodes: TreeListNode[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      parentId: i > 0 ? Math.floor((i - 1) / 3) + 1 : null,
      firstName: `Employee${i + 1}`,
      lastName: `Last${i + 1}`,
      position: `Position ${i + 1}`,
      phone: `555-${String(i + 1).padStart(4, '0')}`,
      expanded: false,
    }))
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const rows = allNodes.slice(start, end)
    
    return {
      data: rows,
      total: allNodes.length,
    }
  },
}

const remoteSchema: TreeListDataSourceSchema = {
  model: {
    id: { field: 'id', type: 'number' },
    parentId: { field: 'parentId', type: 'number', nullable: true },
    expanded: false,
    fields: {
      firstName: { field: 'firstName', type: 'string' },
      lastName: { field: 'lastName', type: 'string' },
      position: { field: 'position', type: 'string' },
      phone: { field: 'phone', type: 'string' },
    },
  },
  data: (response: any) => response.data || response,
  total: (response: any) => response.total || 0,
}

const remoteTreeListDataSource = ref<TreeListDataSourceInstance | null>(null)
const remoteData = ref<TreeListNode[]>([])
const remotePage = ref(1)
const remotePageSize = ref(10)
const remoteTotal = ref(0)

function handleRemoteChange(data: TreeListNode[]) {
  remoteData.value = data
  if (remoteTreeListDataSource.value) {
    remoteTotal.value = remoteTreeListDataSource.value.total()
  }
}

onMounted(async () => {
  if (remoteTreeListDataSource.value) {
    await remoteTreeListDataSource.value.read()
  }
})

// Standalone TreeListDataSource
const standaloneNodes = ref<TreeListNode[]>([
  {
    id: 1,
    parentId: null,
    firstName: 'Root',
    lastName: 'Node 1',
    position: 'Manager',
    phone: '555-0001',
    expanded: true,
  },
  {
    id: 2,
    parentId: 1,
    firstName: 'Child',
    lastName: 'Node 1',
    position: 'Employee',
    phone: '555-0002',
    expanded: false,
  },
  {
    id: 3,
    parentId: null,
    firstName: 'Root',
    lastName: 'Node 2',
    position: 'Manager',
    phone: '555-0003',
    expanded: false,
  },
])

const standaloneTreeListDataSource = ref<TreeListDataSourceInstance | null>(null)
const standaloneData = ref<TreeListNode[]>([])
const isUpdatingData = ref(false)

const standaloneRootNodes = computed(() => {
  if (!standaloneTreeListDataSource.value) return []
  return standaloneTreeListDataSource.value.rootNodes()
})

function handleStandaloneChange(data: TreeListNode[]) {
  if (!isUpdatingData.value) {
    standaloneData.value = data
  }
}

function handleUpdateData(data: TreeListNode[]) {
  // Always update when update:data is emitted
  standaloneNodes.value = data
}

async function addNode() {
  // Generate a unique ID for the new node
  const maxId = standaloneNodes.value.length > 0 
    ? Math.max(...standaloneNodes.value.map(n => {
        const id = n.id
        return typeof id === 'number' ? id : (typeof id === 'string' ? parseInt(id) || 0 : 0)
      }))
    : 0
  
  const newNode: TreeListNode = {
    id: maxId + 1,
    parentId: standaloneRootNodes.value.length > 0 ? standaloneRootNodes.value[0].id : null,
    firstName: `Node${maxId + 1}`,
    lastName: '',
    position: 'Employee',
    phone: `555-${String(maxId + 1).padStart(4, '0')}`,
    expanded: false,
  }
  
  // Update the data directly - this will trigger reactivity
  standaloneNodes.value = [...standaloneNodes.value, newNode]
  
  // Wait for Vue to process the update
  await nextTick()
  
  // Force DataSource to refresh by calling read()
  if (standaloneTreeListDataSource.value) {
    await standaloneTreeListDataSource.value.read()
  }
}

async function removeNode() {
  if (standaloneNodes.value.length === 0) return
  
  const lastNode = standaloneNodes.value[standaloneNodes.value.length - 1]
  const nodeId = lastNode.id
  
  // Update the data directly - this will trigger reactivity
  standaloneNodes.value = standaloneNodes.value.filter(n => {
    const nId = n.id
    if (typeof nId === 'number' && typeof nodeId === 'number') {
      return nId !== nodeId
    }
    return String(nId) !== String(nodeId)
  })
  
  // Wait for Vue to process the update
  await nextTick()
  
  // Force DataSource to refresh by calling read()
  if (standaloneTreeListDataSource.value) {
    await standaloneTreeListDataSource.value.read()
  }
}

async function expandFirstNode() {
  if (!standaloneTreeListDataSource.value || standaloneRootNodes.value.length === 0) return
  
  const firstRootNode = standaloneRootNodes.value[0]
  standaloneTreeListDataSource.value.expand(firstRootNode.id)
  
  await nextTick()
  if (standaloneTreeListDataSource.value) {
    await standaloneTreeListDataSource.value.read()
  }
}

async function collapseFirstNode() {
  if (!standaloneTreeListDataSource.value || standaloneRootNodes.value.length === 0) return
  
  const firstRootNode = standaloneRootNodes.value[0]
  standaloneTreeListDataSource.value.collapse(firstRootNode.id)
  
  await nextTick()
  if (standaloneTreeListDataSource.value) {
    await standaloneTreeListDataSource.value.read()
  }
}

// Grid columns
const treeListColumns: ColumnDef<TreeListNode>[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'firstName', title: 'First Name', width: 150 },
  { field: 'lastName', title: 'Last Name', width: 150 },
  { field: 'position', title: 'Position', width: 200 },
  { field: 'phone', title: 'Phone', width: 120 },
  { field: 'parentId', title: 'Parent ID', width: 100 },
  { field: 'expanded', title: 'Expanded', width: 100, format: (value) => value ? 'Yes' : 'No' },
]
</script>

