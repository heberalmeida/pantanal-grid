<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Table-only</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      responsive="table"
      :height="520"
    />
    <ExampleCode :source="codeSnippet" />
  </div>
</template>

<script setup lang="ts">
import { PantanalGrid } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import { ref, onMounted } from 'vue'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './TableOnlyPage.vue?raw'

const rows = ref<any[]>([])
const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand', filterable:true },
  { field:'category', title:'Category', filterable:true },
  { field:'price', title:'Price', sortable:true, format:(v:number)=>`$ ${v.toFixed(2)}` },
]

onMounted(async () => {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=100')
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    rows.value = data.products || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Fallback data if API fails
    rows.value = [
      { id: 1, title: 'Sample Product 1', brand: 'Brand A', category: 'Electronics', price: 99.99 },
      { id: 2, title: 'Sample Product 2', brand: 'Brand B', category: 'Clothing', price: 49.99 },
      { id: 3, title: 'Sample Product 3', brand: 'Brand C', category: 'Accessories', price: 29.99 },
    ]
  }
})

const codeSnippet = exampleSource
</script>
