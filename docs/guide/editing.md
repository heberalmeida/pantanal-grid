# Editing

Pantanal Grid ships with batch, inline, and popup editors. Each mode shares the same column-level configuration (`editable`, `validation`, `values`, `editor`) so you can switch between experiences without changing column definitions.

## Configuring editable columns

Only columns flagged with `editable` participate in the editing workflow. You can use booleans or row-based predicates.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'AirPods', price: 199, stock: 12, status: 'active' },
  { id: 2, name: 'Noise Cancelling Headphones', price: 349, stock: 4, status: 'archived' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', editable: true },
  { field: 'price', title: 'Price', editable: true, type: 'number' },
  {
    field: 'stock',
    title: 'Stock',
    editable: row => row.status === 'active',
    type: 'number'
  }
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

## Batch editing (`editable=true`)

Batch mode keeps cells readonly until you click them. Every edit is tracked locally until Save (toolbar) commits all pending changes.

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :editable="true"
    :toolbar="['create', 'save', 'cancel']"
    @save="persistChanges"
    @cancel="resetDraft"
  />
</template>
```

Use the emitted payload to sync with your store or API:

```ts
function persistChanges(payload: { changes: Array<{ type: 'create' | 'update' | 'destroy'; row: any }> }) {
  payload.changes.forEach(change => {
    if (change.type === 'update') {
      const index = rows.value.findIndex(item => item.id === change.row.id)
      if (index !== -1) rows.value[index] = { ...rows.value[index], ...change.row }
    }
  })
}

function resetDraft() {
  // fetch original data or simply ignore to keep local state intact
}
```

## Inline editing (`editable="inline"`)

Inline mode swaps the row into edit state when the user clicks the Edit command. Row-level Save/Cancel buttons are injected automatically when you include `'edit'` inside a command column.

```vue
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', editable: true },
  { field: 'price', title: 'Price', editable: true, type: 'number' },
  { field: 'command', title: '', width: 180, command: ['edit', 'destroy'] }
]

<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  editable="inline"
  :toolbar="['create']"
  @editSave="handleInlineSave"
  @editCancel="handleInlineCancel"
/>
```

When inline Save fires the grid has already merged the input values into the row object, so you can push the updated entity to your backend or state store in `handleInlineSave`.

## Popup editing (`editable="popup"`)

Popup mode reuses the same column metadata but renders a dialog with stacked editors. The dialog buttons reuse `handleEditSave` and `handleEditCancel`, so you can share the same event handlers between inline and popup flows.

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  editable="popup"
  :toolbar="['create']"
  @editSave="handleInlineSave"
  @editCancel="handleInlineCancel"
/>
```

## Validation

Set per-column validation rules to stop invalid submissions. Rules run on blur (batch) or right before inline/popup saves. Failed rules emit `validationError`.

```vue
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    editable: true,
    validation: {
      required: true,
      minLength: 3
    }
  },
  {
    field: 'price',
    title: 'Price',
    editable: true,
    type: 'number',
    validation: {
      required: true,
      min: 1,
      max: 9999
    }
  }
]
```

## Custom editors

Use `values` for select lists or `editor` for full control. The `editor` callback receives the container plus field metadata. Attach your own input and listen for `change`/`input` to update the grid.

```ts
const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    editable: true,
    values: [
      { value: 'audio', text: 'Audio' },
      { value: 'mobile', text: 'Mobile' }
    ]
  },
  {
    field: 'supplierId',
    title: 'Supplier',
    editable: true,
    editor: (container, options) => {
      const select = document.createElement('select')
      suppliers.forEach((supplier, index) => {
        const option = document.createElement('option')
        option.value = String(supplier.id)
        option.textContent = supplier.name
        if (supplier.id === options.value) option.selected = true
        select.appendChild(option)
      })
      container.appendChild(select)
      return select
    }
  }
]
```

## Events cheat sheet

| Event        | When it fires                           | Payload                                                     |
|--------------|-----------------------------------------|-------------------------------------------------------------|
| `edit`       | A cell or row entered edit mode         | `{ row, field? }`                                           |
| `editCommit` | A single cell committed in batch mode   | `{ row, field, value }`                                     |
| `editSave`   | Inline/popup row saved                  | `{ row }`                                                   |
| `editCancel` | Inline/popup row cancelled              | `{ row }`                                                   |
| `save`       | Toolbar Save pressed in batch mode      | `{ changes: Array<{ type, row }> }`                         |
| `cancel`     | Toolbar Cancel pressed in batch mode    | `void`                                                      |
| `create`     | Toolbar Create pressed                  | `{ row }` (the draft row injected into the grid)            |
| `destroy`    | Destroy command clicked                 | `{ row }`                                                   |
| `validationError` | A validation rule failed           | `{ row, field, error }`                                     |

## Tips

- Prefer `editable="inline"` when you want row-level save points, or `editable="popup"` when space is limited.
- Always set `key-field` so pending edits map to deterministic rows.
- Pair toolbar actions with toast/notification feedback because batch saves can touch multiple records at once.
- Use `values` for simple dropdowns and `editor` for anything that needs bespoke markup or widgets.
- Keep destructive actions (`destroy`) behind a confirmation dialog by enabling `editableConfirmation`.

Next steps: explore the [complete editing example](/examples/editing), hook up `save` events to your backend, and combine editing with other capabilities such as filtering or persisted state.







