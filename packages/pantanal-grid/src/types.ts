
import type { VNode, VNodeChild } from 'vue'

export type Row = Record<string, unknown>

export type SortDir = 'asc' | 'desc'
export interface SortDescriptor { field: string; dir: SortDir }

export type SelectionMode = 'single' | 'multiple' | false

export interface FilterDescriptor {
  field: string
  operator: 'contains' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'startswith' | 'endswith' | 'isnull' | 'isnotnull' | 'isempty' | 'isnotempty'
  value: unknown
  logic?: 'and' | 'or'
  filters?: FilterDescriptor[]
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
  create: string
  save: string
  cancel: string
  edit: string
  destroy: string
  delete: string
  update?: string
  cancelEdit?: string
  filterAll: string
  filterTrue: string
  filterFalse: string
  sortBy?: string
  sortAsc?: string
  sortDesc?: string
  sortNone?: string
  columnMenuColumns?: string
  columnMenuFilter?: string
  columnMenuSortAscending?: string
  columnMenuSortDescending?: string
  columnMenuSettings?: string
  columnMenuDone?: string
  columnMenuLock?: string
  columnMenuUnlock?: string
  confirmDelete?: string
  cancelDelete?: string
  confirmDeleteTitle?: string
  excel?: string
  pdf?: string
  csv?: string
  docx?: string
  expandCollapseColumnHeader?: string
  filterableMessagesAnd?: string
  filterableMessagesOr?: string
  filterableMessagesClear?: string
  filterableMessagesFilter?: string
  filterableMessagesInfo?: string
  filterableMessagesTitle?: string
  filterableMessagesIsTrue?: string
  filterableMessagesIsFalse?: string
  filterableMessagesSearch?: string
  filterableMessagesSelectValue?: string
  filterableMessagesCancel?: string
  filterableMessagesSelectedItemsFormat?: string
  filterableMessagesOperator?: string
  filterableMessagesValue?: string
  filterableMessagesCheckAll?: string
  noRecords?: string
  invalidValue?: string
  // Pageable messages
  pageableDisplay?: string
  pageableEmpty?: string
  pageablePage?: string
  pageableOf?: string
  pageableItemsPerPage?: string
  pageableFirst?: string
  pageableLast?: string
  pageableNext?: string
  pageablePrevious?: string
  pageableRefresh?: string
  pageableMorePages?: string
  pageableCustom?: string
  pageableCancel?: string
  // Aggregate labels
  aggregateSum?: string
  aggregateAvg?: string
  aggregateMin?: string
  aggregateMax?: string
  aggregateCount?: string
  // Groupable messages
  groupableDropZonePlaceholder?: string
}

export interface ColumnTemplateContext<T = Row> {
  column: ColumnDef<T>
  row: T
  value: any
  rowIndex: number
  columnIndex: number
}

export type ColumnTemplateResult = VNodeChild | string | null | undefined
export type ColumnTemplateFn<T = Row> = (ctx?: ColumnTemplateContext<T>) => ColumnTemplateResult

export interface ImageColumnOptions {
  shape?: 'round' | 'square' | 'rounded'  // Image shape: round (circle), square, or rounded (rounded corners)
  size?: number | string  // Image size (width/height in pixels or CSS value)
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'  // CSS object-fit property
  placeholder?: string  // Placeholder image URL or base64
  loading?: 'lazy' | 'eager'  // Image loading strategy
  errorPlaceholder?: string  // Image to show on error
  endpoint?: string | ((row: Row) => string)  // API endpoint prefix or function to get full URL
  alt?: string | ((row: Row) => string)  // Alt text for image
}

