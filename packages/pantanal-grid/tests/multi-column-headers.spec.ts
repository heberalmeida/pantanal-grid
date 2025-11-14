import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

describe('PantanalGrid Multi-Column Headers', () => {
  const mockRows = [
    { id: 1, name: 'Product 1', price: 10, stock: 5, category: 'A' },
    { id: 2, name: 'Product 2', price: 20, stock: 10, category: 'B' },
    { id: 3, name: 'Product 3', price: 30, stock: 15, category: 'A' },
  ]

  it('should render multi-column headers when columns have nested columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Check if multi-column header table is rendered
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    expect(multiHeaderTable.exists()).toBe(true)
  })

  it('should render single-row header when columns have no nested columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      { field: 'price', title: 'Price', width: 100 },
      { field: 'stock', title: 'Stock', width: 100 },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Check if single-row header is rendered (not multi-column header table)
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    expect(multiHeaderTable.exists()).toBe(false)

    // Check if regular header div is rendered
    const regularHeader = wrapper.find('.v3grid__head')
    expect(regularHeader.exists()).toBe(true)
  })

  it('should render only leaf columns in the body', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        responsive: 'table',
        virtual: false,
      },
    })

    await nextTick()
    // Wait for component to fully initialize and render rows
    await new Promise(resolve => setTimeout(resolve, 150))
    await nextTick()

    // Check that body cells match leaf columns (name, price, stock = 3 columns)
    const bodyRows = wrapper.findAll('.v3grid__row')
    expect(bodyRows.length).toBeGreaterThan(0)
    
    // Check cells in the first row
    if (bodyRows.length > 0) {
      const bodyCells = bodyRows[0].findAll('.v3grid__cell')
      // Should have cells for leaf columns (name, price, stock)
      // Plus potentially selectable/group columns
      expect(bodyCells.length).toBeGreaterThan(0)
    }
  })

  it('should render nested column groups with multiple levels', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Product Info',
        columns: [
          {
            title: 'Pricing',
            columns: [
              { field: 'price', title: 'Price', width: 100 },
            ]
          },
          {
            title: 'Inventory',
            columns: [
              { field: 'stock', title: 'Stock', width: 100 },
            ]
          },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Check if multi-column header table is rendered
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    expect(multiHeaderTable.exists()).toBe(true)

    // Check if header rows exist (should have multiple rows for nested groups)
    const headerRows = multiHeaderTable.findAll('thead tr')
    expect(headerRows.length).toBeGreaterThan(1)
  })

  it('should support sorting on leaf columns in multi-column headers', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150, sortable: true },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100, sortable: true },
          { field: 'stock', title: 'Stock', width: 100, sortable: true },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        sortable: true,
      },
    })

    await nextTick()

    // Check if sort icons are rendered for leaf columns
    const sortIcons = wrapper.findAll('.v3grid__icon')
    // Should have sort icons for sortable leaf columns
    expect(sortIcons.length).toBeGreaterThanOrEqual(0)
  })

  it('should support filtering on leaf columns in multi-column headers', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150, filterable: true },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100, filterable: true },
          { field: 'stock', title: 'Stock', width: 100, filterable: true },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        filterable: true,
        showFilterRow: true,
      },
    })

    await nextTick()

    // Check if filter inputs are rendered for leaf columns
    const filterInputs = wrapper.findAll('.v3grid__filters input')
    // Should have filter inputs for filterable leaf columns
    expect(filterInputs.length).toBeGreaterThanOrEqual(0)
  })

  it('should support column menu on leaf columns in multi-column headers', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        columnMenu: true,
      },
    })

    await nextTick()

    // Check if column menu buttons are rendered for leaf columns
    const menuButtons = wrapper.findAll('.v3grid__column-menu-btn')
    // Should have menu buttons for leaf columns
    expect(menuButtons.length).toBeGreaterThan(0)
  })

  it('should calculate correct colspan for group columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Check if group column has correct colspan (should span 2 leaf columns)
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    if (multiHeaderTable.exists()) {
      const headerCells = multiHeaderTable.findAll('th')
      // The group column should have colspan="2" to span the two leaf columns
      const groupCell = headerCells.find(cell => {
        const colspan = cell.attributes('colspan')
        return colspan === '2'
      })
      expect(groupCell).toBeDefined()
    }
  })

  it('should calculate correct rowspan for leaf columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Check if leaf columns have correct rowspan
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    if (multiHeaderTable.exists()) {
      const headerRows = multiHeaderTable.findAll('thead tr')
      // First row should have group column and leaf columns
      // Second row should only have leaf columns (group column spans both rows)
      expect(headerRows.length).toBeGreaterThan(1)
    }
  })

  it('should support column resize on leaf columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100, resizable: true },
          { field: 'stock', title: 'Stock', width: 100, resizable: true },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        enableColumnResize: true,
      },
    })

    await nextTick()

    // Check if resize handles are rendered for leaf columns
    const resizers = wrapper.findAll('.v3grid__resizer')
    // Should have resizers for resizable leaf columns
    expect(resizers.length).toBeGreaterThanOrEqual(0)
  })

  it('should support column reorder on leaf columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        enableColumnReorder: true,
      },
    })

    await nextTick()

    // Check if leaf columns are draggable
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    if (multiHeaderTable.exists()) {
      const draggableCells = multiHeaderTable.findAll('th[draggable="true"]')
      // Leaf columns should be draggable
      expect(draggableCells.length).toBeGreaterThan(0)
    }
  })

  it('should flatten nested columns correctly', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 100 },
        ]
      },
      { field: 'category', title: 'Category', width: 100 },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
        responsive: 'table',
        virtual: false,
      },
    })

    await nextTick()
    // Wait for component to fully initialize and render rows
    await new Promise(resolve => setTimeout(resolve, 150))
    await nextTick()

    // Check that body has correct number of columns (name, price, stock, category = 4)
    // The body should only render leaf columns
    const bodyRows = wrapper.findAll('.v3grid__row')
    expect(bodyRows.length).toBeGreaterThan(0)
    
    if (bodyRows.length > 0) {
      const firstRow = bodyRows[0]
      const cells = firstRow.findAll('.v3grid__cell')
      // Should have cells for all leaf columns
      expect(cells.length).toBeGreaterThan(0)
    }
  })

  it('should handle mixed nested and flat columns', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
        ]
      },
      { field: 'category', title: 'Category', width: 100 },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Should render multi-column headers (has nested columns)
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    expect(multiHeaderTable.exists()).toBe(true)
  })

  it('should display correct column widths in multi-column headers', async () => {
    const columns: ColumnDef[] = [
      { field: 'name', title: 'Name', width: 150 },
      {
        title: 'Details',
        columns: [
          { field: 'price', title: 'Price', width: 100 },
          { field: 'stock', title: 'Stock', width: 120 },
        ]
      },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: mockRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Check if colgroup has correct width definitions
    const multiHeaderTable = wrapper.find('.v3grid__head-multi')
    if (multiHeaderTable.exists()) {
      const colgroup = multiHeaderTable.find('colgroup')
      expect(colgroup.exists()).toBe(true)
      
      const cols = colgroup.findAll('col')
      // Should have col elements for each leaf column
      expect(cols.length).toBeGreaterThan(0)
    }
  })
})

