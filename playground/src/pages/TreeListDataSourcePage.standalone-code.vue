<template>
  <PantanalTreeListDataSource
    ref="treeListDataSource"
    :data="nodes"
    @change="handleChange"
    @update:data="handleUpdateData"
  />
  
  <button @click="addNode">Add Node</button>
  <button @click="removeNode">Remove Last Node</button>
  <button @click="expandFirstNode">Expand First Root Node</button>
  <button @click="collapseFirstNode">Collapse First Root Node</button>
  
  <div>
    <p>Root Nodes: {{ rootNodes.length }}</p>
    <ul>
      <li v-for="node in rootNodes" :key="node.id">
        {{ node.firstName }} {{ node.lastName }} (ID: {{ node.id }}{{ node.expanded ? ', Expanded' : '' }})
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PantanalTreeListDataSource, 
  type TreeListNode,
  type TreeListDataSourceInstance
} from '@pantanal/grid'

const treeListDataSource = ref<TreeListDataSourceInstance | null>(null)
const nodes = ref<TreeListNode[]>([
  {
    id: 1,
    parentId: null,
    firstName: 'Root',
    lastName: 'Node 1',
    position: 'Manager',
    phone: '555-0001',
    expanded: true,
  },
])

const data = ref<TreeListNode[]>([])

const rootNodes = computed(() => {
  if (!treeListDataSource.value) return []
  return treeListDataSource.value.rootNodes()
})

function handleChange(newData: TreeListNode[]) {
  data.value = newData
}

function handleUpdateData(newData: TreeListNode[]) {
  nodes.value = newData
}

function addNode() {
  if (!treeListDataSource.value) return
  
  const newNode: Partial<TreeListNode> = {
    firstName: `Node${nodes.value.length + 1}`,
    lastName: '',
    position: 'Employee',
    phone: `555-${String(nodes.value.length + 1).padStart(4, '0')}`,
    parentId: rootNodes.value.length > 0 ? rootNodes.value[0].id : null,
    expanded: false,
  }
  
  treeListDataSource.value.add(newNode)
}

function removeNode() {
  if (!treeListDataSource.value || data.value.length === 0) return
  
  const lastNode = data.value[data.value.length - 1]
  treeListDataSource.value.remove(lastNode.id)
}

function expandFirstNode() {
  if (!treeListDataSource.value || rootNodes.value.length === 0) return
  treeListDataSource.value.expand(rootNodes.value[0].id)
}

function collapseFirstNode() {
  if (!treeListDataSource.value || rootNodes.value.length === 0) return
  treeListDataSource.value.collapse(rootNodes.value[0].id)
}
</script>

