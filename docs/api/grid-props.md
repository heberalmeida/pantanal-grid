# GridProps API Reference

Complete TypeScript interface for all PantanalGrid props.

## Interface Definition

```typescript
interface GridProps<T = Row> {
  // ========== DATA ==========
  rows?: T[]
  columns?: ColumnDef<T>[]
  keyField?: keyof T | string
  dataProvider?: DataProvider<T>
  autoBind?: boolean

  // ========== STATE (v-model) ==========
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  page?: number
  pageSize?: number
  selectable?: SelectionMode
  selectedKeys?: any[]
  group?: GroupDescriptor[]

  // ========== DISPLAY ==========
  height?: number
  rowHeight?: number
  autoHeight?: boolean
  maxBodyHeight?: number
  striped?: boolean
  rtl?: boolean
  density?: 'default' | 'compact'

  // ========== FEATURES ==========
  sortable?: boolean
  sortableMode?: 'single' | 'multiple'
  sortableAllowUnsort?: boolean
  sortableShowIndexes?: boolean
  
  filterable?: boolean
  filterableMode?: 'row' | 'menu' | 'menu, row' | false
  filterableExtra?: boolean
  showFilterRow?: boolean
  
  pageable?: boolean
  virtual?: boolean
  
  editable?: boolean | 'inline' | 'popup' | 'batch'
  editableMode?: 'incell' | 'inline' | 'popup'
  editableConfirmation?: boolean | string | ((row: T) => string)
  editableCancelDelete?: string
  editableConfirmDelete?: string
  editableCreateAt?: 'top' | 'bottom'
  editableDestroy?: boolean
  editableUpdate?: boolean
  editableTemplate?: string | ((row: T) => string)
  editableWindow?: Record<string, any>
  
  enableColumnResize?: boolean
  enableColumnReorder?: boolean
  navigatable?: boolean
  allowCopy?: boolean
  allowCopyDelimiter?: string

  // ========== SERVER-SIDE ==========
  serverSide?: boolean
  total?: number
  loading?: boolean

  // ========== GROUPING ==========
  aggregates?: Record<string, AggregateName[]>
  showGroupFooters?: boolean

  // ========== INTERNATIONALIZATION ==========
  locale?: Locale
  messages?: Partial<Messages>

  // ========== TEMPLATES ==========
  rowTemplate?: string | ((row: T, rowIndex: number) => string)
  altRowTemplate?: string | ((row: T, rowIndex: number) => string)
  detailTemplate?: string | ((row: T, rowIndex: number) => string)
  noRecords?: boolean | string | (() => string) | { 
    template?: string | (() => string)
    message?: string 
  } | false

  // ========== PERSISTENCE ==========
  persistStateKey?: string
  persistSelection?: boolean

  // ========== RESPONSIVE ==========
  responsive?: ResponsiveMode
  cardBreakpoint?: number
  showFiltersInCards?: boolean

  // ========== PAGINATION ==========
  showFooter?: boolean
  paginationVariant?: PaginationVariant
  paginationShowText?: boolean
  paginationShowIcons?: boolean
  paginationShowTotal?: boolean
  paginationMaxPages?: number
  pageableAlwaysVisible?: boolean
  pageablePageSizes?: number[] | boolean | (number | 'all')[]
  pageablePreviousNext?: boolean
  pageableNumeric?: boolean
  pageableButtonCount?: number
  pageableInput?: boolean
  pageableRefresh?: boolean
  pageableResponsive?: boolean
  pageableInfo?: boolean

  // ========== TOOLBAR ==========
  toolbar?: ('create' | 'save' | 'cancel' | 'excel' | 'pdf')[] | string | (() => string)

  // ========== COLUMN MENU ==========
  columnMenu?: boolean
  columnMenuColumns?: boolean
  columnMenuFilterable?: boolean
  columnMenuSortable?: boolean

  // ========== EXPORT ==========
  // Excel
  excelAllPages?: boolean
  excelFileName?: string
  excelFilterable?: boolean
  excelForceProxy?: boolean
  excelProxyUrl?: string
  
  // PDF
  pdfAllPages?: boolean
  pdfAvoidLinks?: boolean | string
  pdfPaperSize?: string | [number, number] | [string, string]
  pdfMargin?: {
    top?: string | number
    left?: string | number
    right?: string | number
    bottom?: string | number
  }
  pdfMarginTop?: string | number
  pdfMarginLeft?: string | number
  pdfMarginRight?: string | number
  pdfMarginBottom?: string | number
  pdfLandscape?: boolean
  pdfRepeatHeaders?: boolean
  pdfScale?: number
  pdfFileName?: string
  pdfAuthor?: string
  pdfTitle?: string
  pdfSubject?: string
  pdfKeywords?: string
  pdfCreator?: string
  pdfDate?: Date
  pdfTemplate?: string
  pdfForceProxy?: boolean
  pdfProxyUrl?: string
  pdfProxyTarget?: string

  // ========== STYLING ==========
  cellStyles?: CellStyleConfig<T>[]  // Array of cell style configurations
  rowStyles?: RowStyleConfig<T>[]  // Array of row style configurations
  columnStyles?: ColumnStyleConfig[]  // Array of column style configurations
  cellHoverStyles?: CellStyleConfig<T>[]  // Array of cell hover style configurations
  rowHoverStyles?: RowStyleConfig<T>[]  // Array of row hover style configurations
  gridStyles?: GridStyleConfig  // Grid-wide style configuration (borders, colors, etc.)

  // ========== OTHER ==========
  pinnedShadows?: boolean
  columnResizeHandleWidth?: number
  scrollable?: boolean | {
    virtual?: boolean
    endless?: boolean
  }
  filterableOperators?: {
    string?: Record<string, string>
    number?: Record<string, string>
    date?: Record<string, string>
    boolean?: Record<string, string>
    enums?: Record<string, string>
  }
}
```

