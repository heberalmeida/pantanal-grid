# ColumnDef API Reference

Complete reference for the `ColumnDef` interface used to configure grid columns.

## Interface

```typescript
interface ColumnDef<T = Row> {
  // Basic properties
  field?: keyof T | string
  title?: string
  width?: number | string
  
  // Features
  sortable?: boolean
  filterable?: boolean
  editable?: boolean | ((row: T) => boolean)
  resizable?: boolean
  reorderable?: boolean
  
  // Formatting
  format?: string | ((value: any, row: T) => string)
  type?: 'string' | 'number' | 'boolean' | 'date'
  encoded?: boolean  // HTML encode (default: true)
  
  // Templates
  template?: ColumnTemplateFn<T>
  cell?: (ctx: { value: any; row: T; rowIndex: number }) => any
  headerTemplate?: string | ((column: ColumnDef<T>) => string)
  footerTemplate?: string | ((aggregates: Record<string, any>) => string)
  groupHeaderTemplate?: string | ((group: GroupInfo) => string)
  groupHeaderColumnTemplate?: string | ((group: GroupInfo, column: ColumnDef<T>) => string)
  groupFooterTemplate?: string | ((group: GroupInfo) => string)
  
  // Editor
  editor?: (container: HTMLElement, options: { field: string; value: any; row: T }) => void | HTMLElement
  
  // Validation
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: RegExp | string
    validator?: (value: any, row: T) => boolean | string
    [key: string]: any
  }
  
  // Positioning
  pinned?: boolean | 'left' | 'right'
  locked?: boolean | 'left' | 'right'
  lockable?: boolean
  
  // Visibility
  hidden?: boolean
  media?: string  // Media query string
  minScreenWidth?: number
  
  // Sorting
  sortableAllowUnsort?: boolean
  sortableCompare?: (a: any, b: any, descending?: boolean) => number
  sortableInitialDirection?: 'asc' | 'desc'
  
  // Grouping
  groupable?: boolean
  groupableSortCompare?: (a: any, b: any) => number
  groupableSortDir?: 'asc' | 'desc'
  
  // Aggregates
  aggregates?: AggregateName[]
  
  // Filtering
  filterableMode?: 'row' | 'menu' | false
  filterableMulti?: boolean
  filterableExtra?: boolean
  filterableOperator?: FilterDescriptor['operator']
  filterableDefaultOperator?: FilterDescriptor['operator']
  filterableDataSource?: any[] | (() => any[])
  filterableSearch?: boolean
  filterableCheckAll?: boolean
  filterableItemTemplate?: (item: any, field: string) => string | VNode
  filterableUI?: 'textbox' | 'numeric' | 'date' | 'boolean' | 'dropdown' | Function
  filterableOperators?: Record<string, Record<string, string>>
  filterableOptions?: Array<{ value: any; label: string }> | (() => Array<{ value: any; label: string }>)
  filterableIgnoreCase?: boolean
  filterableCellDelay?: number
  filterableCellMinLength?: number
  filterableCellOperator?: string
  filterableCellShowOperators?: boolean
  filterableCellDataSource?: any[] | (() => any[]) | Record<string, any>
  filterableCellDataTextField?: string
  filterableCellInputWidth?: number
  filterableCellSuggestionOperator?: 'startswith' | 'endswith' | 'contains'
  filterableCellEnabled?: boolean
  filterableCellTemplate?: (element: HTMLElement, options: { field: string; dataSource: any }) => void
  
  // Commands
  command?: ('edit' | 'destroy' | 'save' | 'cancel')[] | CommandDef[] | CommandDef
  
  // Column groups
  columns?: ColumnDef<T>[]
  
  // Attributes
  attributes?: Record<string, string | number | boolean>
  headerAttributes?: Record<string, string | number | boolean>
  footerAttributes?: Record<string, string | number | boolean>
  
  // Other
  slot?: string
  selectable?: boolean
  values?: Array<{ text: string; value: any }>
  menu?: boolean
  minResizableWidth?: number
}
```

## Properties

### Basic Properties

#### `field`

Field name from row data.

```typescript
field?: keyof T | string
```

**Example:**
```typescript
{ field: 'name' }
{ field: 'product.price' }  // Nested field
```

#### `title`

Column header title.

```typescript
title?: string
```

**Example:**
```typescript
{ field: 'name', title: 'Product Name' }
```

#### `width`

Column width in pixels or CSS value.

```typescript
width?: number | string
```

**Example:**
```typescript
{ field: 'id', width: 80 }
{ field: 'name', width: '200px' }
{ field: 'description' }  // Flexible width
```

### Feature Properties

#### `sortable`

Enable sorting for this column.

```typescript
sortable?: boolean
```

**Example:**
```typescript
{ field: 'price', sortable: true }
```

#### `filterable`

Enable filtering for this column.

```typescript
filterable?: boolean
```

**Example:**
```typescript
{ field: 'category', filterable: true }
```

#### `editable`

Enable editing for this column.

