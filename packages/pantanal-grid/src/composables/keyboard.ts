import { ref, nextTick, type Ref, type ComputedRef } from 'vue'
import type { SortDescriptor } from '../types'

export interface KeyboardNavState {
  focusRow: Ref<number>
  focusCol: Ref<number>
  lastSelectedRow: Ref<number | null>
  isShiftSelecting: Ref<boolean>
}

export interface KeyboardNavOptions {
  rowsCount: number | Ref<number> | ComputedRef<number>
  colsCount: number | Ref<number> | ComputedRef<number>
  navigatable?: boolean
  selectable?: boolean | 'single' | 'multiple'
  sortable?: boolean
  pageable?: boolean
  reorderable?: boolean
  filterable?: boolean
  currentPage?: Ref<number>
  totalPages?: () => number
  sortState?: Ref<SortDescriptor[]>
  selectedKeys?: Ref<Set<unknown>>
  expanded?: Ref<Set<string>>
  onSort?: (field: string) => void
  onPageChange?: (page: number) => void
  onSelectRow?: (rowIndex: number, addToSelection?: boolean) => void
  onSelectRange?: (startRow: number, endRow: number) => void
  onToggleGroup?: (key: string) => void
  onColumnReorder?: (fromIndex: number, toIndex: number) => void
  onFocusFirst?: () => void
  onFocusLast?: () => void
  onFocusFirstInRow?: () => void
  onFocusLastInRow?: () => void
  getGroupKey?: (rowIndex: number) => string | null
  isGroupRow?: (rowIndex: number) => boolean
}

