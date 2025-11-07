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

<script setup lang="ts" generic="T extends SchedulerEvent = SchedulerEvent">
import { computed, ref, watch, nextTick } from 'vue'
import DataSource from './DataSource.vue'
import type { 
  SchedulerEvent, 
  SchedulerDataSourceProps, 
  SchedulerDataSourceSchema,
  SchedulerDataSourceSchemaModel,
  SchedulerEventFieldConfig,
  SchedulerDataSourceInstance,
  DataSourceInstance,
  DataSourceSchema,
  DataSourceTransport
} from '../types'
import type { SortDescriptor, FilterDescriptor } from '../types'

const props = withDefaults(defineProps<SchedulerDataSourceProps<T>>(), {
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
  (e: 'change', value: SchedulerEvent[]): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
  (e: 'update:data', value: SchedulerEvent[]): void
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

  if (!props.schema?.model) {
    return props.data.map(item => normalizeEvent(item))
  }

  const modelFields = props.schema.model
  const idField = props.schema.model.taskId || props.schema.model.id || 'taskId'
  
  return props.data.map(item => mapEventFields(item, modelFields, idField)) as T[]
})

// Normalize event to ensure SchedulerEvent structure
function normalizeEvent(item: any): SchedulerEvent {
  const id = item.taskId ?? item.id ?? item.TaskID ?? item.task_id ?? Date.now()
  return {
    taskId: id,
    id: id,
    title: item.title ?? item.Title ?? '',
    start: item.start ? (item.start instanceof Date ? item.start : new Date(item.start)) : new Date(),
    end: item.end ? (item.end instanceof Date ? item.end : new Date(item.end)) : new Date(),
    startTimezone: item.startTimezone ?? item.StartTimezone ?? item.start_timezone,
    endTimezone: item.endTimezone ?? item.EndTimezone ?? item.end_timezone,
    description: item.description ?? item.Description,
    recurrenceId: item.recurrenceId ?? item.RecurrenceID ?? item.recurrence_id ?? null,
    recurrenceRule: item.recurrenceRule ?? item.RecurrenceRule ?? item.recurrence_rule ?? null,
    recurrenceException: item.recurrenceException ?? item.RecurrenceException ?? item.recurrence_exception ?? null,
    ownerId: item.ownerId ?? item.OwnerID ?? item.owner_id,
    isAllDay: item.isAllDay ?? item.IsAllDay ?? item.is_all_day ?? false,
    ...item,
  } as SchedulerEvent
}

// Map event fields according to model configuration
function mapEventFields(
  item: any, 
  modelFields: SchedulerDataSourceSchemaModel, 
  idField: string | SchedulerEventFieldConfig = 'taskId'
): SchedulerEvent {
  const mapped: any = {}
  
  // Map ID field (taskId or id)
  if (typeof idField === 'string') {
    const idValue = getFieldValue(item, idField)
    mapped.taskId = idValue
    mapped.id = idValue
  } else if (typeof idField === 'object' && idField.from) {
    const idValue = getFieldValue(item, idField.from, idField.type, idField.defaultValue)
    mapped.taskId = idValue
    mapped.id = idValue
  } else {
    const id = item.taskId ?? item.id ?? item.TaskID ?? item.task_id ?? Date.now()
    mapped.taskId = id
    mapped.id = id
  }

  // Map other fields
  Object.keys(modelFields).forEach(fieldKey => {
    if (fieldKey === 'id' || fieldKey === 'taskId') return // Already handled
    
    const fieldConfig = modelFields[fieldKey]
    if (typeof fieldConfig === 'string') {
      mapped[fieldKey] = getFieldValue(item, fieldConfig)
    } else if (fieldConfig && typeof fieldConfig === 'object' && fieldConfig.from) {
      const value = getFieldValue(item, fieldConfig.from, fieldConfig.type, fieldConfig.defaultValue)
      mapped[fieldKey] = fieldConfig.parse ? fieldConfig.parse(value) : value
    }
  })

  // Merge with original item to preserve unmapped fields
  return { ...item, ...mapped } as SchedulerEvent
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

// Convert SchedulerDataSource schema to DataSource schema
const normalizedSchema = computed<DataSourceSchema>(() => {
  if (!props.schema) {
    return {
      data: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data || response || [])
        return data.map((item: any) => normalizeEvent(item))
      },
    }
  }

  const baseSchema: DataSourceSchema = {
    data: props.schema.data,
    total: props.schema.total,
    errors: props.schema.errors,
    aggregates: props.schema.aggregates,
    groups: props.schema.groups,
  }

  // If model is defined, wrap the data function to normalize events
  if (props.schema.model) {
    const originalData = baseSchema.data
    const modelFields = props.schema.model
    const idField = props.schema.model.taskId || props.schema.model.id || 'taskId'

    baseSchema.data = (response: any) => {
      let data = originalData ? originalData(response) : response
      if (!Array.isArray(data)) {
        data = data?.data || data || []
      }
      return data.map((item: any) => {
        if (!modelFields || (!modelFields.fields && !modelFields.id && !modelFields.taskId)) {
          return normalizeEvent(item)
        }
        return mapEventFields(item, modelFields, idField)
      })
    }
  }

  return baseSchema
})