```typescript
editable?: boolean | ((row: T) => boolean)
```

**Example:**
```typescript
{ field: 'name', editable: true }
{ field: 'price', editable: (row) => row.status === 'active' }
```

#### `resizable`

Allow column resizing.

```typescript
resizable?: boolean
```

**Default:** `true`

#### `reorderable`

Allow column reordering.

```typescript
reorderable?: boolean
```

**Default:** `true`

### Formatting Properties

#### `format`

Format function or format string.

```typescript
format?: string | ((value: any, row: T) => string)
```

**Example:**
```typescript
{ field: 'price', format: (v) => `$${v.toFixed(2)}` }
{ field: 'date', format: 'date' }
```

#### `type`

Column data type.

```typescript
type?: 'string' | 'number' | 'boolean' | 'date'
```

**Example:**
```typescript
{ field: 'price', type: 'number' }
{ field: 'createdAt', type: 'date' }
```

#### `encoded`

HTML encode column value.

```typescript
encoded?: boolean
```

**Default:** `true`

### Template Properties

#### `template`

Custom cell template function.

```typescript
template?: ColumnTemplateFn<T>
```

**Example:**
```typescript
{
  field: 'status',
  template: ({ value }) => {
    return h('span', {
      class: value === 'active' ? 'text-green-500' : 'text-red-500'
    }, value)
  }
}
```

#### `cell`

Custom cell renderer.

```typescript
cell?: (ctx: { value: any; row: T; rowIndex: number }) => any
```

**Example:**
```typescript
{
  field: 'rating',
  cell: ({ value }) => '⭐'.repeat(Math.floor(value))
}
```

#### `headerTemplate`

Custom header template.

```typescript
headerTemplate?: string | ((column: ColumnDef<T>) => string)
```

**Example:**
```typescript
{
  field: 'name',
  headerTemplate: (col) => `<strong>${col.title}</strong>`
}
```

#### `footerTemplate`

Custom footer template (for aggregates).

```typescript
footerTemplate?: string | ((aggregates: Record<string, any>) => string)
```

**Example:**
```typescript
{
  field: 'price',
  footerTemplate: (aggs) => `Total: $${aggs.price_sum?.toFixed(2)}`
}
```

### Positioning Properties

#### `pinned`

Pin column to left or right.

```typescript
pinned?: boolean | 'left' | 'right'
```

**Example:**
```typescript
{ field: 'id', pinned: 'left' }
{ field: 'actions', pinned: 'right' }
```

#### `locked`

Lock column position.

```typescript
locked?: boolean | 'left' | 'right'
```

**Example:**
```typescript
{ field: 'id', locked: 'left' }
```

#### `lockable`

Allow locking/unlocking.

```typescript
lockable?: boolean
```

**Default:** `true`

### Visibility Properties

#### `hidden`

Hide column.

```typescript
hidden?: boolean
```

**Example:**
```typescript
{ field: 'internal', hidden: true }
```

#### `media`

Media query for responsive visibility.

```typescript
media?: string
```

**Example:**
```typescript
{ field: 'description', media: '(min-width: 768px)' }
```

#### `minScreenWidth`

Hide column below this width.

```typescript
minScreenWidth?: number
```

**Example:**
```typescript
{ field: 'description', minScreenWidth: 768 }
```

### Sorting Properties

#### `sortableCompare`

Custom sort function.

```typescript
sortableCompare?: (a: any, b: any, descending?: boolean) => number
```

**Example:**
```typescript
{
  field: 'name',
  sortableCompare: (a, b, desc) => {
    const result = a.localeCompare(b)
    return desc ? -result : result
  }
}
```

#### `sortableInitialDirection`

Initial sort direction.

```typescript
sortableInitialDirection?: 'asc' | 'desc'
```

**Example:**
```typescript
{ field: 'price', sortableInitialDirection: 'desc' }
```

#### `sortableAllowUnsort`

Allow unsorting this column.

```typescript
sortableAllowUnsort?: boolean
```

**Default:** Inherits from grid prop

### Grouping Properties

#### `groupable`

Allow grouping by this column.

```typescript
groupable?: boolean
```

**Default:** `true`

#### `groupableSortCompare`

Custom group sort function.

```typescript
groupableSortCompare?: (a: any, b: any) => number
```

#### `groupableSortDir`

Group sort direction.

```typescript
groupableSortDir?: 'asc' | 'desc'
```

### Filtering Properties

#### `filterableMode`

Filter UI mode.

```typescript
filterableMode?: 'row' | 'menu' | false
```

**Example:**
```typescript
{ field: 'category', filterableMode: 'menu' }
```

#### `filterableUI`

Filter input type.

```typescript
filterableUI?: 'textbox' | 'numeric' | 'date' | 'boolean' | 'dropdown' | Function
```

**Example:**
```typescript
{ field: 'category', filterableUI: 'dropdown' }
{ field: 'active', filterableUI: 'boolean' }
```

#### `filterableOptions`

Options for dropdown filter.

