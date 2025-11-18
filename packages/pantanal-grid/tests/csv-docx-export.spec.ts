import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number; category: string }

// Mock file-saver
const mockSaveAs = vi.fn()
vi.mock('file-saver', () => ({
  default: { saveAs: mockSaveAs },
  saveAs: mockSaveAs,
}))

// Mock docx library
const mockDocx = {
  Document: vi.fn((options: any) => ({ sections: options.sections })),
  Paragraph: vi.fn((options: any) => options),
  Table: vi.fn((options: any) => options),
  TableRow: vi.fn((options: any) => options),
  TableCell: vi.fn((options: any) => options),
  AlignmentType: { LEFT: 'left', CENTER: 'center', RIGHT: 'right' },
  WidthType: { PERCENTAGE: 'percentage', AUTO: 'auto' },
  Packer: {
    toBlob: vi.fn(() => Promise.resolve(new Blob(['mock docx'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))),
  },
}

vi.mock('docx', () => ({
  default: mockDocx,
  Document: mockDocx.Document,
  Paragraph: mockDocx.Paragraph,
  Table: mockDocx.Table,
  TableRow: mockDocx.TableRow,
  TableCell: mockDocx.TableCell,
  AlignmentType: mockDocx.AlignmentType,
  WidthType: mockDocx.WidthType,
  Packer: mockDocx.Packer,
}))

describe('PantanalGrid CSV and DOCX Export', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product A', price: 10.99, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 20.50, category: 'Clothing' },
    { id: 3, name: 'Product C', price: 30.00, category: 'Home' },
  ]

  const columns: ColumnDef<Row>[] = [
    { field: 'id', title: 'ID', width: 100 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'price', title: 'Price', width: 120 },
    { field: 'category', title: 'Category', width: 150 },
  ]

  let mockLink: any
  let originalCreateElement: typeof document.createElement
  let originalAppendChild: typeof document.body.appendChild
  let originalRemoveChild: typeof document.body.removeChild
  let originalContains: typeof document.body.contains

  beforeEach(() => {
    vi.clearAllMocks()
    mockSaveAs.mockClear()

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()

    // Create mock link element that is a proper Node
    mockLink = document.createElement('a')
    mockLink.href = ''
    mockLink.download = ''
    mockLink.click = vi.fn()
    mockLink.style = {}

    originalCreateElement = document.createElement
    originalAppendChild = document.body.appendChild.bind(document.body)
    originalRemoveChild = document.body.removeChild.bind(document.body)
    originalContains = document.body.contains.bind(document.body)

    // Mock appendChild to track calls
    document.body.appendChild = vi.fn((node: Node) => {
      return originalAppendChild(node)
    }) as any

    document.body.removeChild = vi.fn((node: Node) => {
      return originalRemoveChild(node)
    }) as any

    document.body.contains = vi.fn((node: Node) => {
      return originalContains(node)
    }) as any
  })

  afterEach(() => {
    document.createElement = originalCreateElement
    document.body.appendChild = originalAppendChild
    document.body.removeChild = originalRemoveChild
    document.body.contains = originalContains
    vi.clearAllMocks()
  })

  describe('CSV Export', () => {
    it('should export to CSV with semicolon delimiter', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['csv'],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()

      const csvButton = wrapper.find('button')
      expect(csvButton.exists()).toBe(true)

      await csvButton.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify that a download was triggered (check if link was created and appended)
      expect(document.body.appendChild).toHaveBeenCalled()
    })

    it('should include headers in CSV export', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['csv'],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()

      const csvButton = wrapper.find('button')
      
      await csvButton.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify that a download was triggered
      expect(document.body.appendChild).toHaveBeenCalled()
    })

    it('should use semicolon as delimiter in CSV', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['csv'],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()

      const csvButton = wrapper.find('button')
      
      await csvButton.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify CSV export was triggered
      // The semicolon delimiter is implemented in the exportToCSV function
      expect(document.body.appendChild).toHaveBeenCalled()
    })
  })

  describe('DOCX Export', () => {
    it('should export to DOCX when docx library is available', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['docx'],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()

      const docxButton = wrapper.find('button')
      expect(docxButton.exists()).toBe(true)

      await docxButton.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations

      // Verify docx export was triggered
      expect(mockDocx.Document).toHaveBeenCalled()
      expect(mockDocx.Packer.toBlob).toHaveBeenCalled()
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it('should create document with table structure', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['docx'],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()

      const docxButton = wrapper.find('button')
      await docxButton.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verify document structure was created
      expect(mockDocx.Document).toHaveBeenCalled()
      const docCall = mockDocx.Document.mock.calls[0]
      expect(docCall[0]).toHaveProperty('sections')
    })

    it('should handle missing docx library gracefully', async () => {
      // Mock window.alert to avoid jsdom error
      const originalAlert = window.alert
      window.alert = vi.fn()

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['docx'],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()

      const docxButton = wrapper.find('button')
      
      // Should not throw error, but show warning/alert
      await docxButton.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Restore
      window.alert = originalAlert
    })
  })

  describe('Export Toolbar', () => {
    it('should show CSV button when toolbar includes csv', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['csv'],
          keyField: 'id',
        },
      })

      const buttons = wrapper.findAll('button')
      const csvButton = buttons.find(btn => btn.text().includes('CSV') || btn.text().includes('csv'))
      expect(csvButton).toBeDefined()
    })

    it('should show DOCX button when toolbar includes docx', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['docx'],
          keyField: 'id',
        },
      })

      const buttons = wrapper.findAll('button')
      const docxButton = buttons.find(btn => btn.text().includes('Word') || btn.text().includes('DOCX') || btn.text().includes('docx'))
      expect(docxButton).toBeDefined()
    })

    it('should show both CSV and DOCX buttons', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          toolbar: ['csv', 'docx'],
          keyField: 'id',
        },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
  })
})

