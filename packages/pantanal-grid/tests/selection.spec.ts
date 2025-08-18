import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid selection', () => {
  const rows: Row[] = [{ id:1, name:'A' }, { id:2, name:'B' }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 100 },
    { field:'name', title:'Name', width: 160 },
  ]

  it('select all visible from header checkbox', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, selectable:'multiple' } })
    const headerCb = wrapper.find('.v3grid__head input[type="checkbox"]')
    await headerCb.setValue(true)
    const cbs = wrapper.findAll('.v3grid__row input[type="checkbox"]')
    expect(cbs.every(cb => (cb.element as HTMLInputElement).checked)).toBe(true)
  })
})
