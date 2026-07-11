import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SimpleGrid from '../src/components/SimpleGrid.vue'
import Grid from '../src/components/Grid.vue'

describe('PantanalSimpleGrid', () => {
  const rows = [{ id: 1, name: 'Alpha' }]
  const columns = [{ field: 'name', title: 'Name' }]

  it('applies interactive preset with navigatable enabled', async () => {
    const wrapper = mount(SimpleGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        preset: 'interactive',
        responsive: 'table',
      },
    })

    await nextTick()

    const grid = wrapper.findComponent(Grid)
    expect(grid.exists()).toBe(true)
    expect(grid.props('navigatable')).toBe(true)
    expect(grid.props('sortable')).toBe(true)
  })

  it('allows prop overrides on top of preset', async () => {
    const wrapper = mount(SimpleGrid, {
      props: {
        rows,
        columns,
        keyField: 'id',
        preset: 'readonly',
        sortable: true,
        responsive: 'table',
      },
    })

    await nextTick()

    const grid = wrapper.findComponent(Grid)
    expect(grid.props('sortable')).toBe(true)
    expect(grid.props('filterable')).toBe(false)
  })
})
