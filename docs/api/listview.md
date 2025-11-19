---
title: ListView API

description: "API Index | ListView"

api_reference: true

slug: api_listviewcomponent

---

# ListView

## Directive

`pantanal-listview`

## Component

```vue
<PantanalListView
  :data-source="dataSource"
  :template="template"
  ...
/>
```

## Props

### auto-bind `Boolean`

If `auto-bind` is set to `false`, the ListView will not bind to the data source during initialization. In this case, data binding will occur when the `change` event of the data source is fired. By default, the ListView will bind to the data source that is specified in the configuration.

**Default:** `true`

**Example:**
```vue
<PantanalListView
  :data-source="data"
  :auto-bind="false"
/>
```

### data-source `Object | Array | DataSourceInstance`

The data source of the ListView for rendering the list items.

You can set `data-source` to:

* A JavaScript array.
* A JavaScript object which represents any valid data source configuration.
* An existing `DataSourceInstance`.

If the `dataSource` option is set to a JavaScript object or an array, the ListView will initialize a new DataSource instance by using that value as a data source configuration. If the `dataSource` option is an existing `DataSourceInstance`, the ListView will use that instance and will not initialize a new one.

**Example:**
```vue
<!-- Array -->
<PantanalListView :data-source="items" />

<!-- DataSource props -->
<PantanalListView :data-source="{ data: items, type: 'local' }" />

<!-- DataSource instance -->
<PantanalListView :data-source="dataSourceRef" />
<PantanalDataSource ref="dataSourceRef" :data="items" />
```

### edit-template `Function | String`

The template for the ListView items in the edit mode.

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :edit-template="editTemplate"
/>

<script setup>
const editTemplate = (item) => `
  <input type="text" value="${item.name}" />
  <button>Save</button>
`
</script>
```

### navigatable `Boolean`

Indicates whether the keyboard navigation is enabled or disabled.

**Default:** `false`

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :navigatable="true"
/>
```

**Keyboard Shortcuts:**
- `Arrow Up/Down` - Navigate between items
- `Enter` - Start editing (if editTemplate is provided)
- `Escape` - Cancel editing
- `Delete` - Remove item (if editTemplate is provided)
- `Space` - Toggle selection (if selectable is enabled)

### selectable `Boolean | String`

Indicates whether the selection is enabled or disabled.

**Values:**
- `false` - Selection disabled
- `true` - Multiple selection enabled
- `'single'` - Single selection enabled
- `'multiple'` - Multiple selection enabled

**Default:** `false`

**Example:**
```vue
<PantanalListView
  :data-source="items"
  selectable="multiple"
  @change="handleSelectionChange"
/>
```

### template `Function | String`

The template for the ListView items.

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :template="itemTemplate"
/>

<script setup>
const itemTemplate = (item, index) => `
  <div>
    <strong>${item.name}</strong>
    <div>${item.description}</div>
  </div>
`
</script>
```

**Template Variables:**
- Use `#:fieldName#` or `{fieldName}` to insert field values
- The function receives `(dataItem, index)` as parameters

### alt-template `Function | String`

The template for rendering the alternate items in the ListView. This template is used for items at odd indices (1, 3, 5, etc.) when provided.

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :template="template1"
  :alt-template="template2"
/>
```

## Events

### cancel: `Function`

Fires when the user cancels editing. The event handler function context (available through the `this` keyword) will be set to the ListView instance.

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :edit-template="editTemplate"
  @cancel="handleCancel"
/>

<script setup>
function handleCancel() {
  console.log('Edit cancelled')
}
</script>
```

### change: `Function`

Fires when the selection of the ListView changes. The event handler function context (available through the `this` keyword) will be set to the ListView instance.

**Payload:** `T[]` - Array of selected items

**Example:**
```vue
<PantanalListView
  :data-source="items"
  selectable="multiple"
  @change="handleSelectionChange"
/>

<script setup>
function handleSelectionChange(selectedItems) {
  console.log('Selected items:', selectedItems)
}
</script>
```

### databound: `Function`

Fires when the ListView received data from the DataSource when it is already rendered.

**Payload:** `T[]` - Array of data items

**Example:**
```vue
<PantanalListView
  :data-source="items"
  @databound="handleDataBound"
/>

<script setup>
function handleDataBound(data) {
  console.log('Data bound:', data)
}
</script>
```

### databinding: `Function`

Fires when the ListView is about to be bound.

**Example:**
```vue
<PantanalListView
  :data-source="items"
  @databinding="handleDataBinding"
/>

<script setup>
function handleDataBinding() {
  console.log('Data binding started')
}
</script>
```

