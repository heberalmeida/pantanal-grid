<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor, type Row } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Toolbar Template Example
const toolbarRows = ref([
  { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 149.99, category: 'Clothing' },
  { id: 3, name: 'Product 3', price: 79.99, category: 'Electronics' },
  { id: 4, name: 'Product 4', price: 199.99, category: 'Home' },
  { id: 5, name: 'Product 5', price: 89.99, category: 'Electronics' },
  { id: 6, name: 'Product 6', price: 129.99, category: 'Clothing' },
])

const toolbarColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
  { field: 'category', title: 'Category', width: 150, filterable: true },
]

// Filter state
const toolbarFilter = ref<FilterDescriptor[]>([])

// Toolbar template with unique ID
const toolbarTemplateId = 'toolbar-template-' + Math.random().toString(36).substr(2, 9)
const categoryFilterId = 'category-filter-' + Math.random().toString(36).substr(2, 9)

const toolbarTemplate = () => {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <div>
        <button class="v3grid__btn--toolbar" id="refresh-btn-${toolbarTemplateId}">🔄 Refresh</button>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <label for="${categoryFilterId}">Filter by category:</label>
        <select id="${categoryFilterId}" style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px;">
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
      </div>
    </div>
  `
}

// Setup toolbar event listeners after mount
const gridRef = ref<InstanceType<typeof PantanalGrid> | null>(null)

// Watch for filter changes and update select value
watch(toolbarFilter, (newFilter) => {
  nextTick(() => {
    const categorySelect = document.getElementById(categoryFilterId) as HTMLSelectElement
    if (categorySelect) {
      const categoryFilter = newFilter.find(f => f.field === 'category')
      if (categoryFilter && categoryFilter.value) {
        categorySelect.value = String(categoryFilter.value)
      } else {
        categorySelect.value = ''
      }
    }
  })
}, { deep: true })

// Setup event listeners
function setupToolbarListeners() {
  const categorySelect = document.getElementById(categoryFilterId) as HTMLSelectElement
  const refreshBtn = document.getElementById('refresh-btn-' + toolbarTemplateId) as HTMLButtonElement
  
  if (categorySelect && !categorySelect.dataset.listenerAttached) {
    categorySelect.dataset.listenerAttached = 'true'
    
    categorySelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement
      const value = target.value
      
      if (value) {
        // Set filter for category field
        toolbarFilter.value = [
          { field: 'category', operator: 'eq', value: value }
        ]
      } else {
        // Clear filter
        toolbarFilter.value = []
      }
    })
    
    // Initialize select value based on current filter
    const categoryFilter = toolbarFilter.value.find(f => f.field === 'category')
    if (categoryFilter && categoryFilter.value) {
      categorySelect.value = String(categoryFilter.value)
    }
  }
  
  if (refreshBtn && !refreshBtn.dataset.listenerAttached) {
    refreshBtn.dataset.listenerAttached = 'true'
    
    refreshBtn.addEventListener('click', () => {
      // Refresh the grid - you can add custom logic here
      alert('Refresh clicked - Grid data refreshed')
    })
  }
}

// MutationObserver for toolbar
let toolbarObserver: MutationObserver | null = null

onMounted(() => {
  // Use MutationObserver to detect when toolbar is rendered
  toolbarObserver = new MutationObserver((_mutations, obs) => {
    const categorySelect = document.getElementById(categoryFilterId)
    if (categorySelect) {
      setupToolbarListeners()
      obs.disconnect() // Stop observing once we found the element
      toolbarObserver = null
    }
  })
  
  // Start observing after nextTick
  nextTick(() => {
    // Try immediately first
    setupToolbarListeners()
    
    // If not found, start observing
    const categorySelect = document.getElementById(categoryFilterId)
    if (!categorySelect && toolbarObserver && gridRef.value) {
      // Try to find the grid container element
      const gridEl = (gridRef.value as any).$el || document.querySelector('.v3grid')
      
      if (gridEl) {
        // Observe only the grid container for better performance
        toolbarObserver.observe(gridEl, {
          childList: true,
          subtree: true
        })
      } else {
        // Fallback: observe document body
        toolbarObserver.observe(document.body, {
          childList: true,
          subtree: true
        })
      }
      
      // Fallback: stop observing after 3 seconds
      setTimeout(() => {
        if (toolbarObserver) {
          toolbarObserver.disconnect()
          toolbarObserver = null
        }
        // Final attempt
        setupToolbarListeners()
      }, 3000)
    }
  })
})

onBeforeUnmount(() => {
  // Cleanup observer on unmount
  if (toolbarObserver) {
    toolbarObserver.disconnect()
    toolbarObserver = null
  }
})

// Row Template Example
interface Employee {
  id: number
  firstName: string
  lastName: string
  title: string
  country: string
  employeeID: number
}

const employeeRows = ref<Employee[]>([
  { id: 1, firstName: 'Nancy', lastName: 'Davolio', title: 'Sales Representative', country: 'USA', employeeID: 1 },
  { id: 2, firstName: 'Andrew', lastName: 'Fuller', title: 'Vice President', country: 'UK', employeeID: 2 },
  { id: 3, firstName: 'Janet', lastName: 'Leverling', title: 'Sales Representative', country: 'USA', employeeID: 3 },
  { id: 4, firstName: 'Margaret', lastName: 'Peacock', title: 'Sales Representative', country: 'USA', employeeID: 4 },
])

const rowTemplateColumns: ColumnDef[] = [
  { field: 'details', title: 'Details', width: 400 },
  { field: 'country', title: 'Country', width: 110 },
  { field: 'employeeID', title: 'ID', width: 110 },
]

const rowTemplate = (row: Row, _rowIndex: number) => {
  const emp = row as unknown as Employee
  return `
    <tr data-uid="${emp.id}" style="background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%); padding: 20px;">
      <td class="details" style="width: 400px;">
        <span class="name" style="display: block; font-size: 1.6em;">${emp.firstName} ${emp.lastName}</span>
        <span class="title" style="display: block; padding-top: 1.6em;">Title: ${emp.title}</span>
      </td>
      <td class="country" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${emp.country}
      </td>
      <td class="employeeID" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${emp.employeeID}
      </td>
    </tr>
  `
}

const altRowTemplate = (row: Row, _rowIndex: number) => {
  const emp = row as unknown as Employee
  return `
    <tr class="k-alt" data-uid="${emp.id}" style="background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%); padding: 20px;">
      <td class="details" style="width: 400px;">
        <span class="name" style="display: block; font-size: 1.6em;">${emp.firstName} ${emp.lastName}</span>
        <span class="title" style="display: block; padding-top: 1.6em;">Title: ${emp.title}</span>
      </td>
      <td class="country" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${emp.country}
      </td>
      <td class="employeeID" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${emp.employeeID}
      </td>
    </tr>
  `
}

// Master-Detail Example
interface Order {
  id: number
  orderID: number
  employeeID: number
  shipCountry: string
  shipAddress: string
  shipName: string
}

interface EmployeeWithOrders extends Employee {
  orders?: Order[]
}

const employeeWithOrdersRows = ref<EmployeeWithOrders[]>([
  {
    id: 1,
    firstName: 'Nancy',
    lastName: 'Davolio',
    title: 'Sales Representative',
    country: 'USA',
    employeeID: 1,
    orders: [
      { id: 1, orderID: 10248, employeeID: 1, shipCountry: 'USA', shipAddress: '507 - 20th Ave. E. Apt. 2A', shipName: 'Vins et alcools Chevalier' },
      { id: 2, orderID: 10249, employeeID: 1, shipCountry: 'USA', shipAddress: '908 W. Capital Way', shipName: 'Toms Spezialitäten' },
    ],
  },
  {
    id: 2,
    firstName: 'Andrew',
    lastName: 'Fuller',
    title: 'Vice President',
    country: 'UK',
    employeeID: 2,
    orders: [
      { id: 3, orderID: 10250, employeeID: 2, shipCountry: 'UK', shipAddress: '722 Moss Bay Blvd.', shipName: 'Hanari Carnes' },
    ],
  },
  {
    id: 3,
    firstName: 'Janet',
    lastName: 'Leverling',
    title: 'Sales Representative',
    country: 'USA',
    employeeID: 3,
    orders: [
      { id: 4, orderID: 10251, employeeID: 3, shipCountry: 'USA', shipAddress: '4110 Old Redmond Rd.', shipName: 'Victuailles en stock' },
      { id: 5, orderID: 10252, employeeID: 3, shipCountry: 'USA', shipAddress: 'Edgeham Hollow Winchester Way', shipName: 'Suprêmes délices' },
    ],
  },
])

const masterDetailColumns: ColumnDef[] = [
  { field: 'firstName', title: 'First Name', width: 110 },
  { field: 'lastName', title: 'Last Name', width: 110 },
  { field: 'country', title: 'Country', width: 110 },
  { field: 'city', title: 'City', width: 300 },
  { field: 'title', title: 'Title', width: 200 },
]

const detailTemplate = (row: Row, _rowIndex: number) => {
  const emp = row as unknown as EmployeeWithOrders
  const orders = emp.orders || []
  return `
    <div style="padding: 20px; background: #f5f5f5; border-top: 2px solid #ddd;">
      <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Orders for ${emp.firstName} ${emp.lastName}</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #e0e0e0;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Order ID</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Ship Country</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Ship Address</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Ship Name</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">${order.orderID}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${order.shipCountry}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${order.shipAddress}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${order.shipName}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// Code snippets for each example
const getToolbarTemplateCode = () => {
  const scriptTag = '<script setup lang="ts">'
  const scriptClose = '</' + 'script>'
  const refOpen = 'ref<'
  const refClose = '>'
  const filterType = 'FilterDescriptor[]'
  return scriptTag + `
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor } from '@pantanal/grid'

const toolbarRows = ref([
  { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 149.99, category: 'Clothing' },
  { id: 3, name: 'Product 3', price: 79.99, category: 'Electronics' },
  { id: 4, name: 'Product 4', price: 199.99, category: 'Home' },
])

const toolbarColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
  { field: 'category', title: 'Category', width: 150, filterable: true },
]

const toolbarFilter = ` + refOpen + filterType + refClose + `([])

const toolbarTemplate = () => {
  return \`<div style="display: flex; justify-content: space-between;">
    <button class="v3grid__btn--toolbar">🔄 Refresh</button>
    <select id="category-filter">
      <option value="">All</option>
      <option value="Electronics">Electronics</option>
      <option value="Clothing">Clothing</option>
      <option value="Home">Home</option>
    </select>
  </div>\`
}

// Setup event listeners to connect filter dropdown to grid filter
` + scriptClose + `

<template>
  <PantanalGrid
    :rows="toolbarRows"
    :columns="toolbarColumns"
    key-field="id"
    :toolbar="toolbarTemplate"
    v-model:filter="toolbarFilter"
    responsive="table"
  />
</template>`
}
const toolbarTemplateCode = getToolbarTemplateCode()

const getRowTemplateCode = () => {
  const scriptTag = '<script setup lang="ts">'
  const scriptClose = '</' + 'script>'
  const refOpen = 'ref<'
  const refClose = '>'
  const employeeType = 'Employee[]'
  return scriptTag + `
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Employee {
  id: number
  firstName: string
  lastName: string
  title: string
  country: string
  employeeID: number
}

const employeeRows = ` + refOpen + employeeType + refClose + `([
  { id: 1, firstName: 'Nancy', lastName: 'Davolio', title: 'Sales Representative', country: 'USA', employeeID: 1 },
  { id: 2, firstName: 'Andrew', lastName: 'Fuller', title: 'Vice President', country: 'UK', employeeID: 2 },
])

const rowTemplateColumns: ColumnDef[] = [
  { field: 'details', title: 'Details', width: 400 },
  { field: 'country', title: 'Country', width: 110 },
  { field: 'employeeID', title: 'ID', width: 110 },
]

const rowTemplate = (row: Employee, rowIndex: number) => {
  return \`<tr data-uid="\${row.id}">
    <td class="details">
      <span class="name">\${row.firstName} \${row.lastName}</span>
      <span class="title">Title: \${row.title}</span>
    </td>
    <td class="country">\${row.country}</td>
    <td class="employeeID">\${row.employeeID}</td>
  </tr>\`
}

const altRowTemplate = (row: Employee, rowIndex: number) => {
  return \`<tr class="k-alt" data-uid="\${row.id}">
    <td class="details">
      <span class="name">\${row.firstName} \${row.lastName}</span>
      <span class="title">Title: \${row.title}</span>
    </td>
    <td class="country">\${row.country}</td>
    <td class="employeeID">\${row.employeeID}</td>
  </tr>\`
}
` + scriptClose + `

<template>
  <PantanalGrid
    :rows="employeeRows"
    :columns="rowTemplateColumns"
    key-field="id"
    :row-template="rowTemplate"
    :alt-row-template="altRowTemplate"
    :striped="true"
    responsive="table"
  />
</template>`
}
const rowTemplateCode = getRowTemplateCode()

const getMasterDetailTemplateCode = () => {
  const scriptTag = '<script setup lang="ts">'
  const scriptClose = '</' + 'script>'
  const refOpen = 'ref<'
  const refClose = '>'
  const employeeWithOrdersType = 'EmployeeWithOrders[]'
  return scriptTag + `
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Order {
  id: number
  orderID: number
  employeeID: number
  shipCountry: string
  shipAddress: string
  shipName: string
}

interface EmployeeWithOrders {
  id: number
  firstName: string
  lastName: string
  title: string
  country: string
  employeeID: number
  orders?: Order[]
}

const employeeWithOrdersRows = ` + refOpen + employeeWithOrdersType + refClose + `([
  {
    id: 1,
    firstName: 'Nancy',
    lastName: 'Davolio',
    title: 'Sales Representative',
    country: 'USA',
    employeeID: 1,
    orders: [
      { id: 1, orderID: 10248, employeeID: 1, shipCountry: 'USA', shipAddress: '507 - 20th Ave. E. Apt. 2A', shipName: 'Vins et alcools Chevalier' },
    ],
  },
])

const masterDetailColumns: ColumnDef[] = [
  { field: 'firstName', title: 'First Name', width: 110 },
  { field: 'lastName', title: 'Last Name', width: 110 },
  { field: 'country', title: 'Country', width: 110 },
  { field: 'title', title: 'Title', width: 200 },
]

const detailTemplate = (row: EmployeeWithOrders, rowIndex: number) => {
  const orders = row.orders || []
  return \`<div style="padding: 20px;">
    <h4>Orders for \${row.firstName} \${row.lastName}</h4>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Ship Country</th>
          <th>Ship Address</th>
          <th>Ship Name</th>
        </tr>
      </thead>
      <tbody>
        \${orders.map(order => \`<tr>
          <td>\${order.orderID}</td>
          <td>\${order.shipCountry}</td>
          <td>\${order.shipAddress}</td>
          <td>\${order.shipName}</td>
        </tr>\`).join('')}
      </tbody>
    </table>
  </div>\`
}
` + scriptClose + `

<template>
  <PantanalGrid
    :rows="employeeWithOrdersRows"
    :columns="masterDetailColumns"
    key-field="id"
    :detail-template="detailTemplate"
    responsive="table"
  />
</template>`
}
const masterDetailTemplateCode = getMasterDetailTemplateCode()
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Templates</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid supports custom templates for toolbar, rows, and master-detail views.
        This page demonstrates the template capabilities of the Grid component.
      </p>
    </header>

    <!-- Toolbar Template Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Toolbar Template</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        You can define a custom template for the toolbar content using a function that returns HTML string.
      </p>

      <PantanalGrid
        ref="gridRef"
        :rows="toolbarRows"
        :columns="toolbarColumns as any"
        key-field="id"
        :toolbar="toolbarTemplate"
        v-model:filter="toolbarFilter"
        responsive="table"
      />
      <ExampleCode :source="toolbarTemplateCode" />
    </article>

    <!-- Row Template Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Row Template</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Custom row templates allow you to define custom layout for grid rows. You can specify both regular and alternate row templates.
      </p>

      <PantanalGrid
        :rows="employeeRows"
        :columns="rowTemplateColumns as any"
        key-field="id"
        :row-template="rowTemplate"
        :alt-row-template="altRowTemplate"
        :striped="true"
        responsive="table"
      />
      <ExampleCode :source="rowTemplateCode" />
    </article>

    <!-- Master-Detail Template Example -->
    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Master-Detail Template</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Master-detail templates allow you to display hierarchical data with expandable detail rows.
      </p>

      <div>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
          <strong>Note:</strong> Click on the first column or the expand/collapse button (▶/▼) to expand/collapse the detail view. The detail template shows orders for each employee.
        </p>
        <PantanalGrid
          :rows="employeeWithOrdersRows"
          :columns="masterDetailColumns as any"
          key-field="id"
          :detail-template="detailTemplate"
          responsive="table"
        />
      </div>
      <ExampleCode :source="masterDetailTemplateCode" />
    </article>
  </div>
</template>

<style scoped>
.details {
  width: 400px;
}
.name {
  display: block;
  font-size: 1.6em;
}
.title {
  display: block;
  padding-top: 1.6em;
}
.employeeID,
.country {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 50px;
  font-weight: bold;
  color: #898989;
}
td.photo,
.employeeID {
  text-align: center;
}
</style>

