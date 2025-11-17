import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid filtering', () => {
  const rows: Row[] = [{ id:1, name:'Alpha' }, { id:2, name:'Beta' }, { id:3, name:'Gamma' }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', filterable:true, width: 100 },
    { field:'name', title:'Name', filterable:true, width: 160 },
  ]

  it('filters with contains operator and reduces visible rows', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, responsive: 'table' } })
    const inputs = wrapper.findAll('.v3grid__filters input.v3grid__input[type="text"]')
    expect(inputs.length).toBeGreaterThan(1)

    await inputs.at(1)?.setValue('mm')
    await nextTick()

    const bodyRows = wrapper.findAll('.v3grid__scroll .v3grid__row')
    expect(bodyRows.length).toBe(1)
    expect(bodyRows[0].text()).toMatch(/Gamma/)
  })
})
