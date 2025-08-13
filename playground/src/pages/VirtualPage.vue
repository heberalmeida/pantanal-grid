<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">Virtual Scroll (5000 linhas)</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      :virtual="true"
      :height="420"
      :row-height="44"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Linha ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100
})))

const columns = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Nome', sortable: true, filterable: true },
  { field: 'price', title: 'Preço', sortable: true, filterable: true }
]
</script>
