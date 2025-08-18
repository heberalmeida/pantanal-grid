import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/basic', component: () => import('./pages/BasicPage.vue') },
  { path: '/i18n/en', component: () => import('./pages/I18nEnPage.vue') },
  { path: '/i18n/es', component: () => import('./pages/I18nEsPage.vue') },
  { path: '/i18n/custom', component: () => import('./pages/I18nCustomPage.vue') },
  { path: '/virtual', component: () => import('./pages/VirtualPage.vue') },
  { path: '/server', component: () => import('./pages/ServerSidePage.vue') },
  { path: '/grouping', component: () => import('./pages/GroupingPage.vue') },
  { path: '/table-only', component: () => import('./pages/TableOnlyPage.vue') },
  { path: '/pagination', component: () => import('./pages/PaginationShowcase.vue') },
  { path: '/locked', component: () => import('./pages/LockedColumnsPage.vue') },
  { path: '/data/local', component: () => import('./pages/DataLocalPage.vue') },
  { path: '/data/rest', component: () => import('./pages/DataRestPage.vue') },
  { path: '/data/graphql', component: () => import('./pages/DataGraphQLPage.vue') },
]


export const router = createRouter({
  history: createWebHistory(),
  routes,
})
