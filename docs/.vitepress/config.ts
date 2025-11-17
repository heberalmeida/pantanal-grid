import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  title: 'Pantanal Grid',
  description: 'A feature-rich data grid component for Vue 3 applications',
  base: process.env.VITEPRESS_BASE || '/',
  
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/basic' },
      { text: 'API Reference', link: '/api/grid' },
      { text: 'GitHub', link: 'https://github.com/heberalmeida/pantanal-grid' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'Sorting', link: '/guide/sorting' },
            { text: 'Filtering', link: '/guide/filtering' },
            { text: 'Pagination', link: '/guide/pagination' },
            { text: 'Selection', link: '/guide/selection' },
            { text: 'Grouping', link: '/guide/grouping' },
            { text: 'Virtual Scrolling', link: '/guide/virtual-scrolling' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Server-Side Mode', link: '/guide/server-side' },
            { text: 'Editing', link: '/guide/editing' },
            { text: 'Column Management', link: '/guide/column-management' },
            { text: 'Internationalization', link: '/guide/i18n' },
            { text: 'IntlService', link: '/guide/intl-service' },
            { text: 'Export', link: '/guide/export' },
            { text: 'Templates', link: '/guide/templates' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Basic Examples',
          items: [
            { text: 'Basic Grid', link: '/examples/basic' },
            { text: 'Sorting', link: '/examples/sorting' },
            { text: 'Filtering', link: '/examples/filtering' },
            { text: 'Pagination', link: '/examples/pagination' },
            { text: 'Selection', link: '/examples/selection' }
          ]
        },
        {
          text: 'Advanced Examples',
          items: [
            { text: 'Grouping Basics', link: '/examples/grouping-basics' },
            { text: 'Grouping', link: '/examples/grouping' },
            { text: 'Virtual Scrolling', link: '/examples/virtual' },
            { text: 'Virtualization', link: '/examples/virtualization' },
            { text: 'Scrollable Props', link: '/examples/scrollable-props' },
            { text: 'Sortable Props', link: '/examples/sortable-props' },
            { text: 'Aggregates', link: '/examples/aggregates' },
            { text: 'Editing', link: '/examples/editing' },
            { text: 'Server-Side', link: '/examples/server-side' },
            { text: 'Column Reorder & Resize', link: '/examples/column-management' },
            { text: 'Pinned Columns', link: '/examples/pinned-columns' }
          ]
        },
        {
          text: 'Data Sources',
          items: [
            { text: 'Data Binding', link: '/examples/data-binding' },
            { text: 'REST API', link: '/examples/data-rest' },
            { text: 'GraphQL', link: '/examples/data-graphql' },
            { text: 'WebSocket', link: '/examples/data-websocket' }
          ]
        },
        {
          text: 'Customization',
          items: [
            { text: 'Custom Cells', link: '/examples/custom-cells' },
            { text: 'Templates', link: '/examples/templates' },
            { text: 'Responsive Cards', link: '/examples/responsive-cards' },
            { text: 'Styling', link: '/examples/styling' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Export (Excel/PDF)', link: '/examples/export' },
            { text: 'Internationalization', link: '/examples/i18n' },
            { text: 'IntlService', link: '/examples/intl-service' },
            { text: 'Keyboard Navigation', link: '/examples/keyboard-navigation' },
            { text: 'Persisted State', link: '/examples/persisted-state' },
            { text: 'Multi-Column Headers', link: '/examples/multi-column-headers' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'Components',
          items: [
            { text: 'PantanalGrid', link: '/api/grid' },
            { text: 'PantanalColumn', link: '/api/column' },
            { text: 'Data Sources', link: '/api/data-sources' }
          ]
        },
        {
          text: 'Types',
          items: [
            { text: 'ColumnDef', link: '/api/column-def' },
            { text: 'GridProps', link: '/api/grid-props' },
            { text: 'Messages', link: '/api/messages' },
            { text: 'Types', link: '/api/types' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Pagination', link: '/api/pagination' },
            { text: 'ScrollableProps', link: '/api/scrollable-props' },
            { text: 'SortableProps', link: '/api/sortable-props' },
            { text: 'Aggregates', link: '/api/aggregates' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/heberalmeida/pantanal-grid' }
    ],
    
    search: {
      provider: 'local'
    }
  },
  
  vite: {
    resolve: {
      alias: {
        '@pantanal/grid': resolve(__dirname, '../../packages/pantanal-grid/src'),
        '@': resolve(__dirname, '../../playground/src')
      }
    },
    optimizeDeps: {
      include: ['vue', '@pantanal/grid'],
      force: true
    },
    ssr: {
      noExternal: ['@pantanal/grid']
    },
    server: {
      fs: {
        allow: ['..']
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    }
  }
})

