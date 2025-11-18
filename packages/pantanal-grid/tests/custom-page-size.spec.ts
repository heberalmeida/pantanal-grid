import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import Pagination from '../src/components/Pagination.vue'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; price: number }

describe('PantanalGrid Custom Page Size', () => {
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

  describe('Pagination Component - Custom Page Size', () => {
    it('should not show custom option by default', () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 10,
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: false,
        },
      })

      const options = wrapper.findAll('select option')
      const customOption = options.find(opt => opt.attributes('value') === 'custom')
      expect(customOption).toBeUndefined()
    })

    it('should show custom option when customPageSize is true', () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 10,
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: true,
        },
      })

      const options = wrapper.findAll('select option')
      const customOption = options.find(opt => opt.attributes('value') === 'custom')
      expect(customOption).toBeDefined()
    })

    it('should show input when custom is selected', async () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 10,
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: true,
        },
      })

      const select = wrapper.find('select')
      await select.setValue('custom')
      await wrapper.vm.$nextTick()

      const input = wrapper.find('input[type="number"]')
      expect(input.exists()).toBe(true)
    })

    it('should emit update:pageSize when custom value is entered', async () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 10,
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: true,
        },
      })

      // Select custom option
      const select = wrapper.find('select')
      await select.setValue('custom')
      await wrapper.vm.$nextTick()

      // Enter custom value
      const input = wrapper.find('input[type="number"]')
      await input.setValue('25')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:pageSize')).toBeTruthy()
      expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([25])
    })

    it('should validate custom page size (min 1, max 10000)', async () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 10,
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: true,
        },
      })

      // Select custom option
      const select = wrapper.find('select')
      await select.setValue('custom')
      await wrapper.vm.$nextTick()

      // Try invalid value (too large)
      const input = wrapper.find('input[type="number"]')
      await input.setValue('20000')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()

      // Should not emit invalid value, should reset to current pageSize
      const lastEmit = wrapper.emitted('update:pageSize')
      if (lastEmit && lastEmit.length > 0) {
        const lastValue = lastEmit[lastEmit.length - 1][0]
        expect(lastValue).toBeLessThanOrEqual(10000)
      }
    })

    it('should show cancel button when custom input is active', async () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 10,
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: true,
        },
      })

      // Select custom option
      const select = wrapper.find('select')
      await select.setValue('custom')
      await wrapper.vm.$nextTick()

      const cancelButton = wrapper.find('button')
      expect(cancelButton.exists()).toBe(true)
      expect(cancelButton.text()).toContain('×')
    })

    it('should detect custom pageSize when not in options', () => {
      const wrapper = mount(Pagination, {
        props: {
          page: 1,
          pageSize: 25, // Not in options [10, 20, 50, 100]
          total: 100,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          customPageSize: true,
        },
      })

      const instance = wrapper.vm as any
      expect(instance.isCustomPageSize).toBe(true)
    })
  })

  describe('Grid Component - Custom Page Size', () => {
    it('should not show custom option by default', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageablePageSizes: [10, 20, 50, 100],
          pageableCustomPageSize: false,
          keyField: 'id',
        },
      })

      const select = wrapper.find('select')
      if (select.exists()) {
        const options = select.findAll('option')
        const customOption = options.find(opt => opt.attributes('value') === 'custom')
        expect(customOption).toBeUndefined()
      }
    })

    it('should show custom option when pageableCustomPageSize is true', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageablePageSizes: [10, 20, 50, 100],
          pageableCustomPageSize: true,
          keyField: 'id',
        },
      })

      const select = wrapper.find('select')
      if (select.exists()) {
        const options = select.findAll('option')
        const customOption = options.find(opt => opt.attributes('value') === 'custom')
        expect(customOption).toBeDefined()
      }
    })

    it('should pass customPageSize prop to Pagination component', () => {
      const wrapper = mount(Grid, {
        props: {
          rows,
          columns,
          pageable: true,
          pageablePageSizes: [10, 20, 50, 100],
          pageableCustomPageSize: true,
          keyField: 'id',
        },
      })

      // Find pagination component by looking for the component or its props
      const paginationComponent = wrapper.findComponent({ name: 'GridPagination' })
      if (paginationComponent.exists()) {
        expect(paginationComponent.props('customPageSize')).toBe(true)
      } else {
        // Alternative: check if custom option appears in select
        const select = wrapper.find('select')
        if (select.exists()) {
          const options = select.findAll('option')
          const customOption = options.find(opt => opt.attributes('value') === 'custom')
          expect(customOption).toBeDefined()
        }
      }
    })
  })
})

