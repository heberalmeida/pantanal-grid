<template>
  <PantanalTreeListDataSource
    :data="nodes"
    :schema="schema"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns as any"
    key-field="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGrid, 
  PantanalTreeListDataSource, 
  type TreeListNode,
  type TreeListDataSourceSchema
} from '@pantanal/grid'

// @ts-ignore - Example code showing raw data that will be mapped by schema
const nodes: any[] = [
  {
    EmployeeID: 1,
    ReportsTo: null,
    FirstName: 'John',
    LastName: 'Doe',
    Position: 'CEO',
    Phone: '555-0101',
    Extension: 1001,
  },
  {
    EmployeeID: 2,
    ReportsTo: 1,
    FirstName: 'Jane',
    LastName: 'Smith',
    Position: 'CFO',
    Phone: '555-0102',
    Extension: 1002,
  },
]

const schema: TreeListDataSourceSchema = {
  model: {
    id: { field: 'EmployeeID', type: 'number' },
    parentId: { field: 'ReportsTo', type: 'number', nullable: true },
    expanded: true,
    fields: {
      firstName: { field: 'FirstName', type: 'string' },
      lastName: { field: 'LastName', type: 'string' },
      position: { field: 'Position', type: 'string' },
      phone: { field: 'Phone', type: 'string' },
      extension: { field: 'Extension', type: 'number' },
    },
  },
}

const data = ref<TreeListNode[]>([])

function handleChange(newData: TreeListNode[]) {
  data.value = newData
}

const columns: any[] = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'firstName', title: 'First Name', width: 150 },
  { field: 'lastName', title: 'Last Name', width: 150 },
  { field: 'position', title: 'Position', width: 150 },
  { field: 'phone', title: 'Phone', width: 120 },
]
</script>

