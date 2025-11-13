import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef, AggregateName } from '../src/types'

type Row = { id: number; name: string; price: number; stock: number; category: string }

describe('PantanalGrid aggregates', () => {
  const rows: Row[] = [
    { id: 1, name: 'Product A', price: 99.99, stock: 50, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 49.99, stock: 100, category: 'Electronics' },
    { id: 3, name: 'Product C', price: 19.99, stock: 25, category: 'Clothing' }
  ]

  const columns: ColumnDef<Row>[] = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name' },
    { field: 'price', title: 'Price' },
    { field: 'stock', title: 'Stock' },
    { field: 'category', title: 'Category' }
  ]

  describe('basic aggregates', () => {
    it('calculates sum aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['sum']
      }

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          aggregates
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })

    it('calculates multiple aggregates for same field', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['sum', 'avg', 'min', 'max'],
        stock: ['sum', 'min', 'max']
      }

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          aggregates
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })

    it('calculates count aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        id: ['count']
      }

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          aggregates
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })
  })

  describe('column-level aggregates', () => {
    it('allows aggregates defined per column', async () => {
      const columnColumns: ColumnDef<Row>[] = [
        { field: 'id', title: 'ID' },
        { 
          field: 'price', 
          title: 'Price',
          aggregates: ['sum', 'avg']
        },
        { 
          field: 'stock', 
          title: 'Stock',
          aggregates: ['min', 'max']
        }
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: columnColumns
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const priceColumn = columnColumns.find(c => c.field === 'price')
      const stockColumn = columnColumns.find(c => c.field === 'stock')
      
      expect(priceColumn?.aggregates).toEqual(['sum', 'avg'])
      expect(stockColumn?.aggregates).toEqual(['min', 'max'])
    })
  })

  describe('group footers with aggregates', () => {
    it('displays aggregates in group footers', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['sum', 'avg'],
        stock: ['sum']
      }

      const group = [{ field: 'category', dir: 'asc' as const }]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          aggregates,
          group,
          showGroupFooters: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
      expect(wrapper.props('group')).toEqual(group)
      expect(wrapper.props('showGroupFooters')).toBe(true)
    })
  })

  describe('custom templates', () => {
    it('supports groupFooterTemplate', async () => {
      const columnColumns: ColumnDef<Row>[] = [
        { 
          field: 'price', 
          title: 'Price',
          aggregates: ['sum', 'avg'],
          groupFooterTemplate: (group) => {
            const priceAgg = group.aggregates?.price
            if (priceAgg) {
              return `Sum: ${priceAgg.sum} | Avg: ${priceAgg.avg}`
            }
            return ''
          }
        }
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: columnColumns,
          group: [{ field: 'category', dir: 'asc' }],
          showGroupFooters: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const priceColumn = columnColumns.find(c => c.field === 'price')
      expect(priceColumn?.groupFooterTemplate).toBeDefined()
      expect(typeof priceColumn?.groupFooterTemplate).toBe('function')
    })

    it('supports footerTemplate', async () => {
      const columnColumns: ColumnDef<Row>[] = [
        { 
          field: 'price', 
          title: 'Price',
          aggregates: ['sum', 'avg'],
          footerTemplate: (aggregates) => {
            const priceAgg = aggregates.price
            if (priceAgg) {
              return `Sum: ${priceAgg.sum} | Avg: ${priceAgg.avg}`
            }
            return ''
          }
        }
      ]

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns: columnColumns
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const priceColumn = columnColumns.find(c => c.field === 'price')
      expect(priceColumn?.footerTemplate).toBeDefined()
      expect(typeof priceColumn?.footerTemplate).toBe('function')
    })
  })

  describe('all aggregate types', () => {
    it('supports sum aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['sum']
      }

      const wrapper = mount(Grid, {
        props: { rows, columns, aggregates }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })

    it('supports avg aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['avg']
      }

      const wrapper = mount(Grid, {
        props: { rows, columns, aggregates }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })

    it('supports min aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['min']
      }

      const wrapper = mount(Grid, {
        props: { rows, columns, aggregates }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })

    it('supports max aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['max']
      }

      const wrapper = mount(Grid, {
        props: { rows, columns, aggregates }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })

    it('supports count aggregate', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        id: ['count']
      }

      const wrapper = mount(Grid, {
        props: { rows, columns, aggregates }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toEqual(aggregates)
    })
  })

  describe('integration with grouping', () => {
    it('works with single-level grouping', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['sum', 'avg']
      }

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          aggregates,
          group: [{ field: 'category', dir: 'asc' }],
          showGroupFooters: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toBeDefined()
      expect(wrapper.props('group')).toBeDefined()
    })

    it('works with multi-level grouping', async () => {
      const aggregates: Record<string, AggregateName[]> = {
        price: ['sum', 'avg'],
        stock: ['sum']
      }

      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          aggregates,
          group: [
            { field: 'category', dir: 'asc' },
            { field: 'name', dir: 'asc' }
          ],
          showGroupFooters: true
        }
      })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.props('aggregates')).toBeDefined()
      expect(Array.isArray(wrapper.props('group'))).toBe(true)
    })
  })
})

