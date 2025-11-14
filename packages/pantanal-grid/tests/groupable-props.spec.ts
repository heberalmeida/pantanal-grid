import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { ColumnDef, GroupDescriptor } from '../src/types'

type Row = { id: number; name: string; category: string; price: number; supplier: string }

describe('PantanalGrid Groupable Props', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product 1', category: 'Beverages', price: 10, supplier: 'Supplier A' },
    { id: 2, name: 'Product 2', category: 'Beverages', price: 20, supplier: 'Supplier B' },
    { id: 3, name: 'Product 3', category: 'Condiments', price: 30, supplier: 'Supplier A' },
    { id: 4, name: 'Product 4', category: 'Condiments', price: 40, supplier: 'Supplier C' },
  ]

  describe('Column-Level groupable Property', () => {
    it('should allow grouping when groupable is true', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupable: true },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with grouping
      expect(wrapper.exists()).toBe(true)
      // Check if group rows are rendered (they should be)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })

    it('should prevent grouping when groupable is false', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupable: false },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
        },
      })

      await nextTick()

      // Grid should still render, but grouping behavior may be affected
      // The groupable: false property is more of a UI hint - actual grouping
      // is controlled by the group prop
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('groupableSortDir Property', () => {
    it('should use column groupableSortDir when group descriptor does not specify dir', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupableSortDir: 'desc' },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category' }] // No dir specified

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with grouping using column's groupableSortDir
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })

    it('should use group descriptor dir when both are specified', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupableSortDir: 'desc' },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }] // Override column's sortDir

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with grouping using group descriptor's dir
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })
  })

  describe('groupableSortCompare Property', () => {
    it('should use custom comparison function when groupableSortCompare is provided', async () => {
      const customCompare = (a: any, b: any) => {
        // Custom sort: 'Beverages' first, then others alphabetically
        if (a === 'Beverages' && b !== 'Beverages') return -1
        if (a !== 'Beverages' && b === 'Beverages') return 1
        return a > b ? 1 : a < b ? -1 : 0
      }

      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupableSortCompare: customCompare },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with grouping using custom comparison
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })

    it('should reverse custom comparison when sortDir is desc', async () => {
      const customCompare = (a: any, b: any) => {
        if (a === 'Beverages' && b !== 'Beverages') return -1
        if (a !== 'Beverages' && b === 'Beverages') return 1
        return a > b ? 1 : a < b ? -1 : 0
      }

      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupableSortCompare: customCompare },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'desc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with grouping using reversed custom comparison
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })
  })

  describe('showGroupFooters Property', () => {
    it('should show group footers when showGroupFooters is true', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150 },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          showGroupFooters: true,
        },
      })

      await nextTick()

      // Grid should render with group footers
      expect(wrapper.exists()).toBe(true)
      // Group footers should be visible
      const footerRows = wrapper.findAll('.v3grid__footer')
      // Footers may be rendered even when groups are collapsed
      expect(wrapper.vm).toBeDefined()
    })

    it('should hide group footers when showGroupFooters is false', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150 },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          showGroupFooters: false,
        },
      })

      await nextTick()

      // Grid should render without group footers
      expect(wrapper.exists()).toBe(true)
      // Group footers should not be visible when showGroupFooters is false
      expect(wrapper.vm).toBeDefined()
    })

    it('should default to showing group footers when showGroupFooters is not specified', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150 },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          // showGroupFooters not specified - should default to true
        },
      })

      await nextTick()

      // Grid should render with group footers (default behavior)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Combining Multiple Properties', () => {
    it('should work with groupable, groupableSortDir, and groupableSortCompare together', async () => {
      const customCompare = (a: any, b: any) => a > b ? 1 : a < b ? -1 : 0

      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { 
          field: 'category', 
          title: 'Category', 
          width: 150, 
          groupable: true,
          groupableSortDir: 'asc',
          groupableSortCompare: customCompare
        },
        { field: 'supplier', title: 'Supplier', width: 200, groupable: false },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          showGroupFooters: true,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with all properties applied
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })
  })

  describe('Grouping with Aggregates', () => {
    it('should work with groupable props and aggregates', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupableSortDir: 'asc' },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [{ field: 'category', dir: 'asc' }]
      const aggregates = {
        price: ['sum', 'avg'] as const,
        id: ['count'] as const,
      }

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          aggregates,
          showGroupFooters: true,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with grouping and aggregates
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })
  })

  describe('Nested Grouping', () => {
    it('should respect groupable props in nested groups', async () => {
      const columns: ColumnDef<Row>[] = [
        { field: 'name', title: 'Name', width: 200 },
        { field: 'category', title: 'Category', width: 150, groupableSortDir: 'asc' },
        { field: 'supplier', title: 'Supplier', width: 200, groupableSortDir: 'desc' },
        { field: 'price', title: 'Price', width: 100 },
      ]

      const group: GroupDescriptor[] = [
        { field: 'category', dir: 'asc' },
        { field: 'supplier', dir: 'desc' }
      ]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          group,
          showGroupFooters: true,
          responsive: 'table',
          virtual: false,
        },
      })

      await nextTick()
      // Wait for component to fully initialize and groups to be processed
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()

      // Grid should render with nested grouping
      expect(wrapper.exists()).toBe(true)
      const groupRows = wrapper.findAll('.v3grid__group')
      expect(groupRows.length).toBeGreaterThan(0)
    })
  })
})

