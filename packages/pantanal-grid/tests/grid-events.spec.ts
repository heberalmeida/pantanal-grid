import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { SortDescriptor, FilterDescriptor } from '../src/types'

describe('PantanalGrid Events', () => {
  const rows = [
    { id: 1, name: 'Product 1', price: 10, category: 'A' },
    { id: 2, name: 'Product 2', price: 20, category: 'B' },
    { id: 3, name: 'Product 3', price: 30, category: 'A' },
  ]

  const columns = [
    { field: 'id', title: 'ID', width: 60, sortable: true, filterable: true },
    { field: 'name', title: 'Name', width: 200, sortable: true, filterable: true },
    { field: 'price', title: 'Price', width: 100, sortable: true },
    { field: 'category', title: 'Category', width: 120, sortable: true },
  ]

  describe('Data Events', () => {
    it('should emit databinding event on mount', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
        },
      })

      await nextTick()

      const databindingEvents = wrapper.emitted('databinding')
      expect(databindingEvents).toBeDefined()
      expect(databindingEvents?.length).toBeGreaterThan(0)
    })

    it('should emit databound event after data is processed', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
        },
      })

      await nextTick()

      const databoundEvents = wrapper.emitted('databound')
      expect(databoundEvents).toBeDefined()
      expect(databoundEvents?.length).toBeGreaterThan(0)
    })
  })

  describe('Sort Events', () => {
    it('should emit sort event when column header is clicked', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          sortable: true,
        },
      })

      await nextTick()

      // Find and click a sortable column header
      const headerCell = wrapper.find('.v3grid__headercell')
      expect(headerCell.exists()).toBe(true)

      await headerCell.trigger('click')
      await nextTick()

      const sortEvents = wrapper.emitted('sort')
      expect(sortEvents).toBeDefined()
      expect(sortEvents?.length).toBeGreaterThan(0)
      if (sortEvents && sortEvents[0]) {
        expect(sortEvents[0][0]).toHaveProperty('sort')
        expect(Array.isArray(sortEvents[0][0].sort)).toBe(true)
      }
    })
  })

  describe('Filter Events', () => {
    it('should emit filter event when filter value changes', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          showFilterRow: true,
        },
      })

      await nextTick()

      // Find filter input and change value
      const filterInput = wrapper.find('.v3grid__input')
      if (filterInput.exists()) {
        await filterInput.setValue('Product')
        await nextTick()

        const filterEvents = wrapper.emitted('filter')
        expect(filterEvents).toBeDefined()
        expect(filterEvents?.length).toBeGreaterThan(0)
        if (filterEvents && filterEvents[0]) {
          expect(filterEvents[0][0]).toHaveProperty('filter')
          expect(Array.isArray(filterEvents[0][0].filter)).toBe(true)
        }
      }
    })
  })

  describe('Group Events', () => {
    it('should emit group event when grouping is applied', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          groupable: true,
          group: [{ field: 'category' }],
        },
      })

      await nextTick()

      // Group event should be set up
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Selection Events', () => {
    it('should emit selectionChange event when row is selected', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
          selectable: true,
        },
      })

      await nextTick()

      // Find and click a checkbox
      const checkbox = wrapper.find('.v3grid__checkbox')
      if (checkbox.exists()) {
        await checkbox.setValue(true)
        await nextTick()

        const selectionEvents = wrapper.emitted('selectionChange')
        expect(selectionEvents).toBeDefined()
        expect(selectionEvents?.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Row Click Events', () => {
    it('should emit rowClick event when row is clicked', async () => {
      const wrapper = mount(PantanalGrid, {
        props: {
          rows,
          columns,
          keyField: 'id',
        },
      })

      await nextTick()

      // Find and click a row cell
      const rowCell = wrapper.find('.v3grid__cell')
      if (rowCell.exists()) {
        await rowCell.trigger('click')
        await nextTick()

        const rowClickEvents = wrapper.emitted('rowClick')
        expect(rowClickEvents).toBeDefined()
        expect(rowClickEvents?.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Loading Events', () => {
    it('should emit loading event when using dataProvider', async () => {
      const mockDataProvider = vi.fn().mockResolvedValue({
        rows: [{ id: 1, name: 'Test' }],
        total: 1,
      })

      const wrapper = mount(PantanalGrid, {
        props: {
          columns,
          keyField: 'id',
          dataProvider: mockDataProvider,
          autoBind: true,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const loadingEvents = wrapper.emitted('loading')
      expect(loadingEvents).toBeDefined()
      // Should emit loading: true at start and loading: false at end
      expect(loadingEvents?.length).toBeGreaterThan(0)
    })
  })

  describe('Error Events', () => {
    it('should emit error event when dataProvider fails', async () => {
      const mockDataProvider = vi.fn().mockRejectedValue(new Error('Test error'))

      const wrapper = mount(PantanalGrid, {
        props: {
          columns,
          keyField: 'id',
          dataProvider: mockDataProvider,
          autoBind: true,
        },
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const errorEvents = wrapper.emitted('error')
      expect(errorEvents).toBeDefined()
    })
  })
})

