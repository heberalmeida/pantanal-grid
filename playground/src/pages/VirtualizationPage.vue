<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import type { ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

// Example 1: Local Data
const localRows = ref<any[]>([])
const localNextId = ref(100001)

const localColumns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
]

function generatePeople(count: number) {
  const firstNames = ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Nige']
  const lastNames = ['Davolio', 'Fuller', 'Leverling', 'Peacock', 'Buchanan', 'Suyama', 'King', 'Callahan', 'Dodsworth', 'White']
  const cities = ['Seattle', 'Tacoma', 'Kirkland', 'Redmond', 'London', 'Philadelphia', 'New York', 'Seattle', 'London', 'Boston']
  const titles = ['Accountant', 'Vice President, Sales', 'Sales Representative', 'Technical Support', 'Sales Manager', 'Web Designer', 'Software Developer', 'Inside Sales Coordinator', 'Chief Techical Officer', 'Chief Execute Officer']
  const birthDates = [
    new Date('1948/12/08'),
    new Date('1952/02/19'),
    new Date('1963/08/30'),
    new Date('1937/09/19'),
    new Date('1955/03/04'),
    new Date('1963/07/02'),
    new Date('1960/05/29'),
    new Date('1958/01/09'),
    new Date('1966/01/27'),
    new Date('1966/03/27'),
  ]

  const data = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const birthDate = birthDates[Math.floor(Math.random() * birthDates.length)]
    const age = now.getFullYear() - birthDate.getFullYear()

    data.push({
      Id: i + 1,
      FirstName: firstName,
      LastName: lastName,
      City: city,
      Title: title,
      BirthDate: birthDate,
      Age: age,
    })
  }

  return data
}

// Example 3: Virtualization with Editing
const editingRows = ref<any[]>([])

const editingColumns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110, editable: false },
  { field: 'FirstName', title: 'First Name', editable: true },
  { field: 'LastName', title: 'Last Name', editable: true },
  { field: 'City', editable: true },
  { field: 'Title', editable: true },
  { field: 'command', title: ' ', command: ['edit', 'destroy'], width: 200 },
]

// Example 4: Virtualization with Sorting and Filtering
const filteredRows = ref<any[]>([])

const filteredColumns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110, sortable: true },
  { field: 'FirstName', title: 'First Name', sortable: true, filterable: true },
  { field: 'LastName', title: 'Last Name', sortable: true, filterable: true },
  { field: 'City', sortable: true, filterable: true },
  { field: 'Title', sortable: true, filterable: true },
]

// Example 5: Custom Row Heights
const customHeightRows = ref<any[]>([])

const customHeightColumns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
  { field: 'Description', width: 300 },
]

onMounted(() => {
  // Generate 100,000 rows for local example
  localRows.value = generatePeople(100000)
  
  // Initialize other examples
  editingRows.value = generatePeople(5000)
  filteredRows.value = generatePeople(10000)
  customHeightRows.value = generatePeople(5000).map(item => ({
    ...item,
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  }))
})

const localCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const nextId = ref(100001)

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
]

function generatePeople(count: number) {
  const firstNames = ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Nige']
  const lastNames = ['Davolio', 'Fuller', 'Leverling', 'Peacock', 'Buchanan', 'Suyama', 'King', 'Callahan', 'Dodsworth', 'White']
  const cities = ['Seattle', 'Tacoma', 'Kirkland', 'Redmond', 'London', 'Philadelphia', 'New York', 'Seattle', 'London', 'Boston']
  const titles = ['Accountant', 'Vice President, Sales', 'Sales Representative', 'Technical Support', 'Sales Manager', 'Web Designer', 'Software Developer', 'Inside Sales Coordinator', 'Chief Techical Officer', 'Chief Execute Officer']
  
  const data = []
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    
    data.push({
      Id: i + 1,
      FirstName: firstName,
      LastName: lastName,
      City: city,
      Title: title,
    })
  }
  return data
}

