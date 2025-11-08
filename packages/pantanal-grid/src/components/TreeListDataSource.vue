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

<script setup lang="ts" generic="T extends TreeListNode = TreeListNode">
import { computed, ref, watch, nextTick } from 'vue'
import DataSource from './DataSource.vue'
import type { 
  TreeListNode, 
  TreeListDataSourceProps, 
  TreeListDataSourceSchemaModel,
  TreeListFieldConfig,
  TreeListDataSourceInstance,
  DataSourceInstance,
  DataSourceSchema,
  DataSourceTransport
} from '../types'
import type { SortDescriptor, FilterDescriptor } from '../types'

const props = withDefaults(defineProps<TreeListDataSourceProps<T>>(), {
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
  (e: 'change', value: TreeListNode[]): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
  (e: 'update:data', value: TreeListNode[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'update:group', value: any[]): void
}>()

const dataSourceRef = ref<DataSourceInstance | null>(null)

// Internal state for tree nodes
const treeNodes = ref<TreeListNode[]>([])
const expandedNodes = ref<Set<string | number>>(new Set())

// Normalize data if local and process tree structure
const normalizedData = computed<TreeListNode[] | undefined>(() => {
  if (!props.data || props.type !== 'local') {
    return props.data as TreeListNode[] | undefined
  }

  if (!props.schema?.model) {
    return props.data.map(item => normalizeNode(item))
  }

  const modelFields = props.schema.model
  const idField = getModelField(modelFields.id, 'id')
  const parentIdField = getModelField(modelFields.parentId, 'parentId')
  
  return props.data.map(item => mapTreeListFields(item, modelFields, idField, parentIdField))
})

// Normalize node to ensure TreeListNode structure
function normalizeNode(item: any): TreeListNode {
  const id = item.id ?? item.ID ?? item.employeeId ?? item.EmployeeID ?? Date.now()
  const parentId = item.parentId ?? item.parent_id ?? item.reportsTo ?? item.ReportsTo ?? null
  
  return {
    id,
    parentId: parentId !== undefined && parentId !== null ? parentId : null,
    expanded: item.expanded ?? item.Expanded ?? expandedNodes.value.has(id),
    ...item,
  } as TreeListNode
}

// Get field name from model config
function getModelField(fieldConfig: TreeListFieldConfig | string | undefined, defaultField: string): string {
  if (!fieldConfig) return defaultField
  if (typeof fieldConfig === 'string') return fieldConfig
  return fieldConfig.field || defaultField
}

// Map tree list fields according to model configuration
function mapTreeListFields(
  item: any, 
  modelFields: TreeListDataSourceSchemaModel,
  idField: string,
  parentIdField: string
): TreeListNode {
  const mapped: any = {}
  
  // Map ID field
  const idValue = getFieldValue(item, idField, modelFields.id)
  mapped.id = idValue

  // Map parentId field
  const parentIdValue = getFieldValue(item, parentIdField, modelFields.parentId)
  mapped.parentId = parentIdValue !== undefined && parentIdValue !== null ? parentIdValue : null

  // Map expanded
  if (modelFields.expanded !== undefined) {
    if (typeof modelFields.expanded === 'boolean') {
      mapped.expanded = modelFields.expanded
    } else if (typeof modelFields.expanded === 'string') {
      mapped.expanded = item[modelFields.expanded] ?? false
    } else if (typeof modelFields.expanded === 'function') {
      mapped.expanded = modelFields.expanded(item)
    } else {
      mapped.expanded = expandedNodes.value.has(idValue)
    }
  } else {
    mapped.expanded = expandedNodes.value.has(idValue)
  }

  // Map other fields from fields config
  if (modelFields.fields) {
    Object.keys(modelFields.fields).forEach(fieldKey => {
      if (fieldKey === 'id' || fieldKey === 'parentId') return // Already handled
      
      const fieldConfig = modelFields.fields![fieldKey]
      const fieldName = fieldConfig.field || fieldKey
      const value = getFieldValue(item, fieldName, fieldConfig)
      mapped[fieldKey] = fieldConfig.parse ? fieldConfig.parse(value) : value
    })
  }

  // Merge with original item to preserve unmapped fields
  return { ...item, ...mapped } as TreeListNode
}

function getFieldValue(item: any, field: string, fieldConfig?: TreeListFieldConfig | string): any {
  let value = item[field]

  if (fieldConfig && typeof fieldConfig === 'object') {
    if (value === undefined || value === null) {
      value = fieldConfig.defaultValue
    }

    if (value === undefined || value === null) {
      return fieldConfig.defaultValue
    }

    if (fieldConfig.type === 'date') {
      return value ? new Date(value) : fieldConfig.defaultValue
    }
    if (fieldConfig.type === 'number') {
      const num = Number(value)
      return isNaN(num) ? (fieldConfig.defaultValue ?? null) : num
    }
    if (fieldConfig.type === 'boolean') {
      return Boolean(value)
    }

    return value
  }

  return value
}

// Convert TreeListDataSource schema to DataSource schema
const normalizedSchema = computed<DataSourceSchema>(() => {
  if (!props.schema) {
    return {
      data: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data || response || [])
        return data.map((item: any) => normalizeNode(item))
      },
    }
  }

  const baseSchema: DataSourceSchema = {
    data: props.schema.data,
    total: props.schema.total,
    errors: props.schema.errors,
  }

  // If model is defined, wrap the data function to normalize nodes
  if (props.schema.model) {
    const originalData = baseSchema.data
    const modelFields = props.schema.model
    const idField = getModelField(modelFields.id, 'id')
    const parentIdField = getModelField(modelFields.parentId, 'parentId')

    baseSchema.data = (response: any) => {
      let data: any
      if (originalData && typeof originalData === 'function') {
        data = originalData(response)
      } else if (typeof originalData === 'string' && response && response[originalData]) {
        data = response[originalData]
      } else {
        data = response
      }
      if (!Array.isArray(data)) {
        data = data?.data || data || []
      }
      return data.map((item: any) => mapTreeListFields(item, modelFields, idField, parentIdField))
    }
  }

  return baseSchema
})

