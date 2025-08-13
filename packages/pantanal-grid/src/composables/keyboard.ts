import { ref } from 'vue'

export function useKeyboardNav() {
  const focusRow = ref(0)
  const focusCol = ref(0)

  function onKeydown(e: KeyboardEvent, rowsCount: number, colsCount: number) {
    if (e.key === 'ArrowDown') { focusRow.value = Math.min(rowsCount - 1, focusRow.value + 1); e.preventDefault() }
    else if (e.key === 'ArrowUp') { focusRow.value = Math.max(0, focusRow.value - 1); e.preventDefault() }
    else if (e.key === 'ArrowRight') { focusCol.value = Math.min(colsCount - 1, focusCol.value + 1); e.preventDefault() }
    else if (e.key === 'ArrowLeft') { focusCol.value = Math.max(0, focusCol.value - 1); e.preventDefault() }
  }

  return { focusRow, focusCol, onKeydown }
}