## Type Definitions

### Row

```typescript
type Row = Record<string, unknown>
```

Generic row data type. Can be any object with string keys.

### CellStyleConfig

```typescript
interface CellStyleConfig<T = Row> {
  field?: string  // Column field to target
  condition?: (row: T, value: any, rowIndex: number) => boolean  // Condition function
  backgroundColor?: string  // Background color (e.g., '#fee2e2' or 'red')
  color?: string  // Text color (e.g., '#991b1b' or 'white')
  fontWeight?: string | number  // Font weight (e.g., 'bold', 600)
  rowIndex?: number  // Specific row index (0-based)
  columnIndex?: number  // Specific column index (0-based)
}
```

Configuration for styling individual cells. See [Styling Props Example](/examples/styling-props) for usage.

### RowStyleConfig

```typescript
interface RowStyleConfig<T = Row> {
  condition?: (row: T, rowIndex: number) => boolean  // Condition function
  backgroundColor?: string  // Background color for entire row
  color?: string  // Text color for entire row
  fontWeight?: string | number  // Font weight
  rowIndex?: number  // Specific row index (0-based)
  rowIndices?: number[]  // Multiple row indices
}
```

Configuration for styling entire rows. See [Styling Props Example](/examples/styling-props) for usage.

### ColumnStyleConfig

```typescript
interface ColumnStyleConfig {
  field?: string  // Column field to target
  columnIndex?: number  // Column index (0-based)
  backgroundColor?: string  // Background color for entire column
  color?: string  // Text color for entire column
  fontWeight?: string | number  // Font weight
  headerBackgroundColor?: string  // Background color for column header
  headerColor?: string  // Text color for column header
}
```

Configuration for styling entire columns. See [Styling Props Example](/examples/styling-props) for usage.

### GridStyleConfig

```typescript
interface GridStyleConfig {
  noBorders?: boolean  // Remove all borders from grid
  borderColor?: string  // Custom border color (e.g., '#3b82f6')
  borderWidth?: string  // Custom border width (e.g., '2px')
  cellPadding?: string  // Custom cell padding (e.g., '0.75rem 1rem')
  headerBackground?: string  // Custom header background color
  headerColor?: string  // Custom header text color
  rowBackground?: string  // Default row background color
  rowHoverBackground?: string  // Row hover background color (applies to all rows)
  cellHoverBackground?: string  // Cell hover background color (applies to all cells)
  stripedBackground?: string  // Striped row background color
}
```

Configuration for grid-wide styling. See [Grid Styles Example](/examples/grid-styles) for usage.

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

### AggregateName

```typescript
type AggregateName = 'sum' | 'avg' | 'min' | 'max' | 'count'
```

### Locale

```typescript
type Locale = 'pt' | 'en' | 'es' | (string & {})
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

## Default Values

Most props have sensible defaults. Here are the key defaults:

```typescript
{
  rows: [],
  columns: [],
  keyField: 'id',
  page: 1,
  pageSize: 20,
  selectable: false,
  locale: 'en',
  virtual: false,
  height: 420,
  rowHeight: 44,
  autoHeight: false,
  enableColumnResize: true,
  enableColumnReorder: true,
  serverSide: false,
  responsive: 'auto',
  cardBreakpoint: 768,
  showFiltersInCards: false,
  showFooter: true,
  paginationVariant: 'simple',
  paginationShowText: true,
  paginationShowIcons: true,
  paginationShowTotal: true,
  paginationMaxPages: 5,
  pageable: true,
  pageableAlwaysVisible: true,
  pageablePageSizes: [10, 20, 50, 100],
  pageablePreviousNext: true,
  pageableNumeric: false,
  pageableInput: false,
  pageableRefresh: false,
  pageableResponsive: true,
  pageableInfo: true,
  sortable: true,
  filterable: true,
  sortableAllowUnsort: true,
  autoBind: true
}
```

## Usage Examples

### Basic Props

```typescript
const props: GridProps = {
  rows: data,
  columns: columnDefs,
  keyField: 'id'
}
```

### With State Management

```typescript
const props: GridProps = {
  rows: data,
  columns: columnDefs,
  keyField: 'id',
  sort: [{ field: 'name', dir: 'asc' }],
  filter: [],
  page: 1,
  pageSize: 20
}
```

### Server-Side Props

```typescript
const props: GridProps = {
  rows: data,
  columns: columnDefs,
  keyField: 'id',
  serverSide: true,
  total: 1000,
  loading: false
}
```

### With Data Provider

```typescript
const props: GridProps = {
  columns: columnDefs,
  keyField: 'id',
  dataProvider: async (args) => {
    const response = await fetch(`/api/data?page=${args.page}`)
    const data = await response.json()
    return { rows: data.items, total: data.total }
  }
}
```

## See Also

- [PantanalGrid API](/api/grid) - Component reference
- [ColumnDef API](/api/column-def) - Column definition reference
- [Messages API](/api/messages) - Messages interface
