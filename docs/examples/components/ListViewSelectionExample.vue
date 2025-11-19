<template>
  <div>
    <div v-if="selectedItems.length > 0" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded mb-4">
      <p class="text-sm font-medium">
        Selected: {{ selectedItems.length }} item(s)
      </p>
    </div>

    <PantanalListView
      :data-source="items"
      :template="template"
      selectable="multiple"
      :auto-bind="true"
      @change="handleSelectionChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' },
  { id: 4, name: 'Item 4', description: 'Fourth item' },
])

const selectedItems = ref<any[]>([])

const template = (item: any) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
    <div style="color: #6b7280; font-size: 0.875rem;">${item.description}</div>
  </div>
`

function handleSelectionChange(items: any[]) {
  selectedItems.value = items
}
</script>

