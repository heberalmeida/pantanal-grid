import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number }

describe('PantanalGrid Hide Header', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product A', price: 10 },
    { id: 2, name: 'Product B', price: 20 },
    { id: 3, name: 'Product C', price: 30 },
  ]

  const columns: ColumnDef<Row>[] = [
    { field: 'id', title: 'ID', width: 100 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'price', title: 'Price', width: 120 },
  ]

  describe('Header Visibility', () => {
    it('should show header by default', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          keyField: 'id',
        },
      })

      // Header should be visible (either table or div with v3grid__head class)
      const header = wrapper.find('.v3grid__head, .v3grid__head-multi')
      expect(header.exists()).toBe(true)
    })

    it('should hide header when hideHeader is true', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          hideHeader: true,
          keyField: 'id',
        },
      })

      // Header should not be visible
      const header = wrapper.find('.v3grid__head, .v3grid__head-multi')
      expect(header.exists()).toBe(false)
    })

    it('should show header when hideHeader is false', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          hideHeader: false,
          keyField: 'id',
        },
      })

      const header = wrapper.find('.v3grid__head, .v3grid__head-multi')
      expect(header.exists()).toBe(true)
    })

    it('should hide multi-column header when hideHeader is true', () => {
      const multiColumns: ColumnDef<Row>[] = [
        {
          field: 'id',
          title: 'ID',
          width: 100,
          columns: [
            { field: 'id', title: 'ID', width: 100 },
          ],
        },
        { field: 'name', title: 'Name', width: 200 },
        { field: 'price', title: 'Price', width: 120 },
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: multiColumns,
          hideHeader: true,
          keyField: 'id',
        },
      })

      const multiHeader = wrapper.find('.v3grid__head-multi')
      expect(multiHeader.exists()).toBe(false)
    })

    it('should hide locked column headers when hideHeader is true', () => {
      const lockedColumns: ColumnDef<Row>[] = [
        { field: 'id', title: 'ID', width: 100, locked: 'left' },
        { field: 'name', title: 'Name', width: 200 },
        { field: 'price', title: 'Price', width: 120, locked: 'right' },
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: lockedColumns,
          hideHeader: true,
          keyField: 'id',
        },
      })

      // Locked left header should not be visible
      const leftHeader = wrapper.find('.v3grid__locked-left .v3grid__head')
      expect(leftHeader.exists()).toBe(false)

      // Locked right header should not be visible
      const rightHeader = wrapper.find('.v3grid__locked-right .v3grid__head')
      expect(rightHeader.exists()).toBe(false)
    })
  })

  describe('Data Display', () => {
    it('should still display data when header is hidden', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          hideHeader: true,
          keyField: 'id',
        },
      })

      // Data should still be visible
      const body = wrapper.find('.v3grid__body')
      expect(body.exists()).toBe(true)
      
      // Should contain row data
      const wrapperText = wrapper.text()
      expect(wrapperText).toContain('Product A')
      expect(wrapperText).toContain('Product B')
    })

    it('should maintain functionality when header is hidden', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          hideHeader: true,
          pageable: true,
          keyField: 'id',
        },
      })

      // Pagination should still work - check for pagination controls
      const footer = wrapper.find('.v3grid__footer')
      expect(footer.exists()).toBe(true)
      
      // Grid should still be functional
      expect(wrapper.exists()).toBe(true)
    })
  })
})

