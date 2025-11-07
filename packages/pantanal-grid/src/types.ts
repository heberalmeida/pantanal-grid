
export type Row = Record<string, unknown>

export type SortDir = 'asc' | 'desc'
export interface SortDescriptor { field: string; dir: SortDir }

export type SelectionMode = 'single' | 'multiple' | false

export interface FilterDescriptor {
  field: string
  operator: 'contains' | 'eq' | 'neq' | 'gt' | 'lt'
  value: unknown
}

export type Locale = 'pt' | 'en' | 'es' | (string & {})

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

import type { VNodeChild } from 'vue'

export interface ColumnTemplateContext<T = Row> {
  column: ColumnDef<T>
  row: T
  value: any
  rowIndex: number
  columnIndex: number
}

export type ColumnTemplateResult = VNodeChild | string | null | undefined
export type ColumnTemplateFn<T = Row> = (ctx?: ColumnTemplateContext<T>) => ColumnTemplateResult

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
  locked?: boolean | 'left' | 'right'
  slot?: string
  template?: ColumnTemplateFn<T>
}

export type PaginationVariant = 'simple' | 'pages' | 'edges'

export type ResponsiveMode = 'auto' | 'table' | 'cards'

export interface GridProps<T = Row> {
  rows: T[]
  columns?: ColumnDef<T>[]
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
  autoHeight?: boolean
  maxBodyHeight?: number

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

  dataProvider?: DataProvider<T>
  autoBind?: boolean
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
  (e: 'loading', value: boolean): void
}

export type AggregateName = 'sum' | 'avg' | 'min' | 'max' | 'count'

export interface GroupDescriptor { field: string; dir?: 'asc' | 'desc' }

export interface DataProviderArgs {
  page: number
  pageSize: number
  sort: SortDescriptor[]
  filter: FilterDescriptor[]
  signal?: AbortSignal
}

export interface DataProviderResult<T = Row> {
  rows: T[]
  total?: number
}

export type DataProvider<T = Row> = (args: DataProviderArgs) => Promise<DataProviderResult<T>>

// DataSource Types
export interface DataSourceTransport {
  read?: string | ((options: DataSourceTransportOptions) => Promise<any>)
  create?: string | ((options: DataSourceTransportOptions) => Promise<any>)
  update?: string | ((options: DataSourceTransportOptions) => Promise<any>)
  destroy?: string | ((options: DataSourceTransportOptions) => Promise<any>)
  parameterMap?: (data: any, type: 'read' | 'create' | 'update' | 'destroy') => any
}

export interface DataSourceTransportOptions {
  data?: any
  type?: string
  url?: string
}

export interface DataSourceSchema {
  data?: string | ((response: any) => any[])
  total?: string | ((response: any) => number)
  errors?: string | ((response: any) => any)
  parse?: (response: any) => any
}

export interface DataSourceProps<T = Row> {
  data?: T[]
  transport?: DataSourceTransport
  schema?: DataSourceSchema
  type?: 'local' | 'remote'
  page?: number
  pageSize?: number
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  group?: GroupDescriptor[]
  serverPaging?: boolean
  serverFiltering?: boolean
  serverSorting?: boolean
  serverGrouping?: boolean
  autoSync?: boolean
  batch?: boolean
}

export interface DataSourceEmits {
  (e: 'change', value: any[]): void
  (e: 'error', error: any): void
  (e: 'requestStart', options: any): void
  (e: 'requestEnd', options: any): void
  (e: 'sync', options: any): void
  (e: 'update:data', value: any[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'update:group', value: GroupDescriptor[]): void
}

export interface DataSourceInstance {
  data(): any[]
  total(): number
  read(): Promise<void>
  sync(): Promise<void>
  query(options?: { page?: number; pageSize?: number; sort?: SortDescriptor[]; filter?: FilterDescriptor[]; group?: GroupDescriptor[] }): void
}

// GanttDataSource Types
export interface GanttTask {
  id: number | string
  parentId?: number | string | null
  orderId?: number
  start: Date | string
  end: Date | string
  title: string
  percentComplete?: number
  summary?: boolean
  expanded?: boolean
  [key: string]: any
}

export interface GanttTaskFieldConfig {
  from?: string
  type?: 'string' | 'number' | 'boolean' | 'date'
  defaultValue?: any
  validation?: {
    required?: boolean
    min?: number
    max?: number
  }
  parse?: (value: any) => any
}

export interface GanttDataSourceSchemaModel {
  id?: GanttTaskFieldConfig | string
  parentId?: GanttTaskFieldConfig | string
  orderId?: GanttTaskFieldConfig | string
  start?: GanttTaskFieldConfig | string
  end?: GanttTaskFieldConfig | string
  title?: GanttTaskFieldConfig | string
  percentComplete?: GanttTaskFieldConfig | string
  summary?: GanttTaskFieldConfig | string
  expanded?: GanttTaskFieldConfig | string
  [key: string]: GanttTaskFieldConfig | string | undefined
}

export interface GanttDataSourceSchema extends DataSourceSchema {
  model?: {
    id?: string | GanttTaskFieldConfig
    fields?: GanttDataSourceSchemaModel
  }
}

export interface GanttDataSourceProps<T extends GanttTask = GanttTask> extends Omit<DataSourceProps<T>, 'schema'> {
  schema?: GanttDataSourceSchema
}

export interface GanttDataSourceInstance extends DataSourceInstance {
  tasks(): GanttTask[]
  add(task: Partial<GanttTask>): void
  remove(task: GanttTask | number | string): void
  update(task: GanttTask): void
}

// GanttDependencyDataSource Types
export interface GanttDependency {
  id: number | string
  predecessorId: number | string
  successorId: number | string
  type?: number
  [key: string]: any
}

export interface GanttDependencyDataSourceSchemaModel {
  id?: GanttTaskFieldConfig | string
  predecessorId?: GanttTaskFieldConfig | string
  successorId?: GanttTaskFieldConfig | string
  type?: GanttTaskFieldConfig | string
  [key: string]: GanttTaskFieldConfig | string | undefined
}

export interface GanttDependencyDataSourceSchema extends DataSourceSchema {
  model?: {
    id?: string | GanttTaskFieldConfig
    fields?: GanttDependencyDataSourceSchemaModel
  }
}

export interface GanttDependencyDataSourceProps<T extends GanttDependency = GanttDependency> extends Omit<DataSourceProps<T>, 'schema'> {
  schema?: GanttDependencyDataSourceSchema
}

export interface GanttDependencyDataSourceInstance extends DataSourceInstance {
  dependencies(): GanttDependency[]
  add(dependency: Partial<GanttDependency>): void
  remove(dependency: GanttDependency | number | string): void
  update(dependency: GanttDependency): void
}
