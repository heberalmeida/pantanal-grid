export type Row = Record<string, unknown>

export type SortDir = 'asc' | 'desc'
export interface SortDescriptor { field: string; dir: SortDir }

export type SelectionMode = 'single' | 'multiple' | false

export interface FilterDescriptor {
  field: string
  operator: 'contains' | 'eq' | 'neq' | 'gt' | 'lt'
  value: unknown
}

export interface ColumnDef<T = Row> {
  field: keyof T | string
  title?: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  editable?: boolean
  format?: (value: any, row: T) => string
  cell?: (ctx: { value: any; row: T; rowIndex: number }) => any
}

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
}

export interface GridEmits {
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'selectionChange', value: unknown[]): void
  (e: 'rowClick', value: unknown): void
  (e: 'editCommit', value: { row: unknown; field: string; value: unknown }): void
}
