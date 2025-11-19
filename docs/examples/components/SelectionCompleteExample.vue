<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Single Row Selection
const singleRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, category: 'Condiments' },
])

const singleColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
]

const singleSelected = ref<number[]>([])

// Multiple Row Selection
const multipleRows = ref([...singleRows.value])
const multipleColumns: ColumnDef[] = [...singleColumns]
const multipleSelected = ref<number[]>([])

// Selection with Keyboard Navigation
const keyboardRows = ref([...singleRows.value])
const keyboardColumns: ColumnDef[] = [...singleColumns]
const keyboardSelected = ref<number[]>([])
</script>

<template>
  <div class="space-y-8">
    <!-- Single Row Selection -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Single Row Selection</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Enable single-row selection. Only one row can be selected at a time.
      </p>
      <div v-if="singleSelected.length > 0" class="mb-2 text-sm">
        <strong>Selected:</strong> Row ID {{ singleSelected[0] }}
      </div>
      <PantanalGrid
        :rows="singleRows"
        :columns="singleColumns"
        key-field="productID"
        selectable="single"
        @selectionChange="singleSelected = $event"
        :height="250"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Multiple Row Selection -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Multiple Row Selection</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Enable multiple-row selection. Select multiple rows using checkboxes.
      </p>
      <div v-if="multipleSelected.length > 0" class="mb-2 text-sm">
        <strong>Selected ({{ multipleSelected.length }}):</strong> 
        <span v-for="(id, idx) in multipleSelected" :key="id" class="ml-2">
          {{ id }}<span v-if="idx < multipleSelected.length - 1">,</span>
        </span>
      </div>
      <PantanalGrid
        :rows="multipleRows"
        :columns="multipleColumns"
        key-field="productID"
        selectable="multiple"
        @selectionChange="multipleSelected = $event"
        :height="250"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Selection with Keyboard Navigation -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Selection with Keyboard Navigation</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use keyboard shortcuts to select rows: <code>Space</code> to select, <code>Ctrl+Space</code> to toggle, <code>Shift+Space</code> for range.
      </p>
      <div v-if="keyboardSelected.length > 0" class="mb-2 text-sm">
        <strong>Selected ({{ keyboardSelected.length }}):</strong> 
        <span v-for="(id, idx) in keyboardSelected" :key="id" class="ml-2">
          {{ id }}<span v-if="idx < keyboardSelected.length - 1">,</span>
        </span>
      </div>
      <PantanalGrid
        :rows="keyboardRows"
        :columns="keyboardColumns"
        key-field="productID"
        selectable="multiple"
        :navigatable="true"
        @selectionChange="keyboardSelected = $event"
        :height="250"
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
.ml-2 {
  margin-left: 0.5rem;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>









