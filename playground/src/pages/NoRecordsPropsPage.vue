<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">No Records Props</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports customizable templates for rendering when the current view contains no records. You can customize the no records display using the <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords</code> prop.
      </p>
    </header>

    <!-- Default No Records Message -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Default No Records Message</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        By default, the Grid displays a message when no records are available. Use <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: true</code> to enable the default message.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="defaultColumns as any"
        key-field="productID"
        :no-records="true"
        :height="300"
      />
      <ExampleCode :source="defaultCode" />
    </article>

    <!-- Custom No Records Message -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom No Records Message</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize the no records message using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: { message: '...' }</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="messageColumns as any"
        key-field="productID"
        :no-records="{ message: 'No products found. Please try adjusting your filters or search criteria.' }"
        :height="300"
      />
      <ExampleCode :source="messageCode" />
    </article>

    <!-- No Records Template (String) -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">No Records Template (String)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Customize the no records display using an HTML template string with <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: { template: '...' }</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="templateColumns as any"
        key-field="productID"
        :no-records="{ template: templateString }"
        :height="300"
      />
      <ExampleCode :source="templateStringCode" />
    </article>

    <!-- No Records Template (Function) -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">No Records Template (Function)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use a function to generate the no records template dynamically with <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: { template: () => '...' }</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="functionColumns as any"
        key-field="productID"
        :no-records="{ template: templateFunction }"
        :height="300"
      />
      <ExampleCode :source="templateFunctionCode" />
    </article>

    <!-- No Records Template (Direct String) -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">No Records Template (Direct String)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Pass a template string directly using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: '...'</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="directColumns as any"
        key-field="productID"
        :no-records="directTemplate"
        :height="300"
      />
      <ExampleCode :source="directCode" />
    </article>

    <!-- No Records Template (Direct Function) -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">No Records Template (Direct Function)</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Pass a template function directly using <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: () => '...'</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="directFunctionColumns as any"
        key-field="productID"
        :no-records="directTemplateFunction"
        :height="300"
      />
      <ExampleCode :source="directFunctionCode" />
    </article>

    <!-- Disable No Records -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Disable No Records</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Disable the no records message by setting <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">noRecords: false</code>.
      </p>

      <PantanalGrid
        :rows="[]"
        :columns="disableColumns as any"
        key-field="productID"
        :no-records="false"
        :height="300"
      />
      <ExampleCode :source="disableCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Product extends Record<string, unknown> {
  productID: number
  productName: string
  category: string
  unitPrice: number
  unitsInStock: number
}

// Default No Records Message
const defaultColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const defaultCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="true"
    :height="300"
  />
</template>`

// Custom No Records Message
const messageColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const messageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="{ message: 'No products found. Please try adjusting your filters or search criteria.' }"
    :height="300"
  />
</template>`

// No Records Template (String)
const templateColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const templateString = ref(`<div style="padding: 2rem; text-align: center;"><div style="font-size: 3rem; margin-bottom: 1rem;">📦</div><div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Products Found</div><div style="color: #6b7280;">Try adjusting your search or filter criteria to find what you're looking for.</div></div>`)

const templateStringCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const templateString = ref(\`<div style="padding: 2rem; text-align: center;"><div style="font-size: 3rem; margin-bottom: 1rem;">📦</div><div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Products Found</div><div style="color: #6b7280;">Try adjusting your search or filter criteria to find what you're looking for.</div></div>\`)
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="{ template: templateString }"
    :height="300"
  />
</template>`

// No Records Template (Function)
const functionColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const templateFunction = () => {
  const timestamp = new Date().toLocaleString()
  return `<div style="padding: 2rem; text-align: center;">
    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
    <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Products Available</div>
    <div style="color: #6b7280; margin-bottom: 1rem;">The product catalog is currently empty.</div>
    <div style="font-size: 0.875rem; color: #9ca3af;">Last checked: ${timestamp}</div>
  </div>`
}

const templateFunctionCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const templateFunction = () => {
  const timestamp = new Date().toLocaleString()
  return \`<div style="padding: 2rem; text-align: center;">
    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
    <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Products Available</div>
    <div style="color: #6b7280; margin-bottom: 1rem;">The product catalog is currently empty.</div>
    <div style="font-size: 0.875rem; color: #9ca3af;">Last checked: \${timestamp}</div>
  </div>\`
}
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="{ template: templateFunction }"
    :height="300"
  />
</template>`

// No Records Template (Direct String)
const directColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const directTemplate = ref('<div style="padding: 2rem; text-align: center; color: #6b7280;"><strong>No data available</strong></div>')

const directCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const directTemplate = ref('<div style="padding: 2rem; text-align: center; color: #6b7280;"><strong>No data available</strong></div>')
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="directTemplate"
    :height="300"
  />
</template>`

// No Records Template (Direct Function)
const directFunctionColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const directTemplateFunction = () => {
  return '<div style="padding: 2rem; text-align: center;"><div style="font-size: 2rem; margin-bottom: 1rem;">🚫</div><div style="font-weight: 600;">No records to display</div></div>'
}

const directFunctionCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const directTemplateFunction = () => {
  return '<div style="padding: 2rem; text-align: center;"><div style="font-size: 2rem; margin-bottom: 1rem;">🚫</div><div style="font-weight: 600;">No records to display</div></div>'
}
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="directTemplateFunction"
    :height="300"
  />
</template>`

// Disable No Records
const disableColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]

const disableCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
]
<\/script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="productID"
    :no-records="false"
    :height="300"
  />
</template>`
</script>

