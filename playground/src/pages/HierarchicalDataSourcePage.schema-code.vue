<template>
  <PantanalHierarchicalDataSource
    ref="hierarchicalDataSource"
    :data="data"
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
  type HierarchicalDataSourceInstance
} from '@pantanal/grid'

const data = [
  {
    id: 1,
    name: 'Department A',
    products: [
      { id: 11, name: 'Product A1' },
      { id: 12, name: 'Product A2' },
    ],
  },
  {
    id: 2,
    name: 'Department B',
    products: [
      { id: 21, name: 'Product B1' },
    ],
  },
]

const schema: HierarchicalDataSourceSchema = {
  model: {
    id: 'id',
    hasChildren: 'products',  // Field that indicates children
    children: 'products',     // Field that contains children
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
  { field: 'name', title: 'Name', width: 200 },
  { field: '_level', title: 'Level', width: 80 },
]
</script>

