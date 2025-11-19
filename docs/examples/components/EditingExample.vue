<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

const rows = ref<Product[]>([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, editable: false },
  { field: 'name', title: 'Name', width: 200, editable: true },
  { 
    field: 'price', 
    title: 'Price', 
    width: 120,
    editable: true,
    type: 'number',
    format: (v: number) => `$${v.toFixed(2)}`,
    validation: {
      required: true,
      min: 0
    }
  },
  { field: 'category', title: 'Category', width: 150, editable: true },
  { field: 'stock', title: 'Stock', width: 120, editable: true, type: 'number' },
  {
    field: 'command',
    title: 'Actions',
    width: 180,
    command: ['edit', 'destroy']
  }
]

function handleEditSave(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.id === product.id)
  if (index !== -1) {
    rows.value[index] = { ...rows.value[index], ...product }
  }
}

function handleEditCancel() {
  console.log('Edit cancelled')
}

function handleDestroy(data: { row: unknown }) {
  const product = data.row as Product
  const index = rows.value.findIndex(r => r.id === product.id)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Clique no botão "Edit" para entrar no modo de edição. Os campos editáveis mostrarão inputs diretamente na tabela.
      Use "Update" para salvar ou "Cancel" para descartar. Use "Delete" para remover linhas.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      editable="inline"
      :toolbar="['create']"
      @editSave="handleEditSave"
      @editCancel="handleEditCancel"
      @create="(data: any) => {
        const newProduct = data.row as Product
        const maxId = Math.max(...rows.value.map(r => r.id), 0)
        newProduct.id = maxId + 1
        rows.value.push(newProduct)
      }"
      @destroy="handleDestroy"
      locale="en"
      responsive="table"
      :height="400"
    />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
</style>









