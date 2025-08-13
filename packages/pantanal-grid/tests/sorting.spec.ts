import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'

describe('PantanalGrid sorting', () => {
  const rows = [{ id:2, name:'B' }, { id:1, name:'A' }]
  const columns = [
    { field:'id', title:'ID', sortable:true },
    { field:'name', title:'Name', sortable:true }
  ] as any

  it('toggle sort on header click', async () => {
    const wrapper = mount(Grid as any, { props: { rows, columns } })
    const header = wrapper.findAll('.v3grid__cell').at(0)!
    await header.trigger('click') // asc
    expect(wrapper.text()).toContain('▲')
    await header.trigger('click') // desc
    expect(wrapper.text()).toContain('▼')
  })
})
