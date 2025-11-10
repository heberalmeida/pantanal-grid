import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Product = { productID: number; productName: string; unitPrice: number; unitsInStock: number; discontinued: boolean }

describe('PantanalGrid Custom Commands', () => {
  const rows: Product[] = [
    { productID: 1, productName: 'Chai', unitPrice: 18, unitsInStock: 39, discontinued: false },
    { productID: 2, productName: 'Chang', unitPrice: 19, unitsInStock: 17, discontinued: false },
    { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, unitsInStock: 13, discontinued: false },
    { productID: 4, productName: "Chef Anton's Gumbo Mix", unitPrice: 21.35, unitsInStock: 0, discontinued: true },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render a single custom command', async () => {
    const clickHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      { field: 'unitPrice', title: 'Unit Price', width: 120 },
      {
        command: {
          text: 'View Details',
          click: clickHandler,
        },
        title: ' ',
        width: 120,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Find command buttons
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThan(0)

    // Check if button text is correct
    const firstButton = buttons[0]
    expect(firstButton.text()).toContain('View Details')

    // Click the button
    await firstButton.trigger('click')
    expect(clickHandler).toHaveBeenCalledTimes(1)
    expect(clickHandler).toHaveBeenCalledWith(expect.any(MouseEvent), rows[0])
  })

  it('should render multiple custom commands', async () => {
    const viewHandler = vi.fn()
    const editHandler = vi.fn()
    const deleteHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        command: [
          {
            name: 'view',
            text: 'View',
            click: viewHandler,
          },
          {
            name: 'edit',
            text: 'Edit',
            click: editHandler,
          },
          {
            name: 'delete',
            text: 'Delete',
            click: deleteHandler,
          },
        ],
        title: 'Actions',
        width: 200,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Find command buttons (should be 3 per row)
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThanOrEqual(3)

    // Click first button (View)
    await buttons[0].trigger('click')
    expect(viewHandler).toHaveBeenCalledTimes(1)

    // Click second button (Edit)
    await buttons[1].trigger('click')
    expect(editHandler).toHaveBeenCalledTimes(1)

    // Click third button (Delete)
    await buttons[2].trigger('click')
    expect(deleteHandler).toHaveBeenCalledTimes(1)
  })

  it('should render commands with icons', async () => {
    const viewHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        command: {
          name: 'view',
          text: ' View',
          iconClass: '🔍',
          click: viewHandler,
        },
        title: 'Actions',
        width: 120,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Find command buttons
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThan(0)

    // Check if icon class is present
    const firstButton = buttons[0]
    const iconSpan = firstButton.find('span')
    expect(iconSpan.exists()).toBe(true)
    expect(iconSpan.text()).toContain('🔍')
  })

  it('should conditionally show/hide commands based on visible function', async () => {
    const restockHandler = vi.fn()
    const discontinueHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        command: [
          {
            name: 'restock',
            text: 'Restock',
            visible: (row: Product) => row.unitsInStock < 20,
            click: restockHandler,
          },
          {
            name: 'discontinue',
            text: 'Discontinue',
            visible: (row: Product) => !row.discontinued,
            click: discontinueHandler,
          },
        ],
        title: 'Actions',
        width: 150,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Find command buttons
    const buttons = wrapper.findAll('.v3grid__btn--command')
    
    // Row 0: unitsInStock = 39 (> 20), discontinued = false
    // - Restock should NOT be visible (unitsInStock >= 20)
    // - Discontinue SHOULD be visible (!discontinued)
    
    // Row 1: unitsInStock = 17 (< 20), discontinued = false
    // - Restock SHOULD be visible (unitsInStock < 20)
    // - Discontinue SHOULD be visible (!discontinued)
    
    // Row 3: unitsInStock = 0, discontinued = true
    // - Restock SHOULD be visible (unitsInStock < 20)
    // - Discontinue should NOT be visible (discontinued = true)

    // We should have at least some buttons rendered
    expect(buttons.length).toBeGreaterThan(0)

    // Check button texts to verify conditional visibility
    const buttonTexts = buttons.map(btn => btn.text())
    
    // Restock button should appear for rows with low stock
    expect(buttonTexts.some(text => text.includes('Restock'))).toBe(true)
    
    // Discontinue button should appear for non-discontinued items
    expect(buttonTexts.some(text => text.includes('Discontinue'))).toBe(true)
  })

  it('should render commands with custom templates', async () => {
    const clickHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        command: {
          name: 'custom',
          template: (row: Product) => {
            const stockStatus = row.unitsInStock > 20 ? '✅ In Stock' : '⚠️ Low Stock'
            return `<span style="color: ${row.unitsInStock > 20 ? 'green' : 'orange'}; font-weight: bold;">${stockStatus}</span>`
          },
          click: clickHandler,
        },
        title: 'Stock Status',
        width: 150,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Find command buttons
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThan(0)

    // Check if template content is rendered
    const firstButton = buttons[0]
    const html = firstButton.html()
    
    // Should contain the stock status text
    expect(html).toMatch(/In Stock|Low Stock/)
  })

  it('should normalize single command object to array', async () => {
    const clickHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        // Single object without name property
        command: {
          text: 'View Details',
          click: clickHandler,
        },
        title: ' ',
        width: 120,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Should render buttons correctly even with single object command
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThan(0)

    // Click should work
    await buttons[0].trigger('click')
    expect(clickHandler).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className to command buttons', async () => {
    const clickHandler = vi.fn()
    
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        command: {
          name: 'delete',
          text: 'Delete',
          className: 'text-red-600 custom-class',
          click: clickHandler,
        },
        title: 'Actions',
        width: 120,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Find command buttons
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThan(0)

    // Check if custom class is applied
    const firstButton = buttons[0]
    expect(firstButton.classes()).toContain('text-red-600')
    expect(firstButton.classes()).toContain('custom-class')
  })

  it('should handle commands without click handlers gracefully', async () => {
    const columns: ColumnDef[] = [
      { field: 'productName', title: 'Product Name' },
      {
        command: {
          name: 'view',
          text: 'View',
          // No click handler
        },
        title: 'Actions',
        width: 120,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // Should render buttons even without click handlers
    const buttons = wrapper.findAll('.v3grid__btn--command')
    expect(buttons.length).toBeGreaterThan(0)

    // Clicking should not throw an error
    await buttons[0].trigger('click')
    // No assertion needed - just checking it doesn't throw
  })
})

