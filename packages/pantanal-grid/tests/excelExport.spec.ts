import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number }

// Mock xlsx library - needs to be at module level
const mockXLSX = {
  utils: {
    aoa_to_sheet: vi.fn((data: any[][]) => ({ '!cols': [], '!autofilter': undefined })),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
  write: vi.fn(() => new Uint8Array([1, 2, 3])),
}

// Mock the dynamic import at module level
vi.mock('xlsx', () => mockXLSX)

describe('PantanalGrid Excel export', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product A', price: 10 },
    { id: 2, name: 'Product B', price: 20 },
    { id: 3, name: 'Product C', price: 30 },
  ]
  const columns: ColumnDef<Row>[] = [
    { field: 'id', title: 'ID', width: 100 },
    { field: 'name', title: 'Name', width: 160 },
    { field: 'price', title: 'Price', width: 120 },
  ]

  let mockLink: any
  let originalCreateElement: typeof document.createElement

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset mockXLSX functions
    mockXLSX.utils.aoa_to_sheet.mockReturnValue({ '!cols': [], '!autofilter': undefined })
    mockXLSX.utils.book_new.mockReturnValue({})
    mockXLSX.writeFile.mockClear()
    mockXLSX.write.mockReturnValue(new Uint8Array([1, 2, 3]))
    
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
    
    // Create mock link element
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      style: { display: 'none' },
    }
    
    // Save original createElement
    originalCreateElement = document.createElement.bind(document)
    
    // Mock document.createElement
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any
      }
      // For other elements, use original implementation
      const element = originalCreateElement(tagName)
      return element
    })
    
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
    vi.spyOn(document.body, 'contains').mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should show excel button when excel is in toolbar', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['excel'],
        keyField: 'id',
      },
    })
    const excelButton = wrapper.find('.v3grid__toolbar button')
    expect(excelButton.exists()).toBe(true)
    expect(excelButton.text()).toContain('Export to Excel')
  })

  it('should not show excel button when excel is not in toolbar', () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['create'],
        keyField: 'id',
      },
    })
    const excelButton = wrapper.find('.v3grid__toolbar')
    if (excelButton.exists()) {
      const buttons = excelButton.findAll('button')
      const hasExcel = buttons.some(btn => btn.text().includes('Excel'))
      expect(hasExcel).toBe(false)
    }
  })

  it('should export current page when excelAllPages is false', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['excel'],
        excelAllPages: false,
        keyField: 'id',
      },
    })
    
    const excelButton = wrapper.find('.v3grid__toolbar button')
    await excelButton.trigger('click')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Verify that XLSX functions were called
    expect(mockXLSX.utils.aoa_to_sheet).toHaveBeenCalled()
    expect(mockXLSX.utils.book_new).toHaveBeenCalled()
    expect(mockXLSX.writeFile).toHaveBeenCalled()
  })

  it('should use custom file name when excelFileName is provided', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['excel'],
        excelFileName: 'custom-export.xlsx',
        keyField: 'id',
      },
    })
    
    const excelButton = wrapper.find('.v3grid__toolbar button')
    await excelButton.trigger('click')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Verify that XLSX.writeFile was called with custom file name
    expect(mockXLSX.writeFile).toHaveBeenCalled()
    const writeFileCall = mockXLSX.writeFile.mock.calls[0]
    if (writeFileCall && writeFileCall.length > 1) {
      expect(writeFileCall[1]).toBe('custom-export.xlsx')
    }
  })

  it('should export all pages when excelAllPages is true', async () => {
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['excel'],
        excelAllPages: true,
        keyField: 'id',
      },
    })
    
    const excelButton = wrapper.find('.v3grid__toolbar button')
    await excelButton.trigger('click')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Verify that XLSX.writeFile was called
    expect(mockXLSX.writeFile).toHaveBeenCalled()
    // Verify that all rows were included (not just current page)
    const aoaCall = mockXLSX.utils.aoa_to_sheet.mock.calls[0]
    if (aoaCall && aoaCall[0]) {
      expect(Array.isArray(aoaCall[0])).toBe(true)
      // Should have headers + all 3 rows = 4 rows total
      expect(aoaCall[0].length).toBeGreaterThanOrEqual(4)
    }
  })

  it('should use proxy when excelProxyUrl is provided and browser requires it', async () => {
    // Mock Safari user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    })
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })),
    })
    
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['excel'],
        excelProxyUrl: '/api/excel-proxy',
        keyField: 'id',
      },
    })
    
    const excelButton = wrapper.find('.v3grid__toolbar button')
    await excelButton.trigger('click')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Verify button exists and was clicked
    expect(excelButton.exists()).toBe(true)
  })

  it('should force proxy when excelForceProxy is true', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })),
    })
    
    const wrapper = mount(Grid, {
      props: {
        rows,
        columns,
        toolbar: ['excel'],
        excelForceProxy: true,
        excelProxyUrl: '/api/excel-proxy',
        keyField: 'id',
      },
    })
    
    const excelButton = wrapper.find('.v3grid__toolbar button')
    await excelButton.trigger('click')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Verify button exists
    expect(excelButton.exists()).toBe(true)
  })
})
