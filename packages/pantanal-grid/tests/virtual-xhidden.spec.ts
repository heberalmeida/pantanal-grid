import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Grid from '../src/components/Grid.vue'
import type { ColumnDef } from '../src/types'

type Row = { id: number; name: string }

describe('PantanalGrid virtual mode horizontal overflow hidden', () => {
  const rows: Row[] = Array.from({ length: 200 }, (_, i) => ({ id: i+1, name: `Item ${i+1}` }))
  const columns: ColumnDef<Row>[] = [
    { field:'id',   title:'ID',   width: 100 },
    { field:'name', title:'Name', width: 600 },
  ]

  it('sets overflow-x: hidden on virtual body', async () => {
    const wrapper = mount(Grid, { props: { rows, columns, virtual:true, height:300, responsive:'table' } })
    const vbody = wrapper.find('[tabindex="0"][style*="overflow-x: hidden"]')
    expect(vbody.exists()).toBe(true)
  })
})
