import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useGridState } from '../src/composables/useGridState'
import { useGrid } from '../src/composables/useGrid'

describe('useGridState', () => {
  it('initializes state refs with defaults', () => {
    const state = useGridState()
    expect(state.page.value).toBe(1)
    expect(state.pageSize.value).toBe(20)
    expect(state.sort.value).toEqual([])
    expect(state.selectedKeys.value).toEqual([])
  })

  it('resets state', () => {
    const state = useGridState({ page: 3, pageSize: 50 })
    state.sort.value = [{ field: 'name', dir: 'asc' }]
    state.page.value = 5
    state.selectedKeys.value = [1, 2]

    state.reset()

    expect(state.page.value).toBe(1)
    expect(state.pageSize.value).toBe(50)
    expect(state.sort.value).toEqual([])
    expect(state.selectedKeys.value).toEqual([])
  })
})

describe('useGrid', () => {
  it('builds grid props from simple columns and preset', () => {
    const rows = ref([{ id: 1, name: 'Alpha', price: 10 }])
    const grid = useGrid({
      rows,
      keyField: 'id',
      preset: 'selectable',
      columns: [
        { field: 'name' },
        { field: 'price', format: 'currency' },
      ],
    })

    expect(grid.preset).toBe('selectable')
    expect(grid.gridProps.value.selectable).toBe('multiple')
    expect(grid.gridProps.value.navigatable).toBe(true)
    expect(grid.gridProps.value.columns).toHaveLength(2)
    expect(grid.gridProps.value.rows).toEqual(rows.value)
  })
})
