import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { PantanalGrid, type ColumnDef } from '../src'
import { getMessages } from '../src/i18n/messages'

type Product = { productID: number; productName: string; category: string; unitPrice: number; unitsInStock: number }

describe('No Records Props', () => {
  const columns: ColumnDef<Product>[] = [
    { field: 'productName', title: 'Product Name', width: 200 },
    { field: 'category', title: 'Category', width: 150 },
    { field: 'unitPrice', title: 'Unit Price', width: 120, format: '{0:c}' },
    { field: 'unitsInStock', title: 'Units In Stock', width: 120 },
  ]

  describe('Default No Records Message', () => {
    it('should display default message when noRecords is true and no rows are available', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: true,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const msgs = getMessages('en')
      expect(noRecordsEl.text()).toContain(msgs.noRecords || 'No records available')
    })

    it('should not display no records message when rows are present', () => {
      const rows: Product[] = [
        { productID: 1, productName: 'Chai', category: 'Beverages', unitPrice: 18, unitsInStock: 39 },
      ]

      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'productID',
          noRecords: true,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(false)
    })

    it('should not display no records message when noRecords is false', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: false,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(false)
    })
  })

  describe('Custom No Records Message', () => {
    it('should display custom message when noRecords is an object with message', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: { message: 'No products found. Please try adjusting your filters or search criteria.' },
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)
      expect(noRecordsEl.text()).toContain('No products found. Please try adjusting your filters or search criteria.')
    })
  })

  describe('No Records Template (String)', () => {
    it('should render HTML template string when noRecords is an object with template', () => {
      const templateString = '<div style="padding: 2rem;"><strong>No Products Found</strong></div>'

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: { template: templateString },
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('No Products Found')
    })

    it('should render HTML from direct string template', () => {
      const templateString = '<div style="padding: 2rem;"><strong>No data available</strong></div>'

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: templateString,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('No data available')
    })
  })

  describe('No Records Template (Function)', () => {
    it('should render HTML from function template when noRecords is an object with template function', () => {
      const templateFunction = () => {
        return '<div style="padding: 2rem;"><strong>No Products Available</strong></div>'
      }

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: { template: templateFunction },
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('No Products Available')
    })

    it('should render HTML from direct function template', () => {
      const templateFunction = () => {
        return '<div style="padding: 2rem;"><strong>No records to display</strong></div>'
      }

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: templateFunction,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('No records to display')
    })

    it('should call function template when rendering', () => {
      let callCount = 0
      const templateFunction = () => {
        callCount++
        return `<div>Call count: ${callCount}</div>`
      }

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: templateFunction,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)
      expect(callCount).toBeGreaterThan(0)
    })

    it('should handle dynamic content in function template', () => {
      const templateFunction = () => {
        const timestamp = new Date().toLocaleString()
        return `<div style="padding: 2rem;">
          <div>No Products Available</div>
          <div>Last checked: ${timestamp}</div>
        </div>`
      }

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: templateFunction,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('No Products Available')
      expect(htmlContent).toContain('Last checked:')
    })
  })

  describe('Priority and Fallback', () => {
    it('should prioritize template over message when both are provided', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: {
            template: '<div>Template Content</div>',
            message: 'Message Content',
          },
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('Template Content')
      expect(htmlContent).not.toContain('Message Content')
    })

    it('should fall back to default message when template is empty', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: true,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const msgs = getMessages('en')
      expect(noRecordsEl.text()).toContain(msgs.noRecords || 'No records available')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string template', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: { template: '' },
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      // Should fall back to default message
      const msgs = getMessages('en')
      expect(noRecordsEl.text()).toContain(msgs.noRecords || 'No records available')
    })

    it('should handle function that returns empty string', () => {
      const templateFunction = () => ''

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: templateFunction,
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      // Should fall back to default message
      const msgs = getMessages('en')
      expect(noRecordsEl.text()).toContain(msgs.noRecords || 'No records available')
    })

    it('should handle function that returns non-string', () => {
      const templateFunction = () => null as any

      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: { template: templateFunction },
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      // Should fall back to default message
      const msgs = getMessages('en')
      expect(noRecordsEl.text()).toContain(msgs.noRecords || 'No records available')
    })
  })

  describe('Integration with Messages', () => {
    it('should use messages.noRecords when no custom template is provided', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: true,
          locale: 'pt',
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const msgs = getMessages('pt')
      expect(noRecordsEl.text()).toContain(msgs.noRecords || 'Nenhum registro encontrado')
    })

    it('should override messages.noRecords when custom template is provided', () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          keyField: 'productID',
          noRecords: { template: '<div>Custom Template</div>' },
          locale: 'pt',
          height: 300,
        },
      })

      const noRecordsEl = wrapper.find('.v3grid__no-records')
      expect(noRecordsEl.exists()).toBe(true)

      const htmlContent = noRecordsEl.html()
      expect(htmlContent).toContain('Custom Template')
      expect(htmlContent).not.toContain('Nenhum registro encontrado')
    })
  })
})

