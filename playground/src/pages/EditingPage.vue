<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Grid Editing</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports various editing modes including inline, batch, and popup editing.
        This page demonstrates the editing capabilities of the Grid component.
      </p>
    </header>

    <!-- Note -->
    <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <p class="text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Note:</strong> Editing functionality is currently being implemented. This page will be updated as features are added.
      </p>
    </div>

    <!-- Batch Editing Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Batch Editing</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        In batch editing mode, multiple cells can be edited and changes are saved together using the Save button.
      </p>

      <PantanalGrid
        :rows="batchRows"
        :columns="batchColumns as any"
        key-field="productID"
        :editable="true"
        :toolbar="['create', 'save', 'cancel']"
        :navigatable="true"
        @edit="onEdit"
        @editCommit="onEditCommit"
        @save="onSave"
        @cancel="onCancel"
        @create="onCreate"
        @destroy="onDestroy"
      />
      <ExampleCode :source="batchCode" />
    </article>

    <!-- Inline Editing Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Inline Editing</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        In inline editing mode, clicking the Edit button converts the row into edit mode with inline inputs.
      </p>

      <PantanalGrid
        :rows="inlineRows"
        :columns="inlineColumns as any"
        key-field="productID"
        editable="inline"
        :toolbar="['create']"
        @edit="onEdit"
        @editSave="onEditSave"
        @editCancel="onEditCancel"
        @create="onCreate"
        @destroy="onDestroy"
      />
      <ExampleCode :source="inlineCode" />
    </article>

    <!-- Popup Editing Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Popup Editing</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        In popup editing mode, clicking Edit opens a popup dialog with a form for editing the row.
      </p>

      <PantanalGrid
        :rows="popupRows"
        :columns="popupColumns as any"
        key-field="productID"
        editable="popup"
        :toolbar="['create']"
        @edit="onEdit"
        @editSave="onEditSave"
        @editCancel="onEditCancel"
        @create="onCreate"
        @destroy="onDestroy"
      />
      <ExampleCode :source="popupCode" />
    </article>

    <!-- Validation Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Validation</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        The Grid supports field validation with custom validators and validation rules.
      </p>

      <PantanalGrid
        :rows="validationRows"
        :columns="validationColumns as any"
        key-field="productID"
        editable="inline"
        :toolbar="['create']"
        @edit="onEdit"
        @validationError="onValidationError"
      />
      <ExampleCode :source="validationCode" />
    </article>

    <!-- Custom Editors Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Editors</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can provide custom editors for columns, such as dropdown lists, date pickers, etc.
      </p>

      <PantanalGrid
        :rows="customEditorRows"
        :columns="customEditorColumns as any"
        key-field="productID"
        editable="inline"
        :toolbar="['create']"
        @edit="onEdit"
      />
      <ExampleCode :source="customEditorCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Batch editing data
const batchRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const batchColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

// Inline editing data
const inlineRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
])

const inlineColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

// Popup editing data
const popupRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
])

const popupColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

// Validation data
const validationRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
])

const validationColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  {
    field: 'productName',
    title: 'Product Name',
    width: 200,
    editable: true,
    validation: {
      required: true,
      validator: (value: string) => {
        if (!value || value.trim() === '') {
          return 'Product name is required'
        }
        if (!/^[A-Z]/.test(value)) {
          return 'Product name must start with a capital letter'
        }
        return true
      },
    },
  },
  {
    field: 'unitPrice',
    title: 'Unit Price',
    width: 120,
    editable: true,
    type: 'number',
    validation: { required: true, min: 1 },
    format: (v: number) => `$ ${v.toFixed(2)}`,
  },
  {
    field: 'unitsInStock',
    title: 'Units In Stock',
    width: 140,
    editable: true,
    type: 'number',
    validation: { required: true, min: 0 },
  },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

// Custom editors data
const customEditorRows = ref([
  { productID: 1, productName: 'Chai', categoryID: 1, categoryName: 'Beverages', unitPrice: 18, discontinued: false },
  { productID: 2, productName: 'Chang', categoryID: 1, categoryName: 'Beverages', unitPrice: 17, discontinued: false },
])

const categories = [
  { categoryID: 1, categoryName: 'Beverages' },
  { categoryID: 2, categoryName: 'Condiments' },
  { categoryID: 3, categoryName: 'Confections' },
]

const customEditorColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  {
    field: 'categoryID',
    title: 'Category',
    width: 150,
    editable: true,
    editor: (container: HTMLElement, options: { field: string; value: any; row: any }) => {
      const select = document.createElement('select')
      select.className = 'v3grid__editor'
      select.style.width = '100%'
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = cat.categoryID
        option.textContent = cat.categoryName
        if (cat.categoryID === options.value) {
          option.selected = true
        }
        select.appendChild(option)
      })
      container.appendChild(select)
      return select
    },
  },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

