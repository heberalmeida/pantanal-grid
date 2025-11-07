<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Keyboard Navigation</h1>
    <p class="text-gray-600 mb-6">
      The keyboard support of the Grid is always available when <code class="bg-gray-100 px-2 py-1 rounded">navigatable</code> prop is enabled.
      To apply the keyboard shortcuts, focus the Grid by clicking the example area and pressing the <code class="bg-gray-100 px-2 py-1 rounded">Tab</code> key.
    </p>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Header Shortcuts</h2>
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2 px-4 font-semibold">Shortcut</th>
              <th class="text-left py-2 px-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Enter</kbd></td>
              <td class="py-2 px-4">Sort by the column</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Alt</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Down</kbd></td>
              <td class="py-2 px-4">Opens the filter menu</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Esc</kbd></td>
              <td class="py-2 px-4">Closes the filter menu</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Ctrl</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Left Arrow</kbd></td>
              <td class="py-2 px-4">Reorders the column with the previous one</td>
            </tr>
            <tr>
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Ctrl</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Right Arrow</kbd></td>
              <td class="py-2 px-4">Reorders the column with the next one</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Body Shortcuts</h2>
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2 px-4 font-semibold">Shortcut</th>
              <th class="text-left py-2 px-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Arrow Keys</kbd></td>
              <td class="py-2 px-4">Navigate over the cells</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Enter</kbd></td>
              <td class="py-2 px-4">Toggles the expand and collapse state on group row</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Page Up</kbd></td>
              <td class="py-2 px-4">Navigates to the previous page</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Page Down</kbd></td>
              <td class="py-2 px-4">Navigates to the next page</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Space</kbd></td>
              <td class="py-2 px-4">Selects the row which holds the currently highlighted cell</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Ctrl</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Space</kbd></td>
              <td class="py-2 px-4">Selects or deselects the current row while persisting the previously selected rows (only for multiple selection mode)</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Shift</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Space</kbd></td>
              <td class="py-2 px-4">Performs range selection. Selects all the rows between the last selected one and the one which holds the focused cell</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Shift</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Arrow Keys</kbd></td>
              <td class="py-2 px-4">Adds the row which holds the focused cell to the selection (only for multiple selection mode)</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Ctrl</kbd> + <kbd class="bg-white border px-2 py-1 rounded">Home</kbd></td>
              <td class="py-2 px-4">Focuses the first focusable element inside the body</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Ctrl</kbd> + <kbd class="bg-white border px-2 py-1 rounded">End</kbd></td>
              <td class="py-2 px-4">Focuses the last focusable cell in the last row</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">Home</kbd></td>
              <td class="py-2 px-4">Focuses the first focusable cell in the row</td>
            </tr>
            <tr>
              <td class="py-2 px-4"><kbd class="bg-white border px-2 py-1 rounded">End</kbd></td>
              <td class="py-2 px-4">Focuses the last focusable cell in the row</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Example</h2>
      <p class="text-gray-600 mb-4">
        Click on the grid and use the keyboard shortcuts to navigate. The focused cell will be highlighted with a green outline.
      </p>
      
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        :navigatable="true"
        :selectable="'multiple'"
        :sortable="true"
        :pageable="true"
        :filterable="true"
        :enable-column-reorder="true"
        :group="group"
        key-field="employeeID"
        @selectionChange="onSelectionChange"
      />
      
      <div v-if="selectedRows.length > 0" class="mt-4 p-4 bg-blue-50 rounded-lg">
        <p class="font-semibold mb-2">Selected Rows:</p>
        <ul class="list-disc list-inside">
          <li v-for="row in selectedRows" :key="row.employeeID">
            {{ row.firstName }} {{ row.lastName }} ({{ row.city }})
          </li>
        </ul>
      </div>
    </div>

    <ExampleCode :source="codeExample" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Employee {
  employeeID: number
  firstName: string
  lastName: string
  country: string
  city: string
  title: string
}

const rows = ref<Employee[]>([
  { employeeID: 1, firstName: 'Nancy', lastName: 'Davolio', country: 'USA', city: 'Seattle', title: 'Sales Representative' },
  { employeeID: 2, firstName: 'Andrew', lastName: 'Fuller', country: 'USA', city: 'Tacoma', title: 'Vice President, Sales' },
  { employeeID: 3, firstName: 'Janet', lastName: 'Leverling', country: 'USA', city: 'Kirkland', title: 'Sales Representative' },
  { employeeID: 4, firstName: 'Margaret', lastName: 'Peacock', country: 'UK', city: 'London', title: 'Sales Representative' },
  { employeeID: 5, firstName: 'Steven', lastName: 'Buchanan', country: 'UK', city: 'London', title: 'Sales Manager' },
  { employeeID: 6, firstName: 'Michael', lastName: 'Suyama', country: 'UK', city: 'London', title: 'Sales Representative' },
  { employeeID: 7, firstName: 'Robert', lastName: 'King', country: 'UK', city: 'London', title: 'Sales Representative' },
  { employeeID: 8, firstName: 'Laura', lastName: 'Callahan', country: 'USA', city: 'Seattle', title: 'Inside Sales Coordinator' },
  { employeeID: 9, firstName: 'Anne', lastName: 'Dodsworth', country: 'UK', city: 'London', title: 'Sales Representative' },
])

const columns: ColumnDef[] = [
  { field: 'firstName', title: 'First Name', width: 180, sortable: true, filterable: true },
  { field: 'lastName', title: 'Last Name', width: 180, sortable: true, filterable: true },
  { field: 'country', title: 'Country', width: 180, sortable: true, filterable: true },
  { field: 'city', title: 'City', width: 180, sortable: true, filterable: true },
  { field: 'title', title: 'Title', width: 180, sortable: true, filterable: true },
]

const group = ref([{ field: 'city' }])

const selectedRows = ref<Employee[]>([])

function onSelectionChange(keys: unknown[]) {
  selectedRows.value = rows.value.filter(row => keys.includes(row.employeeID))
}

const codeExample = `<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :navigatable="true"
    :selectable="'multiple'"
    :sortable="true"
    :pageable="true"
    :filterable="true"
    :enable-column-reorder="true"
    key-field="employeeID"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { employeeID: 1, firstName: 'Nancy', lastName: 'Davolio', country: 'USA', city: 'Seattle', title: 'Sales Representative' },
  // ... more rows
])

const columns: ColumnDef[] = [
  { field: 'firstName', title: 'First Name', width: 180, sortable: true },
  { field: 'lastName', title: 'Last Name', width: 180, sortable: true },
  // ... more columns
]
<\/script>`
</script>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.875rem;
}
</style>

