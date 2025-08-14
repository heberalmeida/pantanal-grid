
export type Row = Record<string, unknown>

export type SortDir = 'asc' | 'desc'
export interface SortDescriptor { field: string; dir: SortDir }

export type SelectionMode = 'single' | 'multiple' | false

export interface FilterDescriptor {
  field: string
  operator: 'contains' | 'eq' | 'neq' | 'gt' | 'lt'
  value: unknown
}

export type Locale = 'pt' | 'en' | 'es'

export interface Messages {
  total: string
  page: string
  rowsPerPage: string
  previous: string
  next: string
  filterPlaceholder: string
  selectAll: string
  expandAll: string
  collapseAll: string
  subtotal: string
}

export interface ColumnDef<T = Row> {
  field: keyof T | string
  title?: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  editable?: boolean
  resizable?: boolean
  reorderable?: boolean
  format?: (value: any, row: T) => string
  cell?: (ctx: { value: any; row: T; rowIndex: number }) => any
  pinned?: boolean | 'left' | 'right'
}

export type PaginationVariant = 'simple' | 'pages' | 'edges'

export type ResponsiveMode = 'auto' | 'table' | 'cards'

export interface GridProps<T = Row> {
  rows: T[]
  columns: ColumnDef<T>[]
  keyField?: keyof T | string
  rtl?: boolean
  density?: 'default' | 'compact'

  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  page?: number
  pageSize?: number
  selectable?: SelectionMode

  striped?: boolean

  locale?: Locale
  messages?: Partial<Messages>

  persistStateKey?: string

  virtual?: boolean
  height?: number
  rowHeight?: number

  enableColumnResize?: boolean
  enableColumnReorder?: boolean

  serverSide?: boolean
  total?: number

  group?: GroupDescriptor[]
  aggregates?: Record<string, AggregateName[]>
  showGroupFooters?: boolean

  responsive?: ResponsiveMode          
  cardBreakpoint?: number              
  showFiltersInCards?: boolean         

  showFooter?: boolean                 
  paginationVariant?: PaginationVariant   
  paginationShowText?: boolean            
  paginationShowIcons?: boolean           
  paginationShowTotal?: boolean           
  paginationMaxPages?: number   
  
  showFilterRow?: boolean

  pinnedShadows?: boolean
}

export interface GridEmits {
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'selectionChange', value: unknown[]): void
  (e: 'rowClick', value: unknown): void
  (e: 'editCommit', value: { row: unknown; field: string; value: unknown }): void
  (e: 'columnResize', value: { field: string; width: number }): void
  (e: 'columnReorder', value: { from: number; to: number }): void
  (e: 'toggleGroup', key: string, open: boolean): void
}

export type AggregateName = 'sum' | 'avg' | 'min' | 'max' | 'count'

export interface GroupDescriptor { field: string; dir?: 'asc' | 'desc' }
