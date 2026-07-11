import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Grid from '../src/components/Grid.vue'
import Column from '../src/components/Column.vue'

describe('PantanalGrid declarative columns', () => {
  it('renders headers from <PantanalColumn> children', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const rows = [{ id: 1, name: 'Alpha' }]

    const wrapper = mount(Grid, {
      props: { rows },
      slots: {
        default: () => [
          h(Column, { field: 'id', title: 'ID', width: 90 }),
          h(Column, { field: 'name', title: 'Name', width: 140 }),
        ],
      },
    })

    await nextTick()

    const headers = wrapper.findAll('.v3grid__head .v3grid__headercell')
    expect(headers).toHaveLength(2)
    expect(headers[0].text()).toContain('ID')
    expect(headers[1].text()).toContain('Name')

    const slotWarnings = warnSpy.mock.calls.filter(([message]) =>
      String(message).includes('Slot "default" invoked outside of the render function')
    )
    expect(slotWarnings).toHaveLength(0)
    warnSpy.mockRestore()
  })

  it('renders using template prop when provided', async () => {
    const rows = [{ id: 1, name: 'Alpha' }]

    const wrapper = mount(Grid, {
      props: { rows },
      slots: {
        default: () => [
          h(Column, { field: 'name', title: 'Name', template: ({ row }: any) => [h('strong', `TEMPLATE:${row.name}`)] }),
        ],
      },
    })

    await nextTick()
    await nextTick()
    expect(wrapper.html()).toContain('TEMPLATE:Alpha')
  })
})