### edit: `Function`

Fires when the ListView enters the edit mode.

**Payload:** `T` - The data item being edited

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :edit-template="editTemplate"
  @edit="handleEdit"
/>

<script setup>
function handleEdit(item) {
  console.log('Editing item:', item)
}
</script>
```

### remove: `Function`

Fires before the list view item is removed. If the event is not prevented, the ListView will call the DataSource sync method. The event handler function context (available through the `this` keyword) will be set to the ListView instance.

**Payload:** `T` - The data item being removed

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :edit-template="editTemplate"
  @remove="handleRemove"
/>

<script setup>
function handleRemove(item) {
  console.log('Removing item:', item)
  // Remove from data source
}
</script>
```

### save: `Function`

Fires when a data item is saved. The event handler function context (available through the `this` keyword) will be set to the ListView instance.

**Payload:** `T` - The data item being saved

**Example:**
```vue
<PantanalListView
  :data-source="items"
  :edit-template="editTemplate"
  @save="handleSave"
/>

<script setup>
function handleSave(item) {
  console.log('Saving item:', item)
  // Save to data source
}
</script>
```

## Methods

Access methods via component ref:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const listViewRef = ref<InstanceType<typeof PantanalListView>>()

// Call methods
listViewRef.value?.widget()
listViewRef.value?.refresh()
</script>
```

### widget

##### returns

Returns the ListView instance.

**Returns:** `ListViewInstance`

**Example:**
```typescript
const widget = listViewRef.value?.widget()
widget?.refresh()
```

### refresh

##### returns

Refreshes the ListView by reloading data from the data source.

**Example:**
```typescript
listViewRef.value?.refresh()
```

### items

##### returns

Returns the current array of items displayed in the ListView.

**Returns:** `T[]`

**Example:**
```typescript
const items = listViewRef.value?.items()
console.log('Current items:', items)
```

### selectedItems

##### returns

Returns the array of currently selected items.

**Returns:** `T[]`

**Example:**
```typescript
const selected = listViewRef.value?.selectedItems()
console.log('Selected items:', selected)
```

### clearSelection

##### returns

Clears all selected items.

**Example:**
```typescript
listViewRef.value?.clearSelection()
```

### selectItem

##### parameters

- `item: T` - The item to select

##### returns

Selects a specific item.

**Example:**
```typescript
listViewRef.value?.selectItem(items[0])
```

### deselectItem

##### parameters

- `item: T` - The item to deselect

##### returns

Deselects a specific item.

**Example:**
```typescript
listViewRef.value?.deselectItem(items[0])
```

### startEdit

##### parameters

- `item: T` - The item to edit

##### returns

Starts editing a specific item.

**Example:**
```typescript
listViewRef.value?.startEdit(items[0])
```

### cancelEdit

##### returns

Cancels the current edit operation.

**Example:**
```typescript
listViewRef.value?.cancelEdit()
```

### saveEdit

##### returns

Saves the current edit operation.

**Example:**
```typescript
listViewRef.value?.saveEdit()
```

### removeItem

##### parameters

- `item: T` - The item to remove

##### returns

Removes a specific item from the list.

**Example:**
```typescript
listViewRef.value?.removeItem(items[0])
```

## Examples

### Basic Usage

```vue
<template>
  <PantanalListView
    :data-source="items"
    :template="template"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
])

const template = (item) => `
  <div>
    <strong>${item.name}</strong>
  </div>
`
</script>
```

### With Selection

```vue
<template>
  <PantanalListView
    :data-source="items"
    :template="template"
    selectable="multiple"
    @change="handleSelectionChange"
  />
</template>

<script setup>
function handleSelectionChange(selectedItems) {
  console.log('Selected:', selectedItems)
}
</script>
```

### With Editing

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
const editTemplate = (item) => `
  <input type="text" value="${item.name}" />
`

function handleEdit(item) {
  console.log('Editing:', item)
}

function handleSave(item) {
  console.log('Saving:', item)
}

function handleCancel() {
  console.log('Cancelled')
}
</script>
```

### With DataSource Component

```vue
<template>
  <PantanalListView
    :data-source="dataSourceRef"
    :template="template"
  />
  <PantanalDataSource
    ref="dataSourceRef"
    :data="items"
    type="local"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PantanalListView, PantanalDataSource } from '@pantanal/grid'

const items = ref([...])
const dataSourceRef = ref()
</script>
```

## See Also

- [DataSource API](/api/data-sources) - Data source configuration
- [Getting Started Guide](/guide/getting-started) - Quick start guide

