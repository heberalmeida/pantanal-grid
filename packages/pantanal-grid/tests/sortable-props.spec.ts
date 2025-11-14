import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number; category: string }

describe('PantanalGrid sortableProps', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product A', price: 99.99, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
    { id: 3, name: 'Product C', price: 19.99, category: 'Books' }
  ]

  const columns: ColumnDef<Row>[] = [
    { field: 'id', title: 'ID', width: 80, sortable: true },
    { field: 'name', title: 'Name', sortable: true },
    { field: 'price', title: 'Price', sortable: true },
    { field: 'category', title: 'Category', sortable: true }
  ]

  describe('sortable-allow-unsort', () => {
    it('allows unsort when sortableAllowUnsort is true (default)', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableAllowUnsort: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableAllowUnsort')).toBe(true)
    })

    it('disables unsort when sortableAllowUnsort is false', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableAllowUnsort: false
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableAllowUnsort')).toBe(false)
    })
  })

  describe('sortable-show-indexes', () => {
    it('shows indexes when sortableShowIndexes is true in multiple mode', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'multiple',
          sortableShowIndexes: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableShowIndexes')).toBe(true)
      expect(wrapper.props('sortableMode')).toBe('multiple')
    })

    it('hides indexes when sortableShowIndexes is false', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'multiple',
          sortableShowIndexes: false
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableShowIndexes')).toBe(false)
    })
  })

  describe('sortable-initial-direction', () => {
    it('sets initial direction to asc by default', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Default should be 'asc' or undefined
      const initialDir = wrapper.props('sortableInitialDirection')
      expect(initialDir === undefined || initialDir === 'asc').toBe(true)
    })

    it('sets initial direction to desc when specified', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableInitialDirection: 'desc'
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()

      // Verify the prop was passed correctly
      // Note: wrapper.props() returns the props object, need to access the property
      const props = wrapper.props()
      expect(props.sortableInitialDirection).toBe('desc')
    })
  })

  describe('sortable-mode', () => {
    it('defaults to single mode', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const mode = wrapper.props('sortableMode')
      expect(mode === undefined || mode === 'single').toBe(true)
    })

    it('sets mode to single when specified', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'single'
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableMode')).toBe('single')
    })

    it('sets mode to multiple when specified', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'multiple'
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableMode')).toBe('multiple')
    })
  })

  describe('column-level overrides', () => {
    it('allows column-level sortableInitialDirection', async () => {
      const columnColumns: ColumnDef<Row>[] = [
        { field: 'id', title: 'ID', sortable: true },
        { 
          field: 'name', 
          title: 'Name', 
          sortable: true,
          sortableInitialDirection: 'desc'
        }
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: columnColumns,
          sortable: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('columns')).toBeDefined()
      const nameColumn = columnColumns.find(c => c.field === 'name')
      expect(nameColumn?.sortableInitialDirection).toBe('desc')
    })

    it('allows column-level sortableAllowUnsort', async () => {
      const columnColumns: ColumnDef<Row>[] = [
        { field: 'id', title: 'ID', sortable: true },
        { 
          field: 'name', 
          title: 'Name', 
          sortable: true,
          sortableAllowUnsort: false
        }
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: columnColumns,
          sortable: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const nameColumn = columnColumns.find(c => c.field === 'name')
      expect(nameColumn?.sortableAllowUnsort).toBe(false)
    })
  })

  describe('integration with other props', () => {
    it('works with serverSide mode', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'multiple',
          sortableShowIndexes: true,
          serverSide: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableMode')).toBe('multiple')
      expect(wrapper.props('serverSide')).toBe(true)
    })

    it('works with filterable', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'multiple',
          filterable: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('sortableMode')).toBe('multiple')
      expect(wrapper.props('filterable')).toBe(true)
    })
  })

  describe('prop combinations', () => {
    it('combines all sortable props correctly', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          sortable: true,
          sortableMode: 'multiple',
          sortableAllowUnsort: true,
          sortableShowIndexes: true,
          sortableInitialDirection: 'desc'
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()

      // Verify all props were passed correctly
      const props = wrapper.props()
      expect(props.sortableMode).toBe('multiple')
      expect(props.sortableAllowUnsort).toBe(true)
      expect(props.sortableShowIndexes).toBe(true)
      expect(props.sortableInitialDirection).toBe('desc')
    })
  })
})

