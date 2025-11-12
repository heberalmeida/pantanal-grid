<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

type PlaygroundTheme = 'light' | 'dark' | 'forest' | 'midnight'

const themeOptions: Array<{ value: PlaygroundTheme; label: string; hint: string; icon: string }> = [
  { value: 'light', label: 'Light Breeze', hint: 'Neutral & airy', icon: 'sun' },
  { value: 'dark', label: 'Carbon Night', hint: 'High contrast', icon: 'moon' },
  { value: 'forest', label: 'Emerald Forest', hint: 'Organic accents', icon: 'leaf' },
  { value: 'midnight', label: 'Midnight Aurora', hint: 'Sci‑fi vibes', icon: 'meteor' },
]

const themePresets: Record<PlaygroundTheme, {
  mode: 'light' | 'dark'
  root: string
  header: string
  nav: string
  panel: string
  panelText: string
  sectionTitle: string
  tagline: string
  github: string
  themeSelect: string
  linkActive: string
  linkInactive: string
  menuButton: string
}> = {
  light: {
    mode: 'light',
    root: 'bg-gradient-to-br from-slate-50 via-white to-slate-200 text-slate-900',
    header: 'border-slate-200/70 bg-white/90 text-slate-900 shadow-xl backdrop-blur',
    nav: 'border-slate-200/70 bg-white/85 text-slate-900 shadow-lg',
    panel: 'border-slate-200/70 bg-white/95 shadow-xl',
    panelText: 'text-slate-800',
    sectionTitle: 'text-slate-500',
    tagline: 'text-slate-600',
    github: 'border-slate-300 text-slate-700 hover:bg-slate-100',
    themeSelect: 'border-slate-200 bg-white text-slate-700 focus:ring-cyan-200',
    linkActive: 'bg-cyan-100 text-cyan-700',
    linkInactive: 'text-slate-600 hover:bg-slate-200 hover:text-slate-900',
    menuButton: 'bg-slate-900 text-white hover:bg-slate-800'
  },
  dark: {
    mode: 'dark',
    root: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100',
    header: 'border-slate-700/40 bg-slate-900/65 text-slate-100 shadow-2xl backdrop-blur-xl',
    nav: 'border-slate-700/40 bg-slate-900/70 text-slate-100 shadow-xl',
    panel: 'border-slate-700/40 bg-slate-900/72 shadow-xl',
    panelText: 'text-slate-100',
    sectionTitle: 'text-slate-400',
    tagline: 'text-slate-200',
    github: 'border-slate-500 text-slate-200 hover:bg-slate-800',
    themeSelect: 'border-slate-700 bg-slate-950 text-slate-100 focus:ring-cyan-500/40',
    linkActive: 'bg-cyan-500/20 text-cyan-200',
    linkInactive: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    menuButton: 'bg-slate-800 text-slate-100 hover:bg-slate-700'
  },
  forest: {
    mode: 'light',
    root: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 text-emerald-950',
    header: 'border-emerald-200 bg-white/80 text-emerald-950 shadow-xl backdrop-blur',
    nav: 'border-emerald-200 bg-white/75 text-emerald-900 shadow-lg',
    panel: 'border-emerald-200 bg-white/80 shadow-xl',
    panelText: 'text-emerald-900',
    sectionTitle: 'text-emerald-700/90',
    tagline: 'text-emerald-700',
    github: 'border-emerald-300 text-emerald-800 hover:bg-emerald-100/80',
    themeSelect: 'border-emerald-200 bg-white text-emerald-700 focus:ring-emerald-200',
    linkActive: 'bg-emerald-100 text-emerald-900',
    linkInactive: 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900',
    menuButton: 'bg-emerald-600 text-white hover:bg-emerald-700'
  },
  midnight: {
    mode: 'dark',
    root: 'bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 text-indigo-100',
    header: 'border-indigo-800/50 bg-indigo-950/65 text-indigo-100 shadow-2xl backdrop-blur-xl',
    nav: 'border-indigo-800/50 bg-indigo-950/70 text-indigo-100 shadow-xl',
    panel: 'border-indigo-800/50 bg-slate-950/72 shadow-xl',
    panelText: 'text-indigo-100',
    sectionTitle: 'text-indigo-200/80',
    tagline: 'text-indigo-100',
    github: 'border-indigo-700 text-indigo-100 hover:bg-indigo-900',
    themeSelect: 'border-indigo-700 bg-indigo-950 text-indigo-100 focus:ring-indigo-500/40',
    linkActive: 'bg-indigo-500/25 text-indigo-100',
    linkInactive: 'text-indigo-200/80 hover:bg-indigo-800/40 hover:text-white',
    menuButton: 'bg-indigo-700 text-white hover:bg-indigo-600'
  },
}

