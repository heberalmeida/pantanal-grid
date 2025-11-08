<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">PivotDataSource</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The PivotDataSource extends the DataSource component and provides specialized support for OLAP (Online Analytical Processing) data structures.
        It communicates with OLAP cubes using the XMLA protocol and supports client-side cube processing for local data.
      </p>
    </header>

    <!-- Local PivotDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Local PivotDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use PivotDataSource with local data. The cube processing is done on the client-side.
      </p>

      <PantanalPivotDataSource
        ref="localPivotDataSource"
        type="local"
        :data="localPivotData"
        :schema="localPivotSchema"
        :columns="localPivotColumns"
        :rows="localPivotRows"
        :measures="localPivotMeasures"
        @change="handleLocalChange"
      />
      <div v-if="localPivotResult" class="space-y-4">
        <PantanalGrid
          :rows="localGridRows"
          :columns="pivotGridColumns"
          key-field="rowKey"
          :striped="true"
        />
      </div>
      <ExampleCode :source="localCode" />
    </article>

    <!-- PivotDataSource with Custom Cube Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">PivotDataSource with Custom Cube Configuration</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Configure custom dimensions and measures for pivot analysis.
      </p>

      <PantanalPivotDataSource
        ref="customPivotDataSource"
        type="local"
        :data="customPivotData"
        :schema="customPivotSchema"
        :columns="customPivotColumns"
        :rows="customPivotRows"
        :measures="customPivotMeasures"
        @change="handleCustomChange"
      />
      <div v-if="customPivotResult" class="space-y-4">
        <PantanalGrid
          :rows="customGridRows"
          :columns="customPivotGridColumns"
          key-field="rowKey"
          :striped="true"
        />
      </div>
      <ExampleCode :source="customCode" />
    </article>

    <!-- Remote PivotDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Remote PivotDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Load pivot data from a remote OLAP server or OData service.
      </p>

      <PantanalPivotDataSource
        ref="remotePivotDataSource"
        type="odata"
        :transport="remotePivotTransport"
        :schema="remotePivotSchema"
        :columns="remotePivotColumns"
        :rows="remotePivotRows"
        :measures="remotePivotMeasures"
        :auto-sync="true"
        @change="handleRemoteChange"
      />
      <div v-if="remotePivotResult" class="space-y-4">
        <PantanalGrid
          :rows="remoteGridRows"
          :columns="remotePivotGridColumns"
          key-field="rowKey"
          :striped="true"
        />
      </div>
      <ExampleCode :source="remoteCode" />
    </article>

    <!-- Standalone PivotDataSource Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Standalone PivotDataSource</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use PivotDataSource independently to manage pivot data with programmatic access.
      </p>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="updateColumns"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Columns
          </button>
          <button
            @click="updateRows"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update Rows
          </button>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Refresh Data
          </button>
        </div>
        <div v-if="standalonePivotResult" class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm font-medium mb-2">Pivot Result Info:</p>
          <div class="text-sm space-y-1">
            <div><strong>Columns:</strong> {{ standalonePivotResult.columns?.tuples?.length || 0 }}</div>
            <div><strong>Rows:</strong> {{ standalonePivotResult.rows?.tuples?.length || 0 }}</div>
            <div><strong>Cells:</strong> {{ standalonePivotResult.data?.flat().length || 0 }}</div>
            <div v-if="standalonePivotColumns.length > 0" class="mt-2 pt-2 border-t border-slate-300 dark:border-slate-600">
              <strong>Current Columns:</strong> {{ standalonePivotColumns.map(c => c.name).join(', ') }}
            </div>
            <div v-if="standalonePivotRows.length > 0" class="mt-1">
              <strong>Current Rows:</strong> {{ standalonePivotRows.map(r => r.name).join(', ') }}
            </div>
          </div>
        </div>
        <div v-else class="p-4 bg-slate-100 dark:bg-slate-800 rounded">
          <p class="text-sm text-slate-500">No pivot data available yet. Click "Refresh Data" to load.</p>
        </div>
        
        <div v-if="standalonePivotResult && standaloneGridRows.length > 0" class="space-y-4">
          <PantanalGrid
            :rows="standaloneGridRows"
            :columns="standalonePivotGridColumns"
            key-field="rowKey"
            :striped="true"
          />
        </div>
      </div>

      <PantanalPivotDataSource
        ref="standalonePivotDataSource"
        type="local"
        :data="standalonePivotData"
        :schema="standalonePivotSchema"
        :columns="standalonePivotColumns"
        :rows="standalonePivotRows"
        :measures="standalonePivotMeasures"
        @change="handleStandaloneChange"
      />
      <ExampleCode :source="standaloneCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PantanalGrid, 
  PantanalPivotDataSource,
  type ColumnDef,
  type PivotDataSourceInstance,
  type PivotDataSourceSchema,
  type PivotDataSourceTransport,
  type PivotColumn,
  type PivotRow,
  type PivotResult
} from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import localCodeSource from './PivotDataSourcePage.local-code.vue?raw'
import customCodeSource from './PivotDataSourcePage.custom-code.vue?raw'
import remoteCodeSource from './PivotDataSourcePage.remote-code.vue?raw'
import standaloneCodeSource from './PivotDataSourcePage.standalone-code.vue?raw'

