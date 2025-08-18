import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; score: number }

describe('PantanalGrid filter row respects pinned columns', () => {
  const rows: Row[] = [{ id:1, name:'A', score: 10 }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 90, filterable:true, pinned:'left' },
    { field:'name', title:'Name', width: 160, filterable:true },
    { field:'score', title:'Score', width: 120, filterable:true, pinned:'right' },
  ]

  it('adds pinned class in filter cells and keeps inline offset', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, responsive:'table', showFilterRow:true } })
    const filterCells = wrapper.findAll('.v3grid__filters > div')

    // id (left pinned)
    expect(filterCells[0].classes()).toContain('v3grid__cell--pinned')
    expect((filterCells[0].attributes('style') ?? '').includes('left:')).toBe(true)

    // score (right pinned)
    expect(filterCells[2].classes()).toContain('v3grid__cell--pinned')
    expect((filterCells[2].attributes('style') ?? '').includes('right:')).toBe(true)
  })
})