// Event handlers
function onEdit(data: { row: unknown; field?: string }) {
  console.log('Edit:', data)
}

function onEditCommit(data: { row: unknown; field: string; value: unknown }) {
  console.log('Edit commit:', data)
  // Update the row data
  const row = data.row as any
  if (row && data.field) {
    row[data.field] = data.value
  }
}

function onEditSave(data: { row: unknown }) {
  console.log('Edit save:', data)
}

function onEditCancel(data: { row: unknown }) {
  console.log('Edit cancel:', data)
}

function onSave(data: { changes: Array<{ type: 'create' | 'update' | 'destroy'; row: unknown }> }) {
  console.log('Save:', data)
  
  if (data.changes.length === 0) {
    alert('No changes to save')
    return
  }
  
  alert(`Saving ${data.changes.length} change(s)`)
  
  // Apply changes to the data
  data.changes.forEach(change => {
    if (change.type === 'create') {
      const row = change.row as any
      batchRows.value.push(row)
      inlineRows.value.push(row)
      popupRows.value.push(row)
    } else if (change.type === 'update') {
      const row = change.row as any
      const index = batchRows.value.findIndex((r: any) => r.productID === row.productID)
      if (index !== -1) {
        batchRows.value[index] = { ...batchRows.value[index], ...row }
      }
    } else if (change.type === 'destroy') {
      const row = change.row as any
      batchRows.value = batchRows.value.filter((r: any) => r.productID !== row.productID)
      inlineRows.value = inlineRows.value.filter((r: any) => r.productID !== row.productID)
      popupRows.value = popupRows.value.filter((r: any) => r.productID !== row.productID)
    }
  })
}

function onCancel() {
  console.log('Cancel')
  // Cancel should already clear the editing state
}

function onCreate(data: { row: unknown }) {
  console.log('Create:', data)
  const newRow = data.row as any
  if (newRow) {
    const maxId = Math.max(...batchRows.value.map(r => (r as any).productID), 0)
    newRow.productID = maxId + 1
    newRow.productName = newRow.productName || 'New Product'
    newRow.unitPrice = newRow.unitPrice || 0
    newRow.unitsInStock = newRow.unitsInStock || 0
    newRow.discontinued = newRow.discontinued || false
    batchRows.value.push(newRow as any)
  }
}

function onDestroy(data: { row: unknown }) {
  console.log('Destroy:', data)
  const row = data.row as any
  if (row) {
    batchRows.value = batchRows.value.filter(r => (r as any).productID !== row.productID)
    inlineRows.value = inlineRows.value.filter(r => (r as any).productID !== row.productID)
    popupRows.value = popupRows.value.filter(r => (r as any).productID !== row.productID)
    validationRows.value = validationRows.value.filter(r => (r as any).productID !== row.productID)
    customEditorRows.value = customEditorRows.value.filter(r => (r as any).productID !== row.productID)
  }
}

function onValidationError(data: { row: unknown; field: string; error: string }) {
  console.error('Validation error:', data)
  alert(`Validation error in ${data.field}: ${data.error}`)
}

// Code snippets
const batchCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :editable="true"
    :toolbar="['create', 'save', 'cancel']"
    @save="onSave"
    @cancel="onCancel"
  />
</template>`

const inlineCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    editable="inline"
    :toolbar="['create']"
    @edit="onEdit"
    @editSave="onEditSave"
  />
</template>`

const popupCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    editable="popup"
    :toolbar="['create']"
    @edit="onEdit"
    @editSave="onEditSave"
  />
</template>`

const validationCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    editable="inline"
    @validationError="onValidationError"
  />
</template>

<script setup>
const columns = [
  {
    field: 'productName',
    title: 'Product Name',
    editable: true,
    validation: {
      required: true,
      validator: (value) => {
        if (!/^[A-Z]/.test(value)) {
          return 'Product name must start with a capital letter'
        }
        return true
      }
    }
  }
]
<\/script>`

const customEditorCode = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    editable="inline"
  />
</template>

<script setup>
const columns = [
  {
    field: 'categoryID',
    title: 'Category',
    editable: true,
    editor: (container, options) => {
      const select = document.createElement('select')
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = cat.categoryID
        option.textContent = cat.categoryName
        select.appendChild(option)
      })
      container.appendChild(select)
    }
  }
]
<\/script>`
</script>

