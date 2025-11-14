# Getting Started

Pantanal Grid is a powerful, feature-rich data grid component for Vue 3 applications. It provides everything you need to display, manipulate, and interact with tabular data.

## What is Pantanal Grid?

Pantanal Grid is a Vue 3 component library that offers:

- **Sorting** - Multi-column sorting with ascending/descending cycles
- **Filtering** - Per-column filtering with multiple operators
- **Pagination** - Client-side and server-side pagination
- **Selection** - Single or multiple row selection
- **Grouping** - Multi-level grouping with aggregations
- **Virtual Scrolling** - Efficient rendering for large datasets
- **Editing** - Inline cell and row editing
- **Export** - Excel and PDF export capabilities
- **Column Management** - Resize, reorder, pin, and lock columns
- **Internationalization** - Built-in support for multiple languages
- **Responsive** - Card layout for mobile devices
- **TypeScript** - Fully typed API

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

```bash
# Required
npm install vue@^3.3.0

# Optional - for Excel export
npm install xlsx@^0.18.5

# Optional - for PDF export
npm install jspdf@^2.5.0 html2canvas@^1.4.0

# Optional - for styling (recommended)
npm install -D tailwindcss postcss autoprefixer
```

## Basic Setup

1. Import the stylesheet in your application entry point:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@pantanal/grid/styles.css'

createApp(App).mount('#app')
```

2. Use the component in your Vue component:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = [
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' }
]

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true }
]
</script>

<template>
  <PantanalGrid 
    :rows="rows" 
    :columns="columns" 
    key-field="id" 
  />
</template>
```

## Next Steps

- Learn about [Installation](/guide/installation) and configuration
- Check out [Quick Start](/guide/quick-start) for a complete example
- Browse [Examples](/examples/basic) to see Pantanal Grid in action
- Read the [API Reference](/api/grid) for detailed documentation







