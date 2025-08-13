<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">i18n: English</h2>
    <PantanalGrid :rows="rows" :columns="columns as any" locale="en" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
const rows = ref(Array.from({ length: 50 }, (_, i) => ({ id: i+1, name: `Item ${i+1}`, price: Math.round(Math.random()*1000)/100 })))
const columns = [
  { field:'id', title:'ID', width:80, sortable:true, filterable:true },
  { field:'name', title:'Name', sortable:true, filterable:true },
  { field:'price', title:'Price', sortable:true, filterable:true }
]
</script>