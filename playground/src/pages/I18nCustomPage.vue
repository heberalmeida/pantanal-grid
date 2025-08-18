<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, registerLocale, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

registerLocale('de', {
  total: 'Gesamt',
  page: 'Seite',
  rowsPerPage: 'Zeilen pro Seite',
  previous: 'Zurück',
  next: 'Weiter',
  filterPlaceholder: 'Filtern',
})

type Row = { id: number; name: string; price: number }
const rows = ref<Row[]>(Array.from({ length: 30 }, (_, i) => ({
  id: i + 1, name: `Artikel ${i + 1}`, price: +(Math.random() * 50).toFixed(2)
})))

const columns = [
  { field:'id', title:'ID', width:80, sortable:true, filterable:true },
  { field:'name', title:'Name', sortable:true, filterable:true },
  { field:'price', title:'Preis', sortable:true, format:(v:number)=>`€ ${v.toFixed(2)}` },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-xl font-semibold">i18n — Custom Locale (de)</h2>
    <PantanalGrid
      :rows="rows"
      :columns="columns as any"
      key-field="id"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      locale="de"
      :messages="{ next: 'Weiter »', previous: '« Zurück' }"
    />
  </section>
</template>
