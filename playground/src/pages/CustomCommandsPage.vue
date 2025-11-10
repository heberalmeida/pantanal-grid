<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Custom Commands</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid allows you to implement custom command columns with custom buttons and click handlers.
        You can create buttons with custom text, icons, and click handlers for each row.
      </p>
    </header>

    <!-- Basic Custom Command Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Basic Custom Command</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        A simple custom command column with a button that displays product details when clicked.
      </p>

      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns as any"
        key-field="productID"
        :resizable="true"
      />
      <ExampleCode :source="basicCode" />
    </article>

    <!-- Multiple Custom Commands Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Multiple Custom Commands</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can add multiple custom commands in a single column, each with its own text, icon, and click handler.
      </p>

      <PantanalGrid
        :rows="multipleRows"
        :columns="multipleColumns as any"
        key-field="productID"
        :resizable="true"
      />
      <ExampleCode :source="multipleCode" />
    </article>

    <!-- Custom Command with Icons Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Commands with Icons</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Custom commands can include icons using CSS classes or Unicode characters.
      </p>

      <PantanalGrid
        :rows="iconRows"
        :columns="iconColumns as any"
        key-field="productID"
        :resizable="true"
      />
      <ExampleCode :source="iconCode" />
    </article>

    <!-- Conditional Commands Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Conditional Commands</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Commands can be conditionally visible based on row data using the <code>visible</code> function.
      </p>

      <PantanalGrid
        :rows="conditionalRows"
        :columns="conditionalColumns as any"
        key-field="productID"
        :resizable="true"
      />
      <ExampleCode :source="conditionalCode" />
    </article>

    <!-- Custom Template Commands Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Custom Template Commands</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Commands can use custom templates for more complex button rendering.
      </p>

      <PantanalGrid
        :rows="templateRows"
        :columns="templateColumns as any"
        key-field="productID"
        :resizable="true"
      />
      <ExampleCode :source="templateCode" />
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
  unitsInStock: number
  discontinued: boolean
}

// Basic Custom Command Example
const basicRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, discontinued: false },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, discontinued: true },
])

const basicColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  {
    command: {
      text: 'View Details',
      click: (e: MouseEvent, row: Product) => {
        e.preventDefault()
        alert(`"${row.productName}" details are about to be logged on the console.`)
        console.log(row)
      },
    },
    title: ' ',
    width: 120,
  },
]

const basicCode = `<script setup lang="ts">
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

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  {
    command: {
      text: 'View Details',
      click: (e: MouseEvent, row: Product) => {
        e.preventDefault()
        alert(\`"\${row.productName}" details are about to be logged on the console.\`)
        console.log(row)
      },
    },
    title: ' ',
    width: 120,
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :resizable="true"
  />
</template>`

// Multiple Custom Commands Example
const multipleRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const multipleColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: [
      {
        name: 'view',
        text: 'View',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(`Viewing details for: ${row.productName}`)
        },
      },
      {
        name: 'edit',
        text: 'Edit',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(`Editing: ${row.productName}`)
        },
      },
      {
        name: 'delete',
        text: 'Delete',
        className: 'text-red-600',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          if (confirm(`Are you sure you want to delete ${row.productName}?`)) {
            alert(`${row.productName} deleted`)
          }
        },
      },
    ],
    title: 'Actions',
    width: 200,
  },
]

const multipleCode = `<script setup lang="ts">
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

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: [
      {
        name: 'view',
        text: 'View',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(\`Viewing details for: \${row.productName}\`)
        },
      },
      {
        name: 'edit',
        text: 'Edit',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(\`Editing: \${row.productName}\`)
        },
      },
      {
        name: 'delete',
        text: 'Delete',
        className: 'text-red-600',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          if (confirm(\`Are you sure you want to delete \${row.productName}?\`)) {
            alert(\`\${row.productName} deleted\`)
          }
        },
      },
    ],
    title: 'Actions',
    width: 200,
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :resizable="true"
  />
</template>`

// Custom Command with Icons Example
const iconRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const iconColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: [
      {
        name: 'view',
        text: ' View',
        iconClass: '🔍',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(`Viewing: ${row.productName}`)
        },
      },
      {
        name: 'edit',
        text: ' Edit',
        iconClass: '✏️',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(`Editing: ${row.productName}`)
        },
      },
      {
        name: 'delete',
        text: ' Delete',
        iconClass: '🗑️',
        className: 'text-red-600',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          if (confirm(`Delete ${row.productName}?`)) {
            alert(`${row.productName} deleted`)
          }
        },
      },
    ],
    title: 'Actions',
    width: 180,
  },
]

