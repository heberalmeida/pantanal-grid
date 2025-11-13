# Editing

Pantanal Grid supports inline editing, batch editing, and popup editing modes with validation and custom editors.

<ExamplePreview>
  <EditingCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import EditingCompleteExample from './components/EditingCompleteExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', editable: true },
  { 
    field: 'price', 
    title: 'Price', 
    editable: true,
    validation: {
      required: true,
      min: 0
    }
  },
  { field: 'category', title: 'Category', editable: true },
  { field: 'stock', title: 'Stock', editable: true },
  {
    field: 'command',
    title: 'Actions',
    width: 150,
    command: ['edit', 'destroy']
  }
]

function handleDestroy(row: any) {
  const index = rows.value.findIndex(r => r.id === row.id)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :editable="true"
    :toolbar="['save', 'cancel']"
    @destroy="handleDestroy"
    locale="en"
    responsive="table"
  />
</template>
```

## Editing Modes

### Inline Editing

Edit cells directly in the grid. Click on an editable cell to start editing:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :editable="true"
/>
```

### Batch Editing

Edit multiple cells and save all changes at once:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :editable="true"
  :toolbar="['save', 'cancel']"
  @save="handleSave"
  @cancel="handleCancel"
/>
```

### Popup Editing

Open a popup dialog for editing (requires custom implementation):

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  editable="popup"
  @edit="handleEdit"
/>
```

## Field Validation

Validate user input with validation rules:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    editable: true,
    validation: {
      required: true,
      min: 0,
      max: 10000,
      pattern: /^\d+(\.\d{1,2})?$/
    }
  },
  {
    field: 'email',
    title: 'Email',
    editable: true,
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  }
]
</script>
```

## Validation Rules

- `required`: Field must have a value
- `min`: Minimum value (for numbers)
- `max`: Maximum value (for numbers)
- `minLength`: Minimum string length
- `maxLength`: Maximum string length
- `pattern`: Regular expression pattern

## Events

- `@edit`: Fired when a cell enters edit mode
- `@editSave`: Fired when a cell is saved
- `@editCancel`: Fired when editing is cancelled
- `@save`: Fired when batch save is triggered
- `@cancel`: Fired when batch cancel is triggered
- `@create`: Fired when a new row is created
- `@destroy`: Fired when a row is deleted
- `@validationError`: Fired when validation fails

## See Also

- [Editing Guide](/guide/editing) - Complete editing documentation
- [ColumnDef API](/api/column-def) - Column validation options

