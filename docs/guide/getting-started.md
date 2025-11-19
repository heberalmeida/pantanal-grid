# Getting Started

Pantanal Grid is a powerful, feature-rich data grid component for Vue 3 applications. It provides everything you need to display, manipulate, and interact with tabular data.

<ExamplePreview>
  <GettingStartedExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import GettingStartedExample from '../examples/components/GettingStartedExample.vue'
</script>

## What is Pantanal Grid?

Pantanal Grid is a modern, feature-rich data grid component built specifically for **Vue 3** applications. It provides a comprehensive solution for displaying, manipulating, and interacting with tabular data in your web applications.

Whether you're building dashboards, admin panels, data management interfaces, or any application that requires displaying structured data, Pantanal Grid offers the tools you need out of the box. It's designed with performance, flexibility, and developer experience in mind.

### Key Features

Pantanal Grid comes packed with enterprise-grade features:

**Data Management**
- **Sorting** - Multi-column sorting with ascending/descending cycles
- **Filtering** - Per-column filtering with multiple operators (equals, contains, starts with, etc.)
- **Pagination** - Client-side and server-side pagination with customizable page sizes
- **Selection** - Single or multiple row selection with checkbox support
- **Grouping** - Multi-level grouping with drag-and-drop UI and aggregations
- **Virtual Scrolling** - Efficient rendering for large datasets (100,000+ rows)

**Data Manipulation**
- **Editing** - Inline cell and row editing with validation support
- **Export** - Export data to Excel, PDF, and Word formats
- **Column Management** - Resize, reorder, pin, and lock columns with drag-and-drop

**User Experience**
- **Keyboard Navigation** - Full keyboard support with arrow keys and shortcuts
- **Responsive Design** - Automatic card layout for mobile devices
- **Internationalization** - Built-in support for multiple languages (en, es, pt) with custom locale support
- **Persisted State** - Save and restore grid state (sort, filter, page, column widths) to localStorage
- **Templates** - Custom cell, header, and footer templates for flexible rendering

**Developer Experience**
- **TypeScript** - Fully typed API with comprehensive type definitions
- **Styling** - Flexible styling options with CSS variables and Tailwind CSS support
- **Accessibility** - ARIA attributes and keyboard navigation support for screen readers
- **Performance** - Optimized for large datasets with virtual scrolling and efficient rendering

### Why Choose Pantanal Grid?

- **Vue 3 Native** - Built from the ground up for Vue 3 with Composition API support
- **Zero Configuration** - Works out of the box with sensible defaults
- **Highly Customizable** - Extensive configuration options and template system
- **Production Ready** - Battle-tested with comprehensive test coverage
- **Active Development** - Regularly updated with new features and improvements
- **Type Safe** - Full TypeScript support for better developer experience

## Installation

Install Pantanal Grid using your preferred package manager:

```bash
# npm
npm install @pantanal/grid

# yarn
yarn add @pantanal/grid

# pnpm
pnpm add @pantanal/grid
```

## Peer Dependencies

Pantanal Grid requires Vue 3 and optionally uses some libraries for advanced features:

### Required

```bash
npm install vue@^3.3.0
```

### Optional - Export Features

Pantanal Grid supports exporting data to multiple formats. Install the following packages only if you need export functionality:

#### Excel Export

```bash
npm install xlsx@^0.18.5
```

**Usage:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['excel']"
  excel-file-name="export.xlsx"
/>
```

#### PDF Export

```bash
npm install jspdf@^2.5.0 html2canvas@^1.4.0
```

**Usage:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['pdf']"
  pdf-file-name="export.pdf"
/>
```

#### CSV Export

CSV export is built-in and doesn't require additional dependencies:

**Usage:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['csv']"
/>
```

Or programmatically:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function exportToCSV() {
  gridRef.value?.exportToCSV()
}
</script>

<template>
  <button @click="exportToCSV">Export to CSV</button>
  <PantanalGrid
    ref="gridRef"
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

#### Word Export (DOCX)

```bash
npm install docx@^8.0.0 file-saver@^2.0.5
```

**Usage:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['word']"
/>
```

Or programmatically:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function exportToDocx() {
  gridRef.value?.exportToDocx()
}
</script>

<template>
  <button @click="exportToDocx">Export to Word</button>
  <PantanalGrid
    ref="gridRef"
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

**Note:** All export dependencies are optional except CSV (which is built-in). The grid will work without them, but export features will be unavailable. If you try to export without the required dependencies, the grid will show a warning message.

### Optional - Styling (Recommended)

```bash
npm install -D tailwindcss postcss autoprefixer
```

Tailwind CSS is recommended for better styling control, but not required. Pantanal Grid works with any CSS framework or plain CSS.

## Basic Setup

### 1. Import the Stylesheet

Import the default stylesheet once in your application entry point:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@pantanal/grid/styles.css'

createApp(App).mount('#app')
```

### 2. Use the Component

Use the component in your Vue component:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true },
  { field: 'stock', title: 'Stock', sortable: true }
]
</script>

<template>
  <PantanalGrid 
    :rows="rows" 
    :columns="columns" 
    key-field="id"
    locale="en"
  />
</template>
```

## Essential Props

### Required Props

- **`rows`** - Array of data objects to display
- **`columns`** - Array of column definitions
- **`key-field`** - Field name that uniquely identifies each row

