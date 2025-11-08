<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor, type Row } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

interface Customer {
  id: number
  ContactName: string
  ContactTitle: string
  CompanyName: string
  Country: string
}

const gridRef = ref<InstanceType<typeof PantanalGrid> | null>(null)

const customers = ref<Customer[]>([
  { id: 1, ContactName: 'Maria Anders', ContactTitle: 'Sales Representative', CompanyName: 'Alfreds Futterkiste', Country: 'Germany' },
  { id: 2, ContactName: 'Ana Trujillo', ContactTitle: 'Owner', CompanyName: 'Ana Trujillo Emparedados y helados', Country: 'Mexico' },
  { id: 3, ContactName: 'Antonio Moreno', ContactTitle: 'Owner', CompanyName: 'Antonio Moreno Taquería', Country: 'Mexico' },
  { id: 4, ContactName: 'Thomas Hardy', ContactTitle: 'Sales Representative', CompanyName: 'Around the Horn', Country: 'UK' },
  { id: 5, ContactName: 'Christina Berglund', ContactTitle: 'Order Administrator', CompanyName: 'Berglunds snabbköp', Country: 'Sweden' },
  { id: 6, ContactName: 'Hanna Moos', ContactTitle: 'Sales Representative', CompanyName: 'Blauer See Delikatessen', Country: 'Germany' },
  { id: 7, ContactName: 'Frédérique Citeaux', ContactTitle: 'Marketing Manager', CompanyName: 'Blondesddsl père et fils', Country: 'France' },
  { id: 8, ContactName: 'Martín Sommer', ContactTitle: 'Owner', CompanyName: 'Bólido Comidas preparadas', Country: 'Spain' },
  { id: 9, ContactName: 'Laurence Lebihans', ContactTitle: 'Owner', CompanyName: 'Bon app\'', Country: 'France' },
  { id: 10, ContactName: 'Elizabeth Lincoln', ContactTitle: 'Accounting Manager', CompanyName: 'Bottom-Dollar Markets', Country: 'Canada' },
  { id: 11, ContactName: 'Victoria Ashworth', ContactTitle: 'Sales Representative', CompanyName: 'B\'s Beverages', Country: 'UK' },
  { id: 12, ContactName: 'Patricio Simpson', ContactTitle: 'Sales Agent', CompanyName: 'Cactus Comidas para llevar', Country: 'Argentina' },
  { id: 13, ContactName: 'Francisco Chang', ContactTitle: 'Marketing Manager', CompanyName: 'Centro comercial Moctezuma', Country: 'Mexico' },
  { id: 14, ContactName: 'Yang Wang', ContactTitle: 'Owner', CompanyName: 'Chop-suey Chinese', Country: 'Switzerland' },
  { id: 15, ContactName: 'Pedro Afonso', ContactTitle: 'Sales Associate', CompanyName: 'Comércio Mineiro', Country: 'Brazil' },
])

const columns: ColumnDef[] = [
  { field: 'ContactName', title: 'Contact Name', width: 250, locked: true },
  { field: 'ContactTitle', title: 'Contact Title', width: 350 },
  { field: 'CompanyName', title: 'Company Name', width: 350 },
  { field: 'Country', title: 'Country', width: 450 },
]

const filter = ref<FilterDescriptor[]>([])

const saveState = () => {
  if (!gridRef.value) return
  
  try {
    const options = gridRef.value.getOptions()
    localStorage.setItem('pantanal-grid-options', JSON.stringify(options))
    alert('Grid state saved successfully!')
  } catch (error) {
    console.error('Error saving state:', error)
    alert('Error saving grid state')
  }
}

const loadState = () => {
  if (!gridRef.value) return
  
  try {
    const saved = localStorage.getItem('pantanal-grid-options')
    if (saved) {
      const options = JSON.parse(saved)
      gridRef.value.setOptions(options)
      alert('Grid state loaded successfully!')
    } else {
      alert('No saved state found')
    }
  } catch (error) {
    console.error('Error loading state:', error)
    alert('Error loading grid state')
  }
}

const clearState = () => {
  try {
    localStorage.removeItem('pantanal-grid-options')
    alert('Saved state cleared!')
  } catch (error) {
    console.error('Error clearing state:', error)
    alert('Error clearing saved state')
  }
}