const localCode = localCodeSource
const customCode = customCodeSource
const remoteCode = remoteCodeSource
const standaloneCode = standaloneCodeSource

// Local PivotDataSource
const localPivotData = [
  { Country: 'USA', CompanyName: 'Company A', ContactTitle: 'Manager', CustomerID: 1 },
  { Country: 'USA', CompanyName: 'Company B', ContactTitle: 'Manager', CustomerID: 2 },
  { Country: 'USA', CompanyName: 'Company A', ContactTitle: 'Director', CustomerID: 3 },
  { Country: 'UK', CompanyName: 'Company C', ContactTitle: 'Manager', CustomerID: 4 },
  { Country: 'UK', CompanyName: 'Company C', ContactTitle: 'Director', CustomerID: 5 },
]

const localPivotSchema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Country: { caption: 'All Countries' },
      CompanyName: { caption: 'All Companies' },
      ContactTitle: { caption: 'All Titles' },
    },
    measures: {
      'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
    },
  },
}

const localPivotColumns: PivotColumn[] = [
  { name: 'Country', expand: true },
]

const localPivotRows: PivotRow[] = [
  { name: 'ContactTitle' },
]

const localPivotMeasures: string[] = ['Contacts Count']

const localPivotDataSource = ref<PivotDataSourceInstance | null>(null)
const localPivotResult = ref<PivotResult | null>(null)
const localGridRows = computed(() => {
  if (!localPivotResult.value) return []
  
  const rows: any[] = []
  const rowTuples = localPivotResult.value.rows?.tuples || []
  const colTuples = localPivotResult.value.columns?.tuples || []
  const data = localPivotResult.value.data || []

  rowTuples.forEach((rowTuple, rowIdx) => {
    const row: any = {
      rowKey: `row-${rowIdx}`,
      rowLabel: rowTuple.members?.[0]?.caption || rowTuple.members?.[0]?.name || '',
    }
    
    colTuples.forEach((colTuple, colIdx) => {
      const colLabel = colTuple.members?.[0]?.caption || colTuple.members?.[0]?.name || ''
      row[`col-${colIdx}`] = data[rowIdx]?.[colIdx]?.value || 0
      row[`col-${colIdx}-label`] = colLabel
    })
    
    rows.push(row)
  })

  return rows
})

const pivotGridColumns = computed<ColumnDef[]>(() => {
  if (!localPivotResult.value) return []
  
  const cols: ColumnDef[] = [
    { field: 'rowLabel', title: 'Row', width: 150, pinned: true },
  ]
  
  const colTuples = localPivotResult.value.columns?.tuples || []
  colTuples.forEach((colTuple, idx) => {
    const label = colTuple.members?.[0]?.caption || colTuple.members?.[0]?.name || `Column ${idx + 1}`
    cols.push({
      field: `col-${idx}`,
      title: label,
      width: 120,
      format: (value) => value != null ? String(value) : '-'
    })
  })
  
  return cols
})

function handleLocalChange(result: PivotResult) {
  localPivotResult.value = result
}

