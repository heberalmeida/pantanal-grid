<template>
  <DataSource
    ref="dataSourceRef"
    :data="normalizedData"
    :transport="normalizedTransport"
    :schema="normalizedSchema"
    :type="props.type"
    :page="props.page"
    :pageSize="props.pageSize"
    :sort="props.sort"
    :filter="props.filter"
    :group="props.group"
    :serverPaging="props.serverPaging"
    :serverFiltering="props.serverFiltering"
    :serverSorting="props.serverSorting"
    :serverGrouping="props.serverGrouping"
    :autoSync="props.autoSync"
    :batch="props.batch"
    @change="handleChange"
    @error="handleError"
    @requestStart="handleRequestStart"
    @requestEnd="handleRequestEnd"
    @sync="handleSync"
    @update:data="handleUpdateData"
    @update:page="handleUpdatePage"
    @update:pageSize="handleUpdatePageSize"
    @update:sort="handleUpdateSort"
    @update:filter="handleUpdateFilter"
    @update:group="handleUpdateGroup"
  />
</template>

<script setup lang="ts" generic="T extends GanttDependency = GanttDependency">
import { computed, ref, watch, nextTick } from 'vue'
import DataSource from './DataSource.vue'
import type { 
  GanttDependency, 
  GanttDependencyDataSourceProps, 
  GanttDependencyDataSourceSchema,
  GanttDependencyDataSourceInstance,
  DataSourceInstance,
  DataSourceSchema,
  DataSourceTransport,
  GanttTaskFieldConfig
} from '../types'
import type { SortDescriptor, FilterDescriptor } from '../types'

const props = withDefaults(defineProps<GanttDependencyDataSourceProps<T>>(), {
  type: 'local',
  page: 1,
  pageSize: 20,
  serverPaging: false,
  serverFiltering: false,
  serverSorting: false,
  serverGrouping: false,
  autoSync: false,
  batch: false,
  sort: () => [],
  filter: () => [],
  group: () => [],
})

const emit = defineEmits<{
  (e: 'change', value: GanttDependency[]): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
  (e: 'update:data', value: GanttDependency[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'update:group', value: any[]): void
}>()

const dataSourceRef = ref<InstanceType<typeof DataSource> | null>(null)

// Normalize data if local and model fields are defined
const normalizedData = computed<T[] | undefined>(() => {
  if (!props.data || props.type !== 'local') {
    return props.data
  }

  if (!props.schema?.model?.fields) {
    return props.data.map(item => normalizeDependency(item))
  }

  const modelFields = props.schema.model.fields
  const idField = props.schema.model.id || 'id'
  
  return props.data.map(item => mapDependencyFields(item, modelFields, idField)) as T[]
})

// Normalize dependency to ensure GanttDependency structure
function normalizeDependency(item: any): GanttDependency {
  return {
    id: item.id ?? item.ID ?? Date.now(),
    predecessorId: item.predecessorId ?? item.PredecessorID ?? item.predecessor_id ?? '',
    successorId: item.successorId ?? item.SuccessorID ?? item.successor_id ?? '',
    type: item.type ?? item.Type ?? 0,
    ...item,
  } as GanttDependency
}

// Map dependency fields according to model configuration
function mapDependencyFields(
  item: any, 
  modelFields: Record<string, any>, 
  idField: string | Record<string, any> = 'id'
): GanttDependency {
  const mapped: any = {}
  
  // Map ID field
  if (typeof idField === 'string') {
    mapped.id = getFieldValue(item, idField)
  } else if (typeof idField === 'object' && idField.from) {
    mapped.id = getFieldValue(item, idField.from, idField.type, idField.defaultValue)
  } else {
    mapped.id = item.id ?? item.ID ?? Date.now()
  }

  // Map other fields
  Object.keys(modelFields).forEach(fieldKey => {
    const fieldConfig = modelFields[fieldKey]
    if (typeof fieldConfig === 'string') {
      mapped[fieldKey] = getFieldValue(item, fieldConfig)
    } else if (fieldConfig && typeof fieldConfig === 'object' && fieldConfig.from) {
      const value = getFieldValue(item, fieldConfig.from, fieldConfig.type, fieldConfig.defaultValue)
      mapped[fieldKey] = fieldConfig.parse ? fieldConfig.parse(value) : value
    }
  })

  // Merge with original item to preserve unmapped fields
  return { ...item, ...mapped } as GanttDependency
}

function getFieldValue(item: any, field: string, type?: string, defaultValue?: any): any {
  const value = item[field] !== undefined && item[field] !== null ? item[field] : defaultValue

  if (value === undefined || value === null) {
    return defaultValue
  }

  if (type === 'date') {
    return value ? new Date(value) : defaultValue
  }
  if (type === 'number') {
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }
  if (type === 'boolean') {
    return Boolean(value)
  }

  return value
}

// Convert GanttDependencyDataSource schema to DataSource schema
const normalizedSchema = computed<DataSourceSchema>(() => {
  if (!props.schema) {
    return {
      data: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data || response || [])
        return data.map((item: any) => normalizeDependency(item))
      },
    }
  }

  const baseSchema: DataSourceSchema = {
    data: props.schema.data,
    total: props.schema.total,
    errors: props.schema.errors,
  }

  // Add model-based field mapping through parse function
  if (props.schema.model?.fields) {
    const modelFields = props.schema.model.fields
    const idField = props.schema.model.id || 'id'
    const originalParse = props.schema.parse

    baseSchema.parse = (response: any) => {
      // Apply original parse if exists
      let parsed = originalParse ? originalParse(response) : response

      // Extract data array
      let data: any[] = []
      if (Array.isArray(parsed)) {
        data = parsed
      } else if (parsed?.data && Array.isArray(parsed.data)) {
        data = parsed.data
      } else if (typeof baseSchema.data === 'function') {
        data = baseSchema.data(parsed) || []
      } else if (baseSchema.data && typeof baseSchema.data === 'string') {
        data = parsed?.[baseSchema.data] || []
      } else {
        data = parsed?.data || []
      }

      // Map fields according to model configuration
      const mappedData = data.map((item: any) => mapDependencyFields(item, modelFields, idField))

      if (Array.isArray(parsed)) {
        return mappedData
      }

      return {
        ...parsed,
        data: mappedData,
      }
    }
  } else if (props.schema.parse) {
    baseSchema.parse = props.schema.parse
  }

  return baseSchema
})