const navSections = [
  {
    title: 'Getting started',
    items: [
      { to: '/', label: 'Overview', icon: 'house' },
      { to: '/setup', label: 'Setup & usage', icon: 'circle-play' },
      { to: '/basic', label: 'Basic grid', icon: 'table-cells-large' },
      { to: '/grid-events', label: 'Grid events', icon: 'bell' },
      { to: '/editing', label: 'Editing', icon: 'pen' },
      { to: '/filtering', label: 'Filtering', icon: 'filter' },
      { to: '/sorting', label: 'Sorting', icon: 'arrow-down-wide-short' },
      { to: '/reordering', label: 'Column Reordering', icon: 'arrows-left-right' },
      { to: '/resizing', label: 'Column Resizing', icon: 'arrows-left-right-to-line' },
      { to: '/keyboard-navigation', label: 'Keyboard Navigation', icon: 'keyboard' },
      { to: '/paging', label: 'Paging', icon: 'file-lines' },
      { to: '/selection', label: 'Selection', icon: 'check-square' },
      { to: '/copy', label: 'Copy to Clipboard', icon: 'copy' },
      { to: '/column-menu', label: 'Column Menu', icon: 'bars' },
      { to: '/multi-column-headers', label: 'Multi-Column Headers', icon: 'table-columns' },
      { to: '/excel-export', label: 'Excel Export', icon: 'file-excel' },
      { to: '/filterable-props', label: 'Filterable Props', icon: 'filter' },
      { to: '/grid-column', label: 'Grid Column API', icon: 'table-columns' },
      { to: '/templates', label: 'Templates', icon: 'file-code' },
      { to: '/custom-commands', label: 'Custom Commands', icon: 'code' },
      { to: '/foreign-key-columns', label: 'Foreign-Key Columns', icon: 'link' },
      { to: '/locked', label: 'Locked Columns', icon: 'lock' },
      { to: '/pinned-columns', label: 'Pinned Columns', icon: 'thumbtack' },
      { to: '/persist-state', label: 'Persist State', icon: 'floppy-disk' },
      { to: '/rtl', label: 'RTL Support', icon: 'arrow-right-arrow-left' },
      { to: '/table-only', label: 'Table-only layout', icon: 'table-list' },
      { to: '/cards', label: 'Responsive cards', icon: 'mobile-screen-button' },
    ],
  },
  {
    title: 'Data sources',
    items: [
      { to: '/data/local', label: 'Static data', icon: 'folder' },
      { to: '/data/rest', label: 'REST API', icon: 'cloud-arrow-down' },
      { to: '/data/graphql', label: 'GraphQL', icon: 'diagram-project' },
      { to: '/data/websocket', label: 'WebSocket', icon: 'satellite-dish' },
      { to: '/data/offline', label: 'Offline mode', icon: 'wifi' },
      { to: '/data/datasource', label: 'DataSource component', icon: 'gears' },
      { to: '/data/gantt-datasource', label: 'GanttDataSource component', icon: 'diagram-project' },
      { to: '/data/gantt-dependency-datasource', label: 'GanttDependencyDataSource component', icon: 'link' },
      { to: '/data/hierarchical-datasource', label: 'HierarchicalDataSource component', icon: 'sitemap' },
      { to: '/data/pivot-datasource', label: 'PivotDataSource component', icon: 'table-cells' },
      { to: '/data/scheduler-datasource', label: 'SchedulerDataSource component', icon: 'calendar' },
      { to: '/data/treelist-datasource', label: 'TreeListDataSource component', icon: 'diagram-project' },
      { to: '/server', label: 'Server-side pagination', icon: 'gears' },
      { to: '/persisted', label: 'Persisted state', icon: 'floppy-disk' },
    ],
  },
  {
    title: 'UX & visuals',
    items: [
      { to: '/styled-table', label: 'Styled table', icon: 'palette' },
      { to: '/gallery', label: 'Image gallery', icon: 'images' },
      { to: '/grouping', label: 'Grouping & aggregates', icon: 'layer-group' },
      { to: '/groupable-props', label: 'Groupable Props', icon: 'sliders' },
      { to: '/locked', label: 'Pinned columns', icon: 'table-columns' },
      { to: '/adaptive-height', label: 'Adaptive height & slots', icon: 'arrows-up-down-left-right' },
      { to: '/virtual', label: 'Virtual scroll', icon: 'rocket' },
      { to: '/pagination', label: 'Pagination variants', icon: 'ellipsis' },
      { to: '/pagination/standalone', label: 'Pagination standalone', icon: 'ellipsis' },
      { to: '/custom-cells', label: 'Custom cells & slots', icon: 'puzzle-piece' },
    ],
  },
  {
    title: 'Internationalization',
    items: [
      { to: '/i18n/en', label: 'English (en)', icon: 'language' },
      { to: '/i18n/es', label: 'Spanish (es)', icon: 'flag-checkered' },
      { to: '/i18n/custom', label: 'Custom labels', icon: 'language' },
    ],
  },
]

