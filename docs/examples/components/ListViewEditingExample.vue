<template>
  <PantanalListView
    :data-source="items"
    :template="template"
    :edit-template="editTemplate"
    :navigatable="true"
    :auto-bind="true"
    @edit="handleEdit"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Task 1', status: 'Pending' },
  { id: 2, name: 'Task 2', status: 'In Progress' },
  { id: 3, name: 'Task 3', status: 'Completed' },
])

const template = (item: any) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
    <div style="color: #6b7280; font-size: 0.875rem;">Status: ${item.status}</div>
  </div>
`

const editTemplate = (item: any) => `
  <div style="padding: 0.5rem;">
    <input type="text" value="${item.name}" style="width: 100%; padding: 0.25rem; margin-bottom: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem;" />
    <select style="width: 100%; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 0.25rem;">
      <option ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
      <option ${item.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
      <option ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
    </select>
  </div>
`

function handleEdit(item: any) {
  console.log('Edit:', item)
}

function handleSave(item: any) {
  console.log('Save:', item)
}

function handleCancel() {
  console.log('Cancel')
}
</script>