export function useKeyboardNav(options: KeyboardNavOptions = {} as KeyboardNavOptions) {
  const focusRow = ref(0)
  const focusCol = ref(0)
  const lastSelectedRow = ref<number | null>(null)
  const isShiftSelecting = ref(false)

  function onKeydown(e: KeyboardEvent, rowIndex?: number, colIndex?: number) {
    if (!options.navigatable) return

    const rowsCountValue = typeof options.rowsCount === 'number' 
      ? options.rowsCount 
      : (options.rowsCount as Ref<number> | ComputedRef<number>).value
    const colsCountValue = typeof options.colsCount === 'number'
      ? options.colsCount
      : (options.colsCount as Ref<number> | ComputedRef<number>).value

    const {
      selectable,
      sortable,
      pageable,
      reorderable,
      filterable,
      currentPage,
      totalPages,
      sortState: _sortState,
      selectedKeys: _selectedKeys,
      expanded: _expanded,
      onSort,
      onPageChange,
      onSelectRow,
      onSelectRange,
      onToggleGroup,
      onColumnReorder,
      onFocusFirst,
      onFocusLast,
      onFocusFirstInRow,
      onFocusLastInRow,
      getGroupKey,
      isGroupRow,
    } = options

    const currentRow = rowIndex ?? focusRow.value
    const currentCol = colIndex ?? focusCol.value
    const isCtrl = e.ctrlKey || e.metaKey
    const isShift = e.shiftKey
    const isAlt = e.altKey

    if (e.target && (e.target as HTMLElement).closest('.v3grid__headercell')) {
      const headerCell = (e.target as HTMLElement).closest('.v3grid__headercell') as HTMLElement
      const columnIndex = Array.from(headerCell.parentElement?.children || []).indexOf(headerCell)
      const column = (headerCell as any).__column as { field: string; sortable?: boolean } | undefined

      if (e.key === 'Enter' && sortable && column?.sortable && onSort) {
        e.preventDefault()
        onSort(String(column.field))
        return
      }

      if (e.key === 'ArrowDown' && isAlt && filterable) {
        e.preventDefault()
        return
      }

      if (e.key === 'ArrowLeft' && isCtrl && reorderable && columnIndex > 0 && onColumnReorder) {
        e.preventDefault()
        onColumnReorder(columnIndex, columnIndex - 1)
        return
      }

      if (e.key === 'ArrowRight' && isCtrl && reorderable && columnIndex < colsCountValue - 1 && onColumnReorder) {
        e.preventDefault()
        onColumnReorder(columnIndex, columnIndex + 1)
        return
      }

      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (currentRow < rowsCountValue - 1) {
        focusRow.value = currentRow + 1
        scrollCellIntoView(focusRow.value, currentCol)
      }
      isShiftSelecting.value = false
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (currentRow > 0) {
        focusRow.value = currentRow - 1
        scrollCellIntoView(focusRow.value, currentCol)
      }
      isShiftSelecting.value = false
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (currentCol < colsCountValue - 1) {
        focusCol.value = currentCol + 1
        scrollCellIntoView(currentRow, focusCol.value)
      }
      isShiftSelecting.value = false
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (currentCol > 0) {
        focusCol.value = currentCol - 1
        scrollCellIntoView(currentRow, focusCol.value)
      }
      isShiftSelecting.value = false
      return
    }

    if (e.key === 'Enter' && isGroupRow && onToggleGroup && getGroupKey) {
      const groupKey = getGroupKey(currentRow)
      if (groupKey) {
        e.preventDefault()
        onToggleGroup(groupKey)
        return
      }
    }

    if (e.key === 'PageUp' && pageable && currentPage && totalPages && onPageChange) {
      e.preventDefault()
      const newPage = Math.max(1, currentPage.value - 1)
      if (newPage !== currentPage.value) {
        onPageChange(newPage)
        focusRow.value = 0
      }
      return
    }

    if (e.key === 'PageDown' && pageable && currentPage && totalPages && onPageChange) {
      e.preventDefault()
      const newPage = Math.min(totalPages(), currentPage.value + 1)
      if (newPage !== currentPage.value) {
        onPageChange(newPage)
        focusRow.value = 0
      }
      return
    }

    if (e.key === ' ' && selectable && onSelectRow) {
      e.preventDefault()
      if (isCtrl && selectable === 'multiple') {
        onSelectRow(currentRow, true)
        lastSelectedRow.value = currentRow
      } else if (isShift && selectable === 'multiple' && lastSelectedRow.value !== null) {
        const startRow = Math.min(lastSelectedRow.value, currentRow)
        const endRow = Math.max(lastSelectedRow.value, currentRow)
        if (onSelectRange) {
          onSelectRange(startRow, endRow)
        }
        lastSelectedRow.value = currentRow
      } else {
        onSelectRow(currentRow, false)
        lastSelectedRow.value = currentRow
      }
      return
    }

    if (isShift && selectable === 'multiple' && onSelectRow) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        onSelectRow(currentRow, true)
        lastSelectedRow.value = currentRow
        return
      }
    }

    if (e.key === 'Home' && isCtrl && onFocusFirst) {
      e.preventDefault()
      focusRow.value = 0
      focusCol.value = 0
      onFocusFirst()
      return
    }

    if (e.key === 'End' && isCtrl && onFocusLast) {
      e.preventDefault()
      focusRow.value = rowsCountValue - 1
      focusCol.value = colsCountValue - 1
      onFocusLast()
      return
    }

    if (e.key === 'Home' && !isCtrl && onFocusFirstInRow) {
      e.preventDefault()
      focusCol.value = 0
      onFocusFirstInRow()
      return
    }

    if (e.key === 'End' && !isCtrl && onFocusLastInRow) {
      e.preventDefault()
      focusCol.value = colsCountValue - 1
      onFocusLastInRow()
      return
    }

    if (e.key === 'Escape') {
      isShiftSelecting.value = false
    }
  }

  function scrollCellIntoView(rowIndex: number, colIndex: number) {
    focusRow.value = rowIndex
    focusCol.value = colIndex
    
    nextTick(() => {
      const cell = document.querySelector(`[data-focus="true"]`) as HTMLElement
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        cell.focus()
      } else {
        const cells = document.querySelectorAll('.v3grid__cell[tabindex="0"]')
        if (cells.length > 0) {
          const targetCell = Array.from(cells).find(c => {
            const cellRow = (c as HTMLElement).getAttribute('data-row-index')
            const cellCol = (c as HTMLElement).getAttribute('data-col-index')
            return cellRow === String(rowIndex) && cellCol === String(colIndex)
          }) as HTMLElement
          if (targetCell) {
            targetCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
            targetCell.focus()
          } else if (cells[0]) {
            (cells[0] as HTMLElement).focus()
          }
        }
      }
    })
  }

  function setFocus(rowIndex: number, colIndex: number) {
    focusRow.value = rowIndex
    focusCol.value = colIndex
  }

  function resetFocus() {
    focusRow.value = 0
    focusCol.value = 0
    lastSelectedRow.value = null
    isShiftSelecting.value = false
  }

  return {
    focusRow,
    focusCol,
    lastSelectedRow,
    isShiftSelecting,
    onKeydown,
    setFocus,
    resetFocus,
  }
}
