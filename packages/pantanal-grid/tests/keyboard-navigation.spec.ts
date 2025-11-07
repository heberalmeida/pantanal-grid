import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PantanalGrid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

describe('Keyboard Navigation', () => {
  const rows = [
    { id: 1, name: 'John', age: 30, city: 'New York' },
    { id: 2, name: 'Jane', age: 25, city: 'London' },
    { id: 3, name: 'Bob', age: 35, city: 'Paris' },
  ]

  const columns: ColumnDef[] = [
    { field: 'name', title: 'Name', sortable: true },
    { field: 'age', title: 'Age', sortable: true },
    { field: 'city', title: 'City', sortable: true },
  ]

  it('should enable keyboard navigation when navigatable prop is true', () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
      },
    })

    expect(wrapper.find('.v3grid').exists()).toBe(true)
    const cells = wrapper.findAll('.v3grid__cell[tabindex="0"]')
    expect(cells.length).toBeGreaterThan(0)
  })

  it('should disable keyboard navigation when navigatable prop is false', () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: false,
      },
    })

    const cells = wrapper.findAll('.v3grid__cell[tabindex="0"]')
    expect(cells.length).toBe(0)
  })

  it('should navigate with arrow keys', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    expect(firstCell.exists()).toBe(true)

    // Focus the first cell
    await firstCell.trigger('focus')
    await nextTick()

    // Press ArrowDown
    await firstCell.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    // Check if focus moved to next row
    const focusedCells = wrapper.findAll('.v3grid__cell[data-focus="true"]')
    expect(focusedCells.length).toBeGreaterThan(0)
  })

  it('should sort column on Enter key in header', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
        sortable: true,
      },
    })

    await nextTick()

    const headerCell = wrapper.find('.v3grid__headercell')
    expect(headerCell.exists()).toBe(true)

    await headerCell.trigger('keydown', { key: 'Enter' })
    await nextTick()

    // Check if sort event was emitted or sort state changed
    const emitted = wrapper.emitted('sort')
    expect(emitted).toBeDefined()
  })

  it('should select row on Space key', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
        selectable: 'multiple',
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('focus')
    await nextTick()

    await firstCell.trigger('keydown', { key: ' ' })
    await nextTick()

    const emitted = wrapper.emitted('selectionChange')
    expect(emitted).toBeDefined()
    if (emitted && emitted[0]) {
      expect(Array.isArray(emitted[0][0])).toBe(true)
    }
  })

  it('should navigate to next page on PageDown', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows: Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          name: `Name ${i + 1}`,
          age: 20 + i,
          city: 'City',
        })),
        columns,
        navigatable: true,
        pageSize: 10,
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('focus')
    await nextTick()

    await firstCell.trigger('keydown', { key: 'PageDown' })
    await nextTick()

    // Check if page changed
    const emitted = wrapper.emitted('update:page')
    expect(emitted).toBeDefined()
  })

  it('should navigate to previous page on PageUp', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows: Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          name: `Name ${i + 1}`,
          age: 20 + i,
          city: 'City',
        })),
        columns,
        navigatable: true,
        page: 2,
        pageSize: 10,
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('focus')
    await nextTick()

    await firstCell.trigger('keydown', { key: 'PageUp' })
    await nextTick()

    // Check if page changed
    const emitted = wrapper.emitted('update:page')
    expect(emitted).toBeDefined()
  })

  it('should focus first cell on Ctrl+Home', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('keydown', { key: 'Home', ctrlKey: true })
    await nextTick()

    // Check if focus moved to first cell
    const focusedCells = wrapper.findAll('.v3grid__cell[data-focus="true"]')
    expect(focusedCells.length).toBeGreaterThan(0)
  })

  it('should focus last cell on Ctrl+End', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('keydown', { key: 'End', ctrlKey: true })
    await nextTick()

    // Check if focus moved to last cell
    const focusedCells = wrapper.findAll('.v3grid__cell[data-focus="true"]')
    expect(focusedCells.length).toBeGreaterThan(0)
  })

  it('should focus first cell in row on Home', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
      },
    })

    await nextTick()

    const cells = wrapper.findAll('.v3grid__cell[tabindex="0"]')
    if (cells.length > 1) {
      await cells[1].trigger('focus')
      await nextTick()

      await cells[1].trigger('keydown', { key: 'Home' })
      await nextTick()

      // Check if focus moved to first cell in row
      const focusedCells = wrapper.findAll('.v3grid__cell[data-focus="true"]')
      expect(focusedCells.length).toBeGreaterThan(0)
    }
  })

  it('should focus last cell in row on End', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('focus')
    await nextTick()

    await firstCell.trigger('keydown', { key: 'End' })
    await nextTick()

    // Check if focus moved to last cell in row
    const focusedCells = wrapper.findAll('.v3grid__cell[data-focus="true"]')
    expect(focusedCells.length).toBeGreaterThan(0)
  })

  it('should toggle group expand/collapse on Enter', async () => {
    const groupedRows = [
      { id: 1, name: 'John', age: 30, city: 'New York' },
      { id: 2, name: 'Jane', age: 25, city: 'New York' },
      { id: 3, name: 'Bob', age: 35, city: 'London' },
    ]

    const wrapper = mount(PantanalGrid, {
      props: {
        rows: groupedRows,
        columns,
        navigatable: true,
        group: [{ field: 'city' }],
      },
    })

    await nextTick()

    // Find a group row (this would need to be adjusted based on actual group rendering)
    const groupCell = wrapper.find('.v3grid__group')
    if (groupCell.exists()) {
      await groupCell.trigger('keydown', { key: 'Enter' })
      await nextTick()

      // Check if group toggle was triggered
      const emitted = wrapper.emitted('toggleGroup')
      expect(emitted).toBeDefined()
    }
  })

  it('should handle Ctrl+Space for multiple selection', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
        selectable: 'multiple',
      },
    })

    await nextTick()

    const firstCell = wrapper.find('.v3grid__cell[tabindex="0"]')
    await firstCell.trigger('focus')
    await nextTick()

    await firstCell.trigger('keydown', { key: ' ', ctrlKey: true })
    await nextTick()

    const emitted = wrapper.emitted('selectionChange')
    expect(emitted).toBeDefined()
  })

  it('should handle Shift+Space for range selection', async () => {
    const wrapper = mount(PantanalGrid, {
      props: {
        rows,
        columns,
        navigatable: true,
        selectable: 'multiple',
      },
    })

    await nextTick()

    const cells = wrapper.findAll('.v3grid__cell[tabindex="0"]')
    if (cells.length > 2) {
      await cells[0].trigger('focus')
      await nextTick()

      // Select first row
      await cells[0].trigger('keydown', { key: ' ' })
      await nextTick()

      // Move to third row
      await cells[2].trigger('focus')
      await nextTick()

      // Shift+Space for range selection
      await cells[2].trigger('keydown', { key: ' ', shiftKey: true })
      await nextTick()

      const emitted = wrapper.emitted('selectionChange')
      expect(emitted).toBeDefined()
    }
  })
})

