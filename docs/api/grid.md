---
title: PantanalGrid API

description: "API Index | PantanalGrid"

api_reference: true

slug: api_pantanalgridcomponent

---

# PantanalGrid

## Directive

`pantanal-grid`

## Component

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  ...
/>
```

## Props

### Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `Row[]` | `[]` | Array of data rows to display |
| `columns` | `ColumnDef[]` | `[]` | Column definitions |
| `keyField` | `string \| keyof Row` | `'id'` | Field name used as unique identifier for rows |
| `dataProvider` | `DataProvider<T>` | - | Function that returns `{ rows, total }` for server-side data |

### State Props (v-model)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sort` | `SortDescriptor[]` | `[]` | Current sort state (v-model) |
| `filter` | `FilterDescriptor[]` | `[]` | Current filter state (v-model) |
| `page` | `number` | `1` | Current page number (v-model) |
| `pageSize` | `number` | `20` | Number of items per page (v-model) |
| `selectedKeys` | `any[]` | `[]` | Selected row keys (v-model) |
| `group` | `GroupDescriptor[]` | `[]` | Current group state (v-model) |

### Display Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `number` | `420` | Fixed height of the grid (required for virtual scrolling) |
| `rowHeight` | `number` | `44` | Height of each row in pixels |
| `autoHeight` | `boolean` | `false` | Automatically adjust height to content |
| `maxBodyHeight` | `number` | - | Maximum height of the body |
| `striped` | `boolean` | `false` | Apply striped row styling |
| `rtl` | `boolean` | `false` | Right-to-left layout |
| `density` | `'default' \| 'compact'` | `'default'` | Row density |

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `'single' \| 'multiple' \| false` | `false` | Row selection mode |
| `sortable` | `boolean` | `true` | Enable column sorting globally |
| `sortableMode` | `'single' \| 'multiple'` | `'single'` | Sorting mode |
| `sortableAllowUnsort` | `boolean` | `true` | Allow unsorting columns |
| `sortableShowIndexes` | `boolean` | `false` | Show sort order indexes in multiple mode |
| `filterable` | `boolean` | `true` | Enable column filtering globally |
| `filterableMode` | `'row' \| 'menu' \| 'menu, row' \| false` | `'row'` | Filter UI mode |
| `filterableExtra` | `boolean` | `false` | Allow second filter criterion |
| `showFilterRow` | `boolean` | - | Show filter row (auto-determined by filterableMode) |
| `pageable` | `boolean` | `true` | Enable pagination |
| `virtual` | `boolean` | `false` | Enable virtual scrolling |
| `editable` | `boolean \| 'inline' \| 'popup' \| 'batch'` | `false` | Enable inline editing |
| `editableMode` | `'incell' \| 'inline' \| 'popup'` | `'incell'` | Editing mode |
| `enableColumnResize` | `boolean` | `true` | Enable column resizing |
| `enableColumnReorder` | `boolean` | `true` | Enable column reordering |
| `navigatable` | `boolean` | `false` | Enable keyboard navigation |
| `allowCopy` | `boolean` | `false` | Allow copying cell values |
| `allowCopyDelimiter` | `string` | `'\t'` | Delimiter for copied values |

### Server-Side Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `serverSide` | `boolean` | `false` | Enable server-side mode |
| `total` | `number` | - | Total number of items (for server-side) |
| `loading` | `boolean` | `false` | Loading state indicator |
| `autoBind` | `boolean` | `true` | Automatically bind data when using dataProvider |

### Grouping Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `group` | `GroupDescriptor[]` | `[]` | Group configuration |
| `aggregates` | `Record<string, AggregateName[]>` | `{}` | Aggregate functions |
| `showGroupFooters` | `boolean` | `false` | Show group footers |

### Internationalization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `'en' \| 'es' \| 'pt' \| string` | `'en'` | Locale code |
| `messages` | `Partial<Messages>` | `{}` | Custom messages |