```typescript
filterableOptions?: Array<{ value: any; label: string }> | (() => Array<{ value: any; label: string }>)
```

**Example:**
```typescript
{
  field: 'status',
  filterableUI: 'dropdown',
  filterableOptions: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]
}
```

#### `filterableOperator`

Default filter operator.

```typescript
filterableOperator?: FilterDescriptor['operator']
```

**Example:**
```typescript
{ field: 'name', filterableOperator: 'startswith' }
```

#### `filterableMulti`

Allow multiple filter criteria.

```typescript
filterableMulti?: boolean
```

#### `filterableExtra`

Allow second filter criterion.

```typescript
filterableExtra?: boolean
```

#### `filterableIgnoreCase`

Case-insensitive filtering.

```typescript
filterableIgnoreCase?: boolean
```

### Command Properties

#### `command`

Command buttons configuration.

```typescript
command?: ('edit' | 'destroy' | 'save' | 'cancel')[] | CommandDef[] | CommandDef
```

**Example:**
```typescript
// Simple
{ field: 'command', command: ['edit', 'destroy'] }

// Custom
{
  field: 'command',
  command: {
    name: 'custom',
    text: 'Custom Action',
    click: (e, row) => console.log(row)
  }
}
```

### Column Groups

#### `columns`

Nested columns for multi-level headers.

```typescript
columns?: ColumnDef<T>[]
```

**Example:**
```typescript
{
  title: 'Product Info',
  columns: [
    { field: 'name', title: 'Name' },
    { field: 'price', title: 'Price' }
  ]
}
```

### Aggregates

#### `aggregates`

Aggregate functions for this column.

```typescript
aggregates?: AggregateName[]
```

**Example:**
```typescript
{ field: 'price', aggregates: ['sum', 'avg'] }
```

### Validation

#### `validation`

Validation rules.

```typescript
validation?: {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp | string
  validator?: (value: any, row: T) => boolean | string
  [key: string]: any
}
```

**Example:**
```typescript
{
  field: 'price',
  validation: {
    required: true,
    min: 0,
    max: 10000,
    validator: (value) => {
      if (value < 0) return 'Price cannot be negative'
      return true
    }
  }
}
```

### Editor

#### `editor`

Custom editor function.

```typescript
editor?: (container: HTMLElement, options: { field: string; value: any; row: T }) => void | HTMLElement
```

**Example:**
```typescript
{
  field: 'category',
  editor: (container, options) => {
    const select = document.createElement('select')
    select.innerHTML = '<option>Electronics</option><option>Clothing</option>'
    select.value = options.value || ''
    container.appendChild(select)
    return select
  }
}
```

### Attributes

#### `attributes`

HTML attributes for cells.

```typescript
attributes?: Record<string, string | number | boolean>
```

**Example:**
```typescript
{ field: 'email', attributes: { 'data-type': 'email' } }
```

#### `headerAttributes`

HTML attributes for header.

```typescript
headerAttributes?: Record<string, string | number | boolean>
```

#### `footerAttributes`

HTML attributes for footer.

```typescript
footerAttributes?: Record<string, string | number | boolean>
```

### Other Properties

#### `slot`

Slot name for custom rendering.

```typescript
slot?: string
```

#### `selectable`

Make this a selectable checkbox column.

```typescript
selectable?: boolean
```

#### `values`

Value mapping (for enum-like fields).

```typescript
values?: Array<{ text: string; value: any }>
```

**Example:**
```typescript
{
  field: 'status',
  values: [
    { text: 'Active', value: 1 },
    { text: 'Inactive', value: 0 }
  ]
}
```

#### `menu`

Show in column menu.

```typescript
menu?: boolean
```

**Default:** `true`

#### `minResizableWidth`

Minimum width for resizing.

```typescript
minResizableWidth?: number
```

## Complete Example

```typescript
const columns: ColumnDef[] = [
  {
    field: 'id',
    title: 'ID',
    width: 80,
    pinned: 'left',
    locked: 'left',
    sortable: true,
    filterable: true
  },
  {
    field: 'name',
    title: 'Product Name',
    width: 200,
    sortable: true,
    filterable: true,
    editable: true,
    validation: {
      required: true
    }
  },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    type: 'number',
    sortable: true,
    filterable: true,
    editable: true,
    format: (v) => `$${v.toFixed(2)}`,
    aggregates: ['sum', 'avg'],
    validation: {
      required: true,
      min: 0
    }
  },
  {
    field: 'status',
    title: 'Status',
    filterable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    template: ({ value }) => {
      const color = value === 'active' ? 'green' : 'red'
      return `<span style="color: ${color}">${value}</span>`
    }
  },
  {
    field: 'command',
    title: 'Actions',
    width: 150,
    command: ['edit', 'destroy']
  }
]
```

## See Also

- [PantanalGrid API](/api/grid) - Main component reference
- [GridProps API](/api/grid-props) - All props interface
- [Column Management Guide](/guide/column-management) - Usage guide