// Normalize transport with parameterMap for Gantt operations
const normalizedTransport = computed<DataSourceTransport | undefined>(() => {
  if (!props.transport) return undefined

  const originalParameterMap = props.transport.parameterMap

  return {
    ...props.transport,
    parameterMap: (data: any, type: string) => {
      // For Gantt, transform data structure for create/update/destroy
      if (type === 'create' || type === 'update' || type === 'destroy') {
        // Gantt typically sends models array in batch mode
        if (props.batch && Array.isArray(data)) {
          return { models: JSON.stringify(data) }
        }
        return data
      }

      // For read operations, use original parameterMap if provided
      if (originalParameterMap) {
        return originalParameterMap(data, type)
      }

      return data
    },
  }
})

// Event handlers
function handleChange(data: any[]) {
  emit('change', data as GanttDependency[])
}

function handleError(error: any) {
  emit('error', error)
}

function handleRequestStart(options: any) {
  emit('requestStart', options)
}

function handleRequestEnd(options: any) {
  emit('requestEnd', options)
}

function handleSync(options: any) {
  emit('sync', options)
}

function handleUpdateData(value: any[]) {
  emit('update:data', value as GanttDependency[])
}

function handleUpdatePage(value: number) {
  emit('update:page', value)
}

function handleUpdatePageSize(value: number) {
  emit('update:pageSize', value)
}

function handleUpdateSort(value: SortDescriptor[]) {
  emit('update:sort', value)
}

function handleUpdateFilter(value: FilterDescriptor[]) {
  emit('update:filter', value)
}

function handleUpdateGroup(value: any[]) {
  emit('update:group', value)
}

// Watch for dataSourceRef to be available
watch(() => dataSourceRef.value, (ds) => {
  if (ds) {
    // DataSource is now available
  }
}, { immediate: true })

// Expose GanttDependencyDataSource instance methods
const ganttDependencyDataSourceInstance: GanttDependencyDataSourceInstance = {
  data() {
    const ds = dataSourceRef.value as any
    return ds?.data?.() || []
  },
  total() {
    const ds = dataSourceRef.value as any
    return ds?.total?.() || 0
  },
  async read() {
    const ds = dataSourceRef.value as any
    await ds?.read?.()
  },
  async sync() {
    const ds = dataSourceRef.value as any
    await ds?.sync?.()
  },
  query(options) {
    const ds = dataSourceRef.value as any
    ds?.query?.(options)
  },
  dependencies(): GanttDependency[] {
    return this.data() as GanttDependency[]
  },
  add(dependency: Partial<GanttDependency>) {
    if (props.type === 'local') {
      const currentData = (props.data as GanttDependency[]) || []
      const newDependency: GanttDependency = {
        id: dependency.id || (Date.now() + Math.random()),
        predecessorId: dependency.predecessorId || '',
        successorId: dependency.successorId || '',
        type: dependency.type ?? 0,
        ...dependency,
      } as GanttDependency
      
      const updatedData = [...currentData, newDependency]
      // Emit update:data first
      emit('update:data', updatedData)
      
      // Force DataSource to update by triggering read after nextTick
      nextTick(() => {
        const ds = dataSourceRef.value as any
        if (ds) {
          // Update internal data directly to avoid watcher issues
          ds.read()
        }
      })
    }
  },
  remove(dependency: GanttDependency | number | string) {
    if (props.type === 'local') {
      const currentData = (props.data as GanttDependency[]) || []
      const id = typeof dependency === 'object' ? dependency.id : dependency
      const updatedData = currentData.filter(d => {
        const depId = d.id
        if (typeof depId === 'number' && typeof id === 'number') {
          return depId !== id
        }
        return String(depId) !== String(id)
      })
      // Emit update:data first
      emit('update:data', updatedData)
      
      // Force DataSource to update by triggering read after nextTick
      nextTick(() => {
        const ds = dataSourceRef.value as any
        if (ds) {
          // Update internal data directly to avoid watcher issues
          ds.read()
        }
      })
    }
  },
  update(dependency: GanttDependency) {
    if (props.type === 'local' && props.data) {
      const updatedData = (props.data as GanttDependency[]).map(d => 
        d.id === dependency.id ? dependency : d
      )
      emit('update:data', updatedData)
    }
  },
}

defineExpose(ganttDependencyDataSourceInstance)
</script>

