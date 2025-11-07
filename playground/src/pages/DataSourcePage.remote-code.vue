<template>
  <PantanalDataSource
    ref="remoteDataSource"
    type="remote"
    :transport="transport"
    :schema="schema"
    :server-paging="true"
    :server-filtering="true"
    :server-sorting="true"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
    :total="total"
    server-side
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource } from '@pantanal/grid'

const transport = {
  read: async (options) => {
    const url = new URL('https://api.example.com/products')
    // Configure URL with pagination, filtering, sorting
    const res = await fetch(url.toString())
    return res.json()
  },
}

const schema = {
  data: (response) => response.products || [],
  total: (response) => response.total || 0,
}

const dataSourceData = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const sort = ref([])
const filter = ref([])

function handleChange(data) {
  dataSourceData.value = data
  total.value = remoteDataSource.value?.total() || 0
}
</script>

