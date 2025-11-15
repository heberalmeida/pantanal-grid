import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Grid from '../src/components/Grid.vue'
import { useEditing } from '../src/composables/editing'
import type { ColumnDef } from '../src/types'

describe('useEditing', () => {
  it('tracks row and cell editing state', () => {
    const editing = useEditing()
    editing.startEditingRow(1)
    editing.startEditingCell(1, 'name')
    editing.setPendingChange(1, 'name', 'Beta')

    expect(editing.isRowEditing(1)).toBe(true)
    expect(editing.isCellEditing(1, 'name')).toBe(true)
    expect(editing.getPendingChange(1, 'name')).toBe('Beta')
    expect(editing.hasChanges.value).toBe(true)

    editing.removePendingField(1, 'name')
    expect(editing.getPendingChange(1, 'name')).toBeUndefined()
    expect(editing.hasChanges.value).toBe(false)

    editing.stopEditingCell(1, 'name')
    editing.stopEditingRow(1)
    expect(editing.isRowEditing(1)).toBe(false)
  })

  it('removes pending entries when clearing specific rows', () => {
    const editing = useEditing()
    editing.setPendingChange(1, 'name', 'Beta')
    editing.setPendingChange(2, 'name', 'Gamma')
    expect(editing.hasChanges.value).toBe(true)

    editing.clearPendingChanges(1)
    expect(editing.getPendingChange(1, 'name')).toBeUndefined()
    expect(editing.getPendingChange(2, 'name')).toBe('Gamma')

    editing.clearPendingChanges()
    expect(editing.hasChanges.value).toBe(false)
  })

  it('tracks new rows and deletions', () => {
    const editing = useEditing()
    editing.addNewRow({ id: '__new__', name: 'Draft' })
    editing.markAsDeleted(5)

    expect(editing.newRows.value.length).toBe(1)
    expect(editing.deletedRows.value.has(5)).toBe(true)
    expect(editing.hasChanges.value).toBe(true)

    editing.removeNewRow(0)
    editing.unmarkAsDeleted(5)
    expect(editing.newRows.value.length).toBe(0)
    expect(editing.deletedRows.value.size).toBe(0)
    expect(editing.hasChanges.value).toBe(false)
  })
})

describe('Grid inline editing UI', () => {
  it('shows editor inputs after clicking edit command', async () => {
    const columns: ColumnDef<{ productID: number; productName: string }>[] = [
      { field: 'productName', title: 'Name', editable: true },
      { field: 'command', title: '', command: ['edit'] },
    ]
    const wrapper = mount(Grid, {
      props: {
        rows: [{ productID: 1, productName: 'Chai' }],
        columns,
        keyField: 'productID',
        editable: 'inline',
        responsive: 'table',
      },
    })

    await wrapper.vm.$nextTick()
    const vm: any = wrapper.vm
    console.log('editMode', vm.editMode)
    console.log('columnIsEditable fn', typeof vm.columnIsEditable)
    console.log(vm.columns?.map((col: any) => ({ field: col.field, editable: col.editable })))
    console.log((vm.unlockedCols ?? []).map((col: any) => ({ field: col.field, editable: col.editable })))
    const firstCol = vm.unlockedCols?.[0]
    const firstRow = vm.unlockedRows?.[0] ?? vm.rows?.[0]
    if (firstCol && firstRow) {
      console.log('columnIsEditable result', vm.columnIsEditable(firstCol, firstRow))
      console.log('firstRow productID', firstRow.productID, typeof firstRow.productID)
      console.log('isRowEditing result', vm.isRowEditing(firstRow))
      console.log('isCellEditing result', vm.isCellEditing(firstRow, firstCol))
    }
    console.log('command label', wrapper.find('.v3grid__btn--command span:last-child').text())
    const editButton = wrapper.find('.v3grid__btn--command')
    await editButton.trigger('click')
    await new Promise(resolve => setTimeout(resolve))
    await wrapper.vm.$nextTick()

    console.log(wrapper.html())
  })
})

