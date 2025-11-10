<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Foreign-Key Columns</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Foreign-key columns allow you to display and edit relationships between data using dropdown lists.
        The grid automatically creates a dropdown editor when you define the <code>values</code> property on a column.
      </p>
    </header>

    <!-- Basic Foreign-Key Column Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Foreign-Key Column</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        A simple foreign-key column with a dropdown editor. The <code>values</code> property defines the options available in the dropdown.
        The column displays the text but stores the value in the data.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="productID"
        :editable="true"
        :toolbar="['create', 'save', 'cancel']"
        @edit="onEdit"
        @editCommit="onEditCommit"
        @save="onSave"
        @cancel="onCancel"
        @create="onCreate"
        @destroy="onDestroy"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Foreign-Key with Custom Editor Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Foreign-Key with Custom Editor</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can also provide a custom editor function for more control over the dropdown rendering.
      </p>

      <PantanalGrid
        :rows="customEditorRows"
        :columns="customEditorColumns as any"
        key-field="productID"
        :editable="true"
        :toolbar="['create', 'save', 'cancel']"
        @edit="onEdit"
        @editCommit="onEditCommit"
        @save="onSave"
        @cancel="onCancel"
        @create="onCreate"
        @destroy="onDestroy"
      />
      <ExampleCode :source="customEditorCode" />
    </article>

    <!-- Foreign-Key with Validation Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Foreign-Key with Validation</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Foreign-key columns can include validation to ensure the selected value is valid.
      </p>

      <PantanalGrid
        :rows="validationRows"
        :columns="validationColumns as any"
        key-field="productID"
        :editable="true"
        :toolbar="['create', 'save', 'cancel']"
        @edit="onEdit"
        @editCommit="onEditCommit"
        @save="onSave"
        @cancel="onCancel"
        @create="onCreate"
        @destroy="onDestroy"
        @validationError="onValidationError"
      />
      <ExampleCode :source="validationCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  categoryID: number
  discontinued: boolean
}

// Basic Foreign-Key Column Example
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 1, discontinued: false },
  { productID: 4, productName: 'Chef Anton', unitPrice: 22, categoryID: 2, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, categoryID: 2, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, categoryID: 3, discontinued: false },
])

const categories = [
  { value: 1, text: 'Beverages' },
  { value: 2, text: 'Condiments' },
  { value: 3, text: 'Confections' },
  { value: 4, text: 'Dairy Products' },
  { value: 5, text: 'Grains/Cereals' },
]

const basicColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    values: categories,
    editable: true,
  },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  productID: number
  productName: string
  unitPrice: number
  categoryID: number
  discontinued: boolean
}

const rows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 1, discontinued: false },
  { productID: 4, productName: 'Chef Anton', unitPrice: 22, categoryID: 2, discontinued: false },
  { productID: 5, productName: 'Chef Gumbo Mix', unitPrice: 21.35, categoryID: 2, discontinued: true },
  { productID: 6, productName: 'Boysenberry Spread', unitPrice: 25, categoryID: 3, discontinued: false },
])

const categories = [
  { value: 1, text: 'Beverages' },
  { value: 2, text: 'Condiments' },
  { value: 3, text: 'Confections' },
  { value: 4, text: 'Dairy Products' },
  { value: 5, text: 'Grains/Cereals' },
]

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    values: categories,
    editable: true,
  },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :editable="true"
    :toolbar="['create', 'save', 'cancel']"
    @edit="onEdit"
    @editCommit="onEditCommit"
    @save="onSave"
    @cancel="onCancel"
    @create="onCreate"
    @destroy="onDestroy"
  />
</template>`

// Custom Editor Example
const customEditorRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 1, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, categoryID: 1, discontinued: false },
])

const customEditorColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', editable: true },
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    editable: true,
    editor: (container: HTMLElement, options: { field: string; value: any; row: Product }) => {
      const select = document.createElement('select')
      select.className = 'v3grid__editor'
      select.style.width = '100%'
      select.style.padding = '4px 8px'
      select.style.border = '1px solid #ccc'
      select.style.borderRadius = '4px'
      
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = String(cat.value)
        option.textContent = cat.text
        if (cat.value === options.value) {
          option.selected = true
        }
        select.appendChild(option)
      })
      
      container.appendChild(select)
      return select
    },
  },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

const customEditorCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const categories = [
  { value: 1, text: 'Beverages' },
  { value: 2, text: 'Condiments' },
  { value: 3, text: 'Confections' },
]

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, editable: true },
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    editable: true,
    editor: (container: HTMLElement, options: { field: string; value: any; row: Product }) => {
      const select = document.createElement('select')
      select.className = 'v3grid__editor'
      select.style.width = '100%'
      
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = String(cat.value)
        option.textContent = cat.text
        if (cat.value === options.value) {
          option.selected = true
        }
        select.appendChild(option)
      })
      
      container.appendChild(select)
      return select
    },
  },
]
<\/script>`

// Validation Example
const validationRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 1, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, categoryID: 1, discontinued: false },
])

const validationColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 180, editable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}', editable: true, type: 'number' },
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    values: categories,
    editable: true,
    validation: {
      required: true,
      validator: (value: any) => {
        if (value == null || value === '') {
          return 'Category is required'
        }
        const validValues = categories.map(c => c.value)
        if (!validValues.includes(value)) {
          return 'Invalid category selected'
        }
        return true
      },
    },
  },
  { field: 'discontinued', title: 'Discontinued', width: 120, editable: true, type: 'boolean' },
  { field: 'command', title: ' ', width: 100, command: ['destroy'] },
]

const validationCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const categories = [
  { value: 1, text: 'Beverages' },
  { value: 2, text: 'Condiments' },
  { value: 3, text: 'Confections' },
]

const columns: ColumnDef<Product>[] = [
  {
    field: 'categoryID',
    title: 'Category',
    width: 180,
    values: categories,
    editable: true,
    validation: {
      required: true,
      validator: (value: any) => {
        if (value == null || value === '') {
          return 'Category is required'
        }
        const validValues = categories.map(c => c.value)
        if (!validValues.includes(value)) {
          return 'Invalid category selected'
        }
        return true
      },
    },
  },
]
<\/script>`

// Event handlers
function onEdit(data: { row: unknown; field?: string }) {
  console.log('Edit:', data)
}

function onEditCommit(data: { row: unknown; field: string; value: unknown }) {
  console.log('Edit commit:', data)
  const row = data.row as any
  if (row && data.field) {
    // Convert value to number if it's a categoryID
    if (data.field === 'categoryID' && typeof data.value === 'string') {
      row[data.field] = parseInt(data.value, 10)
    } else {
      row[data.field] = data.value
    }
  }
}

function onSave(data: { changes: Array<{ type: 'create' | 'update' | 'destroy'; row: unknown }> }) {
  console.log('Save:', data)
}

function onCancel() {
  console.log('Cancel')
}

function onCreate(data: { row: unknown }) {
  console.log('Create:', data)
  const row = data.row as any
  if (row && !row.productID) {
    // Assign a temporary ID for new rows
    row.productID = Date.now()
  }
}

function onDestroy(data: { row: unknown }) {
  console.log('Destroy:', data)
  const row = data.row as any
  if (row && row.productID) {
    const index = basicRows.value.findIndex(r => r.productID === row.productID)
    if (index > -1) {
      basicRows.value.splice(index, 1)
    }
  }
}

function onValidationError(data: { row: unknown; field: string; error: string }) {
  console.error('Validation error:', data)
  alert(`Validation error in ${data.field}: ${data.error}`)
}
</script>

