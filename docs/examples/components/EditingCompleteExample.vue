<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Inline Editing
const inlineRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
])

const inlineColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', editable: true },
  { 
    field: 'price', 
    title: 'Price', 
    editable: true,
    format: (v: number) => `$${v.toFixed(2)}`,
    validation: {
      required: true,
      min: 0
    }
  },
  { field: 'category', title: 'Category', editable: true },
  { field: 'stock', title: 'Stock', editable: true, type: 'number' },
  {
    field: 'command',
    title: 'Actions',
    width: 150,
    command: ['edit', 'destroy']
  }
]

function handleDestroy(row: any) {
  const index = inlineRows.value.findIndex(r => r.id === row.id)
  if (index !== -1) {
    inlineRows.value.splice(index, 1)
  }
}

// Batch Editing
const batchRows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
])

const batchColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', editable: true },
  { field: 'price', title: 'Price', editable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', editable: true },
  { field: 'stock', title: 'Stock', editable: true },
]

function handleSave() {
  console.log('Saving changes:', batchRows.value)
  // Save to server or update state
}

function handleCancel() {
  console.log('Canceling changes')
  // Revert changes
}

// With Validation
const validationRows = ref([
  { id: 1, name: 'Product A', price: 29.99, email: 'product@example.com', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, email: 'product2@example.com', stock: 75 },
])

const validationColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { 
    field: 'name', 
    title: 'Name', 
    editable: true,
    validation: {
      required: true,
      minLength: 3
    }
  },
  { 
    field: 'price', 
    title: 'Price', 
    editable: true,
    format: (v: number) => `$${v.toFixed(2)}`,
    validation: {
      required: true,
      min: 0,
      max: 10000
    }
  },
  { 
    field: 'email', 
    title: 'Email', 
    editable: true,
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  { field: 'stock', title: 'Stock', editable: true, type: 'number' },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Inline Editing -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Inline Editing</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click on editable cells to modify values directly. Use the Edit button to enter edit mode for a row.
        Use the Delete button to remove rows. Price must be positive (validation).
      </p>
      <PantanalGrid
        :rows="inlineRows"
        :columns="inlineColumns"
        key-field="id"
        :editable="true"
        :toolbar="['save', 'cancel']"
        @destroy="handleDestroy"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Batch Editing -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Batch Editing</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        In batch editing mode, multiple cells can be edited and changes are saved together using the Save button.
        Use Cancel to discard all changes.
      </p>
      <PantanalGrid
        :rows="batchRows"
        :columns="batchColumns"
        key-field="id"
        :editable="true"
        :toolbar="['save', 'cancel']"
        @save="handleSave"
        @cancel="handleCancel"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- With Validation -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Editing with Validation</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Field validation ensures data integrity. Name must be at least 3 characters, price must be between 0 and 10,000,
        and email must be a valid email address.
      </p>
      <PantanalGrid
        :rows="validationRows"
        :columns="validationColumns"
        key-field="id"
        :editable="true"
        :toolbar="['save', 'cancel']"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
</style>







