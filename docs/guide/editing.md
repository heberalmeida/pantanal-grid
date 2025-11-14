# Editing

Pantanal Grid supports inline editing, allowing users to edit cell values directly in the grid. You can enable editing for specific columns and handle save/cancel operations.

## Basic Editing

Enable editing by setting `editable="true"`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', editable: true },
  { field: 'price', title: 'Price', editable: true },
  { field: 'category', title: 'Category', editable: true }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :editable="true"
    :toolbar="['save', 'cancel']"
  />
</template>
```

## Column-Level Editing

Control editing per column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, editable: false },  // Not editable
  { field: 'name', title: 'Name', editable: true },          // Editable
  { field: 'price', title: 'Price', editable: true },        // Editable
  { field: 'category', title: 'Category', editable: false }   // Not editable
]
</script>
```

## Conditional Editing

Make columns conditionally editable based on row data:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    editable: (row) => row.status === 'active'  // Only editable if status is active
  }
]
</script>
```

## Editing Modes

### Inline Editing

Edit cells directly in the grid:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  editable="inline"
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
/>
```

## Toolbar Buttons

Add toolbar buttons for editing operations:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :editable="true"
  :toolbar="['create', 'save', 'cancel']"
/>
```

## Editing Events

Handle editing events:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :editable="true"
    @edit="handleEdit"
    @editCommit="handleEditCommit"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
function handleEdit(row: any, field: string) {
  console.log('Editing:', row, field)
}

function handleEditCommit(row: any, field: string, value: any) {
  console.log('Committed:', row, field, value)
  // Update row data
  const index = rows.value.findIndex(r => r.id === row.id)
  if (index !== -1) {
    rows.value[index] = { ...rows.value[index], [field]: value }
  }
}

function handleSave() {
  console.log('Saving all changes')
  // Save to server, etc.
}

function handleCancel() {
  console.log('Canceling changes')
  // Revert changes, etc.
}
</script>
```

## Custom Editors

Provide custom editors for specific columns:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    editable: true,
    editor: (container, options) => {
      const select = document.createElement('select')
      select.innerHTML = `
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Accessories">Accessories</option>
      `
      select.value = options.value || ''
      container.appendChild(select)
      return select
    }
  }
]
</script>
```

## Validation

Add validation rules for editable columns:

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
      validator: (value) => {
        if (value < 0) return 'Price cannot be negative'
        if (value > 10000) return 'Price cannot exceed 10000'
        return true
      }
    }
  }
]
</script>
```

## Command Columns

Add edit/delete buttons in a command column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' },
  {
    field: 'command',
    title: 'Actions',
    width: 150,
    command: ['edit', 'destroy']
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :editable="true"
    @edit="handleEdit"
    @destroy="handleDestroy"
  />
</template>
```

## Complete Example

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

function handleEdit(row: any) {
  console.log('Edit row:', row)
}

function handleDestroy(row: any) {
  const index = rows.value.findIndex(r => r.id === row.id)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
}

function handleSave() {
  console.log('Saving changes:', rows.value)
  // Save to server
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :editable="true"
    :toolbar="['save', 'cancel']"
    @edit="handleEdit"
    @destroy="handleDestroy"
    @save="handleSave"
    locale="en"
  />
</template>
```

## Tips

- Use `editable: false` on columns that shouldn't be edited (like IDs)
- Provide validation rules for data integrity
- Handle save/cancel events to persist or revert changes
- Use custom editors for complex input types
- Consider using command columns for row-level actions