### Common Props

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :height="400"              // Grid height in pixels
  locale="en"                // Language (en, es, pt)
  :pageable="true"           // Enable pagination
  :page-size="20"            // Rows per page
  :sortable="true"           // Enable sorting
  :filterable="true"         // Enable filtering
  :selectable="multiple"     // Enable row selection
  :navigatable="true"        // Enable keyboard navigation
  persist-state-key="my-grid" // Persist state to localStorage
  responsive="auto"          // Responsive mode (auto, table, cards)
/>
```

## Complete Example with State Management

Here's a complete example with sorting, filtering, and pagination:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 },
  { id: 6, name: 'Product F', price: 24.99, category: 'Accessories', stock: 300 },
  { id: 7, name: 'Product G', price: 69.99, category: 'Electronics', stock: 25 },
  { id: 8, name: 'Product H', price: 34.99, category: 'Clothing', stock: 120 }
])

const columns: ColumnDef[] = [
  { 
    field: 'id', 
    title: 'ID', 
    width: 80, 
    sortable: true, 
    filterable: true,
    resizable: true
  },
  { 
    field: 'name', 
    title: 'Product Name', 
    sortable: true, 
    filterable: true,
    resizable: true
  },
  { 
    field: 'price', 
    title: 'Price', 
    sortable: true, 
    filterable: true,
    format: (v: number) => `$${v.toFixed(2)}`,
    resizable: true
  },
  { 
    field: 'category', 
    title: 'Category', 
    filterable: true,
    resizable: true
  },
  { 
    field: 'stock', 
    title: 'Stock', 
    sortable: true,
    resizable: true
  }
]

// State management with v-model
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    v-model:filter="filter"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :height="400"
    locale="en"
    :navigatable="true"
    persist-state-key="my-grid"
  />
</template>
```

## Column Configuration

### Basic Column Properties

```vue
const columns: ColumnDef[] = [
  {
    field: 'name',           // Field name from row data
    title: 'Product Name',   // Column header text
    width: 200,              // Column width in pixels
    sortable: true,          // Enable sorting
    filterable: true,        // Enable filtering
    resizable: true,         // Allow column resizing
    reorderable: true,       // Allow column reordering
    format: (value) => {     // Format function for cell values
      return `$${value.toFixed(2)}`
    }
  }
]
```

### Column Types

```vue
const columns: ColumnDef[] = [
  // Text column
  { field: 'name', title: 'Name' },
  
  // Number column with formatting
  { 
    field: 'price', 
    title: 'Price', 
    format: (v: number) => `$${v.toFixed(2)}` 
  },
  
  // Boolean column
  { 
    field: 'active', 
    title: 'Active',
    template: ({ value }) => value ? '✓' : '✗'
  },
  
  // Date column
  { 
    field: 'createdAt', 
    title: 'Created',
    format: (v: Date) => v.toLocaleDateString()
  }
]
```

## Common Use Cases

### With Row Selection

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]
const selectedKeys = ref<number[]>([])

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
  console.log('Selected rows:', keys)
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    selectable="multiple"
    @selectionChange="handleSelectionChange"
  />
</template>
```

### With Grouping

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    groupable
    :group="group"
  />
</template>
```

### With Virtual Scrolling

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="600"
    :page-size="50"
    :row-height="44"
  />
</template>
```

### With Server-Side Data

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type DataProvider } from '@pantanal/grid'

const columns: ColumnDef[] = [/* ... */]

const dataProvider: DataProvider = async (args) => {
  const response = await fetch(`/api/data?page=${args.page}&pageSize=${args.pageSize}`)
  const data = await response.json()
  
  return {
    rows: data.items,
    total: data.total
  }
}
</script>

<template>
  <PantanalGrid
    :columns="columns"
    :data-provider="dataProvider"
    key-field="id"
    :server-side="true"
  />
</template>
```

## Styling

Pantanal Grid uses CSS variables for theming. You can customize colors and spacing:

```css
:root {
  --v3grid-border-color: #e5e7eb;
  --v3grid-header-bg: #f9fafb;
  --v3grid-row-hover: #f3f4f6;
  --v3grid-primary: #3b82f6;
}
```

Or use Tailwind classes directly on the component:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  class="rounded-lg border border-gray-200 shadow-sm"
/>
```

## TypeScript Support

Pantanal Grid is fully typed with TypeScript. Import types as needed:

```ts
import { 
  PantanalGrid,
  type ColumnDef,
  type SortDescriptor,
  type FilterDescriptor,
  type GroupDescriptor,
  type AggregateName,
  type DataProvider
} from '@pantanal/grid'
```

## Performance Tips

- Use `key-field` for efficient row tracking
- Enable virtual scrolling for large datasets (10,000+ rows)
- Use server-side mode for remote data
- Leverage `persist-state-key` to avoid unnecessary re-renders
- Consider pagination for better initial load times

## Browser Support

Pantanal Grid supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

- Learn about [Installation](/guide/installation) and configuration
- Check out [Quick Start](/guide/quick-start) for a complete example
- Browse [Examples](/examples/basic) to see Pantanal Grid in action
- Read the [API Reference](/api/grid) for detailed documentation
- Explore [Advanced Features](/examples) for grouping, editing, and more








