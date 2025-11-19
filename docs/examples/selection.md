# Selection

Pantanal Grid supports single and multiple row selection with checkboxes or programmatic selection.

<ExamplePreview>
  <SelectionCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import SelectionCompleteExample from './components/SelectionCompleteExample.vue'
import SelectionExample from './components/SelectionExample.vue'
</script>

## Selection Modes

### Multiple Selection

<ExamplePreview>
  <SelectionExample />
</ExamplePreview>

### Single Selection

Enable single-row selection:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="single"
  @selectionChange="handleSelectionChange"
/>
```

### Multiple Selection

Enable multiple-row selection:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]

const selectedKeys = ref<number[]>([])

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
  console.log('Selected rows:', keys)
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    selectable="multiple"
    @selectionChange="handleSelectionChange"
  />
</template>
```

## Single Selection

Enable single row selection:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    selectable="single"
    @selectionChange="handleSelectionChange"
  />
</template>
```

## Disable Selection

Disable selection entirely:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :selectable="false"
/>
```

## Programmatic Selection

Control selection programmatically:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()
const selectedKeys = ref<number[]>([])

function selectAll() {
  // Select all rows
  const allKeys = rows.value.map(r => r.id)
  selectedKeys.value = allKeys
}

function clearSelection() {
  selectedKeys.value = []
}

function selectFirst() {
  selectedKeys.value = [rows.value[0].id]
}
</script>

<template>
  <div>
    <div class="mb-4">
      <button @click="selectAll">Select All</button>
      <button @click="clearSelection">Clear Selection</button>
      <button @click="selectFirst">Select First</button>
    </div>
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
      selectable="multiple"
      v-model:selectedKeys="selectedKeys"
    />
  </div>
</template>
```

## Persist Selection

Persist selection across page changes:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="multiple"
  :persist-selection="true"
/>
```

## Selection Events

Listen to selection changes:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    selectable="multiple"
    @selectionChange="handleSelectionChange"
  />
</template>

<script setup lang="ts">
function handleSelectionChange(keys: number[]) {
  console.log('Selection changed:', keys)
  // Update UI, fetch related data, etc.
}
</script>
```

## Keyboard Selection

When `navigatable` is enabled, use keyboard shortcuts for selection:

- **Space**: Select/deselect current row
- **Ctrl + Space**: Toggle selection (multiple mode)
- **Shift + Space**: Range selection (multiple mode)
- **Shift + Arrow Keys**: Extend selection (multiple mode)

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="multiple"
  :navigatable="true"
  @selectionChange="handleSelectionChange"
/>
```

## Selection with Pagination

By default, selection is per-page. Use `persistSelection` to maintain selection across pages:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="multiple"
  :persist-selection="true"
  :pageable="true"
  v-model:page="page"
/>
```

## Initial Selection

Set initial selected rows:

```vue
<script setup lang="ts">
const selectedKeys = ref<number[]>([1, 3, 5]) // Pre-select rows with IDs 1, 3, and 5
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    selectable="multiple"
    v-model:selectedKeys="selectedKeys"
  />
</template>
```

## Selection Checkbox

The grid automatically adds a checkbox column when selection is enabled. Customize it:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="multiple"
  :selection-checkbox="true"
/>
```

## See Also

- [Selection Guide](/guide/selection) - Complete selection documentation
- [Keyboard Navigation](/examples/keyboard-navigation) - Keyboard shortcuts for selection

