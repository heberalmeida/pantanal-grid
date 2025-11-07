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

<script setup lang="ts" generic="T extends GanttTask = GanttTask">
import { computed, ref, watch, nextTick } from 'vue'
import DataSource from './DataSource.vue'
import type { 
  GanttTask, 
  GanttDataSourceProps, 
  GanttDataSourceSchema,
  GanttDataSourceInstance,
  DataSourceInstance,
  DataSourceSchema,
  DataSourceTransport
} from '../types'
import type { SortDescriptor, FilterDescriptor } from '../types'

const props = withDefaults(defineProps<GanttDataSourceProps<T>>(), {
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
  (e: 'change', value: GanttTask[]): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
  (e: 'update:data', value: GanttTask[]): void
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
    return props.data.map(item => normalizeTask(item))
  }

  const modelFields = props.schema.model.fields
  const idField = props.schema.model.id || 'id'
  
  return props.data.map(item => mapTaskFields(item, modelFields, idField)) as T[]
})

// Normalize task to ensure GanttTask structure
function normalizeTask(item: any): GanttTask {
  return {
    id: item.id ?? item.ID ?? Date.now(),
    parentId: item.parentId ?? item.ParentID ?? item.parent_id ?? null,
    start: item.start ? (item.start instanceof Date ? item.start : new Date(item.start)) : new Date(),
    end: item.end ? (item.end instanceof Date ? item.end : new Date(item.end)) : new Date(),
    title: item.title ?? item.Title ?? '',
    percentComplete: item.percentComplete ?? item.PercentComplete ?? item.percent_complete ?? 0,
    summary: item.summary ?? item.Summary ?? false,
    expanded: item.expanded ?? item.Expanded ?? true,
    ...item,
  } as GanttTask
}

// Map task fields according to model configuration
function mapTaskFields(
  item: any, 
  modelFields: Record<string, any>, 
  idField: string | Record<string, any> = 'id'
): GanttTask {
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
  return { ...item, ...mapped } as GanttTask
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

// Convert GanttDataSource schema to DataSource schema
const normalizedSchema = computed<DataSourceSchema>(() => {
  if (!props.schema) {
    return {
      data: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data || response || [])
        return data.map((item: any) => normalizeTask(item))
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
      const mappedData = data.map((item: any) => mapTaskFields(item, modelFields, idField))

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
  emit('change', data as GanttTask[])
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
  emit('update:data', value as GanttTask[])
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

// Expose GanttDataSource instance methods
const ganttDataSourceInstance: GanttDataSourceInstance = {
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
  tasks(): GanttTask[] {
    return this.data() as GanttTask[]
  },
  add(task: Partial<GanttTask>) {
    if (props.type === 'local') {
      const currentData = (props.data as GanttTask[]) || []
      const newTask: GanttTask = {
        id: task.id || (Date.now() + Math.random()),
        parentId: task.parentId ?? null,
        start: task.start ? (task.start instanceof Date ? task.start : new Date(task.start)) : new Date(),
        end: task.end ? (task.end instanceof Date ? task.end : new Date(task.end)) : new Date(),
        title: task.title || '',
        percentComplete: task.percentComplete ?? 0,
        summary: task.summary ?? false,
        expanded: task.expanded ?? true,
        ...task,
      } as GanttTask
      
      const updatedData = [...currentData, newTask]
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
  remove(task: GanttTask | number | string) {
    if (props.type === 'local') {
      const currentData = (props.data as GanttTask[]) || []
      const id = typeof task === 'object' ? task.id : task
      const updatedData = currentData.filter(t => {
        const taskId = t.id
        if (typeof taskId === 'number' && typeof id === 'number') {
          return taskId !== id
        }
        return String(taskId) !== String(id)
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
  update(task: GanttTask) {
    if (props.type === 'local' && props.data) {
      const updatedData = (props.data as GanttTask[]).map(t => 
        t.id === task.id ? task : t
      )
      emit('update:data', updatedData)
    }
  },
}

defineExpose(ganttDataSourceInstance)
</script>
