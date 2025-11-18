# Installation

This guide will help you install and configure Pantanal Grid in your Vue 3 project.

## Prerequisites

- **Node.js** ≥ 18
- **Vue 3** ≥ 3.3.0
- A package manager (npm, yarn, or pnpm)

## Install the Package

```bash
# npm
npm install @pantanal/grid

# yarn
yarn add @pantanal/grid

# pnpm
pnpm add @pantanal/grid
```

## Install Peer Dependencies

### Required

Vue 3 is required:

```bash
npm install vue@^3.3.0
```

### Optional Dependencies

#### Excel Export

For Excel export functionality:

```bash
npm install xlsx@^0.18.5
```

#### PDF Export

For PDF export functionality:

```bash
npm install jspdf@^2.5.0 html2canvas@^1.4.0
```

#### Styling (Recommended)

While Pantanal Grid works without Tailwind CSS, it's recommended for better styling:

```bash
npm install -D tailwindcss postcss autoprefixer
```

Then initialize Tailwind:

```bash
npx tailwindcss init -p
```

## Import Styles

Import the default stylesheet in your application entry point:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@pantanal/grid/styles.css'

createApp(App).mount('#app')
```

## TypeScript Support

Pantanal Grid is written in TypeScript and includes type definitions. If you're using TypeScript, types will be automatically available.

## Verify Installation

Create a simple test component to verify the installation:

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = [
  { id: 1, name: 'Test', value: 100 }
]

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' },
  { field: 'value', title: 'Value' }
]
</script>

<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
</template>
```

If the grid renders correctly, your installation is successful!

## Troubleshooting

### Styles Not Loading

Make sure you've imported the stylesheet:

```ts
import '@pantanal/grid/styles.css'
```

### TypeScript Errors

Ensure you're using Vue 3.3.0 or higher and have TypeScript properly configured in your project.

### Build Errors

If you encounter build errors, make sure all peer dependencies are installed and compatible with your project's versions.








