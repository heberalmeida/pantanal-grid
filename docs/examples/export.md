# Export

Pantanal Grid supports exporting data to Excel (CSV) and PDF formats with customizable options.

<ExamplePreview>
  <ExcelExportCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ExcelExportCompleteExample from './components/ExcelExportCompleteExample.vue'
</script>

## Excel Export

### Basic Usage

Add `'excel'` to the toolbar to enable Excel export:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['excel']"
/>
```

### Export All Pages

Set `excelAllPages` to `true` to export all data pages:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['excel']"
  :excel-all-pages="true"
  :pageable="true"
/>
```

### Custom File Name

Specify a custom file name:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['excel']"
  :excel-file-name="'my-export.csv'"
/>
```

## PDF Export

<ExamplePreview>
  <PdfExportCompleteExample />
</ExamplePreview>

<script setup>
import PdfExportCompleteExample from './components/PdfExportCompleteExample.vue'
</script>

### Basic Usage

Add `'pdf'` to the toolbar. **Note:** PDF export requires `jspdf` and `html2canvas` libraries:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['pdf']"
/>
```

### Paper Size and Orientation

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['pdf']"
  :pdf-paper-size="'A4'"
  :pdf-landscape="true"
/>
```

### Custom Margins

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['pdf']"
  :pdf-margin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
/>
```

### Custom File Name

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['pdf']"
  :pdf-file-name="'my-export.pdf'"
/>
```

## Programmatic Export

You can also trigger exports programmatically using the grid's exposed methods:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid> | null>(null)

function exportToExcel() {
  gridRef.value?.exportToExcel()
}

function exportToPdf() {
  gridRef.value?.exportToPdf()
}
</script>

<template>
  <div>
    <button @click="exportToExcel">Export to Excel</button>
    <button @click="exportToPdf">Export to PDF</button>
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
    />
  </div>
</template>
```

## See Also

- [PantanalGrid API](/api/grid) - Complete API reference
- [Export Guide](/guide/export) - Detailed export documentation



