<template>
  <div></div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { 
  PivotDataSourceProps,
  PivotDataSourceInstance,
  PivotColumn,
  PivotRow,
  PivotMeasure,
  PivotCube,
  PivotResult,
  PivotAxis,
  PivotCell
} from '../types'

const props = withDefaults(defineProps<PivotDataSourceProps>(), {
  type: 'local',
  autoSync: false,
  columns: () => [],
  rows: () => [],
  measures: () => [],
})

const emit = defineEmits<{
  (e: 'change', value: PivotResult): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
}>()

// Internal state
const pivotData = ref<PivotResult | null>(null)
const columns = ref<PivotColumn[]>([])
const rows = ref<PivotRow[]>([])
const measures = ref<PivotMeasure[]>([])

// Normalize columns
watch(() => props.columns, (cols) => {
  if (Array.isArray(cols)) {
    columns.value = cols.map(col => 
      typeof col === 'string' ? { name: col } : col
    )
  }
}, { immediate: true, deep: true })

// Normalize rows
watch(() => props.rows, (rws) => {
  if (Array.isArray(rws)) {
    rows.value = rws.map(row => 
      typeof row === 'string' ? { name: row } : row
    )
  }
}, { immediate: true, deep: true })

// Normalize measures
watch(() => props.measures, (msrs) => {
  if (Array.isArray(msrs)) {
    measures.value = msrs.map(measure => 
      typeof measure === 'string' ? { name: measure } : measure
    )
  }
}, { immediate: true, deep: true })

// Process local data if type is local
const processedData = computed(() => {
  if (props.type !== 'local' || !props.data) {
    return null
  }

  return processLocalPivotData(props.data, props.schema?.cube, columns.value, rows.value, measures.value)
})

