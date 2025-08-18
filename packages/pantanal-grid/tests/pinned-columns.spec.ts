import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string; status: string }

describe('PantanalGrid pinned/locked columns', () => {
  const rows: Row[] = [
    { id:1, name:'Alpha', status:'Ativo' },
    { id:2, name:'Beta',  status:'Pendente' },
  ]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 100, pinned:'left' },
    { field:'name', title:'Name', width: 200 },
    { field:'status', title:'Status', width: 140, pinned:'right' },
  ]

  it('applies sticky class to pinned columns in header and body', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, responsive:'table' } })

    // HEADER: primeira e última devem ter .v3grid__cell--pinned
    const headers = wrapper.findAll('.v3grid__head .v3grid__headercell')
    expect(headers[0].classes()).toContain('v3grid__cell--pinned')
    expect(headers[2].classes()).toContain('v3grid__cell--pinned')

    // BODY: primeira linha, primeira/última célula pinned
    const firstRowCells = wrapper.findAll('.v3grid__row')[0]!.findAll('.v3grid__cell')
    expect(firstRowCells[0].classes()).toContain('v3grid__cell--pinned')
    expect(firstRowCells[2].classes()).toContain('v3grid__cell--pinned')
  })

  it('sets left/right inline styles for pinned sides', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, responsive:'table' } })
    const headers = wrapper.findAll('.v3grid__head .v3grid__headercell')

    const leftStyle = headers[0].attributes('style') ?? ''
    const rightStyle = headers[2].attributes('style') ?? ''

    expect(leftStyle.includes('left:')).toBe(true)
    expect(rightStyle.includes('right:')).toBe(true)
  })
})
