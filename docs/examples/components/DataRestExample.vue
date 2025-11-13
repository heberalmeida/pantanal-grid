<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', width: 250 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 }
]

async function fetchData() {
  loading.value = true
  try {
    const response = await fetch('https://dummyjson.com/products?limit=20')
    const data = await response.json()
    rows.value = data.products || []
  } catch (error) {
    console.error('Error fetching data:', error)
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :loading="loading"
      locale="en"
      responsive="table"
      :height="400"
    />
  </div>
</template>




