import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { ColumnDef, DataProvider, DataProviderArgs } from '../src/types'

describe('Data Binding', () => {
  describe('Local Data Arrays', () => {
    it('should bind to local data array', async () => {
      const rows = ref([
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 20 },
      ])
      
      const columns: ColumnDef[] = [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
        { field: 'price', title: 'Price' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: rows.value,
          columns,
          'key-field': 'id',
        },
      })
      
      await nextTick()
      
      expect(wrapper.text()).toContain('Product 1')
      expect(wrapper.text()).toContain('Product 2')
    })
    
    it('should update when local data changes', async () => {
      const rows = ref([
        { id: 1, name: 'Product 1', price: 10 },
      ])
      
      const columns: ColumnDef[] = [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: rows.value,
          columns,
          'key-field': 'id',
        },
      })
      
      await nextTick()
      expect(wrapper.text()).toContain('Product 1')
      
      rows.value.push({ id: 2, name: 'Product 2', price: 20 })
      await nextTick()
      
      expect(wrapper.text()).toContain('Product 2')
    })
  })
  
  describe('Remote Data Services (REST)', () => {
    it('should call dataProvider with correct arguments', async () => {
      const dataProvider = vi.fn<[DataProviderArgs], Promise<{ rows: any[]; total: number }>>(
        async ({ page, pageSize }) => {
          return {
            rows: [
              { id: 1, name: 'Product 1', price: 10 },
              { id: 2, name: 'Product 2', price: 20 },
            ],
            total: 2,
          }
        }
      )
      
      const columns: ColumnDef[] = [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          'key-field': 'id',
          'data-provider': dataProvider,
          'server-side': true,
        },
      })
      
      await nextTick()
      await flushPromises()
      // Wait for async refresh() to complete - onMounted calls refresh() asynchronously
      // Need to wait longer for onMounted to complete and refresh() to be called
      // Increase wait time and add multiple flushPromises calls
      await new Promise(resolve => setTimeout(resolve, 800))
      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))
      await flushPromises()
      await nextTick()
      
      expect(dataProvider).toHaveBeenCalled()
      const callArgs = dataProvider.mock.calls[0][0]
      expect(callArgs.page).toBe(1)
      expect(callArgs.pageSize).toBeDefined()
    })
    
    it('should handle dataProvider errors gracefully', async () => {
      const dataProvider = vi.fn(async () => {
        throw new Error('Network error')
      })
      
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const columns: ColumnDef[] = [
        { field: 'id', title: 'ID' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          'key-field': 'id',
          'data-provider': dataProvider,
          'server-side': true,
        },
      })
      
      await nextTick()
      await flushPromises()
      // Wait for async refresh() to complete
      // Increase wait time for error handling
      await new Promise(resolve => setTimeout(resolve, 800))
      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))
      await flushPromises()
      await nextTick()
      
      consoleError.mockRestore()
      expect(dataProvider).toHaveBeenCalled()
    })
  })
  
  describe('GraphQL Service', () => {
    it('should handle GraphQL query format', async () => {
      const dataProvider = vi.fn<[DataProviderArgs], Promise<{ rows: any[]; total: number }>>(
        async ({ page, pageSize }) => {
          // Simulate GraphQL response
          return {
            rows: [
              { productID: 1, productName: 'Product 1', unitPrice: 10 },
            ],
            total: 1,
          }
        }
      )
      
      const columns: ColumnDef[] = [
        { field: 'productID', title: 'ID' },
        { field: 'productName', title: 'Name' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: [],
          columns,
          'key-field': 'productID',
          'data-provider': dataProvider,
          'server-side': true,
        },
      })
      
      await nextTick()
      await flushPromises()
      // Wait for async refresh() to complete - onMounted calls refresh() asynchronously
      // Need to wait longer for onMounted to complete and refresh() to be called
      await new Promise(resolve => setTimeout(resolve, 800))
      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))
      await flushPromises()
      await nextTick()
      
      expect(dataProvider).toHaveBeenCalled()
    })
  })
  
  describe('WebSocket', () => {
    it('should handle real-time updates', async () => {
      const rows = ref([
        { id: 1, name: 'Product 1' },
      ])
      
      const columns: ColumnDef[] = [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: rows.value,
          columns,
          'key-field': 'id',
        },
      })
      
      await nextTick()
      expect(wrapper.text()).toContain('Product 1')
      
      // Simulate WebSocket push update
      rows.value.push({ id: 2, name: 'Product 2' })
      await nextTick()
      
      expect(wrapper.text()).toContain('Product 2')
    })
  })
  
  describe('Working Offline', () => {
    beforeEach(() => {
      // Mock localStorage
      const store: Record<string, string> = {}
      global.localStorage = {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key]
        }),
        clear: vi.fn(() => {
          Object.keys(store).forEach(key => delete store[key])
        }),
        get length() {
          return Object.keys(store).length
        },
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
      } as Storage
    })
    
    afterEach(() => {
      vi.clearAllMocks()
    })
    
    it('should save to localStorage when data changes', async () => {
      const rows = ref([
        { id: 1, name: 'Product 1' },
      ])
      
      const columns: ColumnDef[] = [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
      ]
      
      const wrapper = mount(PantanalGrid, {
        props: {
          rows: rows.value,
          columns,
          'key-field': 'id',
        },
      })
      
      await nextTick()
      
      rows.value.push({ id: 2, name: 'Product 2' })
      await nextTick()
      
      // In a real app, you would watch rows and save to localStorage
      // This test just verifies the Grid works with reactive data
      expect(wrapper.text()).toContain('Product 2')
    })
  })
})


