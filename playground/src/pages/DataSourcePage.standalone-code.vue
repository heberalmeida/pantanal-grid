<template>
  <PantanalDataSource
    ref="dataSource"
    type="local"
    :data="data"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    @change="handleChange"
  />
  
  <!-- Custom UI using DataSource data -->
  <div class="grid gap-3">
    <div
      v-for="item in displayData"
      :key="item.id"
      class="p-4 border rounded">
      <h4>{{ item.name }}</h4>
      <p>Price: ${{ item.price.toFixed(2) }}</p>
    </div>
  </div>
  
  <!-- Custom Pagination -->
  <div class="flex gap-2">
    <button @click="page = Math.max(1, page - 1)">Previous</button>
    <span>Page {{ page }}</span>
    <button @click="page = page + 1">Next</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalDataSource, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const data = ref([
  { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing' },
  // ... more data
])

const displayData = ref([])
const page = ref(1)
const pageSize = ref(6)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

function handleChange(data) {
  displayData.value = data
}
</script>

