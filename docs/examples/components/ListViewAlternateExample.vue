<template>
  <PantanalListView
    :data-source="items"
    :template="template1"
    :alt-template="template2"
    :auto-bind="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Item 1', type: 'primary' },
  { id: 2, name: 'Item 2', type: 'secondary' },
  { id: 3, name: 'Item 3', type: 'primary' },
  { id: 4, name: 'Item 4', type: 'secondary' },
])

const template1 = (item: any) => `
  <div style="padding: 0.5rem; background: #eff6ff;">
    <strong>${item.name}</strong> (Primary)
  </div>
`

const template2 = (item: any) => `
  <div style="padding: 0.5rem; background: #f3f4f6;">
    <strong>${item.name}</strong> (Secondary)
  </div>
`
</script>

