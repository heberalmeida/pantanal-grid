<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', filterable: true },
  { field: 'brand', title: 'Brand' },
  { field: 'category', title: 'Category' },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` }
]

watchEffect(async () => {
  loading.value = true
  try {
    const response = await fetch(`https://dummyjson.com/products?limit=${pageSize.value}&skip=${(page.value - 1) * pageSize.value}`)
    const data = await response.json()
    rows.value = data.products || []
    total.value = data.total || 0
  } catch (error) {
    console.error('Error fetching data:', error)
    rows.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Data is fetched from a remote API (DummyJSON). Pagination, sorting, and filtering trigger new API requests.
      Total items: {{ total }}
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :server-side="true"
      :total="total"
      :loading="loading"
      v-model:page="page"
      v-model:pageSize="pageSize"
      v-model:sort="sort"
      v-model:filter="filter"
      locale="en"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
</style>




