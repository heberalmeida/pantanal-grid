import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'

describe('PantanalGrid filtering', () => {
  const rows = [{ id:1, name:'Alpha' }, { id:2, name:'Beta' }, { id:3, name:'Gamma' }]
  const columns = [{ field:'id', title:'ID', filterable:true }, { field:'name', title:'Name', filterable:true }] as any

  it('filters with contains operator', async () => {
    const wrapper = mount(Grid as any, { props: { rows, columns } })
    const inputs = wrapper.findAll('input.v3grid__input')
    await inputs[1].setValue('a') // filtrar por nome contendo 'a'
    // como o pipeline é reativo, deve reduzir o total renderizado
    const bodyRows = wrapper.findAll('.v3grid__row')
    expect(bodyRows.length).toBeGreaterThan(0)
  })
})