// Normalize transport
const normalizedTransport = computed<DataSourceTransport | undefined>(() => {
  if (!props.transport) return undefined

  return {
    ...props.transport,
    // Apply timezone if specified in schema
    parameterMap: (options: any, operation: string) => {
      let params = props.transport?.parameterMap 
        ? props.transport.parameterMap(options, operation)
        : options

      if (props.schema?.timezone && operation === 'read') {
        params = { ...params, timezone: props.schema.timezone }
      }

      return params
    },
  }
})

// Event handlers
function handleChange(data: any[]) {
  emit('change', data as SchedulerEvent[])
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
  emit('update:data', value as SchedulerEvent[])
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

// Watch for data changes and trigger read if autoSync is enabled
watch(() => props.data, () => {
  if (props.autoSync && props.type === 'local') {
    nextTick(() => {
      const ds = dataSourceRef.value as any
      if (ds) {
        ds.read()
      }
    })
  }
}, { immediate: true })

// Expose SchedulerDataSource instance methods
const schedulerDataSourceInstance: SchedulerDataSourceInstance = {
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
  events(): SchedulerEvent[] {
    return this.data() as SchedulerEvent[]
  },
  add(event: Partial<SchedulerEvent>) {
    if (props.type === 'local') {
      const currentData = (props.data as SchedulerEvent[]) || []
      const newEvent: SchedulerEvent = {
        taskId: event.taskId || event.id || (Date.now() + Math.random()),
        id: event.id || event.taskId || (Date.now() + Math.random()),
        title: event.title || '',
        start: event.start ? (event.start instanceof Date ? event.start : new Date(event.start)) : new Date(),
        end: event.end ? (event.end instanceof Date ? event.end : new Date(event.end)) : new Date(),
        startTimezone: event.startTimezone,
        endTimezone: event.endTimezone,
        description: event.description,
        recurrenceId: event.recurrenceId ?? null,
        recurrenceRule: event.recurrenceRule ?? null,
        recurrenceException: event.recurrenceException ?? null,
        ownerId: event.ownerId,
        isAllDay: event.isAllDay ?? false,
        ...event,
      } as SchedulerEvent
      
      const updatedData = [...currentData, newEvent]
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
  remove(event: SchedulerEvent | number | string) {
    if (props.type === 'local') {
      const currentData = (props.data as SchedulerEvent[]) || []
      const id = typeof event === 'object' 
        ? (event.taskId || event.id) 
        : event
      const updatedData = currentData.filter(e => {
        const eventId = e.taskId || e.id
        if (typeof eventId === 'number' && typeof id === 'number') {
          return eventId !== id
        }
        return String(eventId) !== String(id)
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
  update(event: SchedulerEvent) {
    if (props.type === 'local' && props.data) {
      const eventId = event.taskId || event.id
      const updatedData = (props.data as SchedulerEvent[]).map(e => {
        const eId = e.taskId || e.id
        if ((typeof eId === 'number' && typeof eventId === 'number' && eId === eventId) ||
            (String(eId) === String(eventId))) {
          return event
        }
        return e
      })
      emit('update:data', updatedData)
      
      // Force DataSource to update by triggering read after nextTick
      nextTick(() => {
        const ds = dataSourceRef.value as any
        if (ds) {
          ds.read()
        }
      })
    }
  },
}

defineExpose(schedulerDataSourceInstance)
</script>

