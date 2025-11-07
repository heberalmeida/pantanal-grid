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

<script setup lang="ts" generic="T extends HierarchicalNode = HierarchicalNode">
import { computed, ref, watch } from 'vue'
import DataSource from './DataSource.vue'
import type { 
  HierarchicalNode, 
  HierarchicalDataSourceProps, 
  HierarchicalDataSourceSchema,
  HierarchicalDataSourceInstance,
  DataSourceInstance,
  DataSourceSchema,
  DataSourceTransport,
  HierarchicalDataSourceSchemaModelChildren
} from '../types'
import type { SortDescriptor, FilterDescriptor } from '../types'

const props = withDefaults(defineProps<HierarchicalDataSourceProps<T>>(), {
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
  (e: 'change', value: HierarchicalNode[]): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
  (e: 'update:data', value: HierarchicalNode[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'update:group', value: any[]): void
}>()

const dataSourceRef = ref<InstanceType<typeof DataSource> | null>(null)

// Internal state for hierarchical nodes
const hierarchicalNodes = ref<HierarchicalNode[]>([])
const expandedNodes = ref<Set<string | number>>(new Set())
const loadedChildren = ref<Map<string | number, HierarchicalNode[]>>(new Map())

// Normalize data if local and process hierarchical structure
const normalizedData = computed<T[] | undefined>(() => {
  if (!props.data || props.type !== 'local') {
    return props.data
  }

  return props.data.map(item => processHierarchicalNode(item, 0)) as T[]
})

// Process hierarchical node
function processHierarchicalNode(item: any, level: number): HierarchicalNode {
  const node: HierarchicalNode = {
    ...item,
    _level: level,
    _expanded: expandedNodes.value.has(getNodeId(item)),
  }

  // Check if node has children
  if (props.schema?.model?.hasChildren) {
    const hasChildrenField = props.schema.model.hasChildren
    
    if (typeof hasChildrenField === 'string') {
      // Field name that indicates children
      node._hasChildren = !!item[hasChildrenField]
      if (typeof item[hasChildrenField] === 'object' && item[hasChildrenField] !== null) {
        node.children = Array.isArray(item[hasChildrenField]) 
          ? item[hasChildrenField].map((child: any) => processHierarchicalNode(child, level + 1))
          : []
      }
    } else if (typeof hasChildrenField === 'boolean') {
      node._hasChildren = hasChildrenField
    } else if (typeof hasChildrenField === 'function') {
      node._hasChildren = hasChildrenField(item)
    } else {
      // Default: check if item has children property
      node._hasChildren = !!item.children || (Array.isArray(item.children) && item.children.length > 0)
      if (item.children) {
        node.children = Array.isArray(item.children)
          ? item.children.map((child: any) => processHierarchicalNode(child, level + 1))
          : []
      }
    }
  } else {
    // Default behavior: check for children property
    node._hasChildren = !!item.children || (Array.isArray(item.children) && item.children.length > 0)
    if (item.children) {
      node.children = Array.isArray(item.children)
        ? item.children.map((child: any) => processHierarchicalNode(child, level + 1))
        : []
    }
  }

  return node
}

// Get node ID
function getNodeId(node: any): string | number {
  if (props.schema?.model?.id) {
    return node[props.schema.model.id] ?? node.id ?? node._id
  }
  return node.id ?? node._id ?? node.key ?? JSON.stringify(node)
}

// Convert HierarchicalDataSource schema to DataSource schema
const normalizedSchema = computed<DataSourceSchema>(() => {
  const baseSchema: DataSourceSchema = {
    data: props.schema?.data,
    total: props.schema?.total,
    errors: props.schema?.errors,
    parse: props.schema?.parse,
  }

  // Add hierarchical processing if model is defined
  if (props.schema?.model) {
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

      // Process hierarchical structure
      const processedData = data.map(item => processHierarchicalNode(item, 0))

      if (Array.isArray(parsed)) {
        return processedData
      }

      return {
        ...parsed,
        data: processedData,
      }
    }
  }

  return baseSchema
})

// Normalize transport for hierarchical data
const normalizedTransport = computed<DataSourceTransport | undefined>(() => {
  if (!props.transport) return undefined

  return props.transport
})

// Load children for a node
async function loadNodeChildren(node: HierarchicalNode): Promise<HierarchicalNode[]> {
  const nodeId = getNodeId(node)
  
  // Check if children are already loaded
  if (loadedChildren.value.has(nodeId)) {
    return loadedChildren.value.get(nodeId) || []
  }

  // If children are in the node itself, return them
  if (node.children && Array.isArray(node.children)) {
    loadedChildren.value.set(nodeId, node.children)
    return node.children
  }

  // If schema has children configuration, load from remote
  if (props.schema?.model?.children && typeof props.schema.model.children === 'object') {
    const childrenConfig = props.schema.model.children as HierarchicalDataSourceSchemaModelChildren
    
    if (childrenConfig.transport?.read) {
      try {
        emit('requestStart', { type: 'read', node })
        
        let response: any
        if (typeof childrenConfig.transport.read === 'string') {
          // URL string - might need to append node ID
          const url = childrenConfig.transport.read.replace('{id}', String(nodeId))
          const res = await fetch(url)
          response = await res.json()
        } else {
          // Function
          response = await childrenConfig.transport.read({
            data: { parentId: nodeId },
            type: 'read',
            url: typeof childrenConfig.transport.read === 'string' ? childrenConfig.transport.read : undefined,
          })
        }

        // Parse response
        let children: any[] = []
        if (childrenConfig.schema?.data) {
          if (typeof childrenConfig.schema.data === 'function') {
            children = childrenConfig.schema.data(response) || []
          } else {
            children = response?.[childrenConfig.schema.data] || []
          }
        } else {
          children = Array.isArray(response) ? response : (response?.data || [])
        }

        // Process children as hierarchical nodes
        const processedChildren = children.map((child: any) => processHierarchicalNode(child, (node._level || 0) + 1))
        
        loadedChildren.value.set(nodeId, processedChildren)
        node.children = processedChildren
        
        emit('requestEnd', { type: 'read', node })
        return processedChildren
      } catch (error: any) {
        emit('error', error)
        emit('requestEnd', { type: 'read', node })
        throw error
      }
    }
  }

  return []
}

// Event handlers
function handleChange(data: any[]) {
  hierarchicalNodes.value = data as HierarchicalNode[]
  emit('change', data as HierarchicalNode[])
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
  emit('update:data', value as HierarchicalNode[])
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

// Find node in tree
function findNodeInTree(nodes: HierarchicalNode[], id: string | number): HierarchicalNode | null {
  for (const node of nodes) {
    if (getNodeId(node) === id) {
      return node
    }
    if (node.children) {
      const found = findNodeInTree(node.children, id)
      if (found) return found
    }
  }
  return null
}

// Expose HierarchicalDataSource instance methods
const hierarchicalDataSourceInstance: HierarchicalDataSourceInstance = {
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
  rootNodes(): HierarchicalNode[] {
    return hierarchicalNodes.value
  },
  getNode(id: number | string): HierarchicalNode | null {
    return findNodeInTree(hierarchicalNodes.value, id)
  },
  async expand(node: HierarchicalNode | number | string): Promise<void> {
    const targetNode = typeof node === 'object' ? node : this.getNode(node)
    if (!targetNode) return

    const nodeId = getNodeId(targetNode)
    expandedNodes.value.add(nodeId)
    targetNode._expanded = true

    // Load children if not already loaded
    if (targetNode._hasChildren && !targetNode.children) {
      await loadNodeChildren(targetNode)
      // Trigger change event
      emit('change', hierarchicalNodes.value)
    }
  },
  collapse(node: HierarchicalNode | number | string): void {
    const targetNode = typeof node === 'object' ? node : this.getNode(node)
    if (!targetNode) return

    const nodeId = getNodeId(targetNode)
    expandedNodes.value.delete(nodeId)
    targetNode._expanded = false
  },
  async loadChildren(node: HierarchicalNode | number | string): Promise<HierarchicalNode[]> {
    const targetNode = typeof node === 'object' ? node : this.getNode(node)
    if (!targetNode) return []

    return await loadNodeChildren(targetNode)
  },
}

defineExpose(hierarchicalDataSourceInstance)
</script>

