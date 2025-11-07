<template>
  <PantanalTreeListDataSource
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="data"
    :columns="columns"
    key-field="id"
    server-side
    :total="total"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PantanalGrid, 
  PantanalTreeListDataSource, 
  type TreeListNode,
  type TreeListDataSourceSchema,
  type DataSourceTransport
} from '@pantanal/grid'

const transport: DataSourceTransport = {
  read: async (options) => {
    const response = await fetch('/api/treelist-nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: options.page,
        pageSize: options.pageSize,
      }),
    })
    return response.json()
  },
}

const schema: TreeListDataSourceSchema = {
  model: {
    id: { field: 'id', type: 'number' },
    parentId: { field: 'parentId', type: 'number', nullable: true },
    expanded: false,
    fields: {
      firstName: { field: 'firstName', type: 'string' },
      lastName: { field: 'lastName', type: 'string' },
      position: { field: 'position', type: 'string' },
      phone: { field: 'phone', type: 'string' },
    },
  },
  data: (response: any) => response.data || response,
  total: (response: any) => response.total || 0,
}

const data = ref<TreeListNode[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function handleChange(newData: TreeListNode[]) {
  data.value = newData
}
</script>