onMounted(() => {
  rows.value = generatePeople(100000)
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    key-field="Id"
    locale="en"
  />
<\/template>`

// Example 2: Remote Data (using dataProvider pattern)
const remoteRows = ref<any[]>([])
const remoteLoading = ref(false)

const remoteColumns: ColumnDef[] = [
  { field: 'OrderID', title: 'Order ID', width: 80 },
  { field: 'ShipName', title: 'Ship Name', width: 200 },
  { field: 'Freight', width: 80, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'OrderDate', title: 'Order Date', width: 100, format: (v: Date | string) => {
    if (!v) return ''
    const d = typeof v === 'string' ? new Date(v) : v
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }},
  { field: 'ShipCity', title: 'Ship City', width: 120 },
]

// Simulated remote data - in real scenario, this would call your API
async function generateRemoteData(count: number) {
  const cities = ['Seattle', 'Tacoma', 'Kirkland', 'Redmond', 'London', 'Philadelphia', 'New York', 'Boston']
  const shipNames = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E']
  
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      OrderID: i + 1,
      ShipName: shipNames[Math.floor(Math.random() * shipNames.length)],
      Freight: Math.round(Math.random() * 1000 * 100) / 100,
      OrderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      ShipCity: cities[Math.floor(Math.random() * cities.length)],
    })
  }
  return data
}

onMounted(async () => {
  // Simulate loading 1000 remote records
  remoteLoading.value = true
  remoteRows.value = await generateRemoteData(1000)
  remoteLoading.value = false
})

const remoteCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'OrderID', title: 'Order ID', width: 80 },
  { field: 'ShipName', title: 'Ship Name', width: 200 },
  { field: 'Freight', width: 80, format: (v: number) => \`$\${v?.toFixed(2) || '0.00'}\` },
  { field: 'OrderDate', title: 'Order Date', width: 100 },
  { field: 'ShipCity', title: 'Ship City', width: 120 },
]

async function loadData(page = 1, pageSize = 100) {
  loading.value = true
  try {
    const skip = (page - 1) * pageSize
    const response = await fetch(\`https://your-api.com/orders?limit=\${pageSize}&skip=\${skip}\`)
    const data = await response.json()
    rows.value = data.items
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="543"
    :page-size="100"
    key-field="OrderID"
    locale="en"
    :loading="loading"
  />
<\/template>`

const editingCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110, editable: false },
  { field: 'FirstName', title: 'First Name', editable: true },
  { field: 'LastName', title: 'Last Name', editable: true },
  { field: 'City', editable: true },
  { field: 'Title', editable: true },
  { field: 'command', title: ' ', command: ['edit', 'destroy'], width: 200 },
]

onMounted(() => {
  rows.value = generatePeople(5000)
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    editable="inline"
    toolbar="['create']"
    key-field="Id"
    locale="en"
    :messages="{
      pageableDisplay: 'Showing {2} data items'
    }"
  />
<\/template>`

const filteredCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110, sortable: true },
  { field: 'FirstName', title: 'First Name', sortable: true, filterable: true },
  { field: 'LastName', title: 'Last Name', sortable: true, filterable: true },
  { field: 'City', sortable: true, filterable: true },
  { field: 'Title', sortable: true, filterable: true },
]

onMounted(() => {
  rows.value = generatePeople(10000)
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    sortable
    filterable
    show-filter-row
    key-field="Id"
    locale="en"
  />
<\/template>`

const customHeightCode = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
  { field: 'Description', width: 300 },
]

onMounted(() => {
  rows.value = generatePeople(5000).map(item => ({
    ...item,
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }))
})
<\/script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    :row-height="60"
    key-field="Id"
    locale="en"
  />
<\/template>`
</script>

<template>
  <section class="space-y-8 px-4 py-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Virtualization</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Virtual scrolling is an alternative to paging and optimizes grid performance when displaying huge volumes of data.
        The grid displays a vertical scrollbar and renders only the visible items based on the pageSize property.
      </p>
    </header>

    <!-- Local Data Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Virtual Scrolling with Local Data</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        This example demonstrates virtual scrolling with 100,000 local records. Only the visible rows are rendered,
        providing optimal performance even with large datasets.
      </p>
      <PantanalGrid
        :rows="localRows"
        :columns="localColumns"
        scrollable-virtual
        :height="600"
        :page-size="20"
        key-field="Id"
        locale="en"
        :messages="{
          pageableDisplay: 'Showing {2} data items'
        }"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="localCode" />
    </div>

    <!-- Remote Data Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Virtual Scrolling with Remote Data</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Virtual scrolling works seamlessly with remote data sources. As you scroll, the grid automatically loads
        the next set of rows from the server.
      </p>
      <PantanalGrid
        :rows="remoteRows"
        :columns="remoteColumns"
        scrollable-virtual
        :height="543"
        :page-size="100"
        key-field="OrderID"
        locale="en"
        :loading="remoteLoading"
        :sortable="true"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="remoteCode" />
    </div>

    <!-- Editing Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Virtual Scrolling with Inline Editing</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Virtual scrolling works seamlessly with inline editing. You can edit, create, and delete rows
        even with large datasets.
      </p>
      <PantanalGrid
        :rows="editingRows"
        :columns="editingColumns"
        scrollable-virtual
        :height="600"
        :page-size="20"
        editable="inline"
        toolbar="['create']"
        key-field="Id"
        locale="en"
        :messages="{
          pageableDisplay: 'Showing {2} data items'
        }"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="editingCode" />
    </div>

    <!-- Sorting and Filtering Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Virtual Scrolling with Sorting and Filtering</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Sort and filter large datasets efficiently with virtual scrolling. The grid maintains
        performance even when processing 10,000+ rows.
      </p>
      <PantanalGrid
        :rows="filteredRows"
        :columns="filteredColumns"
        scrollable-virtual
        :height="600"
        :page-size="20"
        sortable
        filterable
        show-filter-row
        key-field="Id"
        locale="en"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="filteredCode" />
    </div>

    <!-- Custom Row Height Example -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Virtual Scrolling with Custom Row Heights</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Configure custom row heights for better visual presentation. Adjust the `rowHeight` prop
        to match your content.
      </p>
      <PantanalGrid
        :rows="customHeightRows"
        :columns="customHeightColumns"
        scrollable-virtual
        :height="600"
        :page-size="20"
        :row-height="60"
        key-field="Id"
        locale="en"
        class="rounded-xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
      />
      <ExampleCode :source="customHeightCode" />
    </div>
  </section>
</template>

