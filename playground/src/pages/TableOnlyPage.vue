<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Table-only</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      responsive="table"
      :height="520"
    />
  </div>
</template>

<script setup lang="ts">
import { PantanalGrid } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import { ref, onMounted } from 'vue'

const rows = ref<any[]>([])
const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand', filterable:true },
  { field:'category', title:'Category', filterable:true },
  { field:'price', title:'Price', sortable:true, format:(v:number)=>`$ ${v.toFixed(2)}` },
]

onMounted(async () => {
  const res = await fetch('https://dummyjson.com/products?limit=100')
  const data = await res.json()
  rows.value = data.products
})
</script>