export interface ColumnDef<T = Row> {
  field?: keyof T | string  // Made optional for group columns
  title?: string
  width?: number | string
  sortable?: boolean
  filterable?: boolean
  editable?: boolean | ((row: T) => boolean)
  resizable?: boolean
  reorderable?: boolean
  format?: string | ((value: any, row: T) => string)  // Support both string format and function
  cell?: (ctx: { value: any; row: T; rowIndex: number }) => any
  pinned?: boolean | 'left' | 'right'
  locked?: boolean | 'left' | 'right'
  lockable?: boolean  // If false, column cannot be locked/unlocked
  slot?: string
  template?: ColumnTemplateFn<T>
  image?: boolean | ImageColumnOptions  // Enable image rendering with options
  editor?: (container: HTMLElement, options: { field: string; value: any; row: T }) => void | HTMLElement
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: RegExp | string
    validator?: (value: any, row: T) => boolean | string
    [key: string]: any
  }
  command?: ('edit' | 'destroy' | 'save' | 'cancel')[] | Array<{
    name: string
    text?: string
    iconClass?: string
    className?: string
    template?: string | ((row: T) => string)
    click?: (e: MouseEvent, row: T) => void
    visible?: (row: T) => boolean
    // Specific text for edit command states
    textEdit?: string
    textUpdate?: string
    textCancel?: string
    // Specific icon classes for edit command states
    iconClassEdit?: string
    iconClassUpdate?: string
    iconClassCancel?: string
  }> | {
    name?: string
    text?: string
    iconClass?: string
    className?: string
    template?: string | ((row: T) => string)
    click?: (e: MouseEvent, row: T) => void
    visible?: (row: T) => boolean
    // Specific text for edit command states
    textEdit?: string
    textUpdate?: string
    textCancel?: string
    // Specific icon classes for edit command states
    iconClassEdit?: string
    iconClassUpdate?: string
    iconClassCancel?: string
  }
  type?: 'string' | 'number' | 'boolean' | 'date'
  
  // Aggregates
  aggregates?: AggregateName[]
  
  // HTML attributes
  attributes?: Record<string, string | number | boolean>
  headerAttributes?: Record<string, string | number | boolean>
  footerAttributes?: Record<string, string | number | boolean>
  
  // Column groups (sub-columns)
  columns?: ColumnDef<T>[]
  
  // Encoding
  encoded?: boolean  // HTML encode column value (default: true)
  
  // Visibility
  hidden?: boolean
  media?: string  // Media query string (e.g., "(min-width: 768px)")
  minScreenWidth?: number  // Hide column below this width
  
  // Resizing
  minResizableWidth?: number  // Minimum width for resizing
  
  // Sorting options
  sortableAllowUnsort?: boolean
  sortableCompare?: (a: any, b: any, descending?: boolean) => number
  sortableInitialDirection?: 'asc' | 'desc'
  
  // Grouping options
  groupable?: boolean  // If false, column cannot be grouped
  groupableSortCompare?: (a: any, b: any) => number
  groupableSortDir?: 'asc' | 'desc'
  
  // Templates
  headerTemplate?: string | ((column: ColumnDef<T>) => string)
  footerTemplate?: string | ((aggregates: Record<string, any>) => string)
  groupHeaderTemplate?: string | ((group: { field: string; value: any; items: T[]; aggregates?: Record<string, any> }) => string)
  groupHeaderColumnTemplate?: string | ((group: { field: string; value: any; items: T[]; aggregates?: Record<string, any> }, column: ColumnDef<T>) => string)
  groupFooterTemplate?: string | ((group: { field: string; value: any; items: T[]; aggregates?: Record<string, any> }) => string)
  
  // Selectable column (checkbox column)
  selectable?: boolean
  
  // Values (enum/transform)
  values?: Array<{ text: string; value: any }>
  
  // Column menu
  menu?: boolean  // If false, column won't appear in column menu
  
  // Filtering options
  filterableMode?: 'row' | 'menu' | false
  filterableMulti?: boolean
  filterableExtra?: boolean  // Allow second filter criterion
  filterableOperator?: FilterDescriptor['operator']
  filterableDefaultOperator?: FilterDescriptor['operator']
  filterableDataSource?: any[] | (() => any[])
  filterableSearch?: boolean
  filterableCheckAll?: boolean
  filterableItemTemplate?: (item: any, field: string) => string | VNode
  filterableUI?: 'textbox' | 'numeric' | 'date' | 'boolean' | 'dropdown' | ((element: HTMLElement, options: { field: string; value: any }) => void)
  filterableOperators?: {
    string?: Record<string, string>
    number?: Record<string, string>
    date?: Record<string, string>
    boolean?: Record<string, string>
  }
  // Custom filter options for boolean/dropdown
  filterableOptions?: Array<{ value: any; label: string }> | (() => Array<{ value: any; label: string }>)
  filterableIgnoreCase?: boolean  // Case-insensitive filtering
  filterableCellDelay?: number  // Delay for AutoComplete in cell filter
  filterableCellMinLength?: number  // Min length for AutoComplete
  filterableCellOperator?: string  // Default operator for cell filter
  filterableCellShowOperators?: boolean  // Show operator dropdown in cell filter
  filterableCellDataSource?: any[] | (() => any[]) | Record<string, any>  // DataSource for AutoComplete
  filterableCellDataTextField?: string  // Text field for AutoComplete
  filterableCellInputWidth?: number  // Width of filter input
  filterableCellSuggestionOperator?: 'startswith' | 'endswith' | 'contains'  // Operator for AutoComplete
  filterableCellEnabled?: boolean  // Enable/disable cell filter widget
  filterableCellTemplate?: (element: HTMLElement, options: { field: string; dataSource: any }) => void  // Custom template for filter cell
}

