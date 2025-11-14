import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid pagination basic', () => {
  const rows: Row[] = Array.from({ length: 35 }, (_, i) => ({ id: i+1, name: `R${i+1}` }))
  const columns: ColumnDef<Row>[] = [
    { field:'id', title:'ID', width: 100 },
    { field:'name', title:'Name', width: 160 },
  ]

  it('renders GridPagination in footer when not virtual', async () => {
    const wrapper = mount(Grid, {
      props: { rows, columns, pageSize:10, page:1, responsive:'table', locale: 'pt' }
    })

    // Footer existe
    const footer = wrapper.find('.v3grid__footer')
    expect(footer.exists()).toBe(true)

    // Label em PT-BR + select com 4 opções
    const label = footer.find('label.text-sm')
    expect(label.exists()).toBe(true)
    expect(label.text()).toMatch(/itens por página/i)

    const select = footer.find('select.v3grid__input')
    expect(select.exists()).toBe(true)
    const options = select.findAll('option')
    expect(options.length).toBe(4)
    expect(options.map(o => o.text())).toEqual(['10','20','50','100'])
  })
})
