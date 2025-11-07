<template>
  <PantanalTreeListDataSource
    :data="nodes"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalTreeListDataSource, type TreeListNode } from '@pantanal/grid'

const nodes = ref<TreeListNode[]>([
  {
    id: 1,
    parentId: null,
    firstName: 'John',
    lastName: 'Doe',
    position: 'CEO',
    phone: '555-0101',
    expanded: true,
  },
  {
    id: 2,
    parentId: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    position: 'CFO',
    phone: '555-0102',
    expanded: false,
  },
])

const data = ref<TreeListNode[]>([])

function handleChange(newData: TreeListNode[]) {
  data.value = newData
}
</script>

