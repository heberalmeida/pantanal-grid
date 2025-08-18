import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid sorting', () => {
  const rows: Row[] = [{ id:2, name:'B' }, { id:1, name:'A' }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', sortable:true, width: 100 },
    { field:'name', title:'Name', sortable:true, width: 160 },
  ]

  it('toggle sort on header click (asc -> desc)', async () => {
    const wrapper = mount(Grid, { props: { rows, columns } })
    const headers = wrapper.findAll('.v3grid__head .v3grid__headercell')
    await headers[0].trigger('click') // asc
    expect(wrapper.find('img[alt="sort-asc"]').exists()).toBe(true)
    await headers[0].trigger('click') // desc
    expect(wrapper.find('img[alt="sort-desc"]').exists()).toBe(true)
  })
})
