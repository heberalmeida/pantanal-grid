import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid horizontal scroll wrapper and footer placement', () => {
  const rows: Row[] = [{ id:1, name:'A' }]
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 120, pinned:'left' },
    { field:'name', title:'Name', width: 800 }, // força largura
  ]

  it('renders .v3grid__scroll wrapper and keeps footer outside it', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, responsive:'table', showFooter:true } })
    const scroll = wrapper.find('.v3grid__scroll')
    const footer = wrapper.findAll('.v3grid > .v3grid__cell').at(-1)

    expect(scroll.exists()).toBe(true)
    expect(footer?.exists()).toBe(true)
    // Footer não deve estar dentro do scroll
    expect(scroll.element.contains(footer!.element)).toBe(false)
  })
})