// Code snippet
const getPersistStateCode = () => {
  const scriptTag = '<script setup lang="ts">'
  const scriptClose = '</' + 'script>'
  const refOpen = 'ref<'
  const refClose = '>'
  const gridType = 'InstanceType<typeof PantanalGrid>'
  return scriptTag + `
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const gridRef = ` + refOpen + gridType + refClose + `(null)

const columns: ColumnDef[] = [
  { field: 'ContactName', title: 'Contact Name', width: 250, locked: true },
  { field: 'ContactTitle', title: 'Contact Title', width: 350 },
  { field: 'CompanyName', title: 'Company Name', width: 350 },
  { field: 'Country', title: 'Country', width: 450 },
]

const saveState = () => {
  if (!gridRef.value) return
  const options = gridRef.value.getOptions()
  localStorage.setItem('pantanal-grid-options', JSON.stringify(options))
}

const loadState = () => {
  if (!gridRef.value) return
  const saved = localStorage.getItem('pantanal-grid-options')
  if (saved) {
    const options = JSON.parse(saved)
    gridRef.value.setOptions(options)
  }
}
` + scriptClose + `

<template>
  <div>
    <button @click="saveState">Save State</button>
    <button @click="loadState">Load State</button>
    
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
      :groupable="true"
      :sortable="true"
      :enable-column-reorder="true"
      :enable-column-resize="true"
      :column-menu="true"
      :filterable-mode="'row'"
      :pageable="true"
      :pageable-page-sizes="[10, 20, 50, 100]"
    />
  </div>
</template>`
}
const persistStateCode = getPersistStateCode()
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Persisting the State</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Save and restore the Grid's current state (sorting, filtering, pagination, column order, widths, etc.)
        using the <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">getOptions()</code> and
        <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">setOptions()</code> methods.
      </p>
    </header>

    <article class="space-y-4">
      <div>
        <h2 class="text-2xl font-semibold mb-2">Save and Load State</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Use the buttons below to save the current grid state to localStorage and restore it later.
          The state includes:
        </p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 mb-4 space-y-1">
          <li>Sorting configuration</li>
          <li>Filtering configuration</li>
          <li>Current page and page size</li>
          <li>Column order (reordering)</li>
          <li>Column widths (resizing)</li>
          <li>Selected rows (if persistSelection is enabled)</li>
        </ul>
        <div class="flex gap-2 mb-4">
          <button
            @click="saveState"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save State
          </button>
          <button
            @click="loadState"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Load State
          </button>
          <button
            @click="clearState"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear Saved State
          </button>
        </div>
        <div class="border rounded-lg overflow-hidden">
        <PantanalGrid
          ref="gridRef"
          :rows="customers"
          :columns="columns"
          key-field="id"
          :groupable="true"
          :sortable="true"
          :enable-column-reorder="true"
          :enable-column-resize="true"
          :column-menu="true"
          :filterable-mode="'row'"
          :pageable="true"
          :pageable-page-sizes="[10, 20, 50, 100]"
          :pageable-button-count="5"
          v-model:filter="filter"
          responsive="table"
        />
        </div>
      </div>
      <ExampleCode :source="persistStateCode" />
    </article>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold mb-2">How It Works</h2>
      <div class="prose dark:prose-invert max-w-none">
        <h3>1. Get Grid Reference</h3>
        <p>
          Create a template ref to access the grid instance:
        </p>
        <pre><code>const gridRef = ref&lt;InstanceType&lt;typeof PantanalGrid&gt;&gt;(null)</code></pre>
        
        <h3>2. Save State</h3>
        <p>
          Use <code>getOptions()</code> to get the current grid state and save it to localStorage:
        </p>
        <pre><code>const saveState = () => {
  if (!gridRef.value) return
  const options = gridRef.value.getOptions()
  localStorage.setItem('pantanal-grid-options', JSON.stringify(options))
}</code></pre>
        
        <h3>3. Load State</h3>
        <p>
          Use <code>setOptions()</code> to restore the saved state:
        </p>
        <pre><code>const loadState = () => {
  if (!gridRef.value) return
  const saved = localStorage.getItem('pantanal-grid-options')
  if (saved) {
    const options = JSON.parse(saved)
    gridRef.value.setOptions(options)
  }
}</code></pre>
        
        <h3>4. Automatic Persistence</h3>
        <p>
          You can also use the <code>persistStateKey</code> prop to automatically save and restore
          the grid state using localStorage:
        </p>
        <pre><code>&lt;PantanalGrid
  :persist-state-key="'my-grid-state'"
  ...other props
/&gt;</code></pre>
      </div>
    </article>
  </div>
</template>

<style scoped>
code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.dark pre {
  background: #1e1e1e;
}
</style>

