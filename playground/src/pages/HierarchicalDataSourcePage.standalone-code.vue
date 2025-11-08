<template>
  <PantanalHierarchicalDataSource
    ref="hierarchicalDataSource"
    :data="data"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalHierarchicalDataSource,
  type HierarchicalNode,
  type HierarchicalDataSourceInstance
} from '@pantanal/grid'

const data = ref<HierarchicalNode[]>([
  {
    id: 1,
    text: 'Root Node 1',
    _hasChildren: true,
  },
  {
    id: 2,
    text: 'Root Node 2',
    _hasChildren: true,
  },
])

const hierarchicalDataSource = ref<HierarchicalDataSourceInstance | null>(null)

function handleChange(newData: HierarchicalNode[]) {
  console.log('Data changed:', newData)
}

// Expand a node
// @ts-ignore - Example code
async function expandNode(nodeId: number | string) {
  if (hierarchicalDataSource.value) {
    await hierarchicalDataSource.value.expand(nodeId)
  }
}

// Collapse a node
// @ts-ignore - Example code
function collapseNode(nodeId: number | string) {
  if (hierarchicalDataSource.value) {
    hierarchicalDataSource.value.collapse(nodeId)
  }
}

// Load children for a node
// @ts-ignore - Example code
async function loadChildren(nodeId: number | string) {
  if (hierarchicalDataSource.value) {
    const children = await hierarchicalDataSource.value.loadChildren(nodeId)
    return children
  }
  return []
}

// Get a specific node
// @ts-ignore - Example code
function getNode(nodeId: number | string) {
  if (hierarchicalDataSource.value) {
    return hierarchicalDataSource.value.getNode(nodeId)
  }
  return null
}

// Get root nodes
// @ts-ignore - Example code
function getRootNodes() {
  if (hierarchicalDataSource.value) {
    return hierarchicalDataSource.value.rootNodes()
  }
  return []
}
</script>

