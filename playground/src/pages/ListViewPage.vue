<template>
  <div class="space-y-8 p-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">ListView Component</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The ListView component displays data in a list format with support for templates, selection, editing, and keyboard navigation.
      </p>
    </header>

    <!-- Basic Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic ListView</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        A simple list view with a template showing product information.
      </p>

      <PantanalListView
        :data-source="basicData"
        :template="basicTemplate"
        :auto-bind="true"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Selection Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Selection</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Enable single or multiple selection with checkboxes.
      </p>

      <div v-if="selectedItems.length > 0" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded mb-4">
        <p class="text-sm font-medium">
          Selected: {{ selectedItems.length }} item(s)
        </p>
      </div>

      <PantanalListView
        :data-source="selectionData"
        :template="selectionTemplate"
        selectable="multiple"
        :auto-bind="true"
        @change="handleSelectionChange"
      />
      <ExampleCode :source="selectionCode" />
    </article>

    <!-- Editing Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Editing</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Double-click an item to edit it. Press Escape to cancel or Enter to save.
      </p>

      <PantanalListView
        :data-source="editingData"
        :template="editingTemplate"
        :edit-template="editTemplate"
        :navigatable="true"
        :auto-bind="true"
        @edit="handleEdit"
        @save="handleSave"
        @cancel="handleCancel"
      />
      <ExampleCode :source="editingCode" />
    </article>

    <!-- Alternate Template Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Alternate Template</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use different templates for alternating items.
      </p>

      <PantanalListView
        :data-source="altData"
        :template="altTemplate1"
        :alt-template="altTemplate2"
        :auto-bind="true"
      />
      <ExampleCode :source="altCode" />
    </article>

    <!-- With DataSource Array -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">With DataSource Configuration</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use DataSource configuration object for advanced data management.
      </p>

      <PantanalListView
        :data-source="{ data: dataSourceData, type: 'local' }"
        :template="dataSourceTemplate"
        :auto-bind="true"
      />
      <ExampleCode :source="dataSourceCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Basic Example
const basicData = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics' },
])

const basicTemplate = (item: any) => `
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem;">
    <div>
      <strong>${item.name}</strong>
      <div style="color: #6b7280; font-size: 0.875rem;">${item.category}</div>
    </div>
    <div style="font-weight: bold; color: #059669;">$${item.price.toFixed(2)}</div>
  </div>
`

const basicCode = `<PantanalListView
  :data-source="data"
  :template="template"
  :auto-bind="true"
/>

<script setup>
const data = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
])

const template = (item) => \`
  <div>
    <strong>\${item.name}</strong>
    <div>\${item.category}</div>
  </div>
\`
<\/script>`

// Selection Example
const selectionData = ref([
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' },
  { id: 4, name: 'Item 4', description: 'Fourth item' },
])

const selectedItems = ref<any[]>([])

const selectionTemplate = (item: any) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
    <div style="color: #6b7280; font-size: 0.875rem;">${item.description}</div>
  </div>
`

function handleSelectionChange(items: any[]) {
  selectedItems.value = items
}

const selectionCode = `<PantanalListView
  :data-source="data"
  :template="template"
  selectable="multiple"
  @change="handleSelectionChange"
/>

<script setup>
function handleSelectionChange(items) {
  console.log('Selected:', items)
}
<\/script>`

// Editing Example
const editingData = ref([
  { id: 1, name: 'Task 1', status: 'Pending' },
  { id: 2, name: 'Task 2', status: 'In Progress' },
  { id: 3, name: 'Task 3', status: 'Completed' },
])

const editingTemplate = (item: any) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
    <div style="color: #6b7280; font-size: 0.875rem;">Status: ${item.status}</div>
  </div>
`

const editTemplate = (item: any) => `
  <div style="padding: 0.5rem;">
    <input type="text" value="${item.name}" style="width: 100%; padding: 0.25rem; margin-bottom: 0.5rem;" />
    <select style="width: 100%; padding: 0.25rem;">
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

const editingCode = `<PantanalListView
  :data-source="data"
  :template="template"
  :edit-template="editTemplate"
  :navigatable="true"
  @edit="handleEdit"
  @save="handleSave"
  @cancel="handleCancel"
/>

<script setup>
const editTemplate = (item) => \`
  <input type="text" value="\${item.name}" />
\`
<\/script>`

// Alternate Template Example
const altData = ref([
  { id: 1, name: 'Item 1', type: 'primary' },
  { id: 2, name: 'Item 2', type: 'secondary' },
  { id: 3, name: 'Item 3', type: 'primary' },
  { id: 4, name: 'Item 4', type: 'secondary' },
])

const altTemplate1 = (item: any) => `
  <div style="padding: 0.5rem; background: #eff6ff;">
    <strong>${item.name}</strong> (Primary)
  </div>
`

const altTemplate2 = (item: any) => `
  <div style="padding: 0.5rem; background: #f3f4f6;">
    <strong>${item.name}</strong> (Secondary)
  </div>
`

const altCode = `<PantanalListView
  :data-source="data"
  :template="template1"
  :alt-template="template2"
/>`

// DataSource Example
const dataSourceData = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
])

const dataSourceTemplate = (item: any) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
  </div>
`

const dataSourceCode = `<PantanalListView
  :data-source="{ data: items, type: 'local' }"
  :template="template"
/>

<script setup>
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
])
<\/script>`
</script>