### Persistence Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `persistStateKey` | `string` | - | Key for persisting grid state |
| `persistSelection` | `boolean` | `false` | Persist selection across pages |

### Responsive Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `responsive` | `'auto' \| 'table' \| 'cards'` | `'auto'` | Responsive mode |
| `cardBreakpoint` | `number` | `768` | Breakpoint for card mode (in pixels) |
| `showFiltersInCards` | `boolean` | `false` | Show filters in card mode |

### Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `paginationVariant` | `'simple' \| 'pages' \| 'edges'` | `'simple'` | Pagination style |
| `paginationShowText` | `boolean` | `true` | Show pagination text |
| `paginationShowIcons` | `boolean` | `true` | Show pagination icons |
| `paginationShowTotal` | `boolean` | `true` | Show total count |
| `paginationMaxPages` | `number` | `5` | Maximum pages to show |
| `pageableAlwaysVisible` | `boolean` | `true` | Always show pager |
| `pageablePageSizes` | `number[] \| boolean \| (number \| 'all')[]` | `[10, 20, 50, 100]` | Available page sizes |
| `pageablePreviousNext` | `boolean` | `true` | Show previous/next buttons |
| `pageableNumeric` | `boolean` | `false` | Show numeric page buttons |
| `pageableButtonCount` | `number` | - | Maximum number of numeric buttons |
| `pageableInput` | `boolean` | `false` | Show page number input |
| `pageableRefresh` | `boolean` | `false` | Show refresh button |
| `pageableResponsive` | `boolean` | `true` | Enable responsive pager |
| `pageableInfo` | `boolean` | `true` | Show pagination info |

### Template Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowTemplate` | `string \| ((row: T, rowIndex: number) => string)` | - | Custom row template |
| `altRowTemplate` | `string \| ((row: T, rowIndex: number) => string)` | - | Custom alternate row template |
| `detailTemplate` | `string \| ((row: T, rowIndex: number) => string)` | - | Master-detail template |
| `noRecords` | `boolean \| string \| (() => string) \| object \| false` | - | No records message/template |

### Toolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toolbar` | `('create' \| 'save' \| 'cancel' \| 'excel' \| 'pdf')[] \| string \| (() => string)` | - | Toolbar configuration |

### Column Menu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnMenu` | `boolean` | `false` | Enable column menu |
| `columnMenuColumns` | `boolean` | `true` | Show columns option in menu |
| `columnMenuFilterable` | `boolean` | `true` | Show filter option in menu |
| `columnMenuSortable` | `boolean` | `true` | Show sort option in menu |

### Editing Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `editableConfirmation` | `boolean \| string \| ((row: T) => string)` | `false` | Delete confirmation |
| `editableCancelDelete` | `string` | - | Cancel delete button text |
| `editableConfirmDelete` | `string` | - | Confirm delete button text |
| `editableCreateAt` | `'top' \| 'bottom'` | `'top'` | Where to create new rows |
| `editableDestroy` | `boolean` | `true` | Allow row deletion |
| `editableUpdate` | `boolean` | `true` | Allow row updates |
| `editableTemplate` | `string \| ((row: T) => string)` | - | Custom edit template |
| `editableWindow` | `Record<string, any>` | - | Popup window configuration |

### Excel Export Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `excelAllPages` | `boolean` | `false` | Export all pages |
| `excelFileName` | `string` | `'export.xlsx'` | Excel file name |
| `excelFilterable` | `boolean` | `true` | Include filters in export |
| `excelForceProxy` | `boolean` | `false` | Force proxy for download |
| `excelProxyUrl` | `string` | - | Proxy URL for Excel export |

