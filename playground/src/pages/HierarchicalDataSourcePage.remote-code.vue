<template>
  <PantanalHierarchicalDataSource
    ref="hierarchicalDataSource"
    type="remote"
    :transport="transport"
    :schema="schema"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="gridData"
    :columns="columns"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGrid, 
  PantanalHierarchicalDataSource,
  type ColumnDef,
  type HierarchicalNode,
  type HierarchicalDataSourceSchema,
  type HierarchicalDataSourceInstance,
  type DataSourceTransport
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async () => {
    const res = await fetch('https://api.example.com/categories')
    return res.json()
  },
}

const schema: HierarchicalDataSourceSchema = {
  data: (response: any) => response.data || [],
  model: {
    id: 'id',
    hasChildren: '_hasChildren',
    children: {
      type: 'remote',
      transport: {
        read: async (options: any) => {
          const parentId = options.data?.parentId
          const res = await fetch(`https://api.example.com/categories/${parentId}/children`)
          return res.json()
        },
      },
      schema: {
        data: (response: any) => response.data || [],
      },
    },
  },
}

const hierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const gridData = ref<HierarchicalNode[]>([])

function handleChange(newData: HierarchicalNode[]) {
  gridData.value = flattenTree(newData)
}

function flattenTree(nodes: HierarchicalNode[]): HierarchicalNode[] {
  const result: HierarchicalNode[] = []
  function traverse(node: HierarchicalNode) {
    result.push(node)
    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  nodes.forEach(traverse)
  return result
}

const columns: ColumnDef<HierarchicalNode>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'text', title: 'Text', width: 200 },
  { field: '_level', title: 'Level', width: 80 },
]
</script>

