import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Grid from '../src/components/Grid.vue'
import Column from '../src/components/Column.vue'

describe('PantanalGrid declarative columns', () => {
  it('renders headers from <PantanalColumn> children', () => {
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

    const headers = wrapper.findAll('.v3grid__head .v3grid__headercell')
    expect(headers).toHaveLength(2)
    expect(headers[0].text()).toContain('ID')
    expect(headers[1].text()).toContain('Name')
  })
})