### PDF Export Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pdfAllPages` | `boolean` | `false` | Export all pages |
| `pdfAvoidLinks` | `boolean \| string` | `true` | Convert links to text or ignore via CSS selector |
| `pdfPaperSize` | `string \| [number, number] \| [string, string]` | `'A4'` | Paper size |
| `pdfMargin` | `object` | `{ top: '1cm', left: '1cm', right: '1cm', bottom: '1cm' }` | Margins object |
| `pdfMarginTop` | `string \| number` | - | Top margin |
| `pdfMarginLeft` | `string \| number` | - | Left margin |
| `pdfMarginRight` | `string \| number` | - | Right margin |
| `pdfMarginBottom` | `string \| number` | - | Bottom margin |
| `pdfLandscape` | `boolean` | `false` | Landscape orientation |
| `pdfRepeatHeaders` | `boolean` | `true` | Repeat headers on each page |
| `pdfScale` | `number` | `1` | Scale factor |
| `pdfFileName` | `string` | `'export.pdf'` | PDF file name |
| `pdfAuthor` | `string` | - | PDF author metadata |
| `pdfTitle` | `string` | - | PDF title metadata |
| `pdfSubject` | `string` | - | PDF subject metadata |
| `pdfKeywords` | `string` | - | PDF keywords metadata |
| `pdfCreator` | `string` | - | PDF creator metadata |
| `pdfDate` | `Date` | `new Date()` | PDF creation date |
| `pdfTemplate` | `string` | - | HTML template for headers/footers |
| `pdfForceProxy` | `boolean` | `false` | Force proxy for download |
| `pdfProxyUrl` | `string` | - | Proxy URL for PDF export |
| `pdfProxyTarget` | `string` | - | Where to display document (`'_blank'`, `'_self'`, iframe name) |

### Other Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showFooter` | `boolean` | `true` | Show footer |
| `pinnedShadows` | `boolean` | `false` | Show shadows on pinned columns |
| `columnResizeHandleWidth` | `number` | `4` | Column resize handle width |
| `scrollable` | `boolean \| object` | - | Scrollable configuration |

## Events

### State Events (v-model)

| Event | Payload | Description |
|-------|---------|-------------|
| `update:sort` | `SortDescriptor[]` | Emitted when sort changes |
| `update:filter` | `FilterDescriptor[]` | Emitted when filter changes |
| `update:page` | `number` | Emitted when page changes |
| `update:pageSize` | `number` | Emitted when page size changes |
| `update:selectedKeys` | `any[]` | Emitted when selection changes |
| `update:group` | `GroupDescriptor[]` | Emitted when group changes |

### Data Events

| Event | Payload | Description |
|-------|---------|-------------|
| `selectionChange` | `any[]` | Emitted when selection changes |
| `rowClick` | `Row` | Emitted when row is clicked |
| `loading` | `boolean` | Emitted when loading state changes |
| `error` | `unknown` | Emitted when an error occurs |
| `databinding` | `{ sort?, filter?, group?, page?, pageSize? }` | Emitted before data binding |
| `databound` | `any[]` | Emitted after data binding |

### Column Events

| Event | Payload | Description |
|-------|---------|-------------|
| `columnResize` | `{ field: string, width: number }` | Emitted when column is resized |
| `columnReorder` | `{ from: number, to: number }` | Emitted when column is reordered |
| `columnhide` | `{ column: ColumnDef, field: string }` | Emitted when column is hidden |
| `columnshow` | `{ column: ColumnDef, field: string }` | Emitted when column is shown |
| `columnlock` | `{ column: ColumnDef, field: string }` | Emitted when column is locked |
| `columnunlock` | `{ column: ColumnDef, field: string }` | Emitted when column is unlocked |
| `columnmenuinit` | `{ column: ColumnDef, field: string, container: HTMLElement }` | Emitted when column menu is initialized |
| `columnmenuopen` | `{ column: ColumnDef, field: string }` | Emitted when column menu opens |

### Editing Events