export type PaginationVariant = 'simple' | 'pages' | 'edges'

export type ResponsiveMode = 'auto' | 'table' | 'cards'

export interface PaginationTemplateContext {
  page: number
  pageSize: number
  total: number
  totalPages: number
  firstItem: number
  lastItem: number
  canGoPrevious: boolean
  canGoNext: boolean
  canGoFirst: boolean
  canGoLast: boolean
  messages: Messages
}

export interface LoadingOptions {
  enabled?: boolean  // Show loading indicator
  template?: string | (() => string)  // Custom loading template
  text?: string  // Loading text
  spinner?: boolean  // Show spinner
  overlay?: boolean  // Show overlay
  position?: 'top' | 'center' | 'bottom'  // Loading position
}

export interface GridProps<T = Row> {
  rows?: T[]
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

  // Row templates
  rowTemplate?: string | ((row: T, rowIndex: number) => string)
  altRowTemplate?: string | ((row: T, rowIndex: number) => string)
  
  // Detail template (master-detail)
  detailTemplate?: string | ((row: T, rowIndex: number) => string)
  
  // No records message or template
  noRecords?: boolean | string | (() => string) | { template?: string | (() => string); message?: string } | false

  // Column resize handle width
  columnResizeHandleWidth?: number

  // Persist selection
  persistSelection?: boolean
  
  // Persistence options for filters and pagination
  persistFilters?: boolean | 'localStorage' | 'sessionStorage'  // Persist filters to storage
  persistFiltersKey?: string  // Storage key for filters (default: 'pantanal-grid-filters')
  persistPagination?: boolean | 'localStorage' | 'sessionStorage'  // Persist pagination to storage
  persistPaginationKey?: string  // Storage key for pagination (default: 'pantanal-grid-pagination')

  // Scrollable configuration
  scrollable?: boolean | {
    virtual?: boolean
    endless?: boolean
  }
  
  // Scrollable props (kebab-case compatible)
  scrollableVirtual?: boolean
  scrollableEndless?: boolean

  // String cleaning: automatically clean HTML entities and normalize quotes in string values
  cleanStrings?: boolean

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
  loading?: boolean | LoadingOptions  // Loading state and options

  group?: GroupDescriptor[]
  aggregates?: Record<string, AggregateName[]>
  showGroupFooters?: boolean
  groupable?: boolean  // Enable drag-and-drop grouping UI

  responsive?: ResponsiveMode
  cardBreakpoint?: number
  showFiltersInCards?: boolean

  showFooter?: boolean
  paginationVariant?: PaginationVariant
  paginationShowText?: boolean
  paginationShowIcons?: boolean
  paginationShowTotal?: boolean
  paginationMaxPages?: number
  pageable?: boolean
  pageableAlwaysVisible?: boolean
  pageablePageSizes?: number[] | boolean | (number | 'all')[]
  pageableCustomPageSize?: boolean  // Enable custom page size input (default: false)
  pageablePreviousNext?: boolean
  pageableNumeric?: boolean
  pageableButtonCount?: number
  pageableInput?: boolean
  pageableRefresh?: boolean
  pageableResponsive?: boolean
  pageableInfo?: boolean
  pageableSyncUrl?: boolean  // Sync page and pageSize with URL query parameters
  pageableUrlParamPage?: string  // URL parameter name for page (default: 'page')
  pageableUrlParamPageSize?: string  // URL parameter name for pageSize (default: 'pageSize')
  pageableTemplate?: string | ((context: PaginationTemplateContext) => string)  // Custom pagination template
  pageableSlots?: {
    before?: string  // Slot name for content before pagination
    after?: string  // Slot name for content after pagination
    info?: string  // Slot name for custom info display
    pageSize?: string  // Slot name for custom page size selector
    pageInput?: string  // Slot name for custom page input
    buttons?: string  // Slot name for custom page buttons
  }
  pageableMobileBreakpoint?: number  // Breakpoint for mobile pagination (default: 768)
  pageableMobileVariant?: PaginationVariant  // Variant to use on mobile

