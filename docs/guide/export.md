# Export

Pantanal Grid supports exporting data to Excel and PDF formats. Export functionality requires additional dependencies.

## Excel Export

### Installation

Install the required dependency:

```bash
npm install xlsx@^0.18.5
```

### Basic Usage

Add `'excel'` to the toolbar:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :toolbar="['excel']"
  />
</template>
```

### Programmatic Export

Export programmatically:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function exportToExcel() {
  gridRef.value?.exportToExcel()
}
</script>

<template>
  <div>
    <button @click="exportToExcel">Export to Excel</button>
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
    />
  </div>
</template>
```

### Custom File Name

Specify a custom file name:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['excel']"
  excel-file-name="my-products.xlsx"
/>
```

## PDF Export

### Installation

Install the required dependencies:

```bash
npm install jspdf@^2.5.0 html2canvas@^1.4.0
```

### Basic Usage

Add `'pdf'` to the toolbar:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :toolbar="['pdf']"
  />
</template>
```

### Programmatic Export

Export programmatically:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function exportToPdf() {
  gridRef.value?.exportToPdf()
}
</script>

<template>
  <div>
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

### PDF Configuration

Customize PDF export:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :toolbar="['pdf']"
  :pdf-paper-size="'A4'"
  :pdf-landscape="false"
  :pdf-margin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
  :pdf-file-name="'products.pdf'"
  :pdf-title="'Products Report'"
  :pdf-author="'My Company'"
/>
```

### PDF Options

Available PDF options:

- `pdfPaperSize` - Paper size ('A4', 'A3', 'Letter', etc.)
- `pdfLandscape` - Landscape orientation (default: false)
- `pdfMargin` - Margins object
- `pdfFileName` - File name (default: 'export.pdf')
- `pdfTitle` - PDF title metadata
- `pdfAuthor` - PDF author metadata
- `pdfSubject` - PDF subject metadata
- `pdfKeywords` - PDF keywords metadata
- `pdfCreator` - PDF creator metadata
- `pdfScale` - Scale factor (default: 1)
- `pdfRepeatHeaders` - Repeat headers on each page (default: true)

## Export Current View

By default, exports include:
- Current page data (if paginated)
- Current filters
- Current sorting
- Visible columns

## Export All Data

For server-side data, you may need to fetch all data before exporting:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()
const allRows = ref([])

async function exportAllToExcel() {
  // Fetch all data
  const response = await fetch('/api/products?limit=10000')
  const data = await response.json()
  allRows.value = data.rows
  
  // Export
  gridRef.value?.exportToExcel()
}
</script>
```

## Custom Export

Create custom export functionality:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

async function customExport() {
  const rows = gridRef.value?.getRows() || []
  const columns = gridRef.value?.getColumns() || []
  
  // Custom export logic
  const csv = convertToCSV(rows, columns)
  downloadFile(csv, 'export.csv', 'text/csv')
}

function convertToCSV(rows: any[], columns: any[]): string {
  const headers = columns.map(c => c.title || c.field).join(',')
  const data = rows.map(row => 
    columns.map(c => row[c.field]).join(',')
  ).join('\n')
  return `${headers}\n${data}`
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :toolbar="['excel', 'pdf']"
    excel-file-name="products.xlsx"
    :pdf-paper-size="'A4'"
    :pdf-file-name="'products.pdf'"
    :pdf-title="'Products Export'"
    locale="en"
  />
</template>
```

## Tips

- Excel export requires `xlsx` package
- PDF export requires `jspdf` and `html2canvas` packages
- Exports respect current filters, sorting, and pagination
- Use custom file names for better organization
- Configure PDF margins and paper size for professional reports
- For large datasets, consider server-side export