| Event | Payload | Description |
|-------|---------|-------------|
| `edit` | `{ row: any, field?: string }` | Emitted when editing starts |
| `editCommit` | `{ row: any, field: string, value: any }` | Emitted when cell edit is committed |
| `editCancel` | `{ row: any }` | Emitted when editing is cancelled |
| `editSave` | `{ row: any }` | Emitted when row is saved |
| `create` | `{ row: any }` | Emitted when new row is created |
| `destroy` | `{ row: any }` | Emitted when row is deleted |
| `save` | `{ changes: Array<{ type: 'create' \| 'update' \| 'destroy', row: any }> }` | Emitted when all changes are saved |
| `cancel` | `void` | Emitted when all changes are cancelled |
| `validationError` | `{ row: any, field: string, error: string }` | Emitted when validation fails |

### Grouping Events

| Event | Payload | Description |
|-------|---------|-------------|
| `toggleGroup` | `key: string, open: boolean` | Emitted when group is toggled |
| `group` | `{ groups: GroupDescriptor[] }` | Emitted when group changes |
| `groupexpand` | `{ group: { field: string, value: any, aggregates? } }` | Emitted when group expands |
| `groupcollapse` | `{ group: { field: string, value: any, aggregates? } }` | Emitted when group collapses |

### Sorting/Filtering Events

| Event | Payload | Description |
|-------|---------|-------------|
| `sort` | `{ sort: SortDescriptor[] }` | Emitted when sort changes |
| `filter` | `{ filter: FilterDescriptor[] }` | Emitted when filter changes |

### Export Events

| Event | Payload | Description |
|-------|---------|-------------|
| `pdfExport` | `{ fileName: string }` | Emitted when PDF export completes |

### Other Events

| Event | Payload | Description |
|-------|---------|-------------|
| `refresh` | `void` | Emitted when refresh button is clicked |

## Methods

Access methods via component ref:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

// Call methods
gridRef.value?.exportToPdf()
gridRef.value?.getOptions()
</script>
```

### getOptions

##### returns

Returns the current grid state including sort, filter, page, pageSize, column order, widths, and selectedKeys (if persistSelection is enabled).

**Returns:** `GridOptions`

**Example:**
```typescript
const options = gridRef.value?.getOptions()
// { sort: [{ field: 'name', dir: 'asc' }], page: 1, pageSize: 20, order: [0, 1, 2], widths: [100, 200, 150] }
```

### setOptions

##### parameters

- `options: GridOptions` - The grid state to set

##### returns

Sets the grid state programmatically. Updates sort, filter, page, pageSize, column order, widths, and selectedKeys.

**Example:**
```typescript
gridRef.value?.setOptions({
  sort: [{ field: 'price', dir: 'desc' }],
  page: 2,
  pageSize: 50,
  order: [1, 0, 2],
  widths: [150, 200, 100]
})
```

### exportToPdf

##### returns

Exports the grid data to PDF format. The PDF will be downloaded with the filename specified in `pdfFileName` prop (default: `'export.pdf'`).

**Returns:** `Promise<void>`

**Example:**
```typescript
await gridRef.value?.exportToPdf()
```

### saveAsPdf

##### returns

Alias for `exportToPdf`. Exports the grid data to PDF format.

**Returns:** `Promise<void>`

### exportToExcel

##### returns

Exports the grid data to Excel format (.xlsx). The file will be downloaded with the filename specified in `excelFileName` prop (default: `'export.xlsx'`).

**Returns:** `Promise<void>`

**Example:**
```typescript
await gridRef.value?.exportToExcel()
```

### exportToCSV

##### returns

Exports the grid data to CSV format. The file will be downloaded with a `.csv` extension.

**Returns:** `Promise<void>`

**Example:**
```typescript
await gridRef.value?.exportToCSV()
```

### exportToDocx

##### returns

Exports the grid data to Word document format (.docx). The file will be downloaded with a `.docx` extension.

**Returns:** `Promise<void>`

**Example:**
```typescript
await gridRef.value?.exportToDocx()
```

### isRowEditing

##### parameters

- `row: any` - The row to check

##### returns

Returns `true` if the specified row is currently in edit mode, `false` otherwise.

**Returns:** `boolean`

**Example:**
```typescript
const isEditing = gridRef.value?.isRowEditing(row)
```

#### GridOptions Interface

```typescript
interface GridOptions {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  page?: number
  pageSize?: number
  order?: number[]  // Column order
  widths?: (number | undefined)[]  // Column widths
  selectedKeys?: any[]  // Only if persistSelection is enabled
}
```

**Note:** `group` is not included in `getOptions`/`setOptions` as it's controlled via props. Use `v-model:group` to manage grouping.

## Slots

### Default Slot

Use `PantanalColumn` components as children:

```vue
<PantanalGrid :rows="rows" key-field="id">
  <PantanalColumn field="id" title="ID" />
  <PantanalColumn field="name" title="Name" />
