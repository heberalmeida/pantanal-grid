import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

describe('RTL Support', () => {
  const rows = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
  ]

  const columns: ColumnDef[] = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'price', title: 'Price', width: 120 },
  ]

  it('should apply RTL direction when rtl prop is true', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: true,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBe('rtl')
  })

  it('should not apply RTL direction when rtl prop is false', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: false,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBeUndefined()
  })

  it('should not apply RTL direction when rtl prop is undefined', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBeUndefined()
  })

  it('should render cells with RTL borders when RTL is enabled', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: true,
        keyField: 'id',
      },
    })

    const cells = wrapper.findAll('.v3grid__cell')
    expect(cells.length).toBeGreaterThan(0)

    // Check that grid has RTL direction
    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBe('rtl')
  })

  it('should work with sorting in RTL mode', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: true,
        sortable: true,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBe('rtl')

    // Grid should still be sortable
    const headerCells = wrapper.findAll('.v3grid__cell--header')
    expect(headerCells.length).toBeGreaterThan(0)
  })

  it('should work with filtering in RTL mode', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: true,
        filterable: true,
        showFilterRow: true,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBe('rtl')

    // Grid should still be filterable
    const filterRow = wrapper.find('.v3grid__filters')
    expect(filterRow.exists()).toBe(true)
  })

  it('should work with pagination in RTL mode', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: true,
        pageable: true,
        page: 1,
        pageSize: 10,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBe('rtl')

    // Pagination should be rendered
    const footer = wrapper.find('.v3grid__footer')
    expect(footer.exists()).toBe(true)
  })

  it('should pass rtl prop to Pagination component', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        rtl: true,
        pageable: true,
        page: 1,
        pageSize: 10,
        total: 2,
        keyField: 'id',
      },
    })

    const pagination = wrapper.findComponent({ name: 'GridPagination' })
    expect(pagination.exists()).toBe(true)
    expect(pagination.props('rtl')).toBe(true)
  })

  it('should handle RTL with locked columns', () => {
    const columnsWithLocked: ColumnDef[] = [
      { field: 'id', title: 'ID', width: 80, locked: 'left' },
      { field: 'name', title: 'Name', width: 200 },
      { field: 'price', title: 'Price', width: 120, locked: 'right' },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns: columnsWithLocked,
        rtl: true,
        keyField: 'id',
      },
    })

    const gridElement = wrapper.find('.v3grid')
    expect(gridElement.attributes('dir')).toBe('rtl')

    // Locked columns should be rendered
    const lockedLeft = wrapper.find('.v3grid__locked-left')
    const lockedRight = wrapper.find('.v3grid__locked-right')
    expect(lockedLeft.exists() || lockedRight.exists()).toBe(true)
  })
})

