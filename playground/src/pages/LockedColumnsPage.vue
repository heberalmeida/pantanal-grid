<template>
  <section class="space-y-8">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Pinned columns</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Compare pinned (sticky) columns with locked columns. Both keep key data visible while scrolling horizontally,
        but locked columns never overlay the footer.
      </p>
    </header>

    <div class="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
      <h3 class="text-lg font-semibold">Pinned mode</h3>
      <div class="overflow-x-auto">
        <PantanalGrid
          :rows="rows"
          :columns="columnsPinned as any"
          key-field="id"
          v-model:sort="sort"
          v-model:filter="filter"
          v-model:page="page"
          v-model:pageSize="pageSize"
          :enable-column-resize="true"
          :enable-column-reorder="true"
          :show-filter-row="true"
          responsive="table"
          :pinned-shadows="true"
          :striped="true"
          :height="420"
          locale="en"
        />
      </div>
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-300">
        <strong>Pinned:</strong> columns stick to the viewport while the footer can be covered by the sticky region.
      </p>
    </div>

    <div class="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
      <h3 class="text-lg font-semibold">Locked mode</h3>
      <div class="overflow-x-auto">
        <PantanalGrid
          :rows="rows"
          :columns="columnsLocked as any"
          key-field="id"
          v-model:sort="sort"
          v-model:filter="filter"
          v-model:page="page"
          v-model:pageSize="pageSize"
          :enable-column-resize="true"
          :enable-column-reorder="true"
          :show-filter-row="true"
          responsive="table"
          :striped="true"
          :height="420"
          locale="en"
        />
      </div>
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-300">
        <strong>Locked:</strong> columns stay fixed without overlapping the footer, ideal for financial dashboards and
        reports with summaries.
      </p>
    </div>
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './LockedColumnsPage.vue?raw'

type Row = {
  id: number
  name: string
  country: string
  city: string
  email: string
  phone: string
  age: number
  company: string
  title: string
  department: string
  salary: number
  score: number
  createdAt: string
  status: 'Active' | 'Pending' | 'Inactive'
}

function rnd<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)] }
const countries = ['Brazil', 'Argentina', 'Chile', 'Paraguay', 'Uruguay', 'Peru', 'Bolivia']
const cities = ['São Paulo', 'Curitiba', 'Porto Alegre', 'Brasília', 'Lima', 'Santiago', 'Asunción']
const companies = ['Aurora Labs', 'Northwind', 'Hexa Corp', 'Orbital Systems', 'Delta Group', 'Nimbus Digital']
const titles = ['Front-end Dev', 'Back-end Dev', 'QA Analyst', 'Product Manager', 'Product Owner', 'Designer']
const depts = ['Engineering', 'Product', 'Quality', 'Marketing', 'Finance']
const statuses: Row['status'][] = ['Active', 'Pending', 'Inactive']

const rows = ref<Row[]>(
  Array.from({ length: 200 }, (_, i) => {
    const dt = new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28))
    const name = `Person ${i + 1}`
    return {
      id: i + 1,
      name,
      country: rnd(countries),
      city: rnd(cities),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`,
      phone: `(${10 + Math.floor(Math.random() * 90)}) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      age: 18 + Math.floor(Math.random() * 42),
      company: rnd(companies),
      title: rnd(titles),
      department: rnd(depts),
      salary: Math.round(3000 + Math.random() * 12000),
      score: Math.round(50 + Math.random() * 50),
      createdAt: dt.toISOString().slice(0, 10),
      status: rnd(statuses)
    }
  })
)

const columnsPinned = [
  { field: 'id', title: 'ID', width: 100, pinned: 'left' },
  { field: 'name', title: 'Name', width: 220, pinned: 'left' },
  { field: 'country', title: 'Country', width: 160, filterable: true, sortable: true },
  { field: 'city', title: 'City', width: 200 },
  { field: 'email', title: 'Email', width: 260 },
  { field: 'phone', title: 'Phone', width: 190 },
  { field: 'age', title: 'Age', width: 120 },
  { field: 'company', title: 'Company', width: 200 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'department', title: 'Department', width: 180 },
  { field: 'salary', title: 'Salary', width: 160, format: (v: any) => `$ ${Number(v).toLocaleString('en-US')}` },
  { field: 'createdAt', title: 'Created at', width: 160 },
  { field: 'status', title: 'Status', width: 140, pinned: 'right' },
  { field: 'score', title: 'Score', width: 140 }
]

const columnsLocked = [
  { field: 'id', title: 'ID', width: 100, locked: 'left', sortable: true },
  { field: 'name', title: 'Name', width: 220, locked: 'left', filterable: true, sortable: true },
  { field: 'country', title: 'Country', width: 160, filterable: true, sortable: true },
  { field: 'city', title: 'City', width: 200 },
  { field: 'email', title: 'Email', width: 260 },
  { field: 'phone', title: 'Phone', width: 190 },
  { field: 'age', title: 'Age', width: 120 },
  { field: 'company', title: 'Company', width: 200 },
  { field: 'title', title: 'Title', width: 200 },
  { field: 'department', title: 'Department', width: 180 },
  { field: 'salary', title: 'Salary', width: 160, format: (v: any) => `$ ${Number(v).toLocaleString('en-US')}` },
  { field: 'createdAt', title: 'Created at', width: 160 },
  { field: 'score', title: 'Score', width: 140 },
  { field: 'status', title: 'Status', width: 140 },
]

const sort = ref<SortDescriptor[]>([{ field: 'id', dir: 'asc' }])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(20)
const codeSnippet = exampleSource
</script>
