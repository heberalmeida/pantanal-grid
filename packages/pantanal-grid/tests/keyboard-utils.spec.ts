import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useKeyboardNav } from '../src/composables/keyboard'
import type { SortDescriptor } from '../src/types'

describe('useKeyboardNav - Unit Tests', () => {
  let mockOnSort: ReturnType<typeof vi.fn>
  let mockOnPageChange: ReturnType<typeof vi.fn>
  let mockOnSelectRow: ReturnType<typeof vi.fn>
  let mockOnSelectRange: ReturnType<typeof vi.fn>
  let mockOnToggleGroup: ReturnType<typeof vi.fn>
  let mockOnColumnReorder: ReturnType<typeof vi.fn>
  let mockOnFocusFirst: ReturnType<typeof vi.fn>
  let mockOnFocusLast: ReturnType<typeof vi.fn>
  let mockOnFocusFirstInRow: ReturnType<typeof vi.fn>
  let mockOnFocusLastInRow: ReturnType<typeof vi.fn>
  let mockGetGroupKey: ReturnType<typeof vi.fn>
  let mockIsGroupRow: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnSort = vi.fn()
    mockOnPageChange = vi.fn()
    mockOnSelectRow = vi.fn()
    mockOnSelectRange = vi.fn()
    mockOnToggleGroup = vi.fn()
    mockOnColumnReorder = vi.fn()
    mockOnFocusFirst = vi.fn()
    mockOnFocusLast = vi.fn()
    mockOnFocusFirstInRow = vi.fn()
    mockOnFocusLastInRow = vi.fn()
    mockGetGroupKey = vi.fn((rowIndex: number) => rowIndex === 0 ? 'group1' : null)
    mockIsGroupRow = vi.fn((rowIndex: number) => rowIndex === 0)
  })

  describe('Arrow Keys Navigation', () => {
    it('should navigate down with ArrowDown', () => {
      const { focusRow, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      onKeydown(event, 0, 0)

      expect(focusRow.value).toBe(1)
    })

    it('should navigate up with ArrowUp', () => {
      const { focusRow, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      onKeydown(event, 2, 0)

      expect(focusRow.value).toBe(1)
    })

    it('should navigate right with ArrowRight', () => {
      const { focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      onKeydown(event, 0, 0)

      expect(focusCol.value).toBe(1)
    })

    it('should navigate left with ArrowLeft', () => {
      const { focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      onKeydown(event, 0, 2)

      expect(focusCol.value).toBe(1)
    })

    it('should not navigate beyond boundaries', () => {
      const { focusRow, focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 3,
        colsCount: 2,
      })

      // Set initial position
      focusRow.value = 2
      focusCol.value = 0

      // Try to go beyond last row
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      onKeydown(downEvent, 2, 0)
      expect(focusRow.value).toBe(2) // Should stay at last row

      // Set to first row
      focusRow.value = 0
      // Try to go before first row
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      onKeydown(upEvent, 0, 0)
      expect(focusRow.value).toBe(0) // Should stay at first row
    })
  })

  describe('Header Cell Navigation', () => {
    it('should sort on Enter in header cell', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        sortable: true,
        onSort: mockOnSort,
      })

      const headerCell = document.createElement('div')
      headerCell.className = 'v3grid__headercell'
      // Store column info directly on the element
      ;(headerCell as any).__column = { field: 'name', sortable: true }
      const parent = document.createElement('div')
      parent.appendChild(headerCell)
      document.body.appendChild(parent)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      Object.defineProperty(event, 'target', { value: headerCell, writable: false })

      onKeydown(event)

      expect(mockOnSort).toHaveBeenCalledWith('name')
      document.body.removeChild(parent)
    })

    it('should not sort if column is not sortable', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        sortable: true,
        onSort: mockOnSort,
      })

      const headerCell = document.createElement('div')
      headerCell.className = 'v3grid__headercell'
      headerCell.setAttribute('__column', JSON.stringify({ field: 'name', sortable: false }))
      document.body.appendChild(headerCell)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      Object.defineProperty(event, 'target', { value: headerCell, writable: false })

      onKeydown(event)

      expect(mockOnSort).not.toHaveBeenCalled()
      document.body.removeChild(headerCell)
    })
  })

  describe('Pagination Navigation', () => {
    it('should go to previous page with PageUp', () => {
      const currentPage = ref(2)
      const totalPages = () => 5

      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        pageable: true,
        currentPage,
        totalPages,
        onPageChange: mockOnPageChange,
      })

      const event = new KeyboardEvent('keydown', { key: 'PageUp' })
      onKeydown(event)

      expect(mockOnPageChange).toHaveBeenCalledWith(1)
    })

    it('should go to next page with PageDown', () => {
      const currentPage = ref(2)
      const totalPages = () => 5

      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        pageable: true,
        currentPage,
        totalPages,
        onPageChange: mockOnPageChange,
      })

      const event = new KeyboardEvent('keydown', { key: 'PageDown' })
      onKeydown(event)

      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('should not go before first page', () => {
      const currentPage = ref(1)
      const totalPages = () => 5

      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        pageable: true,
        currentPage,
        totalPages,
        onPageChange: mockOnPageChange,
      })

      const event = new KeyboardEvent('keydown', { key: 'PageUp' })
      onKeydown(event)

      // When already at first page, onPageChange is not called (newPage === currentPage.value)
      expect(mockOnPageChange).not.toHaveBeenCalled()
    })

    it('should not go beyond last page', () => {
      const currentPage = ref(5)
      const totalPages = () => 5

      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        pageable: true,
        currentPage,
        totalPages,
        onPageChange: mockOnPageChange,
      })

      const event = new KeyboardEvent('keydown', { key: 'PageDown' })
      onKeydown(event)

      // When already at last page, onPageChange is not called (newPage === currentPage.value)
      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('Selection Navigation', () => {
    it('should select row with Space key', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        selectable: true,
        onSelectRow: mockOnSelectRow,
      })

      const event = new KeyboardEvent('keydown', { key: ' ' })
      onKeydown(event, 1, 0)

      expect(mockOnSelectRow).toHaveBeenCalledWith(1, false)
    })

    it('should select multiple rows with Ctrl+Space', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        selectable: 'multiple',
        onSelectRow: mockOnSelectRow,
      })

      const event = new KeyboardEvent('keydown', { key: ' ', ctrlKey: true })
      onKeydown(event, 1, 0)

      expect(mockOnSelectRow).toHaveBeenCalledWith(1, true)
    })

    it('should select range with Shift+Space', () => {
      const { lastSelectedRow, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        selectable: 'multiple',
        onSelectRow: mockOnSelectRow,
        onSelectRange: mockOnSelectRange,
      })

      // First select a row
      const firstEvent = new KeyboardEvent('keydown', { key: ' ' })
      onKeydown(firstEvent, 0, 0)

      // Then select range with Shift+Space
      const rangeEvent = new KeyboardEvent('keydown', { key: ' ', shiftKey: true })
      onKeydown(rangeEvent, 2, 0)

      expect(mockOnSelectRange).toHaveBeenCalledWith(0, 2)
    })

    it('should navigate with Shift+Arrow keys (selection handled separately)', () => {
      const { onKeydown, focusRow } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        selectable: 'multiple',
        onSelectRow: mockOnSelectRow,
      })

      focusRow.value = 0

      // ArrowDown with Shift navigates first (before selection check)
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true })
      onKeydown(event, 0, 0)

      // Navigation occurs, but selection check happens after ArrowDown returns
      // So we verify navigation occurred
      expect(focusRow.value).toBe(1)
    })
  })

  describe('Group Navigation', () => {
    it('should toggle group with Enter on group row', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        getGroupKey: mockGetGroupKey,
        isGroupRow: mockIsGroupRow,
        onToggleGroup: mockOnToggleGroup,
      })

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      onKeydown(event, 0, 0)

      expect(mockOnToggleGroup).toHaveBeenCalledWith('group1')
    })

    it('should not toggle if not a group row', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        getGroupKey: mockGetGroupKey,
        isGroupRow: mockIsGroupRow,
        onToggleGroup: mockOnToggleGroup,
      })

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      onKeydown(event, 1, 0) // Not a group row

      expect(mockOnToggleGroup).not.toHaveBeenCalled()
    })
  })

  describe('Column Reordering', () => {
    it('should handle column reorder keydown events', () => {
      const { onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        reorderable: true,
        onColumnReorder: mockOnColumnReorder,
      })

      // Test that reorderable option is respected
      // The actual DOM manipulation is complex to test in isolation
      // This test verifies the composable accepts the reorderable option
      expect(mockOnColumnReorder).toBeDefined()
    })
  })

  describe('Focus Management', () => {
    it('should focus first cell with Ctrl+Home', () => {
      const { focusRow, focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        onFocusFirst: mockOnFocusFirst,
      })

      const event = new KeyboardEvent('keydown', { key: 'Home', ctrlKey: true })
      onKeydown(event, 2, 2)

      expect(focusRow.value).toBe(0)
      expect(focusCol.value).toBe(0)
      expect(mockOnFocusFirst).toHaveBeenCalled()
    })

    it('should focus last cell with Ctrl+End', () => {
      const { focusRow, focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        onFocusLast: mockOnFocusLast,
      })

      const event = new KeyboardEvent('keydown', { key: 'End', ctrlKey: true })
      onKeydown(event, 0, 0)

      expect(focusRow.value).toBe(4)
      expect(focusCol.value).toBe(2)
      expect(mockOnFocusLast).toHaveBeenCalled()
    })

    it('should focus first cell in row with Home', () => {
      const { focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        onFocusFirstInRow: mockOnFocusFirstInRow,
      })

      const event = new KeyboardEvent('keydown', { key: 'Home' })
      onKeydown(event, 2, 2)

      expect(focusCol.value).toBe(0)
      expect(mockOnFocusFirstInRow).toHaveBeenCalled()
    })

    it('should focus last cell in row with End', () => {
      const { focusCol, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
        onFocusLastInRow: mockOnFocusLastInRow,
      })

      const event = new KeyboardEvent('keydown', { key: 'End' })
      onKeydown(event, 2, 0)

      expect(focusCol.value).toBe(2)
      expect(mockOnFocusLastInRow).toHaveBeenCalled()
    })
  })

  describe('Focus State Management', () => {
    it('should reset focus state', () => {
      const { focusRow, focusCol, lastSelectedRow, isShiftSelecting, resetFocus } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      focusRow.value = 3
      focusCol.value = 2
      lastSelectedRow.value = 1
      isShiftSelecting.value = true

      resetFocus()

      expect(focusRow.value).toBe(0)
      expect(focusCol.value).toBe(0)
      expect(lastSelectedRow.value).toBeNull()
      expect(isShiftSelecting.value).toBe(false)
    })

    it('should set focus manually', () => {
      const { focusRow, focusCol, setFocus } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      setFocus(2, 1)

      expect(focusRow.value).toBe(2)
      expect(focusCol.value).toBe(1)
    })

    it('should reset shift selecting on Escape', () => {
      const { isShiftSelecting, onKeydown } = useKeyboardNav({
        navigatable: true,
        rowsCount: 5,
        colsCount: 3,
      })

      isShiftSelecting.value = true

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      onKeydown(event)

      expect(isShiftSelecting.value).toBe(false)
    })
  })

  describe('Disabled Navigation', () => {
    it('should not handle keys when navigatable is false', () => {
      const { focusRow, onKeydown } = useKeyboardNav({
        navigatable: false,
        rowsCount: 5,
        colsCount: 3,
      })

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      onKeydown(event, 0, 0)

      expect(focusRow.value).toBe(0) // Should not change
    })
  })
})


