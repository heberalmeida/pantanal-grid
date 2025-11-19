<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const basicRows = ref([
  { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, category: 'Beverages' },
  { productID: 2, productName: 'Chang', unitPrice: 17, unitsInStock: 40, category: 'Beverages' },
  { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, category: 'Condiments' },
  { productID: 4, productName: "Chef Anton's Cajun Seasoning", unitPrice: 22, unitsInStock: 53, category: 'Condiments' },
  { productID: 5, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, category: 'Condiments' },
])

const basicColumns: ColumnDef[] = [
  { field: 'productID', title: 'ID', width: 80 },
  { field: 'productName', title: 'Product Name', width: 200 },
  { field: 'unitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140 },
  { field: 'category', title: 'Category', width: 150 },
]

// Landscape Orientation
const landscapeRows = ref([...basicRows.value])
const landscapeColumns: ColumnDef[] = [...basicColumns]

// Custom Margins
const marginRows = ref([...basicRows.value])
const marginColumns: ColumnDef[] = [...basicColumns]

// Custom File Name
const customFileName = ref('my-products-export.pdf')
const customFileNameRows = ref([...basicRows.value])
const customFileNameColumns: ColumnDef[] = [...basicColumns]
</script>

<template>
  <div class="space-y-8">
    <!-- Basic PDF Export -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic PDF Export</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Add <code>'pdf'</code> to the toolbar to enable PDF export. By default, the current view is exported.
        <strong>Note:</strong> PDF export requires <code>jspdf</code> and <code>html2canvas</code> libraries.
        Click the PDF button in the toolbar to export the data.
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="productID"
        :toolbar="['pdf']"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Landscape Orientation -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Landscape Orientation</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Configure paper size and orientation using <code>pdfPaperSize</code> and <code>pdfLandscape</code> props.
        Use landscape orientation for wider tables.
      </p>
      <PantanalGrid
        :rows="landscapeRows"
        :columns="landscapeColumns"
        key-field="productID"
        :toolbar="['pdf']"
        :pdf-paper-size="'A4'"
        :pdf-landscape="true"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom Margins -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Margins</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Specify custom margins using the <code>pdfMargin</code> prop. Margins can be specified as strings (e.g., "2cm") or numbers (in mm).
      </p>
      <PantanalGrid
        :rows="marginRows"
        :columns="marginColumns"
        key-field="productID"
        :toolbar="['pdf']"
        :pdf-margin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
        :height="300"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom File Name -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom File Name</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Specify a custom file name using the <code>pdfFileName</code> prop.
      </p>
      <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
        <label class="block text-sm font-medium mb-2">File name:</label>
        <input
          v-model="customFileName"
          type="text"
          class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter file name (e.g., my-export.pdf)"
        />
      </div>
      <PantanalGrid
        :rows="customFileNameRows"
        :columns="customFileNameColumns"
        key-field="productID"
        :toolbar="['pdf']"
        :pdf-file-name="customFileName"
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
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
strong {
  font-weight: 600;
}
.p-3 {
  padding: 0.75rem;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.dark .bg-gray-800 {
  background-color: #1f2937;
}
.rounded {
  border-radius: 0.25rem;
}
.block {
  display: block;
}
.font-medium {
  font-weight: 500;
}
.w-full {
  width: 100%;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.border {
  border-width: 1px;
  border-color: #e5e7eb;
}
.dark .bg-gray-700 {
  background-color: #374151;
}
.dark .border-gray-600 {
  border-color: #4b5563;
}
</style>