  showFilterRow?: boolean
  filterable?: boolean
  filterableMode?: 'row' | 'menu' | 'menu, row' | false
  hideHeader?: boolean  // Hide the table header row
  filterableExtra?: boolean
  filterableOperators?: {
    string?: Record<string, string>
    number?: Record<string, string>
    date?: Record<string, string>
    boolean?: Record<string, string>
    enums?: Record<string, string>
  }

  pinnedShadows?: boolean

  dataProvider?: DataProvider<T>
  autoBind?: boolean

  editable?: boolean | 'inline' | 'popup' | 'batch'
  toolbar?: ('create' | 'save' | 'cancel' | 'excel' | 'pdf' | 'csv' | 'docx')[] | string | (() => string)
  navigatable?: boolean

  sortable?: boolean
  sortableMode?: 'single' | 'multiple'
  sortableAllowUnsort?: boolean
  sortableShowIndexes?: boolean

  allowCopy?: boolean
  allowCopyDelimiter?: string

  columnMenu?: boolean
  columnMenuColumns?: boolean
  columnMenuFilterable?: boolean
  columnMenuSortable?: boolean

  editableConfirmation?: boolean | string | ((row: T) => string)
  editableCancelDelete?: string
  editableConfirmDelete?: string
  editableCreateAt?: 'top' | 'bottom'
  editableDestroy?: boolean
  editableMode?: 'incell' | 'inline' | 'popup'
  editableTemplate?: string | ((row: T) => string)
  editableUpdate?: boolean
  editableWindow?: Record<string, any>

  excelAllPages?: boolean
  excelFileName?: string
  excelFilterable?: boolean
  excelForceProxy?: boolean
  excelProxyUrl?: string