// Process local pivot data
function processLocalPivotData(
  data: any[],
  cube: PivotCube | undefined,
  cols: PivotColumn[],
  rws: PivotRow[],
  msrs: PivotMeasure[]
): PivotResult {
  if (!data || data.length === 0) {
    return {
      columns: { tuples: [] },
      rows: { tuples: [] },
      data: []
    }
  }

  // If no cube config, return empty result
  if (!cube) {
    return {
      columns: { tuples: [] },
      rows: { tuples: [] },
      data: []
    }
  }

  // Get dimension and measure configurations
  const measureConfigs = cube.measures || {}

  // Process columns - get unique values from first column dimension
  const columnTuples: any[] = []
  if (cols.length > 0 && cols[0].name) {
    const colDimName = cols[0].name
    const uniqueValues = [...new Set(data.map(item => item[colDimName]).filter(v => v != null))]
    columnTuples.push(...uniqueValues.sort().map(val => ({
      members: [{ caption: String(val), name: String(val) }]
    })))
  }

  // Process rows - get unique values from first row dimension
  const rowTuples: any[] = []
  if (rws.length > 0 && rws[0].name) {
    const rowDimName = rws[0].name
    const uniqueValues = [...new Set(data.map(item => item[rowDimName]).filter(v => v != null))]
    rowTuples.push(...uniqueValues.sort().map(val => ({
      members: [{ caption: String(val), name: String(val) }]
    })))
  }

  // If no columns or rows, return empty result
  if (columnTuples.length === 0 && rowTuples.length === 0) {
    return {
      columns: { tuples: columnTuples },
      rows: { tuples: rowTuples },
      data: []
    }
  }

  // If no columns, create a single column for totals
  if (columnTuples.length === 0) {
    columnTuples.push({ members: [{ caption: 'Total', name: 'Total' }] })
  }

  // If no rows, create a single row for totals
  if (rowTuples.length === 0) {
    rowTuples.push({ members: [{ caption: 'Total', name: 'Total' }] })
  }

  // Process data cells
  const cells: PivotCell[][] = []
  for (const rowTuple of rowTuples) {
    const rowCells: PivotCell[] = []
    for (const colTuple of columnTuples) {
      const rowValue = rowTuple.members[0]?.name
      const colValue = colTuple.members[0]?.name
      
      // Filter data for this cell
      let cellData = data
      if (rws.length > 0 && rws[0].name && rowValue !== 'Total') {
        cellData = cellData.filter(item => String(item[rws[0].name]) === String(rowValue))
      }
      if (cols.length > 0 && cols[0].name && colValue !== 'Total') {
        cellData = cellData.filter(item => String(item[cols[0].name]) === String(colValue))
      }

      // Calculate measure
      let cellValue: any = 0
      if (msrs.length > 0) {
        const measureName = typeof msrs[0] === 'string' ? msrs[0] : msrs[0].name
        const measure = measureConfigs[measureName || '']
        
        if (measure) {
          if (measure.aggregate === 'count') {
            cellValue = cellData.length
          } else if (measure.aggregate === 'sum' && measure.field) {
            cellValue = cellData.reduce((sum, item) => sum + (Number(item[measure.field!]) || 0), 0)
          } else if (measure.aggregate === 'avg' && measure.field) {
            const sum = cellData.reduce((sum, item) => sum + (Number(item[measure.field!]) || 0), 0)
            cellValue = cellData.length > 0 ? sum / cellData.length : 0
          } else if (measure.aggregate === 'min' && measure.field) {
            cellValue = cellData.length > 0 
              ? Math.min(...cellData.map(item => Number(item[measure.field!]) || 0))
              : 0
          } else if (measure.aggregate === 'max' && measure.field) {
            cellValue = cellData.length > 0
              ? Math.max(...cellData.map(item => Number(item[measure.field!]) || 0))
              : 0
          }
        } else if (typeof msrs[0] === 'object' && msrs[0].aggregate) {
          // Handle inline measure definition
          const inlineMeasure = msrs[0]
          if (inlineMeasure.aggregate === 'count') {
            cellValue = cellData.length
          } else if (inlineMeasure.aggregate === 'sum' && inlineMeasure.field) {
            cellValue = cellData.reduce((sum, item) => sum + (Number(item[inlineMeasure.field!]) || 0), 0)
          } else if (inlineMeasure.aggregate === 'avg' && inlineMeasure.field) {
            const sum = cellData.reduce((sum, item) => sum + (Number(item[inlineMeasure.field!]) || 0), 0)
            cellValue = cellData.length > 0 ? sum / cellData.length : 0
          } else if (inlineMeasure.aggregate === 'min' && inlineMeasure.field) {
            cellValue = cellData.length > 0 
              ? Math.min(...cellData.map(item => Number(item[inlineMeasure.field!]) || 0))
              : 0
          } else if (inlineMeasure.aggregate === 'max' && inlineMeasure.field) {
            cellValue = cellData.length > 0
              ? Math.max(...cellData.map(item => Number(item[inlineMeasure.field!]) || 0))
              : 0
          }
        }
      }

      const measureName = typeof msrs[0] === 'string' ? msrs[0] : msrs[0]?.name
      const measureConfig = measureConfigs[measureName || ''] || (typeof msrs[0] === 'object' ? msrs[0] : undefined)

      rowCells.push({
        value: cellValue,
        formattedValue: formatValue(cellValue, typeof msrs[0] === 'string' ? { name: msrs[0] } : msrs[0], measureConfig)
      })
    }
    cells.push(rowCells)
  }

  return {
    columns: { tuples: columnTuples },
    rows: { tuples: rowTuples },
    data: cells
  }
}

// Format value based on measure
function formatValue(value: any, measure?: PivotMeasure | { name?: string }, measureConfig?: PivotMeasure): string {
  if (value == null || value === '') return ''
  
  const config = measureConfig || (measure && typeof measure === 'object' && 'aggregate' in measure ? measure : undefined)
  
  if (config?.format) {
    // Simple number formatting
    const num = Number(value)
    if (!isNaN(num)) {
      if (config.format === 'currency') {
        return num.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    }
  }
  
  // Default formatting for numbers
  const num = Number(value)
  if (!isNaN(num)) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }
  
  return String(value)
}

