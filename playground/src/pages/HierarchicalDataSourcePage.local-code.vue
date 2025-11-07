<template>
  <PantanalHierarchicalDataSource
    ref="hierarchicalDataSource"
    :data="data"
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
  type HierarchicalDataSourceInstance
} from '@pantanal/grid'

const data: HierarchicalNode[] = [
  {
    id: 1,
    text: 'Category A',
    children: [
      {
        id: 11,
        text: 'Subcategory A1',
        children: [
          { id: 111, text: 'Item A1a' },
          { id: 112, text: 'Item A1b' },
        ],
      },
      {
        id: 12,
        text: 'Subcategory A2',
      },
    ],
  },
  {
    id: 2,
    text: 'Category B',
    children: [
      { id: 21, text: 'Subcategory B1' },
    ],
  },
]

const hierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)
const gridData = ref<HierarchicalNode[]>([])

function handleChange(newData: HierarchicalNode[]) {
  // Flatten tree for grid display
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

