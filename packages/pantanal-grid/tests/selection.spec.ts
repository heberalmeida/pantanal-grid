import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'

describe('PantanalGrid selection', () => {
  const rows = [{ id:1, name:'A' }, { id:2, name:'B' }]
  const columns = [{ field:'id', title:'ID' }, { field:'name', title:'Name' }] as any

  it('select all visible', async () => {
    const wrapper = mount(Grid as any, { props: { rows, columns, selectable:'multiple' } })
    const headerCb = wrapper.find('.v3grid__head input[type="checkbox"]')
    await headerCb.setValue(true)
    const cbs = wrapper.findAll('.v3grid__row input[type="checkbox"]')
    expect(cbs.every(cb => (cb.element as HTMLInputElement).checked)).toBe(true)
  })
})