// Read data from remote source
async function read(): Promise<void> {
  if (props.type === 'local') {
    if (processedData.value) {
      pivotData.value = processedData.value
      emit('change', processedData.value)
    }
    return
  }

  if (!props.transport?.read) {
    return
  }

  try {
    emit('requestStart', { type: 'read' })

    let response: any
    if (typeof props.transport.read === 'string') {
      const url = new URL(props.transport.read, window.location.origin)
      // Add pivot parameters
      const params = new URLSearchParams()
      if (columns.value.length > 0) {
        params.append('columns', JSON.stringify(columns.value))
      }
      if (rows.value.length > 0) {
        params.append('rows', JSON.stringify(rows.value))
      }
      if (measures.value.length > 0) {
        params.append('measures', JSON.stringify(measures.value))
      }
      url.search = params.toString()

      const res = await fetch(url.toString())
      response = await res.json()
    } else {
      response = await props.transport.read({
        columns: columns.value,
        rows: rows.value,
        measures: measures.value,
        type: 'read'
      })
    }

    // Parse response using schema
    let parsed: PivotResult
    if (props.schema?.data) {
      if (typeof props.schema.data === 'function') {
        parsed = props.schema.data(response) as PivotResult
      } else {
        parsed = response[props.schema.data] as PivotResult
      }
    } else {
      parsed = response as PivotResult
    }

    pivotData.value = parsed
    emit('change', parsed)
    emit('requestEnd', { type: 'read' })
  } catch (error: any) {
    emit('error', error)
    emit('requestEnd', { type: 'read' })
    throw error
  }
}

// Sync data
async function sync(): Promise<void> {
  emit('sync', {})
  await read()
}

// Query with options
function query(options?: any): void {
  if (options) {
    if (options.columns) {
      columns.value = Array.isArray(options.columns)
        ? options.columns.map((col: any) => typeof col === 'string' ? { name: col } : col)
        : columns.value
    }
    if (options.rows) {
      rows.value = Array.isArray(options.rows)
        ? options.rows.map((row: any) => typeof row === 'string' ? { name: row } : row)
        : rows.value
    }
    if (options.measures) {
      measures.value = Array.isArray(options.measures)
        ? options.measures.map((measure: any) => typeof measure === 'string' ? { name: measure } : measure)
        : measures.value
    }
  }
  
  // Force reprocessing of data
  if (props.type === 'local') {
    // Manually process data with current state to ensure it uses updated columns/rows
    const newData = processLocalPivotData(
      props.data || [],
      props.schema?.cube,
      columns.value,
      rows.value,
      measures.value
    )
    pivotData.value = newData
    emit('change', newData)
  } else {
    read()
  }
}

// Get axes
function axes(): { columns: PivotAxis; rows: PivotAxis } | null {
  if (!pivotData.value) return null
  return {
    columns: pivotData.value.columns,
    rows: pivotData.value.rows
  }
}

// Watch for props changes and update internal state
watch(() => props.columns, (cols) => {
  if (Array.isArray(cols)) {
    columns.value = cols.map(col => 
      typeof col === 'string' ? { name: col } : col
    )
  }
}, { immediate: true, deep: true })

watch(() => props.rows, (rws) => {
  if (Array.isArray(rws)) {
    rows.value = rws.map(row => 
      typeof row === 'string' ? { name: row } : row
    )
  }
}, { immediate: true, deep: true })

watch(() => props.measures, (msrs) => {
  if (Array.isArray(msrs)) {
    measures.value = msrs.map(measure => 
      typeof measure === 'string' ? { name: measure } : measure
    )
  }
}, { immediate: true, deep: true })

// Watch for data processing changes
watch(() => [props.data, props.schema?.cube, columns.value, rows.value, measures.value], () => {
  if (props.type === 'local') {
    if (processedData.value) {
      pivotData.value = processedData.value
      emit('change', processedData.value)
    }
  }
}, { immediate: true, deep: true })

// Watch for type changes
watch(() => props.type, () => {
  if (props.type === 'local') {
    if (processedData.value) {
      pivotData.value = processedData.value
      emit('change', processedData.value)
    }
  } else {
    read()
  }
})

// Expose PivotDataSource instance methods
const pivotDataSourceInstance: PivotDataSourceInstance = {
  data() {
    return pivotData.value || { columns: { tuples: [] }, rows: { tuples: [] }, data: [] }
  },
  total() {
    if (!pivotData.value) return 0
    return pivotData.value.data?.flat().length || 0
  },
  async read() {
    await read()
  },
  async sync() {
    await sync()
  },
  query(options) {
    query(options)
  },
  axes() {
    return axes()
  },
  measures() {
    return measures.value
  },
  columns() {
    return columns.value
  },
  rows() {
    return rows.value
  },
}

// Initial read
onMounted(() => {
  if (props.type === 'local') {
    if (processedData.value) {
      pivotData.value = processedData.value
      emit('change', processedData.value)
    }
  } else if (props.autoSync) {
    read()
  }
})

defineExpose(pivotDataSourceInstance)
</script>

