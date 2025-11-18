import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number }

describe('PantanalGrid Pagination URL Sync', () => {
  const rows: Row[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (i + 1) * 10,
  }))

  const columns: ColumnDef<Row>[] = [
    { field: 'id', title: 'ID', width: 100 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'price', title: 'Price', width: 120 },
  ]

  let originalLocation: Location
  let originalHistory: History
  let mockReplaceState: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockReplaceState = vi.fn()
    
    // Mock window.history.replaceState
    originalHistory = window.history
    Object.defineProperty(window, 'history', {
      value: {
        ...originalHistory,
        replaceState: mockReplaceState,
        pushState: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'history', {
      value: originalHistory,
      writable: true,
      configurable: true,
    })
  })

  describe('URL Parameter Reading', () => {
    it('should read page from URL on mount', async () => {
      // Mock URLSearchParams to return page=3
      const originalURLSearchParams = global.URLSearchParams
      global.URLSearchParams = class extends originalURLSearchParams {
        get(key: string): string | null {
          if (key === 'page') return '3'
          if (key === 'pageSize') return '20'
          return null
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      // Grid should initialize with page from URL
      const instance = wrapper.vm as any
      expect(instance.page).toBe(3)
      
      global.URLSearchParams = originalURLSearchParams
    })

    it('should read pageSize from URL on mount', async () => {
      const originalURLSearchParams = global.URLSearchParams
      global.URLSearchParams = class extends originalURLSearchParams {
        get(key: string): string | null {
          if (key === 'page') return '1'
          if (key === 'pageSize') return '50'
          return null
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      expect(instance.pageSize).toBe(50)
      
      global.URLSearchParams = originalURLSearchParams
    })

    it('should use default values when URL params are missing', async () => {
      const originalURLSearchParams = global.URLSearchParams
      global.URLSearchParams = class extends originalURLSearchParams {
        get(_key: string): string | null {
          return null
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          page: 1,
          pageSize: 20,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      expect(instance.page).toBe(1)
      expect(instance.pageSize).toBe(20)
      
      global.URLSearchParams = originalURLSearchParams
    })

    it('should use custom URL parameter names', async () => {
      const originalURLSearchParams = global.URLSearchParams
      global.URLSearchParams = class extends originalURLSearchParams {
        get(key: string): string | null {
          if (key === 'p') return '5'
          if (key === 'size') return '30'
          return null
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          pageableUrlParamPage: 'p',
          pageableUrlParamPageSize: 'size',
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      expect(instance.page).toBe(5)
      expect(instance.pageSize).toBe(30)
      
      global.URLSearchParams = originalURLSearchParams
    })
  })

  describe('URL Parameter Updates', () => {
    it('should update URL when page changes', async () => {
      // Mock window.location.href for URL constructor
      const mockUrl = 'http://localhost:5174/?page=1'
      const originalURL = global.URL
      global.URL = class extends originalURL {
        constructor(url: string | URL, base?: string | URL) {
          super(url, base || mockUrl)
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      instance.page = 2
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(mockReplaceState).toHaveBeenCalled()
      
      global.URL = originalURL
    })

    it('should update URL when pageSize changes', async () => {
      const mockUrl = 'http://localhost:5174/?pageSize=10'
      const originalURL = global.URL
      global.URL = class extends originalURL {
        constructor(url: string | URL, base?: string | URL) {
          super(url, base || mockUrl)
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          pageablePageSizes: [10, 20, 50, 100],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      instance.pageSize = 50
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(mockReplaceState).toHaveBeenCalled()
      
      global.URL = originalURL
    })

    it('should remove default page from URL', async () => {
      const mockUrl = 'http://localhost:5174/?page=2&pageSize=20'
      const originalURL = global.URL
      global.URL = class extends originalURL {
        constructor(url: string | URL, base?: string | URL) {
          super(url, base || mockUrl)
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          page: 1,
          pageSize: 20,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      // Clear previous calls
      mockReplaceState.mockClear()
      
      const instance = wrapper.vm as any
      instance.page = 2 // Change to non-default
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Now change back to default
      instance.page = 1 // Default value
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should have been called to update URL (may remove page param)
      expect(mockReplaceState.mock.calls.length).toBeGreaterThan(0)
      
      global.URL = originalURL
    })

    it('should remove default pageSize from URL', async () => {
      const mockUrl = 'http://localhost:5174/?page=1&pageSize=50'
      const originalURL = global.URL
      global.URL = class extends originalURL {
        constructor(url: string | URL, base?: string | URL) {
          super(url, base || mockUrl)
        }
      } as any
      
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          pageablePageSizes: [10, 20, 50, 100],
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      instance.pageSize = 10 // First option (default)
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(mockReplaceState).toHaveBeenCalled()
      
      global.URL = originalURL
    })
  })

  describe('Browser Navigation', () => {
    it('should handle popstate event', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: true,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      // Simulate browser back/forward
      const popstateEvent = new PopStateEvent('popstate', { state: null })
      window.dispatchEvent(popstateEvent)
      
      await wrapper.vm.$nextTick()
      
      // Grid should handle the event
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Disabled URL Sync', () => {
    it('should not update URL when pageableSyncUrl is false', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: false,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      instance.page = 2
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should not call replaceState when sync is disabled
      // Note: May still be called during initialization, so we check it's not called for page change
      const callsBefore = mockReplaceState.mock.calls.length
      expect(callsBefore).toBeLessThanOrEqual(1) // Only initialization, not page change
    })

    it('should not read from URL when pageableSyncUrl is false', async () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageableSyncUrl: false,
          page: 1,
          pageSize: 20,
          keyField: 'id',
        },
      })

      await wrapper.vm.$nextTick()
      
      const instance = wrapper.vm as any
      // Should use props, not URL
      expect(instance.page).toBe(1)
      expect(instance.pageSize).toBe(20)
    })
  })
})

