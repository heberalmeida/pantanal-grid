import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; a: string; b: string }

describe('PantanalGrid column reorder', () => {
  const rows: Row[] = [{ id:1, a:'A', b:'B' }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 100, reorderable:true },
    { field:'a',  title:'A',  width: 120, reorderable:true },
    { field:'b',  title:'B',  width: 120, reorderable:true },
  ]

  it('emits columnReorder on drop', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, enableColumnReorder:true } })
    const headers = wrapper.findAll('.v3grid__head .v3grid__headercell')
    await headers[0].trigger('dragstart')
    await headers[2].trigger('drop')
    const evts = wrapper.emitted('columnReorder')
    expect(evts).toBeTruthy()
    const [payload] = evts![0] as [{ from: number; to: number }]
    // handler emite { from:0, to:i } segundo o template
    expect(payload.from).toBe(0)
    expect(payload.to).toBe(2)
  })
})