  // PDF Export
  pdfAllPages?: boolean
  pdfAvoidLinks?: boolean | string  // Boolean or CSS selector
  pdfPaperSize?: 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'B10' | 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'C10' | 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'Executive' | 'Folio' | 'auto' | string | [number, number] | [string, string]
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
  pdfTemplate?: string  // HTML template for headers/footers with pageNum and totalPages variables
  pdfForceProxy?: boolean
  pdfProxyUrl?: string
  pdfProxyTarget?: string  // Where to display the document (e.g., '_blank', '_self', iframe name)
}
export interface GridEmits {
  (e: 'update:sort', value: SortDescriptor[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:filter', value: FilterDescriptor[]): void
  (e: 'update:group', value: GroupDescriptor[]): void
  (e: 'selectionChange', value: unknown[]): void
  (e: 'rowClick', value: unknown): void
  (e: 'refresh'): void
  (e: 'editCommit', value: { row: unknown; field: string; value: unknown }): void
  (e: 'edit', value: { row: unknown; field?: string }): void
  (e: 'editCancel', value: { row: unknown }): void
  (e: 'editSave', value: { row: unknown }): void
  (e: 'create', value: { row: unknown }): void
  (e: 'destroy', value: { row: unknown }): void
  (e: 'save', value: { changes: Array<{ type: 'create' | 'update' | 'destroy'; row: unknown }> }): void
  (e: 'cancel', value: void): void
  (e: 'validationError', value: { row: unknown; field: string; error: string }): void
  (e: 'columnResize', value: { field: string; width: number }): void
  (e: 'columnReorder', value: { from: number; to: number }): void
  (e: 'toggleGroup', key: string, open: boolean): void
  (e: 'loading', value: boolean): void
  (e: 'error', error: unknown): void
  (e: 'databinding', options: { sort?: SortDescriptor[]; filter?: FilterDescriptor[]; group?: GroupDescriptor[]; page?: number; pageSize?: number }): void
  (e: 'databound', data: unknown[]): void
  (e: 'sort', options: { sort: SortDescriptor[] }): void
  (e: 'filter', options: { filter: FilterDescriptor[] }): void
  (e: 'group', options: { groups: GroupDescriptor[] }): void
  (e: 'groupexpand', options: { group: { field: string; value: unknown; aggregates?: Record<string, any> } }): void
  (e: 'groupcollapse', options: { group: { field: string; value: unknown; aggregates?: Record<string, any> } }): void
  (e: 'columnhide', options: { column: ColumnDef; field: string }): void
  (e: 'columnshow', options: { column: ColumnDef; field: string }): void
  (e: 'columnlock', options: { column: ColumnDef; field: string }): void
  (e: 'columnunlock', options: { column: ColumnDef; field: string }): void
  (e: 'columnmenuinit', options: { column: ColumnDef; field: string; container: HTMLElement }): void
  (e: 'columnmenuopen', options: { column: ColumnDef; field: string }): void
  (e: 'pdfExport', options: { fileName: string }): void
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
  page?: number
  pageSize?: number
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  group?: GroupDescriptor[]
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

// HierarchicalDataSource Types
export interface HierarchicalNode {
  id?: number | string
  text?: string
  [key: string]: any
  children?: HierarchicalNode[]
  _hasChildren?: boolean
  _expanded?: boolean
  _level?: number
}

export interface HierarchicalDataSourceSchemaModelChildren {
  type?: 'local' | 'remote'
  data?: any[]
  transport?: DataSourceTransport
  schema?: DataSourceSchema
  [key: string]: any
}

export interface HierarchicalDataSourceSchemaModel {
  id?: string
  hasChildren?: string | boolean | ((item: any) => boolean)
  children?: string | HierarchicalDataSourceSchemaModelChildren
  [key: string]: any
}

export interface HierarchicalDataSourceSchema extends DataSourceSchema {
  model?: HierarchicalDataSourceSchemaModel
}

export interface HierarchicalDataSourceProps<T = HierarchicalNode> extends DataSourceProps<T> {
  schema?: HierarchicalDataSourceSchema
  iconRenderer?: (node: HierarchicalNode) => any
}

export interface HierarchicalDataSourceInstance extends DataSourceInstance {
  rootNodes(): HierarchicalNode[]
  getNode(id: number | string): HierarchicalNode | null
  expand(node: HierarchicalNode | number | string): Promise<void>
  collapse(node: HierarchicalNode | number | string): void
  loadChildren(node: HierarchicalNode | number | string): Promise<HierarchicalNode[]>
}

// PivotDataSource Types
export interface PivotDimension {
  caption?: string
  name?: string
  [key: string]: any
}

export interface PivotMeasure {
  field?: string
  aggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  format?: string
  name?: string
  type?: string
  [key: string]: any
}

export interface PivotCube {
  dimensions?: Record<string, PivotDimension>
  measures?: Record<string, PivotMeasure>
  [key: string]: any
}

export interface PivotColumn {
  name: string
  expand?: boolean
  [key: string]: any
}

export interface PivotRow {
  name: string
  expand?: boolean
  [key: string]: any
}

export interface PivotDataSourceSchema {
  cube?: PivotCube
  axes?: string | ((response: any) => any)
  catalogs?: string | ((response: any) => any)
  cubes?: string | ((response: any) => any)
  data?: string | ((response: any) => any)
  dimensions?: string | ((response: any) => any)
  hierarchies?: string | ((response: any) => any)
  levels?: string | ((response: any) => any)
  measures?: string | ((response: any) => any)
  [key: string]: any
}

export interface PivotDataSourceTransport {
  read?: string | ((options: any) => Promise<any>)
  discover?: string | ((options: any) => Promise<any>)
  connection?: {
    catalog?: string
    cube?: string
    [key: string]: any
  }
  parameterMap?: (options: any, operation: string) => any
  [key: string]: any
}

export interface PivotDataSourceProps {
  type?: 'xmla' | 'odata' | 'local'
  data?: any[]
  transport?: PivotDataSourceTransport
  schema?: PivotDataSourceSchema
  columns?: PivotColumn[] | string[]
  rows?: PivotRow[] | string[]
  measures?: string[] | PivotMeasure[]
  autoSync?: boolean
  [key: string]: any
}

export interface PivotCell {
  value: any
  formattedValue?: string
  member?: any
  [key: string]: any
}

export interface PivotAxis {
  tuples: any[]
  [key: string]: any
}

export interface PivotResult {
  columns: PivotAxis
  rows: PivotAxis
  data: PivotCell[][]
  [key: string]: any
}

export interface PivotDataSourceInstance {
  data(): PivotResult | any[]
  total(): number
  read(): Promise<void>
  sync(): Promise<void>
  query(options?: any): void
  axes(): { columns: PivotAxis; rows: PivotAxis } | null
  measures(): PivotMeasure[]
  columns(): PivotColumn[]
  rows(): PivotRow[]
}

// SchedulerDataSource Types
export interface SchedulerEvent {
  taskId?: number | string
  id?: number | string
  title: string
  start: Date | string
  end: Date | string
  startTimezone?: string
  endTimezone?: string
  description?: string
  recurrenceId?: number | string | null
  recurrenceRule?: string | null
  recurrenceException?: string | null
  ownerId?: number | string
  isAllDay?: boolean
  [key: string]: any
}

export interface SchedulerEventFieldConfig {
  from?: string
  type?: 'string' | 'number' | 'boolean' | 'date'
  defaultValue?: any
  validation?: {
    required?: boolean
    min?: number
    max?: number
    [key: string]: any
  }
  parse?: (value: any) => any
}

export interface SchedulerDataSourceSchemaModel {
  id?: SchedulerEventFieldConfig | string
  taskId?: SchedulerEventFieldConfig | string
  title?: SchedulerEventFieldConfig | string
  start?: SchedulerEventFieldConfig | string
  end?: SchedulerEventFieldConfig | string
  startTimezone?: SchedulerEventFieldConfig | string
  endTimezone?: SchedulerEventFieldConfig | string
  description?: SchedulerEventFieldConfig | string
  recurrenceId?: SchedulerEventFieldConfig | string
  recurrenceRule?: SchedulerEventFieldConfig | string
  recurrenceException?: SchedulerEventFieldConfig | string
  ownerId?: SchedulerEventFieldConfig | string
  isAllDay?: SchedulerEventFieldConfig | string
  [key: string]: SchedulerEventFieldConfig | string | undefined
}

export interface SchedulerDataSourceSchema extends DataSourceSchema {
  model?: SchedulerDataSourceSchemaModel
  timezone?: string
}

export interface SchedulerDataSourceProps<T extends SchedulerEvent = SchedulerEvent> extends Omit<DataSourceProps<T>, 'schema'> {
  schema?: SchedulerDataSourceSchema
}

export interface SchedulerDataSourceInstance extends DataSourceInstance {
  events(): SchedulerEvent[]
  add(event: Partial<SchedulerEvent>): void
  remove(event: SchedulerEvent | number | string): void
  update(event: SchedulerEvent): void
}

// TreeListDataSource Types
export interface TreeListNode {
  id: number | string
  parentId?: number | string | null
  expanded?: boolean
  [key: string]: any
}

export interface TreeListFieldConfig {
  field?: string
  type?: 'string' | 'number' | 'boolean' | 'date'
  nullable?: boolean
  defaultValue?: any
  validation?: {
    required?: boolean
    min?: number
    max?: number
    [key: string]: any
  }
  parse?: (value: any) => any
}

export interface TreeListDataSourceSchemaModel {
  id?: TreeListFieldConfig | string
  parentId?: TreeListFieldConfig | string
  expanded?: boolean | string | ((item: any) => boolean)
  fields?: Record<string, TreeListFieldConfig>
  [key: string]: any
}

export interface TreeListDataSourceSchema extends DataSourceSchema {
  model?: TreeListDataSourceSchemaModel
}

export interface TreeListDataSourceProps<T extends TreeListNode = TreeListNode> extends Omit<DataSourceProps<T>, 'schema'> {
  schema?: TreeListDataSourceSchema
}

export interface TreeListDataSourceInstance extends DataSourceInstance {
  data(): TreeListNode[]
  add(node: Partial<TreeListNode>): void
  remove(node: TreeListNode | number | string): void
  update(node: TreeListNode): void
  rootNodes(): TreeListNode[]
  getNode(id: number | string): TreeListNode | null
  expand(node: TreeListNode | number | string): void
  collapse(node: TreeListNode | number | string): void
}
