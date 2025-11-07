import './styles.css'

export { default as PantanalGrid } from './components/Grid.vue'
export { default as PantanalColumn } from './components/Column.vue'
export { default as PantanalDataSource } from './components/DataSource.vue'
export { default as PantanalGanttDataSource } from './components/GanttDataSource.vue'
export { default as PantanalGanttDependencyDataSource } from './components/GanttDependencyDataSource.vue'
export { default as PantanalHierarchicalDataSource } from './components/HierarchicalDataSource.vue'
export { default as PantanalPivotDataSource } from './components/PivotDataSource.vue'

export { default as GridPagination } from './components/Pagination.vue'
export { default as Pagination } from './components/Pagination.vue'

export * from './types'
export { registerLocale, getMessages } from './i18n/messages'
