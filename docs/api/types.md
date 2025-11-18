# Types API Reference

Complete reference for all TypeScript types and interfaces used in Pantanal Grid.

## Core Types

### Row

```typescript
type Row = Record<string, unknown>
```

Generic row data type. Can be any object with string keys.

### SortDir

```typescript
type SortDir = 'asc' | 'desc'
```

Sort direction.

### SelectionMode

```typescript
type SelectionMode = 'single' | 'multiple' | false
```

Row selection mode.

### Locale

```typescript
type Locale = 'pt' | 'en' | 'es' | (string & {})
```

Locale code. Built-in: `'en'`, `'es'`, `'pt'`. Custom locales can be registered.

### ResponsiveMode

```typescript
type ResponsiveMode = 'auto' | 'table' | 'cards'
```

Responsive display mode.

### PaginationVariant

```typescript
type PaginationVariant = 'simple' | 'pages' | 'edges'
```

Pagination style variant.

### AggregateName

```typescript
type AggregateName = 'sum' | 'avg' | 'min' | 'max' | 'count'
```

Aggregate function names.

## Interfaces

### SortDescriptor

```typescript
interface SortDescriptor {
  field: string
  dir: 'asc' | 'desc'
}
```

Sort configuration for a column.

**Example:**
```typescript
const sort: SortDescriptor[] = [
  { field: 'name', dir: 'asc' },
  { field: 'price', dir: 'desc' }
]
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

Filter configuration. Supports nested filters with `logic` and `filters` properties.

**Example:**
```typescript
const filter: FilterDescriptor[] = [
  {
    field: 'category',
    operator: 'eq',
    value: 'Electronics'
  },
  {
    logic: 'and',
    filters: [
      { field: 'price', operator: 'gte', value: 100 },
      { field: 'price', operator: 'lte', value: 1000 }
    ]
  }
]
```

### GroupDescriptor

```typescript
interface GroupDescriptor {
  field: string
  dir?: 'asc' | 'desc'
}
```

Group configuration.

**Example:**
```typescript
const group: GroupDescriptor[] = [
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'desc' }
]
```

### ColumnTemplateContext

```typescript
interface ColumnTemplateContext&lt;T = Row&gt; {
  column: ColumnDef&lt;T&gt;
  row: T
  value: any
  rowIndex: number
  columnIndex: number
}
```

Context passed to column template functions.

### ColumnTemplateFn

```typescript
type ColumnTemplateResult = VNodeChild | string | null | undefined
type ColumnTemplateFn&lt;T = Row&gt; = (ctx?: ColumnTemplateContext&lt;T&gt;) => ColumnTemplateResult
```

Template function type.

### GridOptions

```typescript
interface GridOptions {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  page?: number
  pageSize?: number
  order?: number[]
  widths?: (number | undefined)[]
  selectedKeys?: any[]
}
```

Grid state options returned by `getOptions()` and accepted by `setOptions()`.

### DataProviderArgs

```typescript
interface DataProviderArgs {
  page: number
  pageSize: number
  sort: SortDescriptor[]
  filter: FilterDescriptor[]
  signal?: AbortSignal
}
```

Arguments passed to data provider function.

### DataProviderResult

```typescript
interface DataProviderResult&lt;T = Row&gt; {
  rows: T[]
  total?: number
}
```

Result returned by data provider function.

### ImageColumnOptions

```typescript
interface ImageColumnOptions {
  shape?: 'round' | 'square' | 'rounded'  // Image shape: round (circle), square, or rounded (rounded corners)
  size?: number | string  // Image size (width/height in pixels or CSS value)
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'  // CSS object-fit property
  placeholder?: string  // Placeholder image URL or base64
  loading?: 'lazy' | 'eager'  // Image loading strategy
  errorPlaceholder?: string  // Image to show on error
  endpoint?: string | ((row: Row) => string)  // API endpoint prefix or function to get full URL
  alt?: string | ((row: Row) => string)  // Alt text for image
  rowHeight?: number | string  // Optional row height when this image column is present (in pixels or CSS value)
}
```

Configuration options for image columns. Used with the `image` property in `ColumnDef`.

**Example:**
```typescript
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      rowHeight: 70,  // Increase row height to 70px
      placeholder: 'https://via.placeholder.com/50',
      alt: (row) => `${row.name} avatar`
    }
  }
]
```

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

Configuration for styling individual cells. Used with the `cellStyles` prop in `GridProps`.

**Example:**
```typescript
const cellStyles: CellStyleConfig[] = [
  {
    field: 'status',
    condition: (row, value) => value === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 600
  },
  {
    rowIndex: 1,
    columnIndex: 2,
    backgroundColor: '#dc2626',
    color: 'white'
  }
]
```

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

Configuration for styling entire rows. Used with the `rowStyles` prop in `GridProps`.

**Example:**
```typescript
const rowStyles: RowStyleConfig[] = [
  {
    condition: (row) => row.status === 'Inactive',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  {
    rowIndices: [0, 2, 4],
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  }
]
```

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

Configuration for styling entire columns. Used with the `columnStyles` prop in `GridProps`.

**Example:**
```typescript
const columnStyles: ColumnStyleConfig[] = [
  {
    field: 'status',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    headerBackgroundColor: '#dc2626',
    headerColor: 'white',
    fontWeight: 600
  }
]
```

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

Configuration for grid-wide styling. Used with the `gridStyles` prop in `GridProps`.

**Example:**
```typescript
const gridStyles: GridStyleConfig = {
  noBorders: false,
  borderColor: '#e5e7eb',
  borderWidth: '1px',
  headerBackground: '#f3f4f6',
  headerColor: '#111827',
  rowBackground: '#ffffff',
  rowHoverBackground: '#f0f9ff',
  cellHoverBackground: '#fef3c7',
  stripedBackground: '#f9fafb',
  cellPadding: '0.75rem 1rem'
}
```

### DataProvider

```typescript
type DataProvider&lt;T = Row&gt; = (args: DataProviderArgs) => Promise&lt;DataProviderResult&lt;T&gt;&gt;
```

Data provider function type.

## Filter Operators

Available filter operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `contains` | Contains text | `{ operator: 'contains', value: 'test' }` |
| `eq` | Equals | `{ operator: 'eq', value: 100 }` |
| `neq` | Not equals | `{ operator: 'neq', value: 100 }` |
| `gt` | Greater than | `{ operator: 'gt', value: 100 }` |
| `gte` | Greater than or equal | `{ operator: 'gte', value: 100 }` |
| `lt` | Less than | `{ operator: 'lt', value: 100 }` |
| `lte` | Less than or equal | `{ operator: 'lte', value: 100 }` |
| `startswith` | Starts with | `{ operator: 'startswith', value: 'A' }` |
| `endswith` | Ends with | `{ operator: 'endswith', value: 'Z' }` |
| `isnull` | Is null | `{ operator: 'isnull', value: null }` |
| `isnotnull` | Is not null | `{ operator: 'isnotnull', value: null }` |
| `isempty` | Is empty | `{ operator: 'isempty', value: '' }` |
| `isnotempty` | Is not empty | `{ operator: 'isnotempty', value: '' }` |

## Type Utilities

### Partial&lt;Messages&gt;

All message properties are optional when using the `messages` prop:

```typescript
const customMessages: Partial&lt;Messages&gt; = {
  create: 'Add New',
  save: 'Save All'
}
```

### ColumnDef&lt;T&gt;

Generic column definition with row type:

```typescript
interface Product {
  id: number
  name: string
  price: number
}

const columns: ColumnDef&lt;Product&gt;[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' }
]
```

## See Also

- [PantanalGrid API](/api/grid) - Component reference
- [ColumnDef API](/api/column-def) - Column definition
- [GridProps API](/api/grid-props) - All props interface
- [Messages API](/api/messages) - Messages interface



