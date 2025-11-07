<template>
  <PantanalTreeListDataSource
    :data="nodes"
    :schema="schema"
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
import { 
  PantanalGrid, 
  PantanalTreeListDataSource, 
  type TreeListNode,
  type TreeListDataSourceSchema
} from '@pantanal/grid'

const nodes = ref([
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
])

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
</script>

