<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Grouping + Aggregates</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      :group="group"
      :aggregates="aggregates"
      :showGroupFooters="true"
      :pageSize="20"
      :height="520"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import type { GroupDescriptor, AggregateName } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)
const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand', filterable:true },
  { field:'category', title:'Category', filterable:true },
  { field:'price', title:'Price', sortable:true, format:(v:number)=>`$ ${v.toFixed(2)}` }
]

const group = ref<GroupDescriptor[]>([{ field:'category', dir:'asc' }, { field:'brand', dir:'asc' }])
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum','avg'] as AggregateName[],
  id: ['count'] as AggregateName[],
}

onMounted(async () => {
  loading.value = true
  const res = await fetch('https://dummyjson.com/products?limit=100')
  const data = await res.json()
  rows.value = data.products
  loading.value = false
})
</script>
