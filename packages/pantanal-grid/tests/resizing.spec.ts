import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid resizing', () => {
  const rows: Row[] = [{ id:1, name:'A' }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 120, resizable:true },
    { field:'name', title:'Name', width: 200, resizable:true },
  ]

  it('emits columnResize when mousedown on resizer', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, enableColumnResize:true } })
    const resizers = wrapper.findAll('.v3grid__resizer')
    await resizers[0].trigger('mousedown', { buttons: 1 })
    const events = wrapper.emitted('columnResize')
    expect(events).toBeTruthy()
    const [payload] = events![0] as [{ field: string; width: number }]
    expect(payload.field).toBe('id')
    expect(typeof payload.width).toBe('number')
  })
})