// Custom PivotDataSource
const customPivotData = [
  { Category: 'Electronics', Product: 'Laptop', Year: 2023, Sales: 15000, Quantity: 50 },
  { Category: 'Electronics', Product: 'Laptop', Year: 2024, Sales: 18000, Quantity: 60 },
  { Category: 'Electronics', Product: 'Phone', Year: 2023, Sales: 12000, Quantity: 80 },
  { Category: 'Electronics', Product: 'Phone', Year: 2024, Sales: 15000, Quantity: 100 },
  { Category: 'Clothing', Product: 'Shirt', Year: 2023, Sales: 5000, Quantity: 200 },
  { Category: 'Clothing', Product: 'Shirt', Year: 2024, Sales: 6000, Quantity: 240 },
]

const customPivotSchema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Category: { caption: 'All Categories' },
      Product: { caption: 'All Products' },
      Year: { caption: 'All Years' },
    },
    measures: {
      'Total Sales': { field: 'Sales', aggregate: 'sum', format: 'currency' },
      'Total Quantity': { field: 'Quantity', aggregate: 'sum' },
    },
  },
}

const customPivotColumns: PivotColumn[] = [
  { name: 'Year' },
]

const customPivotRows: PivotRow[] = [
  { name: 'Category' },
  { name: 'Product' },
]

const customPivotMeasures: string[] = ['Total Sales', 'Total Quantity']

const customPivotDataSource = ref<PivotDataSourceInstance | null>(null)
const customPivotResult = ref<PivotResult | null>(null)
const customGridRows = computed(() => {
  if (!customPivotResult.value) return []
  return formatPivotResultToGridRows(customPivotResult.value)
})

const customPivotGridColumns = computed<ColumnDef[]>(() => {
  if (!customPivotResult.value) return []
  
  const cols: ColumnDef[] = [
    { field: 'rowLabel', title: 'Row', width: 150, pinned: true },
  ]
  
  const colTuples = customPivotResult.value.columns?.tuples || []
  colTuples.forEach((colTuple, idx) => {
    const label = colTuple.members?.[0]?.caption || colTuple.members?.[0]?.name || `Column ${idx + 1}`
    cols.push({
      field: `col-${idx}`,
      title: label,
      width: 120,
      format: (value) => value != null ? String(value) : '-'
    })
  })
  
  return cols
})

function handleCustomChange(result: PivotResult) {
  customPivotResult.value = result
}

// Remote PivotDataSource
const remotePivotTransport: PivotDataSourceTransport = {
  read: async (_options: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      columns: {
        tuples: [
          { members: [{ caption: '2023', name: '2023' }] },
          { members: [{ caption: '2024', name: '2024' }] },
        ],
      },
      rows: {
        tuples: [
          { members: [{ caption: 'Manager', name: 'Manager' }] },
          { members: [{ caption: 'Director', name: 'Director' }] },
        ],
      },
      data: [
        [{ value: 10 }, { value: 12 }],
        [{ value: 5 }, { value: 6 }],
      ],
    }
  },
}

const remotePivotSchema: PivotDataSourceSchema = {
  data: (response: any) => response,
}

const remotePivotColumns: PivotColumn[] = [
  { name: 'Year' },
]

const remotePivotRows: PivotRow[] = [
  { name: 'ContactTitle' },
]

const remotePivotMeasures: string[] = ['Count']

const remotePivotDataSource = ref<PivotDataSourceInstance | null>(null)
const remotePivotResult = ref<PivotResult | null>(null)
const remoteGridRows = computed(() => {
  if (!remotePivotResult.value) return []
  return formatPivotResultToGridRows(remotePivotResult.value)
})

const remotePivotGridColumns = computed<ColumnDef[]>(() => {
  if (!remotePivotResult.value) return []
  
  const cols: ColumnDef[] = [
    { field: 'rowLabel', title: 'Row', width: 150, pinned: true },
  ]
  
  const colTuples = remotePivotResult.value.columns?.tuples || []
  colTuples.forEach((colTuple, idx) => {
    const label = colTuple.members?.[0]?.caption || colTuple.members?.[0]?.name || `Column ${idx + 1}`
    cols.push({
      field: `col-${idx}`,
      title: label,
      width: 120,
      format: (value) => value != null ? String(value) : '-'
    })
  })
  
  return cols
})

function handleRemoteChange(result: PivotResult) {
  remotePivotResult.value = result
}

