import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/basic', component: () => import('./pages/BasicPage.vue') },
  { path: '/i18n/en', component: () => import('./pages/I18nEnPage.vue') },
  { path: '/i18n/es', component: () => import('./pages/I18nEsPage.vue') },
  { path: '/i18n/custom', component: () => import('./pages/I18nCustomPage.vue') },
  { path: '/cards', component: () => import('./pages/ResponsiveCardsPage.vue') },
  { path: '/setup', component: () => import('./pages/SetupGuidePage.vue') },
  { path: '/virtual', component: () => import('./pages/VirtualPage.vue') },
  { path: '/server', component: () => import('./pages/ServerSidePage.vue') },
  { path: '/grouping', component: () => import('./pages/GroupingPage.vue') },
  { path: '/table-only', component: () => import('./pages/TableOnlyPage.vue') },
  { path: '/pagination', component: () => import('./pages/PaginationShowcase.vue') },
  { path: '/pagination/standalone', component: () => import('./pages/PaginationStandalonePage.vue') },
  { path: '/locked', component: () => import('./pages/LockedColumnsPage.vue') },
  { path: '/adaptive-height', component: () => import('./pages/AdaptiveHeightSlotsPage.vue') },
  { path: '/data/local', component: () => import('./pages/DataLocalPage.vue') },
  { path: '/data/rest', component: () => import('./pages/DataRestPage.vue') },
  { path: '/data/graphql', component: () => import('./pages/DataGraphQLPage.vue') },
  { path: '/data/datasource', component: () => import('./pages/DataSourcePage.vue') },
  { path: '/data/gantt-datasource', component: () => import('./pages/GanttDataSourcePage.vue') },
  { path: '/data/gantt-dependency-datasource', component: () => import('./pages/GanttDependencyDataSourcePage.vue') },
  { path: '/data/hierarchical-datasource', component: () => import('./pages/HierarchicalDataSourcePage.vue') },
  { path: '/data/pivot-datasource', component: () => import('./pages/PivotDataSourcePage.vue') },
  { path: '/data/scheduler-datasource', component: () => import('./pages/SchedulerDataSourcePage.vue') },
  { path: '/persisted', component: () => import('./pages/PersistedStatePage.vue') },
  { path: '/custom-cells', component: () => import('./pages/CustomCellsPage.vue') },
  { path: '/styled-table', component: () => import('./pages/StyledTablePage.vue') },
  { path: '/gallery', component: () => import('./pages/ImageGalleryPage.vue') },
]

export const router = createRouter({
  history: createWebHistory('/pantanal-grid/'),
  routes,
})