const iconCode = `<script setup lang="ts">
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

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: [
      {
        name: 'view',
        text: ' View',
        iconClass: '🔍',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(\`Viewing: \${row.productName}\`)
        },
      },
      {
        name: 'edit',
        text: ' Edit',
        iconClass: '✏️',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(\`Editing: \${row.productName}\`)
        },
      },
      {
        name: 'delete',
        text: ' Delete',
        iconClass: '🗑️',
        className: 'text-red-600',
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          if (confirm(\`Delete \${row.productName}?\`)) {
            alert(\`\${row.productName} deleted\`)
          }
        },
      },
    ],
    title: 'Actions',
    width: 180,
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :resizable="true"
  />
</template>`

// Conditional Commands Example
const conditionalRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
  { productID: 4, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, discontinued: true },
])

const conditionalColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  {
    command: [
      {
        name: 'restock',
        text: 'Restock',
        visible: (row: Product) => row.unitsInStock < 20,
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(`Restocking ${row.productName}`)
        },
      },
      {
        name: 'discontinue',
        text: 'Discontinue',
        visible: (row: Product) => !row.discontinued,
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          if (confirm(`Discontinue ${row.productName}?`)) {
            alert(`${row.productName} discontinued`)
          }
        },
      },
      {
        name: 'reactivate',
        text: 'Reactivate',
        visible: (row: Product) => row.discontinued,
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(`Reactivating ${row.productName}`)
        },
      },
    ],
    title: 'Actions',
    width: 150,
  },
]

const conditionalCode = `<script setup lang="ts">
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
  { productID: 4, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, discontinued: true },
])

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  { field: 'discontinued', title: 'Discontinued', width: 120 },
  {
    command: [
      {
        name: 'restock',
        text: 'Restock',
        visible: (row: Product) => row.unitsInStock < 20,
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(\`Restocking \${row.productName}\`)
        },
      },
      {
        name: 'discontinue',
        text: 'Discontinue',
        visible: (row: Product) => !row.discontinued,
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          if (confirm(\`Discontinue \${row.productName}?\`)) {
            alert(\`\${row.productName} discontinued\`)
          }
        },
      },
      {
        name: 'reactivate',
        text: 'Reactivate',
        visible: (row: Product) => row.discontinued,
        click: (e: MouseEvent, row: Product) => {
          e.preventDefault()
          alert(\`Reactivating \${row.productName}\`)
        },
      },
    ],
    title: 'Actions',
    width: 150,
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :resizable="true"
  />
</template>`

// Custom Template Commands Example
const templateRows = ref<Product[]>([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
  { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
])

const templateColumns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: {
      name: 'custom',
      template: (row: Product) => {
        const stockStatus = row.unitsInStock > 20 ? '✅ In Stock' : '⚠️ Low Stock'
        return `<span style="color: ${row.unitsInStock > 20 ? 'green' : 'orange'}; font-weight: bold;">${stockStatus}</span>`
      },
      click: (e: MouseEvent, row: Product) => {
        e.preventDefault()
        alert(`Stock status for ${row.productName}: ${row.unitsInStock} units`)
      },
    },
    title: 'Stock Status',
    width: 150,
  },
]

const templateCode = `<script setup lang="ts">
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

const columns: ColumnDef<Product>[] = [
  { field: 'productName', title: 'Product Name' },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
  { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  {
    command: {
      name: 'custom',
      template: (row: Product) => {
        const stockStatus = row.unitsInStock > 20 ? '✅ In Stock' : '⚠️ Low Stock'
        return \`<span style="color: \${row.unitsInStock > 20 ? 'green' : 'orange'}; font-weight: bold;">\${stockStatus}</span>\`
      },
      click: (e: MouseEvent, row: Product) => {
        e.preventDefault()
        alert(\`Stock status for \${row.productName}: \${row.unitsInStock} units\`)
      },
    },
    title: 'Stock Status',
    width: 150,
  },
]
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="productID"
    :resizable="true"
  />
</template>`
</script>

