import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PivotDataSource from '../src/components/PivotDataSource.vue'
import type { 
  PivotDataSourceSchema, 
  PivotColumn, 
  PivotRow,
  PivotMeasure,
  PivotResult
} from '../src/types'

describe('PivotDataSource', () => {
  describe('Local PivotDataSource', () => {
    it('should initialize with local pivot data', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
        { Country: 'UK', ContactTitle: 'Director', CustomerID: 2 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const columns: PivotColumn[] = [
        { name: 'Country' },
      ]

      const rows: PivotRow[] = [
        { name: 'ContactTitle' },
      ]

      const measures = ['Contacts Count']

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns,
          rows,
          measures,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data()
      
      expect(result).toBeDefined()
      expect(result.columns).toBeDefined()
      expect(result.rows).toBeDefined()
      expect(result.data).toBeDefined()
    })

    it('should process pivot data with count aggregate', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 2 },
        { Country: 'UK', ContactTitle: 'Director', CustomerID: 3 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const columns: PivotColumn[] = [
        { name: 'Country' },
      ]

      const rows: PivotRow[] = [
        { name: 'ContactTitle' },
      ]

      const measures = ['Contacts Count']

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns,
          rows,
          measures,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data() as PivotResult
      
      expect(result.data.length).toBeGreaterThan(0)
      // Should have counts for each combination
      const managerCount = result.data.find((row: any[]) => 
        row.some((cell: any) => cell.value === 2)
      )
      expect(managerCount).toBeDefined()
    })

    it('should process pivot data with sum aggregate', async () => {
      const data = [
        { Category: 'A', Product: 'X', Sales: 100 },
        { Category: 'A', Product: 'X', Sales: 200 },
        { Category: 'B', Product: 'Y', Sales: 150 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Category: { caption: 'All Categories' },
            Product: { caption: 'All Products' },
          },
          measures: {
            'Total Sales': { field: 'Sales', aggregate: 'sum' },
          },
        },
      }

      const columns: PivotColumn[] = [
        { name: 'Category' },
      ]

      const rows: PivotRow[] = [
        { name: 'Product' },
      ]

      const measures = ['Total Sales']

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns,
          rows,
          measures,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data() as PivotResult
      
      expect(result.data.length).toBeGreaterThan(0)
      // Should sum Sales for Category A, Product X = 300
      const sumValue = result.data.flat().find((cell: any) => cell.value === 300)
      expect(sumValue).toBeDefined()
    })
  })

  describe('PivotDataSource Methods', () => {
    it('should provide data() method', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data()
      
      expect(result).toBeDefined()
      expect(result.columns).toBeDefined()
      expect(result.rows).toBeDefined()
      expect(result.data).toBeDefined()
    })

    it('should provide total() method', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
        { Country: 'UK', ContactTitle: 'Director', CustomerID: 2 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const total = instance.total()
      
      expect(typeof total).toBe('number')
      expect(total).toBeGreaterThanOrEqual(0)
    })

    it('should provide read() method', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      await instance.read()
      
      const result = instance.data()
      expect(result).toBeDefined()
    })

    it('should provide sync() method', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      await instance.sync()
      
      expect(wrapper.emitted('sync')).toBeDefined()
    })

    it('should provide query() method', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      instance.query({
        columns: [{ name: 'ContactTitle' }],
        rows: [{ name: 'Country' }],
      })
      
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const columns = instance.columns()
      expect(columns[0].name).toBe('ContactTitle')
    })

    it('should provide axes() method', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const axes = instance.axes()
      
      expect(axes).toBeDefined()
      expect(axes?.columns).toBeDefined()
      expect(axes?.rows).toBeDefined()
    })

    it('should provide measures() method', async () => {
      const measures = ['Contacts Count', 'Total Sales']

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data: [],
          schema: { cube: {} },
          columns: [],
          rows: [],
          measures,
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const resultMeasures = instance.measures()
      
      expect(Array.isArray(resultMeasures)).toBe(true)
      expect(resultMeasures.length).toBe(2)
    })

    it('should provide columns() method', async () => {
      const columns: PivotColumn[] = [
        { name: 'Country' },
        { name: 'Region' },
      ]

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data: [],
          schema: { cube: {} },
          columns,
          rows: [],
          measures: [],
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const resultColumns = instance.columns()
      
      expect(Array.isArray(resultColumns)).toBe(true)
      expect(resultColumns.length).toBe(2)
      expect(resultColumns[0].name).toBe('Country')
    })

    it('should provide rows() method', async () => {
      const rows: PivotRow[] = [
        { name: 'ContactTitle' },
        { name: 'Department' },
      ]

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data: [],
          schema: { cube: {} },
          columns: [],
          rows,
          measures: [],
        },
      })

      await nextTick()

      const instance = wrapper.vm as any
      const resultRows = instance.rows()
      
      expect(Array.isArray(resultRows)).toBe(true)
      expect(resultRows.length).toBe(2)
      expect(resultRows[0].name).toBe('ContactTitle')
    })
  })

  describe('Remote PivotDataSource', () => {
    it('should load data from remote source', async () => {
      const mockResponse = {
        columns: {
          tuples: [
            { members: [{ caption: '2023', name: '2023' }] },
          ],
        },
        rows: {
          tuples: [
            { members: [{ caption: 'Manager', name: 'Manager' }] },
          ],
        },
        data: [
          [{ value: 10 }],
        ],
      }

      const transport = {
        read: vi.fn().mockResolvedValue(mockResponse),
      }

      const schema: PivotDataSourceSchema = {
        data: (response: any) => response,
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'odata',
          transport,
          schema,
          columns: [{ name: 'Year' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Count'],
        },
      })

      await nextTick()
      await wrapper.vm.read()
      await nextTick()

      expect(transport.read).toHaveBeenCalled()
      const instance = wrapper.vm as any
      const result = instance.data()
      expect(result).toBeDefined()
    })
  })

  describe('Event Handling', () => {
    it('should emit change event when data changes', async () => {
      const data = [
        { Country: 'USA', ContactTitle: 'Manager', CustomerID: 1 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Country: { caption: 'All Countries' },
            ContactTitle: { caption: 'All Titles' },
          },
          measures: {
            'Contacts Count': { field: 'CustomerID', aggregate: 'count' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Country' }],
          rows: [{ name: 'ContactTitle' }],
          measures: ['Contacts Count'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.emitted('change')).toBeDefined()
    })

    it('should emit error event on error', async () => {
      const transport = {
        read: vi.fn().mockRejectedValue(new Error('Network error')),
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'odata',
          transport,
          schema: { data: (r: any) => r },
          columns: [],
          rows: [],
          measures: [],
        },
      })

      await nextTick()
      
      try {
        await wrapper.vm.read()
      } catch (e) {
        // Expected
      }
      
      await nextTick()
      expect(wrapper.emitted('error')).toBeDefined()
    })
  })

  describe('Measure Aggregates', () => {
    it('should calculate average aggregate', async () => {
      const data = [
        { Category: 'A', Sales: 100 },
        { Category: 'A', Sales: 200 },
        { Category: 'A', Sales: 300 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Category: { caption: 'All Categories' },
          },
          measures: {
            'Avg Sales': { field: 'Sales', aggregate: 'avg' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Category' }],
          rows: [],
          measures: ['Avg Sales'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data() as PivotResult
      
      // Average of 100, 200, 300 = 200
      const avgValue = result.data.flat().find((cell: any) => cell.value === 200)
      expect(avgValue).toBeDefined()
    })

    it('should calculate min aggregate', async () => {
      const data = [
        { Category: 'A', Sales: 100 },
        { Category: 'A', Sales: 200 },
        { Category: 'A', Sales: 50 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Category: { caption: 'All Categories' },
          },
          measures: {
            'Min Sales': { field: 'Sales', aggregate: 'min' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Category' }],
          rows: [],
          measures: ['Min Sales'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data() as PivotResult
      
      // Min of 100, 200, 50 = 50
      const minValue = result.data.flat().find((cell: any) => cell.value === 50)
      expect(minValue).toBeDefined()
    })

    it('should calculate max aggregate', async () => {
      const data = [
        { Category: 'A', Sales: 100 },
        { Category: 'A', Sales: 200 },
        { Category: 'A', Sales: 300 },
      ]

      const schema: PivotDataSourceSchema = {
        cube: {
          dimensions: {
            Category: { caption: 'All Categories' },
          },
          measures: {
            'Max Sales': { field: 'Sales', aggregate: 'max' },
          },
        },
      }

      const wrapper = mount(PivotDataSource, {
        props: {
          type: 'local',
          data,
          schema,
          columns: [{ name: 'Category' }],
          rows: [],
          measures: ['Max Sales'],
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const instance = wrapper.vm as any
      const result = instance.data() as PivotResult
      
      // Max of 100, 200, 300 = 300
      const maxValue = result.data.flat().find((cell: any) => cell.value === 300)
      expect(maxValue).toBeDefined()
    })
  })
})