// Standalone PivotDataSource
const standalonePivotData = [
  { Region: 'North', Product: 'A', Sales: 1000 },
  { Region: 'North', Product: 'B', Sales: 1500 },
  { Region: 'South', Product: 'A', Sales: 1200 },
  { Region: 'South', Product: 'B', Sales: 1800 },
]

const standalonePivotSchema: PivotDataSourceSchema = {
  cube: {
    dimensions: {
      Region: { caption: 'All Regions' },
      Product: { caption: 'All Products' },
    },
    measures: {
      'Total Sales': { field: 'Sales', aggregate: 'sum' },
    },
  },
}

const standalonePivotColumns = ref<PivotColumn[]>([
  { name: 'Region' },
])

const standalonePivotRows = ref<PivotRow[]>([
  { name: 'Product' },
])

const standalonePivotMeasures: string[] = ['Total Sales']

const standalonePivotDataSource = ref<PivotDataSourceInstance | null>(null)
const standalonePivotResult = ref<PivotResult | null>(null)

function handleStandaloneChange(result: PivotResult) {
  standalonePivotResult.value = result
}

const standaloneGridRows = computed(() => {
  if (!standalonePivotResult.value) return []
  return formatPivotResultToGridRows(standalonePivotResult.value)
})

const standalonePivotGridColumns = computed<ColumnDef[]>(() => {
  if (!standalonePivotResult.value) return []
  
  const cols: ColumnDef[] = [
    { field: 'rowLabel', title: 'Row', width: 150, pinned: true },
  ]
  
  const colTuples = standalonePivotResult.value.columns?.tuples || []
  colTuples.forEach((colTuple, idx) => {
    const label = colTuple.members?.[0]?.caption || colTuple.members?.[0]?.name || `Column ${idx + 1}`
    cols.push({
      field: `col-${idx}`,
      title: label,
      width: 120,
      format: (value) => value != null ? String(value) : '-'
    })
  })
  
  return cols
})

async function updateColumns() {
  if (!standalonePivotDataSource.value) return
  
  // Swap columns and rows
  standalonePivotColumns.value = [
    { name: 'Product' },
  ]
  standalonePivotRows.value = [
    { name: 'Region' },
  ]
  
  // Use query method to update
  standalonePivotDataSource.value.query({
    columns: standalonePivotColumns.value,
    rows: standalonePivotRows.value,
  })
  
  await new Promise(resolve => setTimeout(resolve, 100))
}

async function updateRows() {
  if (!standalonePivotDataSource.value) return
  
  // Change rows to have expand option
  standalonePivotRows.value = [
    { name: 'Product', expand: true },
  ]
  
  // Use query method to update
  standalonePivotDataSource.value.query({
    columns: standalonePivotColumns.value,
    rows: standalonePivotRows.value,
  })
  
  await new Promise(resolve => setTimeout(resolve, 100))
}

async function refreshData() {
  if (!standalonePivotDataSource.value) return
  
  // Reset to original configuration
  standalonePivotColumns.value = [
    { name: 'Region' },
  ]
  standalonePivotRows.value = [
    { name: 'Product' },
  ]
  
  // Use query method to refresh
  standalonePivotDataSource.value.query({
    columns: standalonePivotColumns.value,
    rows: standalonePivotRows.value,
  })
  
  await new Promise(resolve => setTimeout(resolve, 100))
}

// Helper function to format pivot result to grid rows
function formatPivotResultToGridRows(result: PivotResult): any[] {
  const rows: any[] = []
  const rowTuples = result.rows?.tuples || []
  const colTuples = result.columns?.tuples || []
  const data = result.data || []

  rowTuples.forEach((rowTuple, rowIdx) => {
    const row: any = {
      rowKey: `row-${rowIdx}`,
      rowLabel: rowTuple.members?.[0]?.caption || rowTuple.members?.[0]?.name || '',
    }
    
    colTuples.forEach((colTuple, colIdx) => {
      const colLabel = colTuple.members?.[0]?.caption || colTuple.members?.[0]?.name || `Col ${colIdx + 1}`
      row[`col-${colIdx}`] = data[rowIdx]?.[colIdx]?.value ?? null
      row[`col-${colIdx}-label`] = colLabel
    })
    
    rows.push(row)
  })

  return rows
}
</script>

