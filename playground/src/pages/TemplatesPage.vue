<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './TemplatesPage.vue?raw'

// Toolbar Template Example
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
  { field: 'category', title: 'Category', width: 150 },
]

const toolbarTemplate = () => {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <div>
        <button class="v3grid__btn--toolbar" onclick="alert('Refresh clicked')">🔄 Refresh</button>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <label for="category-filter">Filter by category:</label>
        <select id="category-filter" style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px;">
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
      </div>
    </div>
  `
}

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

const rowTemplate = (row: Employee, rowIndex: number) => {
  return `
    <tr data-uid="${row.id}" style="background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%); padding: 20px;">
      <td class="details" style="width: 400px;">
        <span class="name" style="display: block; font-size: 1.6em;">${row.firstName} ${row.lastName}</span>
        <span class="title" style="display: block; padding-top: 1.6em;">Title: ${row.title}</span>
      </td>
      <td class="country" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${row.country}
      </td>
      <td class="employeeID" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${row.employeeID}
      </td>
    </tr>
  `
}

const altRowTemplate = (row: Employee, rowIndex: number) => {
  return `
    <tr class="k-alt" data-uid="${row.id}" style="background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%); padding: 20px;">
      <td class="details" style="width: 400px;">
        <span class="name" style="display: block; font-size: 1.6em;">${row.firstName} ${row.lastName}</span>
        <span class="title" style="display: block; padding-top: 1.6em;">Title: ${row.title}</span>
      </td>
      <td class="country" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${row.country}
      </td>
      <td class="employeeID" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; font-weight: bold; color: #898989; text-align: center;">
        ${row.employeeID}
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

const detailTemplate = (row: EmployeeWithOrders, rowIndex: number) => {
  const orders = row.orders || []
  return `
    <div style="padding: 20px; background: #f5f5f5; border-top: 2px solid #ddd;">
      <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Orders for ${row.firstName} ${row.lastName}</h4>
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

const codeSnippet = exampleSource
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
        :rows="toolbarRows"
        :columns="toolbarColumns as any"
        key-field="id"
        :toolbar="toolbarTemplate"
        responsive="table"
      />
      <ExampleCode :source="codeSnippet" />
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
      <ExampleCode :source="codeSnippet" />
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
      <ExampleCode :source="codeSnippet" />
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

