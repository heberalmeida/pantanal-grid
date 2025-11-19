<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Grid Editing</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports various editing modes including inline, batch, and popup editing.
        This page demonstrates the editing capabilities of the Grid component.
      </p>
    </header>

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
        @save="onBatchSave"
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
        @editSave="handleInlineEditSave"
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
        @editSave="handlePopupEditSave"
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
        @editSave="handleValidationEditSave"
        @editCancel="onEditCancel"
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
        @editSave="handleCustomEditSave"
        @editCancel="onEditCancel"
        @create="onCreate"
        @destroy="onDestroy"
      />
      <ExampleCode :source="customEditorCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

type ProductRecord = {
  productID: number
  productName: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
  categoryID?: number
  categoryName?: string
  email?: string
}

const formatCurrency = (value?: number) => {
  const numeric = typeof value === 'number' && !Number.isNaN(value) ? value : 0
  return `$ ${numeric.toFixed(2)}`
}

const categories = [
  { categoryID: 1, categoryName: 'Beverages' },
  { categoryID: 2, categoryName: 'Condiments' },
  { categoryID: 3, categoryName: 'Confections' },
]

const batchRows = ref<ProductRecord[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const batchColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v?: number) => formatCurrency(v) },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

const inlineRows = ref<ProductRecord[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
])

const inlineColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v?: number) => formatCurrency(v) },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

const popupRows = ref<ProductRecord[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false },
])

const popupColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v?: number) => formatCurrency(v) },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

const validationRows = ref<ProductRecord[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false, email: 'product@example.com' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, discontinued: false, email: 'product2@example.com' },
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
    format: (v?: number) => formatCurrency(v),
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

const customEditorRows = ref<ProductRecord[]>([
  { productID: 1, productName: 'Chai', categoryID: 1, categoryName: 'Beverages', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', categoryID: 1, categoryName: 'Beverages', unitPrice: 17, unitsInStock: 40, discontinued: false },
])

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
        option.value = String(cat.categoryID)
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
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number', format: (v?: number) => formatCurrency(v) },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

const dataStores: Ref<ProductRecord[]>[] = [
  batchRows,
  inlineRows,
  popupRows,
  validationRows,
  customEditorRows,
]

const fallbackCategory = categories[0] ?? { categoryID: 1, categoryName: 'Beverages' }

function getNextProductId() {
  const ids = dataStores.flatMap(store => store.value.map(row => row.productID ?? 0))
  return (ids.length ? Math.max(...ids) : 0) + 1
}

function normalizeProductRow(row: Partial<ProductRecord> = {}): ProductRecord {
  const nextCategory = categories.find(cat => cat.categoryID === row.categoryID) ?? fallbackCategory
  return {
    productID: typeof row.productID === 'number' ? row.productID : getNextProductId(),
    productName: row.productName ?? 'New Product',
    unitPrice: typeof row.unitPrice === 'number' && !Number.isNaN(row.unitPrice) ? row.unitPrice : 0,
    unitsInStock: typeof row.unitsInStock === 'number' && !Number.isNaN(row.unitsInStock) ? row.unitsInStock : 0,
    discontinued: !!row.discontinued,
    categoryID: nextCategory?.categoryID,
    categoryName: nextCategory?.categoryName,
  }
}

function upsertRow(store: Ref<ProductRecord[]>, row: ProductRecord) {
  const index = store.value.findIndex(item => item.productID === row.productID)
  if (index === -1) {
    store.value = [...store.value, row]
    return
  }
  store.value = store.value.map(item => (item.productID === row.productID ? { ...item, ...row } : item))
}

function removeRow(store: Ref<ProductRecord[]>, productID?: number) {
  if (typeof productID !== 'number') return
  store.value = store.value.filter(item => item.productID !== productID)
}

function handleEditSave(target: Ref<ProductRecord[]>, data: { row: unknown }) {
  console.log('Edit save:', data)
  const normalized = normalizeProductRow(data.row as ProductRecord)
  upsertRow(target, normalized)
}

const handleInlineEditSave = (data: { row: unknown }) => handleEditSave(inlineRows, data as { row: unknown })
const handlePopupEditSave = (data: { row: unknown }) => handleEditSave(popupRows, data as { row: unknown })
const handleValidationEditSave = (data: { row: unknown }) => handleEditSave(validationRows, data as { row: unknown })
const handleCustomEditSave = (data: { row: unknown }) => handleEditSave(customEditorRows, data as { row: unknown })

function onEdit(data: { row: unknown; field?: string }) {
  console.log('Edit:', data)
}

function onEditCommit(data: { row: unknown; field: string; value: unknown }) {
  console.log('Edit commit:', data)
  const row = data.row as any
  if (row && data.field) {
    row[data.field] = data.value
  }
}

function onEditCancel(data: { row: unknown }) {
  console.log('Edit cancel:', data)
}

function onBatchSave(data: { changes: Array<{ type: 'create' | 'update' | 'destroy'; row: unknown }> }) {
  console.log('Save:', data)
  if (data.changes.length === 0) {
    alert('No changes to save')
    return
  }
  alert(`Saving ${data.changes.length} change(s)`)
  data.changes.forEach(change => {
    const normalized = normalizeProductRow(change.row as ProductRecord)
    if (change.type === 'create' || change.type === 'update') {
      upsertRow(batchRows, normalized)
    } else if (change.type === 'destroy') {
      removeRow(batchRows, normalized.productID)
    }
  })
}

function onCancel() {
  console.log('Cancel')
}

function onCreate(data: { row: unknown }) {
  console.log('Create:', data)
  const newRow = data.row as ProductRecord
  if (!newRow) return
  const normalized = normalizeProductRow(newRow)
  Object.assign(newRow, normalized)
}

function onDestroy(data: { row: unknown }) {
  console.log('Destroy:', data)
  const row = data.row as ProductRecord
  if (!row) return
  dataStores.forEach(store => removeRow(store, row.productID))
}

function onValidationError(data: { row: unknown; field: string; error: string }) {
  console.error('Validation error:', data)
  alert(`Validation error in ${data.field}: ${data.error}`)
}

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
    @editCancel="onEditCancel"
    @create="onCreate"
    @destroy="onDestroy"
  />
</template>

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
])

const columns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80, editable: false },
  { field: 'productName', title: 'Product Name', width: 200, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, editable: true, type: 'number' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, editable: true, type: 'number' },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 180, command: ['edit', 'destroy'] },
]

function onEditSave(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.productID === product.productID)
  if (index !== -1) {
    rows.value[index] = { ...rows.value[index], ...product }
  }
}

function onEditCancel() {
  console.log('Edit cancelled')
}

function onCreate(data: { row: unknown }) {
  const product = data.row as Product
  const maxId = Math.max(...rows.value.map(r => r.productID), 0)
  product.productID = maxId + 1
  rows.value.push(product)
}

function onDestroy(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.productID === product.productID)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
}
<\/script>`

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
        option.value = String(cat.categoryID)
        option.textContent = cat.categoryName
        select.appendChild(option)
      })
      container.appendChild(select)
    }
  }
]
<\/script>`
</script>

