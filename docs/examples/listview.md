# ListView

Pantanal Grid ListView component displays data in a list format with support for templates, selection, editing, and keyboard navigation.

<ExamplePreview>
  <ListViewBasicExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ListViewBasicExample from './components/ListViewBasicExample.vue'
import ListViewSelectionExample from './components/ListViewSelectionExample.vue'
import ListViewEditingExample from './components/ListViewEditingExample.vue'
import ListViewAlternateExample from './components/ListViewAlternateExample.vue'
</script>

## Basic Usage

A simple list view with a template:

<ExamplePreview>
  <ListViewBasicExample />
</ExamplePreview>

```vue
<template>
  <PantanalListView
    :data-source="items"
    :template="template"
    :auto-bind="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' },
])

const template = (item) => `
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem;">
    <div>
      <strong>${item.name}</strong>
      <div style="color: #6b7280; font-size: 0.875rem;">${item.category}</div>
    </div>
    <div style="font-weight: bold; color: #059669;">$${item.price.toFixed(2)}</div>
  </div>
`
</script>
```

## Selection

Enable single or multiple selection with checkboxes:

<ExamplePreview>
  <ListViewSelectionExample />
</ExamplePreview>

### Single Selection

```vue
<PantanalListView
  :data-source="items"
  :template="template"
  selectable="single"
  @change="handleSelectionChange"
/>
```

### Multiple Selection

```vue
<PantanalListView
  :data-source="items"
  :template="template"
  selectable="multiple"
  @change="handleSelectionChange"
/>
```

**Example:**
```vue
<template>
  <div>
    <div v-if="selectedItems.length > 0" class="p-4 bg-blue-50 rounded mb-4">
      <p>Selected: {{ selectedItems.length }} item(s)</p>
    </div>
    
    <PantanalListView
      :data-source="items"
      :template="template"
      selectable="multiple"
      @change="handleSelectionChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
])

const selectedItems = ref([])

function handleSelectionChange(items) {
  selectedItems.value = items
  console.log('Selected:', items)
}
</script>
```

## Editing

Double-click an item to edit it. Press Escape to cancel or Enter to save:

<ExamplePreview>
  <ListViewEditingExample />
</ExamplePreview>

```vue
<template>
  <PantanalListView
    :data-source="items"
    :template="template"
    :edit-template="editTemplate"
    :navigatable="true"
    @edit="handleEdit"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Task 1', status: 'Pending' },
  { id: 2, name: 'Task 2', status: 'In Progress' },
  { id: 3, name: 'Task 3', status: 'Completed' },
])

const template = (item) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
    <div style="color: #6b7280; font-size: 0.875rem;">Status: ${item.status}</div>
  </div>
`

const editTemplate = (item) => `
  <div style="padding: 0.5rem;">
    <input type="text" value="${item.name}" style="width: 100%; padding: 0.25rem; margin-bottom: 0.5rem;" />
    <select style="width: 100%; padding: 0.25rem;">
      <option ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
      <option ${item.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
      <option ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
    </select>
  </div>
`

function handleEdit(item) {
  console.log('Edit:', item)
}

function handleSave(item) {
  console.log('Save:', item)
  // Update item in data source
}

function handleCancel() {
  console.log('Cancel')
}
</script>
```

## Alternate Template

Use different templates for alternating items:

<ExamplePreview>
  <ListViewAlternateExample />
</ExamplePreview>

```vue
<template>
  <PantanalListView
    :data-source="items"
    :template="template1"
    :alt-template="template2"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Item 1', type: 'primary' },
  { id: 2, name: 'Item 2', type: 'secondary' },
  { id: 3, name: 'Item 3', type: 'primary' },
  { id: 4, name: 'Item 4', type: 'secondary' },
])

const template1 = (item) => `
  <div style="padding: 0.5rem; background: #eff6ff;">
    <strong>${item.name}</strong> (Primary)
  </div>
`

const template2 = (item) => `
  <div style="padding: 0.5rem; background: #f3f4f6;">
    <strong>${item.name}</strong> (Secondary)
  </div>
`
</script>
```

## Keyboard Navigation

Enable keyboard navigation for better accessibility:

```vue
<PantanalListView
  :data-source="items"
  :template="template"
  :navigatable="true"
/>
```

**Keyboard Shortcuts:**
- `Arrow Up/Down` - Navigate between items
- `Enter` - Start editing (if editTemplate is provided)
- `Escape` - Cancel editing
- `Delete` - Remove item (if editTemplate is provided)
- `Space` - Toggle selection (if selectable is enabled)

## With DataSource

Use DataSource configuration for advanced data management:

```vue
<template>
  <PantanalListView
    :data-source="{ data: items, type: 'local' }"
    :template="template"
    :auto-bind="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
])

const template = (item) => `
  <div style="padding: 0.5rem;">
    <strong>${item.name}</strong>
  </div>
`
</script>
```

## Template Variables

In template strings, you can use:

- `#:fieldName#` - Insert field value
- `{fieldName}` - Insert field value (alternative syntax)

**Example:**
```vue
const template = (item) => `
  <div>
    <strong>#:name#</strong>
    <div>Price: ${item.price}</div>
  </div>
`
```

## Methods

Access methods via component ref:

```vue
<template>
  <PantanalListView
    ref="listViewRef"
    :data-source="items"
    :template="template"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const listViewRef = ref()

// Refresh data
listViewRef.value?.refresh()

// Get current items
const items = listViewRef.value?.items()

// Get selected items
const selected = listViewRef.value?.selectedItems()

// Clear selection
listViewRef.value?.clearSelection()

// Select/deselect item
listViewRef.value?.selectItem(items[0])
listViewRef.value?.deselectItem(items[0])

// Edit operations
listViewRef.value?.startEdit(items[0])
listViewRef.value?.cancelEdit()
listViewRef.value?.saveEdit()
</script>
```

## Events

Listen to ListView events:

```vue
<PantanalListView
  :data-source="items"
  :template="template"
  @change="handleChange"
  @edit="handleEdit"
  @save="handleSave"
  @cancel="handleCancel"
  @databound="handleDataBound"
  @databinding="handleDataBinding"
/>
```

## See Also

- [ListView API Reference](/api/listview) - Complete API documentation
- [Getting Started Guide](/guide/getting-started) - Quick start guide
- [DataSource API](/api/data-sources) - Data source configuration

