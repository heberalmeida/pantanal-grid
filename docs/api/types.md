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
interface ColumnTemplateContext<T = Row> {
  column: ColumnDef<T>
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
type ColumnTemplateFn<T = Row> = (ctx?: ColumnTemplateContext<T>) => ColumnTemplateResult
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
interface DataProviderResult<T = Row> {
  rows: T[]
  total?: number
}
```

Result returned by data provider function.

### DataProvider

```typescript
type DataProvider<T = Row> = (args: DataProviderArgs) => Promise<DataProviderResult<T>>
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

### Partial<Messages>

All message properties are optional when using the `messages` prop:

```typescript
const customMessages: Partial<Messages> = {
  create: 'Add New',
  save: 'Save All'
}
```

### ColumnDef<T>

Generic column definition with row type:

```typescript
interface Product {
  id: number
  name: string
  price: number
}

const columns: ColumnDef<Product>[] = [
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



