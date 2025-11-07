<template>
  <PantanalDataSource
    ref="localDataSource"
    type="local"
    :data="localData"
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
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource } from '@pantanal/grid'

const localData = ref([
  { id: 1, title: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, title: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const dataSourceData = ref([])
const page = ref(1)
const pageSize = ref(10)
const sort = ref([])
const filter = ref([])

function handleChange(data) {
  dataSourceData.value = data
}
</script>

