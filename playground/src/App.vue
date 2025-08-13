<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i+1,
  name: `Item ${i+1}`,
  price: Math.round(Math.random()*1000)/100
})))
const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Nome', sortable: true },
  { field: 'price', title: 'Preço', sortable: true }
]
</script>

<template>
  <main class="p-6 space-y-4" data-theme="light">
    <h1 class="text-2xl font-bold">Pantanal Grid — Playground</h1>
    <PantanalGrid :rows="rows" :columns="columns" />
  </main>
</template>
