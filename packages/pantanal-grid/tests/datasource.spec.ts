import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import DataSource from '../src/components/DataSource.vue'
import type { DataSourceTransport, DataSourceSchema } from '../src/types'

type Row = { id: number; name: string; price: number; category: string }

describe('PantanalDataSource', () => {
  const mockData: Row[] = [
    { id: 1, name: 'Product A', price: 100, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 50, category: 'Clothing' },
    { id: 3, name: 'Product C', price: 75, category: 'Electronics' },
    { id: 4, name: 'Product D', price: 200, category: 'Books' },
    { id: 5, name: 'Product E', price: 150, category: 'Clothing' },
  ]

  describe('Local DataSource', () => {
    it('should initialize with local data', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
      expect(data[0].name).toBe('Product A')
    })

    it('should filter data client-side', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
          filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(2)
      expect(data.every((item: Row) => item.category === 'Electronics')).toBe(true)
    })

    it('should sort data client-side', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
          sort: [{ field: 'price', dir: 'desc' }],
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data[0].price).toBe(200)
      expect(data[data.length - 1].price).toBe(50)
    })

    it('should paginate data client-side', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 2,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(2)
      expect(data[0].id).toBe(1)

      await wrapper.setProps({ page: 2 })
      await wrapper.vm.$nextTick()

      const data2 = instance.data()
      expect(data2).toHaveLength(2)
      expect(data2[0].id).toBe(3)
    })

    it('should return correct total', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 2,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      expect(instance.total()).toBe(5)
    })

    it('should emit change event when data changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      // DataSource may emit change events on initialization and when data changes
      // Allow for multiple change events (initialization + data change)
      expect(wrapper.emitted('change')).toBeDefined()
      const changeEvents = wrapper.emitted('change')
      expect(changeEvents).toBeDefined()
      if (changeEvents && changeEvents.length > 0) {
        // Verify that at least one change event was emitted with data
        const lastEvent = changeEvents[changeEvents.length - 1]
        expect(Array.isArray(lastEvent[0])).toBe(true)
      }
    })

    it('should update data when filter changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        filter: [{ field: 'name', operator: 'contains', value: 'A' }],
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Product A')
    })

    it('should update data when sort changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        sort: [{ field: 'name', dir: 'asc' }],
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data[0].name).toBe('Product A')
      expect(data[data.length - 1].name).toBe('Product E')
    })

    it('should query method update state', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      instance.query({ page: 2, pageSize: 2 })

      await wrapper.vm.$nextTick()

      const data = instance.data()
      expect(data).toHaveLength(2)
      expect(data[0].id).toBe(3)
    })
  })

  describe('Remote DataSource', () => {
    let mockFetch: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockFetch = vi.fn()
      global.fetch = mockFetch
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should read data from remote service', async () => {
      const mockResponse = {
        products: mockData,
        total: 5,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.products || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async read

      expect(mockFetch).toHaveBeenCalled()
      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
      expect(instance.total()).toBe(5)
    })

    it('should use custom read function', async () => {
      const mockRead = vi.fn().mockResolvedValue({
        products: mockData,
        total: 5,
      })

      const transport: DataSourceTransport = {
        read: mockRead,
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.products || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockRead).toHaveBeenCalled()
      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
    })

    it('should emit requestStart and requestEnd events', async () => {
      const mockResponse = {
        products: mockData,
        total: 5,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.products || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('requestStart')).toBeDefined()
      expect(wrapper.emitted('requestEnd')).toBeDefined()
    })

    it('should emit error event on fetch failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.products || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('error')).toBeDefined()
    })

    it('should use parameterMap for custom parameters', async () => {
      const mockRead = vi.fn().mockResolvedValue({
        products: mockData,
        total: 5,
      })

      const parameterMap = vi.fn((data: any) => ({
        ...data,
        customParam: 'customValue',
      }))

      const transport: DataSourceTransport = {
        read: mockRead,
        parameterMap,
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.products || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 2,
          pageSize: 5,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(parameterMap).toHaveBeenCalled()
      expect(mockRead).toHaveBeenCalled()
      const callArgs = mockRead.mock.calls[0][0]
      expect(callArgs.data.customParam).toBe('customValue')
    })

    it('should refresh data when read() is called', async () => {
      const mockResponse1 = {
        products: mockData,
        total: 5,
      }

      const mockResponse2 = {
        products: [...mockData, { id: 6, name: 'Product F', price: 300, category: 'Electronics' }],
        total: 6,
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2,
        })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.products || [],
        total: (response: any) => response.total || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      expect(instance.data()).toHaveLength(5)

      await instance.read()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(instance.data()).toHaveLength(6)
      expect(instance.total()).toBe(6)
    })
  })

  describe('DataSource Events', () => {
    it('should emit update:page when page changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      await wrapper.setProps({ page: 2 })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:page')).toBeDefined()
      const events = wrapper.emitted('update:page')
      expect(events![events!.length - 1][0]).toBe(2)
    })

    it('should emit update:pageSize when pageSize changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      await wrapper.setProps({ pageSize: 20 })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:pageSize')).toBeDefined()
      const events = wrapper.emitted('update:pageSize')
      expect(events![events!.length - 1][0]).toBe(20)
    })

    it('should emit update:sort when sort changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        sort: [{ field: 'name', dir: 'asc' }],
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:sort')).toBeDefined()
    })

    it('should emit update:filter when filter changes', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:filter')).toBeDefined()
    })
  })

  describe('DataSource Methods', () => {
    it('should expose data() method', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      expect(typeof instance.data).toBe('function')
      const data = instance.data()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should expose total() method', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      expect(typeof instance.total).toBe('function')
      const total = instance.total()
      expect(typeof total).toBe('number')
      expect(total).toBe(5)
    })

    it('should expose read() method', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      expect(typeof instance.read).toBe('function')
    })

    it('should expose sync() method', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      expect(typeof instance.sync).toBe('function')
    })

    it('should expose query() method', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      expect(typeof instance.query).toBe('function')
    })

    it('should expose query() method with all options', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      instance.query({
        page: 3,
        pageSize: 2,
        sort: [{ field: 'price', dir: 'asc' }],
        filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
        group: [{ field: 'category', dir: 'asc' }],
      })

      await wrapper.vm.$nextTick()

      const data = instance.data()
      expect(data.length).toBeLessThanOrEqual(2)
    })
  })

  describe('Remote DataSource - Server Operations', () => {
    let mockFetch: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockFetch = vi.fn()
      global.fetch = mockFetch
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should trigger read on page change with serverPaging', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData, total: 5 }),
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          serverPaging: true,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const initialCallCount = mockFetch.mock.calls.length

      await wrapper.setProps({ page: 2 })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should have triggered another read
      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should trigger read on pageSize change with serverPaging', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData, total: 5 }),
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          serverPaging: true,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const initialCallCount = mockFetch.mock.calls.length

      await wrapper.setProps({ pageSize: 5 })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should have triggered another read
      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should trigger read on sort change with serverSorting', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData, total: 5 }),
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          serverSorting: true,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const initialCallCount = mockFetch.mock.calls.length

      await wrapper.setProps({
        sort: [{ field: 'name', dir: 'asc' }],
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should have triggered another read
      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should trigger read on filter change with serverFiltering', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData, total: 5 }),
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          serverFiltering: true,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const initialCallCount = mockFetch.mock.calls.length

      await wrapper.setProps({
        filter: [{ field: 'category', operator: 'eq', value: 'Electronics' }],
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should have triggered another read
      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should trigger read on group change with serverGrouping', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData, total: 5 }),
      })

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          serverGrouping: true,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const initialCallCount = mockFetch.mock.calls.length

      await wrapper.setProps({
        group: [{ field: 'category', dir: 'asc' }],
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should have triggered another read
      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should handle sync() method call', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      await instance.sync()

      expect(wrapper.emitted('sync')).toBeDefined()
    })
  })

  describe('DataSource Schema Parsing', () => {
    it('should parse schema with results array', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: mockData,
          count: 5,
        }),
      })

      global.fetch = mockFetch

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
      expect(instance.total()).toBe(5)

      vi.restoreAllMocks()
    })

    it('should parse schema with custom data function', async () => {
      const mockRead = vi.fn().mockResolvedValue({
        custom: {
          items: mockData,
          totalCount: 5,
        },
      })

      const transport: DataSourceTransport = {
        read: mockRead,
      }

      const schema: DataSourceSchema = {
        data: (response: any) => response.custom.items || [],
        total: (response: any) => response.custom.totalCount || 0,
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
      expect(instance.total()).toBe(5)
    })

    it('should parse schema with string paths', async () => {
      const mockRead = vi.fn().mockResolvedValue({
        response: {
          items: mockData,
          metadata: {
            total: 5,
          },
        },
      })

      const transport: DataSourceTransport = {
        read: mockRead,
      }

      const schema: DataSourceSchema = {
        data: 'response.items',
        total: 'response.metadata.total',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
          autoBind: true,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
      expect(instance.total()).toBe(5)
    })

    it('should parse schema with parse function', async () => {
      const mockRead = vi.fn().mockResolvedValue({
        products: mockData,
        total: 5,
      })

      const transport: DataSourceTransport = {
        read: mockRead,
      }

      const schema: DataSourceSchema = {
        parse: (response: any) => ({
          data: response.products,
          total: response.total,
        }),
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(5)
      expect(instance.total()).toBe(5)
    })

    it('should handle schema errors', async () => {
      const mockRead = vi.fn().mockResolvedValue({
        data: mockData,
        errors: ['Error 1', 'Error 2'],
      })

      const transport: DataSourceTransport = {
        read: mockRead,
      }

      const schema: DataSourceSchema = {
        data: 'data',
        errors: 'errors',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          schema,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('error')).toBeDefined()
    })

    it('should handle relative URLs', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData }),
      })

      global.fetch = mockFetch

      const transport: DataSourceTransport = {
        read: '/api/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockFetch).toHaveBeenCalled()
      // Should convert relative URL to absolute
      const fetchCall = mockFetch.mock.calls[0][0]
      expect(fetchCall).toContain('/api/products')

      vi.restoreAllMocks()
    })

    it('should handle AbortError gracefully', async () => {
      const mockFetch = vi.fn().mockImplementation(() => {
        const controller = new AbortController()
        controller.abort()
        return Promise.reject(new DOMException('Aborted', 'AbortError'))
      })

      global.fetch = mockFetch

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should not emit error for AbortError
      const errorEvents = wrapper.emitted('error')
      // AbortError should not emit error event
      expect(errorEvents).toBeUndefined() || (errorEvents && errorEvents.length === 0)

      vi.restoreAllMocks()
    })

    it('should handle HTTP error responses', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      global.fetch = mockFetch

      const transport: DataSourceTransport = {
        read: 'https://api.example.com/products',
      }

      const wrapper = mount(DataSource, {
        props: {
          type: 'remote',
          transport,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('error')).toBeDefined()

      vi.restoreAllMocks()
    })
  })

  describe('DataSource Grouping', () => {
    it('should group data client-side', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
          group: [{ field: 'category', dir: 'asc' }],
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should paginate grouped data', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 2,
          group: [{ field: 'category', dir: 'asc' }],
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data.length).toBeLessThanOrEqual(2)
    })
  })

  describe('DataSource Edge Cases', () => {
    it('should handle empty data array', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: [],
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(data).toHaveLength(0)
      expect(instance.total()).toBe(0)
    })

    it('should handle null data', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: null as any,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should handle undefined data', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: undefined as any,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      const data = instance.data()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should handle read() when no transport', async () => {
      const wrapper = mount(DataSource, {
        props: {
          type: 'local',
          data: mockData,
          page: 1,
          pageSize: 10,
        },
      })

      await wrapper.vm.$nextTick()

      const instance = wrapper.vm as any
      // Should not throw when calling read() without transport
      await expect(instance.read()).resolves.not.toThrow()
    })
  })
})

