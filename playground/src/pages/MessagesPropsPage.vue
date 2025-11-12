<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Messages Props</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports customizable messages for all UI elements. You can customize toolbar buttons, command buttons, and other messages through the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages</code> prop.
      </p>
    </header>

    <!-- Toolbar Messages -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Toolbar Messages</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize toolbar button messages using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.create</code>, 
        <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.save</code>, 
        <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.cancel</code>, 
        and <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.excel</code>.
      </p>

      <PantanalGrid
        :rows="toolbarRows"
        :columns="toolbarColumns as any"
        key-field="productID"
        :toolbar="['create', 'save', 'cancel', 'excel']"
        :messages="toolbarMessages"
        :height="400"
      />
      <ExampleCode :source="toolbarCode" />
    </article>

    <!-- Command Messages -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Command Messages</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize command button messages using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.edit</code>, 
        <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.update</code>, 
        <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.destroy</code>, 
        and <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.cancelEdit</code>.
      </p>

      <PantanalGrid
        :rows="commandRows"
        :columns="commandColumns as any"
        key-field="productID"
        :editable="true"
        :messages="commandMessages"
        :height="400"
      />
      <ExampleCode :source="commandCode" />
    </article>

    <!-- No Records Message -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">No Records Message</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize the "no records" message using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.noRecords</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="noRecordsColumns as any"
        key-field="productID"
        :no-records="true"
        :messages="noRecordsMessages"
        :height="300"
      />
      <ExampleCode :source="noRecordsCode" />
    </article>

    <!-- Expand Collapse Column Header -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Expand Collapse Column Header</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize the expand/collapse column header message using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">messages.expandCollapseColumnHeader</code> 
        when using master-detail templates.
      </p>

      <PantanalGrid
        :rows="detailRows"
        :columns="detailColumns as any"
        key-field="productID"
        :detail-template="detailTemplate"
        :messages="detailMessages"
        :height="400"
      />
      <ExampleCode :source="detailCode" />
    </article>

    <!-- Combining Multiple Messages -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Combining Multiple Messages</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can combine multiple message customizations to create a fully customized grid experience.
      </p>

      <PantanalGrid
        :rows="combinedRows"
        :columns="combinedColumns as any"
        key-field="productID"
        :toolbar="['create', 'save', 'cancel', 'excel']"
        :editable="true"
        :messages="combinedMessages"
        :height="400"
      />
      <ExampleCode :source="combinedCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  productID: number
  productName: string
  category: string
  unitPrice: number
  unitsInStock: number
  discontinued: boolean
}

// Toolbar Messages
const toolbarRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const toolbarColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const toolbarMessages: Partial<Messages> = {
  create: 'Add New',
  save: 'Save All',
  cancel: 'Discard Changes',
  excel: 'Export Data',
}

const toolbarCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const messages: Partial<Messages> = {
  create: 'Add New',
  save: 'Save All',
  cancel: 'Discard Changes',
  excel: 'Export Data',
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :toolbar="['create', 'save', 'cancel', 'excel']"
    :messages="messages"
    :height="400"
  />
</template>`

// Command Messages
const commandRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const commandColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'command', title: 'Actions', width: 150, command: ['edit', 'destroy'] },
]

const commandMessages: Partial<Messages> = {
  edit: 'Modify',
  update: 'Confirm',
  destroy: 'Remove',
  cancelEdit: 'Undo',
}

const commandCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'command', title: 'Actions', width: 150, command: ['edit', 'destroy'] },
]

const messages: Partial<Messages> = {
  edit: 'Modify',
  update: 'Confirm',
  destroy: 'Remove',
  cancelEdit: 'Undo',
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :editable="true"
    :messages="messages"
    :height="400"
  />
</template>`

// No Records Message
const noRecordsColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const noRecordsMessages: Partial<Messages> = {
  noRecords: 'No products found. Please try a different search.',
}

const noRecordsCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const messages: Partial<Messages> = {
  noRecords: 'No products found. Please try a different search.',
}
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="true"
    :messages="messages"
    :height="300"
  />
</template>`

// Expand Collapse Column Header
const detailRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const detailColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const detailTemplate = (row: Product) => {
  return `<div style="padding: 1rem;">
    <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Product Details</h3>
    <p><strong>Category:</strong> ${row.category}</p>
    <p><strong>Unit Price:</strong> $${row.unitPrice}</p>
    <p><strong>Units In Stock:</strong> ${row.unitsInStock}</p>
    <p><strong>Discontinued:</strong> ${row.discontinued ? 'Yes' : 'No'}</p>
  </div>`
}

const detailMessages: Partial<Messages> = {
  expandCollapseColumnHeader: 'Details',
}

const detailCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const detailTemplate = (row: Product) => {
  return \`<div style="padding: 1rem;">
    <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Product Details</h3>
    <p><strong>Category:</strong> \${row.category}</p>
    <p><strong>Unit Price:</strong> $\${row.unitPrice}</p>
    <p><strong>Units In Stock:</strong> \${row.unitsInStock}</p>
    <p><strong>Discontinued:</strong> \${row.discontinued ? 'Yes' : 'No'}</p>
  </div>\`
}

const messages: Partial<Messages> = {
  expandCollapseColumnHeader: 'Details',
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :detail-template="detailTemplate"
    :messages="messages"
    :height="400"
  />
</template>`

// Combining Multiple Messages
const combinedRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', category: 'Beverages', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', category: 'Condiments', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const combinedColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'command', title: 'Actions', width: 150, command: ['edit', 'destroy'] },
]

const combinedMessages: Partial<Messages> = {
  create: 'Add New Product',
  save: 'Save Changes',
  cancel: 'Cancel Changes',
  excel: 'Export to Excel',
  edit: 'Modify',
  update: 'Update',
  destroy: 'Delete',
  cancelEdit: 'Cancel',
  noRecords: 'No products available',
}

const combinedCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type Messages } from '@pantanal/grid'

const messages: Partial<Messages> = {
  create: 'Add New Product',
  save: 'Save Changes',
  cancel: 'Cancel Changes',
  excel: 'Export to Excel',
  edit: 'Modify',
  update: 'Update',
  destroy: 'Delete',
  cancelEdit: 'Cancel',
  noRecords: 'No products available',
}
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :toolbar="['create', 'save', 'cancel', 'excel']"
    :editable="true"
    :messages="messages"
    :height="400"
  />
</template>`
</script>