const initialTheme: PlaygroundTheme = (() => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('pantanal-play-theme')
  if (stored && stored in themePresets) return stored as PlaygroundTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
})()

const theme = ref<PlaygroundTheme>(initialTheme)
const themePreset = computed(() => themePresets[theme.value])
const currentThemeOption = computed(() =>
  themeOptions.find(option => option.value === theme.value) ?? themeOptions[0]
)
const route = useRoute()
const menuOpen = ref(false)
const themeMenuOpen = ref(false)

watchEffect(() => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme.value)
  window.localStorage.setItem('pantanal-play-theme', theme.value)
})

watch(() => route.path, () => {
  menuOpen.value = false
  themeMenuOpen.value = false
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

watch(theme, () => {
  themeMenuOpen.value = false
})

const rootClasses = computed(() => themePreset.value.root)
const headerClasses = computed(() => themePreset.value.header)
const navClasses = computed(() => themePreset.value.nav)
const panelClasses = computed(() => `${themePreset.value.panel} ${themePreset.value.panelText}`)
const sectionTitleClass = computed(() => themePreset.value.sectionTitle)
const taglineClass = computed(() => themePreset.value.tagline)
const githubClasses = computed(() => themePreset.value.github)
const selectClasses = computed(() => themePreset.value.themeSelect)
const menuButtonClasses = computed(() => themePreset.value.menuButton)

const linkClasses = (path: string) => {
  const active = route.path === path
  return [
    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
    active ? themePreset.value.linkActive : themePreset.value.linkInactive,
  ]
}

function toggleThemeMenu() {
  themeMenuOpen.value = !themeMenuOpen.value
}

function selectTheme(value: PlaygroundTheme) {
  theme.value = value
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-500 ease-in-out" :class="rootClasses">
    <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
      <header class="rounded-3xl border p-6 shadow-2xl transition-colors duration-500 backdrop-blur-xl"
        :class="headerClasses">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-3">
            <p class="text-sm font-semibold uppercase tracking-widest text-cyan-400">Pantanal Grid</p>
            <h1 class="text-3xl font-bold leading-tight sm:text-[2.1rem]">Playground &amp; Live Cookbook</h1>
            <p class="max-w-2xl text-sm md:text-base transition-colors" :class="taglineClass">
              Explore production-like scenarios to understand how Pantanal Grid behaves with different layouts, data
              sources and customization hooks. Switch themes, pin columns, try virtual scrolling or mix table and card
              layouts in seconds.
            </p>
          </div>

          <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div class="relative w-full sm:w-72">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-full border px-4 py-2 text-left text-sm font-semibold shadow transition focus:outline-none focus:ring-2"
                :class="selectClasses"
                @click="toggleThemeMenu"
              >
                <span class="flex items-center gap-3">
                  <FontAwesomeIcon :icon="currentThemeOption.icon" class="text-base" />
                  <span class="flex flex-col leading-tight">
                    <span class="text-[11px] uppercase tracking-wide text-cyan-500">Theme</span>
                    <span>{{ currentThemeOption.label }} — <span class="font-normal text-xs">{{ currentThemeOption.hint }}</span></span>
                  </span>
                </span>
                <FontAwesomeIcon icon="chevron-down" class="text-xs opacity-70" />
              </button>
              <Transition name="fade">
                <ul
                  v-if="themeMenuOpen"
                  class="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/90 text-slate-800 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100"
                >
                  <li v-for="option in themeOptions" :key="option.value">
                    <button
                      type="button"
                      class="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition hover:bg-cyan-500/10"
                      :class="option.value === theme ? 'text-cyan-600 dark:text-cyan-200' : ''"
                      @click="selectTheme(option.value)"
                    >
                      <span class="flex items-center gap-3">
                        <FontAwesomeIcon :icon="option.icon" />
                        <span class="flex flex-col text-left leading-tight">
                          <span>{{ option.label }}</span>
                          <span class="text-xs font-normal opacity-70">{{ option.hint }}</span>
                        </span>
                      </span>
                      <span v-if="option.value === theme" class="text-xs uppercase tracking-wide text-cyan-500">Active</span>
                    </button>
                  </li>
                </ul>
              </Transition>
            </div>
            <div class="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow transition-colors lg:hidden"
                :class="menuButtonClasses"
                @click="menuOpen = true"
              >
                <FontAwesomeIcon icon="bars" /> Menu
              </button>
              <a
                href="https://github.com/heberalmeida/pantanal-grid"
                target="_blank"
                rel="noreferrer"
                class="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
                :class="githubClasses"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <Transition name="fade">
        <div
          v-if="menuOpen"
          class="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          @click="menuOpen = false"
        />
      </Transition>

      <div class="mt-10 flex flex-1 flex-col gap-8 pb-16 lg:grid lg:grid-cols-[280px,1fr] lg:pb-12">
        <aside
          class="fixed left-0 top-0 z-40 flex h-full w-72 -translate-x-full transform flex-col gap-8 overflow-y-auto border p-6 transition-transform duration-300 ease-out lg:static lg:h-auto lg:w-full lg:translate-x-0 lg:rounded-3xl lg:border lg:p-6"
          :class="[navClasses, menuOpen ? 'translate-x-0' : '', 'lg:shadow-lg shadow-2xl']"
        >
          <button
            type="button"
            class="mb-2 inline-flex items-center gap-2 self-end rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition lg:hidden"
            :class="menuButtonClasses"
            @click="menuOpen = false"
          >
            <FontAwesomeIcon icon="xmark" /> Close
          </button>
          <template v-for="section in navSections" :key="section.title">
            <div class="space-y-4">
              <p class="text-xs font-semibold uppercase tracking-wider transition-colors" :class="sectionTitleClass">
                {{ section.title }}
              </p>
              <nav class="space-y-1">
                <RouterLink
                  v-for="item in section.items"
                  :key="item.to"
                  :to="item.to"
                  :class="linkClasses(item.to)"
                >
                  <FontAwesomeIcon :icon="item.icon" class="text-sm" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </nav>
            </div>
          </template>
        </aside>

        <section
  class="flex-1 rounded-3xl border p-6 shadow-2xl transition-colors lg:p-8 overflow-x-auto"
  :class="panelClasses"
>
  <RouterView />
</section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
