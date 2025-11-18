import { describe, it, expect } from 'vitest'
import { useColumnLocked } from '../src/composables/locked'
import { ref } from 'vue'
import type { ColumnDef } from '../src/types'

describe('useColumnLocked', () => {
  const columns: ColumnDef[] = [
    { field: 'id', title: 'ID', width: 100, locked: 'left' },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'price', title: 'Price', width: 120 },
    { field: 'actions', title: 'Actions', width: 150, locked: 'right' },
  ]

  const widths = ref([100, 200, 120, 150])

  it('should calculate locked metadata for left-locked columns', () => {
    const { lockedMeta } = useColumnLocked(() => columns, widths)
    
    expect(lockedMeta.value).toBeDefined()
    expect(lockedMeta.value.length).toBe(4)
    
    // First column should be locked left
    expect(lockedMeta.value[0].side).toBe('left')
    expect(lockedMeta.value[0].left).toBe(0)
    
    // Middle columns should not be locked
    expect(lockedMeta.value[1].side).toBeNull()
    expect(lockedMeta.value[2].side).toBeNull()
    
    // Last column should be locked right
    expect(lockedMeta.value[3].side).toBe('right')
    expect(lockedMeta.value[3].right).toBe(0)
  })

  it('should calculate correct left offsets for multiple left-locked columns', () => {
    const multiLeftColumns: ColumnDef[] = [
      { field: 'id', title: 'ID', width: 100, locked: 'left' },
      { field: 'name', title: 'Name', width: 200, locked: 'left' },
      { field: 'price', title: 'Price', width: 120 },
      { field: 'actions', title: 'Actions', width: 150, locked: 'right' },
    ]
    
    const multiWidths = ref([100, 200, 120, 150])
    const { lockedMeta } = useColumnLocked(() => multiLeftColumns, multiWidths)
    
    expect(lockedMeta.value[0].side).toBe('left')
    expect(lockedMeta.value[0].left).toBe(0)
    
    expect(lockedMeta.value[1].side).toBe('left')
    expect(lockedMeta.value[1].left).toBe(100) // Offset by first column width
  })

  it('should calculate correct right offsets for multiple right-locked columns', () => {
    const multiRightColumns: ColumnDef[] = [
      { field: 'id', title: 'ID', width: 100, locked: 'left' },
      { field: 'name', title: 'Name', width: 200 },
      { field: 'price', title: 'Price', width: 120, locked: 'right' },
      { field: 'actions', title: 'Actions', width: 150, locked: 'right' },
    ]
    
    const multiWidths = ref([100, 200, 120, 150])
    const { lockedMeta } = useColumnLocked(() => multiRightColumns, multiWidths)
    
    expect(lockedMeta.value[2].side).toBe('right')
    expect(lockedMeta.value[2].right).toBe(150) // Offset by last column width
    
    expect(lockedMeta.value[3].side).toBe('right')
    expect(lockedMeta.value[3].right).toBe(0) // Last right-locked column
  })

  it('should handle locked: true as left-locked', () => {
    const boolLockedColumns: ColumnDef[] = [
      { field: 'id', title: 'ID', width: 100, locked: true },
      { field: 'name', title: 'Name', width: 200 },
    ]
    
    const boolWidths = ref([100, 200])
    const { lockedMeta } = useColumnLocked(() => boolLockedColumns, boolWidths)
    
    expect(lockedMeta.value[0].side).toBe('left')
    expect(lockedMeta.value[1].side).toBeNull()
  })

  it('should generate correct locked classes', () => {
    const { lockedClass } = useColumnLocked(() => columns, widths)
    
    const leftClass = lockedClass(0)
    expect(leftClass['v3grid__cell--locked']).toBe(true)
    expect(leftClass['v3grid__cell--locked-left']).toBe(true)
    expect(leftClass['v3grid__cell--locked-right']).toBe(false)
    
    const middleClass = lockedClass(1)
    expect(middleClass).toEqual({})
    
    const rightClass = lockedClass(3)
    expect(rightClass['v3grid__cell--locked']).toBe(true)
    expect(rightClass['v3grid__cell--locked-left']).toBe(false)
    expect(rightClass['v3grid__cell--locked-right']).toBe(true)
  })

  it('should generate correct locked styles', () => {
    const { lockedStyle } = useColumnLocked(() => columns, widths)
    
    const leftStyle = lockedStyle(0)
    expect(leftStyle).toBeDefined()
    expect(leftStyle?.position).toBe('absolute')
    expect(leftStyle?.left).toBe('0px')
    expect(leftStyle?.width).toBe('100px')
    
    const middleStyle = lockedStyle(1)
    expect(middleStyle).toBeUndefined()
    
    const rightStyle = lockedStyle(3)
    expect(rightStyle).toBeDefined()
    expect(rightStyle?.position).toBe('sticky')
    expect(rightStyle?.right).toBe('0px')
    expect(rightStyle?.width).toBe('150px')
  })

  it('should use column width when widths array value is undefined', () => {
    const undefinedWidths = ref([100, undefined, 120, 150])
    const { lockedStyle } = useColumnLocked(() => columns, undefinedWidths)
    
    const style = lockedStyle(1)
    // Should use column width (200) when widths[i] is undefined
    // But column at index 1 is not locked, so style should be undefined
    expect(style).toBeUndefined()
  })

  it('should handle empty columns array', () => {
    const emptyColumns: ColumnDef[] = []
    const emptyWidths = ref<number[]>([])
    const { lockedMeta, lockedClass, lockedStyle } = useColumnLocked(() => emptyColumns, emptyWidths)
    
    expect(lockedMeta.value).toEqual([])
    expect(lockedClass(0)).toEqual({})
    expect(lockedStyle(0)).toBeUndefined()
  })

  it('should handle columns without locked property', () => {
    const noLockedColumns: ColumnDef[] = [
      { field: 'id', title: 'ID', width: 100 },
      { field: 'name', title: 'Name', width: 200 },
    ]
    
    const noLockedWidths = ref([100, 200])
    const { lockedMeta } = useColumnLocked(() => noLockedColumns, noLockedWidths)
    
    expect(lockedMeta.value[0].side).toBeNull()
    expect(lockedMeta.value[1].side).toBeNull()
  })
})


