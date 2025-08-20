<template>
  <section class="space-y-6">
    <h2 class="text-xl font-semibold">Pinned Columns (pt-BR)</h2>
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
    />
    <p class="text-sm text-slate-600">
      <b>Pinned:</b> colunas grudam no scroll horizontal mas podem cobrir rodapé.
    </p>

    <h2 class="text-xl font-semibold">Locked Columns (pt-BR)</h2>
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
    />
    <p class="text-sm text-slate-600">
      <b>Locked:</b> colunas ficam fixas absolutas, não rolam horizontalmente e não sobrepõem o rodapé.
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

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
  status: 'Ativo' | 'Pendente' | 'Inativo'
}

function rnd<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)] }
const countries = ['Brasil', 'Argentina', 'Chile', 'Paraguai', 'Uruguai', 'Peru', 'Bolívia']
const cities = ['Campo Grande', 'São Paulo', 'Curitiba', 'Porto Alegre', 'Lima', 'Santiago', 'Assunção']
const companies = ['Onr Tech', 'Alfa SA', 'Beta Ltda', 'Gama Corp', 'Delta Group', 'Zeta Digital']
const titles = ['Dev Front-end', 'Dev Back-end', 'QA', 'PM', 'PO', 'Designer']
const depts = ['Engenharia', 'Produto', 'Qualidade', 'Marketing', 'Financeiro']
const statuses: Row['status'][] = ['Ativo', 'Pendente', 'Inativo']

const rows = ref<Row[]>(
  Array.from({ length: 200 }, (_, i) => {
    const dt = new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28))
    const name = `Pessoa ${i + 1}`
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
  { field: 'name', title: 'Nome', width: 220, pinned: 'left' },
  { field: 'country', title: 'País', width: 160, filterable: true, sortable: true },
  { field: 'city', title: 'Cidade', width: 200 },
  { field: 'email', title: 'Email', width: 260 },
  { field: 'phone', title: 'Telefone', width: 190 },
  { field: 'age', title: 'Idade', width: 120 },
  { field: 'company', title: 'Empresa', width: 200 },
  { field: 'title', title: 'Cargo', width: 200 },
  { field: 'department', title: 'Depto', width: 180 },
  { field: 'salary', title: 'Salário', width: 160, format: (v: any) => `R$ ${Number(v).toLocaleString('pt-BR')}` },
  { field: 'createdAt', title: 'Criado em', width: 160 },
  { field: 'status', title: 'Status', width: 140, pinned: 'right' },
  { field: 'score', title: 'Score', width: 140 }
]

const columnsLocked = [
  { field: 'id', title: 'ID', width: 100, locked: 'left', sortable: true },
  { field: 'name', title: 'Nome', width: 220, locked: 'left', filterable: true, sortable: true },
  { field: 'country', title: 'País', width: 160, filterable: true, sortable: true },
  { field: 'city', title: 'Cidade', width: 200 },
  { field: 'email', title: 'Email', width: 260 },
  { field: 'phone', title: 'Telefone', width: 190 },
  { field: 'age', title: 'Idade', width: 120 },
  { field: 'company', title: 'Empresa', width: 200 },
  { field: 'title', title: 'Cargo', width: 200 },
  { field: 'department', title: 'Depto', width: 180 },
  { field: 'salary', title: 'Salário', width: 160, format: (v: any) => `R$ ${Number(v).toLocaleString('pt-BR')}` },
  { field: 'createdAt', title: 'Criado em', width: 160 },
  { field: 'score', title: 'Score', width: 140, pinned: 'right' },
  { field: 'status', title: 'Status', width: 140 },
]

const sort = ref<SortDescriptor[]>([{ field: 'id', dir: 'asc' }])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(20)
</script>