// Normalize transport
const normalizedTransport = computed<DataSourceTransport | undefined>(() => {
  return props.transport
})

// Event handlers
function handleChange(data: any[]) {
  treeNodes.value = data as TreeListNode[]
  emit('change', data as TreeListNode[])
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
  emit('update:data', value as TreeListNode[])
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

// Helper functions for tree operations
function getNodeId(node: TreeListNode | number | string): string | number {
  if (typeof node === 'object') {
    return node.id
  }
  return node
}

function findNode(nodes: TreeListNode[], id: string | number): TreeListNode | null {
  // Since TreeList uses flat structure with parentId, we can search directly
  for (const node of nodes) {
    const nodeId = node.id
    if ((typeof nodeId === 'number' && typeof id === 'number' && nodeId === id) ||
        (String(nodeId) === String(id))) {
      return node
    }
  }
  return null
}

function getRootNodes(nodes: TreeListNode[]): TreeListNode[] {
  return nodes.filter(node => !node.parentId || node.parentId === null)
}

// Expose TreeListDataSource instance methods
const treeListDataSourceInstance: TreeListDataSourceInstance = {
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
  rootNodes(): TreeListNode[] {
    const nodes = this.data()
    return getRootNodes(nodes)
  },
  getNode(id: number | string): TreeListNode | null {
    const nodes = this.data()
    return findNode(nodes, id)
  },
  expand(node: TreeListNode | number | string) {
    const nodeId = getNodeId(node)
    expandedNodes.value.add(nodeId)
    
    // Update the node's expanded state
    const nodes = this.data()
    const targetNode = typeof node === 'object' ? node : findNode(nodes, nodeId)
    if (targetNode) {
      targetNode.expanded = true
      emit('update:data', [...nodes])
    }
    
    nextTick(() => {
      const ds = dataSourceRef.value as any
      if (ds) {
        ds.read()
      }
    })
  },
  collapse(node: TreeListNode | number | string) {
    const nodeId = getNodeId(node)
    expandedNodes.value.delete(nodeId)
    
    // Update the node's expanded state
    const nodes = this.data()
    const targetNode = typeof node === 'object' ? node : findNode(nodes, nodeId)
    if (targetNode) {
      targetNode.expanded = false
      emit('update:data', [...nodes])
    }
    
    nextTick(() => {
      const ds = dataSourceRef.value as any
      if (ds) {
        ds.read()
      }
    })
  },
  add(node: Partial<TreeListNode>) {
    if (props.type === 'local') {
      const currentData = (props.data as TreeListNode[]) || []
      const newNode: TreeListNode = {
        id: node.id || (Date.now() + Math.random()),
        parentId: node.parentId ?? null,
        expanded: node.expanded ?? false,
        ...node,
      } as TreeListNode
      
      const updatedData = [...currentData, newNode]
      emit('update:data', updatedData)
      
      nextTick(() => {
        const ds = dataSourceRef.value as any
        if (ds) {
          ds.read()
        }
      })
    }
  },
  remove(node: TreeListNode | number | string) {
    if (props.type === 'local') {
      const currentData = (props.data as TreeListNode[]) || []
      const id = typeof node === 'object' ? node.id : node
      const updatedData = currentData.filter(n => {
        const nodeId = n.id
        if (typeof nodeId === 'number' && typeof id === 'number') {
          return nodeId !== id
        }
        return String(nodeId) !== String(id)
      })
      emit('update:data', updatedData)
      
      nextTick(() => {
        const ds = dataSourceRef.value as any
        if (ds) {
          ds.read()
        }
      })
    }
  },
  update(node: TreeListNode) {
    if (props.type === 'local' && props.data) {
      const nodeId = node.id
      const updatedData = (props.data as TreeListNode[]).map(n => {
        const nId = n.id
        if ((typeof nId === 'number' && typeof nodeId === 'number' && nId === nodeId) ||
            (String(nId) === String(nodeId))) {
          return node
        }
        return n
      })
      emit('update:data', updatedData)
      
      nextTick(() => {
        const ds = dataSourceRef.value as any
        if (ds) {
          ds.read()
        }
      })
    }
  },
}

defineExpose(treeListDataSourceInstance)
</script>

