# Selection

Pantanal Grid supports single and multiple row selection with checkboxes and programmatic control.

## Multiple Selection

Enable multiple row selection:

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

Control selection programmatically using v-model:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]
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

## Column-Level Selection

You can also add a selectable column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'selectable',
    selectable: true,
    width: 50
  },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' }
]
</script>
```

## Tips

- Use `selectable="multiple"` for bulk operations
- Use `selectable="single"` for detail views
- Use `persistSelection: true` to maintain selection across pagination
- Handle `selectionChange` event to update related UI components








