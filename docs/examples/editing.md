# Editing

Pantanal Grid supports inline editing, batch editing, and popup editing modes with validation and custom editors.

<ExamplePreview>
  <EditingCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import EditingCompleteExample from './components/EditingCompleteExample.vue'
import EditingExample from './components/EditingExample.vue'
</script>

## Basic Editing

<ExamplePreview>
  <EditingExample />
</ExamplePreview>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

const rows = ref<Product[]>([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, editable: false },
  { field: 'name', title: 'Name', width: 200, editable: true },
  { 
    field: 'price', 
    title: 'Price', 
    width: 120,
    editable: true,
    type: 'number',
    format: (v: number) => `$${v.toFixed(2)}`,
    validation: {
      required: true,
      min: 0
    }
  },
  { field: 'category', title: 'Category', width: 150, editable: true },
  { field: 'stock', title: 'Stock', width: 120, editable: true, type: 'number' },
  {
    field: 'command',
    title: 'Actions',
    width: 180,
    command: ['edit', 'destroy']
  }
]

function handleEditSave(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.id === product.id)
  if (index !== -1) {
    rows.value[index] = { ...rows.value[index], ...product }
  }
}

function handleDestroy(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.id === product.id)
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
    editable="inline"
    :toolbar="['create']"
    @editSave="handleEditSave"
    @editCancel="() => console.log('Edit cancelled')"
    @create="(data: any) => {
      const newProduct = data.row as Product
      const maxId = Math.max(...rows.map(r => r.id), 0)
      newProduct.id = maxId + 1
      rows.push(newProduct)
    }"
    @destroy="handleDestroy"
    locale="en"
    responsive="table"
    :height="400"
  />
</template>
```

## Editing Modes

### Inline Editing

In inline editing mode (`editable="inline"`), clicking the Edit button converts the row into edit mode with inline inputs. All editable cells in the row will show input fields directly in the table:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

const rows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const columns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

function handleEditSave(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.productID === product.productID)
  if (index !== -1) {
    rows.value[index] = { ...rows.value[index], ...product }
  }
}

function handleEditCancel() {
  console.log('Edit cancelled')
}

function handleCreate(data: { row: unknown }) {
  const product = data.row as Product
  const maxId = Math.max(...rows.value.map(r => r.productID), 0)
  product.productID = maxId + 1
  rows.value.push(product)
}

function handleDestroy(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.productID === product.productID)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    editable="inline"
    :toolbar="['create']"
    @editSave="handleEditSave"
    @editCancel="handleEditCancel"
    @create="handleCreate"
    @destroy="handleDestroy"
  />
</template>
```

**How it works:**

1. **Click Edit button**: When you click the "Edit" button on a row, that row enters edit mode
2. **Inputs appear**: All editable columns in that row automatically show input fields:
   - Text fields for string columns
   - Number inputs (with spinner) for number columns
   - Checkboxes for boolean columns
   - Date pickers for date columns
   - Select dropdowns for columns with `values` prop
3. **Update or Cancel**: Use the "Update" button to save changes or "Cancel" to discard them
4. **Visual feedback**: The editing row is clearly distinguished with input fields replacing the static text

The inputs are rendered directly in the table cells, making it easy to edit data without opening a separate dialog.

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