</PantanalGrid>
```

### Named Slots

| Slot | Props | Description |
|------|-------|-------------|
| `toolbar` | - | Custom toolbar content |
| `header` | `{ column: ColumnDef }` | Custom header cell |
| `cell` | `{ row: Row, column: ColumnDef, value: any, rowIndex: number, columnIndex: number }` | Custom cell content |
| `footer` | `{ aggregates: Record<string, any> }` | Custom footer content |

### Slot Examples

#### Custom Toolbar

```vue
<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id">
    <template #toolbar>
      <button @click="customAction">Custom Action</button>
    </template>
  </PantanalGrid>
</template>
```

#### Custom Cell

```vue
<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id">
    <template #cell="{ column, row, value }">
      <div v-if="column.field === 'status'">
        <span :class="value === 'active' ? 'text-green-500' : 'text-red-500'">
          {{ value }}
        </span>
      </div>
      <div v-else>{{ value }}</div>
    </template>
  </PantanalGrid>
</template>
```

## Types

### SortDescriptor

```typescript
interface SortDescriptor {
  field: string
  dir: 'asc' | 'desc'
}
```

### FilterDescriptor

```typescript
interface FilterDescriptor {
  field: string
  operator: 'contains' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 
           'startswith' | 'endswith' | 'isnull' | 'isnotnull' | 
           'isempty' | 'isnotempty'
  value: unknown
  logic?: 'and' | 'or'
  filters?: FilterDescriptor[]
}
```

### GroupDescriptor

```typescript
interface GroupDescriptor {
  field: string
  dir?: 'asc' | 'desc'
}
```

### AggregateName

```typescript
type AggregateName = 'sum' | 'avg' | 'min' | 'max' | 'count'
```

### SelectionMode

```typescript
type SelectionMode = 'single' | 'multiple' | false
```

### ResponsiveMode

```typescript
type ResponsiveMode = 'auto' | 'table' | 'cards'
```

### PaginationVariant

```typescript
type PaginationVariant = 'simple' | 'pages' | 'edges'
```

### DataProvider

```typescript
interface DataProviderArgs {
  page: number
  pageSize: number
  sort: SortDescriptor[]
  filter: FilterDescriptor[]
  signal?: AbortSignal
}

interface DataProviderResult<T = Row> {
  rows: T[]
  total?: number
}

type DataProvider<T = Row> = (args: DataProviderArgs) => Promise<DataProviderResult<T>>
```

## Examples

### Basic Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

### With State Management

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    v-model:filter="filter"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>
```

### Server-Side Mode

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    :loading="loading"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>
```

### With Data Provider

```vue
<script setup lang="ts">
async function dataProvider(args) {
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
    key-field="id"
    :data-provider="dataProvider"
  />
</template>
```

### With Methods

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function handleExport() {
  gridRef.value?.exportToExcel()
}
</script>

<template>
  <div>
    <button @click="handleExport">Export</button>
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

- [ColumnDef API](/api/column-def) - Complete column definition reference
- [GridProps API](/api/grid-props) - All props interface
- [Messages API](/api/messages) - All customizable messages
- [Types API](/api/types) - All TypeScript types and interfaces
- [Getting Started Guide](/guide/getting-started) - Quick start guide
