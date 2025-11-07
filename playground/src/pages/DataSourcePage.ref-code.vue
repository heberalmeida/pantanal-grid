<template>
  <PantanalDataSource
    ref="dataSource"
    type="local"
    :data="data"
    v-model:page="page"
    v-model:pageSize="pageSize"
    @change="handleChange"
  />
  <button @click="dataSource?.read()">Refresh</button>
  <button @click="dataSource?.query({ page: 1 })">Reset</button>
  <PantanalGrid
    :rows="dataSourceData"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, PantanalDataSource } from '@pantanal/grid'

const dataSource = ref(null)
const dataSourceData = ref([])
const page = ref(1)
const pageSize = ref(10)

function handleChange(data) {
  dataSourceData.value = data
}
</script>

