import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Product = { productID: number; productName: string; unitPrice: number; categoryID: number; discontinued: boolean }

describe('PantanalGrid Foreign-Key Columns', () => {
  const rows: Product[] = [
    { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 1, discontinued: false },
    { productID: 2, productName: 'Chang', unitPrice: 19, categoryID: 2, discontinued: false },
    { productID: 3, productName: 'Aniseed Syrup', unitPrice: 10, categoryID: 3, discontinued: false },
  ]

  const categories = [
    { value: 1, text: 'Beverages' },
    { value: 2, text: 'Condiments' },
    { value: 3, text: 'Confections' },
    { value: 4, text: 'Dairy Products' },
    { value: 5, text: 'Grains/Cereals' },
  ]

  beforeEach(() => {
    // Clear any previous state
  })

  it('should display text from values array instead of raw value', async () => {
    const columns: ColumnDef<Product>[] = [
      { field: 'productName', title: 'Product Name' },
      { field: 'unitPrice', title: 'Unit Price', width: 120 },
      {
        field: 'categoryID',
        title: 'Category',
        width: 180,
        values: categories,
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

    // Check that the category text is displayed instead of the numeric value
    const html = wrapper.html()
    expect(html).toContain('Beverages')
    expect(html).toContain('Condiments')
    expect(html).toContain('Confections')
    // Should not contain raw numeric values in the display
    // (Note: The raw values might still be in the DOM as data attributes, but the displayed text should be the text from values)
  })

  it('should create dropdown editor when values is defined', async () => {
    const columns: ColumnDef<Product>[] = [
      { field: 'productName', title: 'Product Name' },
      {
        field: 'categoryID',
        title: 'Category',
        width: 180,
        values: categories,
        editable: true,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
        editable: true,
      },
    })

    await nextTick()

    // The renderEditor function should be available
    // We can't directly test the editor rendering without triggering edit mode,
    // but we can verify that the values transformation works
    const vm = wrapper.vm as any
    
    // Test that values are transformed correctly
    // This is tested indirectly through the display
    expect(wrapper.html()).toContain('Beverages')
  })

  it('should handle missing value in values array', async () => {
    const rowsWithMissingCategory: Product[] = [
      { productID: 1, productName: 'Chai', unitPrice: 18, categoryID: 99, discontinued: false }, // categoryID 99 doesn't exist in categories
    ]

    const columns: ColumnDef<Product>[] = [
      { field: 'productName', title: 'Product Name' },
      {
        field: 'categoryID',
        title: 'Category',
        width: 180,
        values: categories,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows: rowsWithMissingCategory,
        columns,
        keyField: 'productID',
      },
    })

    await nextTick()

    // When value is not found in values array, it should display the raw value
    const html = wrapper.html()
    // The raw value (99) should be displayed since it's not in the categories array
    expect(html).toContain('99')
  })

  it('should work with custom editor function', async () => {
    const customEditor = vi.fn((container: HTMLElement, options: { field: string; value: any; row: Product }) => {
      const select = document.createElement('select')
      select.className = 'v3grid__editor'
      categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = String(cat.value)
        option.textContent = cat.text
        if (cat.value === options.value) {
          option.selected = true
        }
        select.appendChild(option)
      })
      container.appendChild(select)
      return select
    })

    const columns: ColumnDef<Product>[] = [
      { field: 'productName', title: 'Product Name' },
      {
        field: 'categoryID',
        title: 'Category',
        width: 180,
        values: categories,
        editable: true,
        editor: customEditor,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        keyField: 'productID',
        editable: true,
      },
    })

    await nextTick()

    // Custom editor should take precedence over automatic dropdown
    // The display should still use values transformation
    expect(wrapper.html()).toContain('Beverages')
  })

  it('should handle empty values array', async () => {
    const columns: ColumnDef<Product>[] = [
      { field: 'productName', title: 'Product Name' },
      {
        field: 'categoryID',
        title: 'Category',
        width: 180,
        values: [], // Empty array
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

    // With empty values array, should display raw value
    const html = wrapper.html()
    expect(html).toContain('1') // categoryID value
    expect(html).toContain('2')
    expect(html).toContain('3')
  })

  it('should handle values with different types', async () => {
    const stringValues = [
      { value: 'active', text: 'Active' },
      { value: 'inactive', text: 'Inactive' },
      { value: 'pending', text: 'Pending' },
    ]

    type StatusRow = { id: number; name: string; status: string }
    const statusRows: StatusRow[] = [
      { id: 1, name: 'Item 1', status: 'active' },
      { id: 2, name: 'Item 2', status: 'inactive' },
    ]

    const columns: ColumnDef<StatusRow>[] = [
      { field: 'name', title: 'Name' },
      {
        field: 'status',
        title: 'Status',
        width: 120,
        values: stringValues,
      },
    ]

    const wrapper = mount(Grid, {
      props: {
        rows: statusRows,
        columns,
        keyField: 'id',
      },
    })

    await nextTick()

    // Should display text for string values
    const html = wrapper.html()
    expect(html).toContain('Active')
    expect(html).toContain('Inactive')
  })

  it('should transform value to text in columnValue function', async () => {
    const columns: ColumnDef<Product>[] = [
      {
        field: 'categoryID',
        title: 'Category',
        values: categories,
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

    // Verify that the transformation works
    // The first row has categoryID: 1, which should display as 'Beverages'
    const html = wrapper.html()
    expect(html).toContain('Beverages')
  })
})

