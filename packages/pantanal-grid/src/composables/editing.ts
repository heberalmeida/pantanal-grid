import { ref, computed } from 'vue'

export interface EditingState {
  editingRows: Set<string | number>
  editingCells: Map<string, { rowKey: string | number; field: string }>
  pendingChanges: Map<string | number, Record<string, any>>
  deletedRows: Set<string | number>
  newRows: Array<Record<string, any>>
}

export function useEditing() {
  const editingRows = ref<Set<string | number>>(new Set())
  const editingCells = ref<Map<string, { rowKey: string | number; field: string }>>(new Map())
  const pendingChanges = ref<Map<string | number, Record<string, any>>>(new Map())
  const deletedRows = ref<Set<string | number>>(new Set())
  const newRows = ref<Array<Record<string, any>>>([])

  function isRowEditing(rowKey: string | number): boolean {
    return editingRows.value.has(rowKey)
  }

  function isCellEditing(rowKey: string | number, field: string): boolean {
    const key = `${rowKey}:${field}`
    return editingCells.value.has(key)
  }

  function startEditingRow(rowKey: string | number) {
    editingRows.value.add(rowKey)
  }

  function stopEditingRow(rowKey: string | number) {
    editingRows.value.delete(rowKey)
    // Clear cell editing state for this row
    const keysToDelete: string[] = []
    editingCells.value.forEach((value, key) => {
      if (value.rowKey === rowKey) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => editingCells.value.delete(key))
  }

  function startEditingCell(rowKey: string | number, field: string) {
    const key = `${rowKey}:${field}`
    editingCells.value.set(key, { rowKey, field })
  }

  function stopEditingCell(rowKey: string | number, field: string) {
    const key = `${rowKey}:${field}`
    editingCells.value.delete(key)
  }

  function setPendingChange(rowKey: string | number, field: string, value: any) {
    if (!pendingChanges.value.has(rowKey)) {
      pendingChanges.value.set(rowKey, {})
    }
    const changes = pendingChanges.value.get(rowKey)!
    changes[field] = value
  }

  function getPendingChange(rowKey: string | number, field: string): any {
    return pendingChanges.value.get(rowKey)?.[field]
  }

  function clearPendingChanges(rowKey?: string | number) {
    if (rowKey !== undefined) {
      pendingChanges.value.delete(rowKey)
    } else {
      pendingChanges.value.clear()
    }
  }

  function markAsDeleted(rowKey: string | number) {
    deletedRows.value.add(rowKey)
  }

  function unmarkAsDeleted(rowKey: string | number) {
    deletedRows.value.delete(rowKey)
  }

  function addNewRow(row: Record<string, any>) {
    newRows.value.push(row)
  }

  function removeNewRow(index: number) {
    newRows.value.splice(index, 1)
  }

  function clearAll() {
    editingRows.value.clear()
    editingCells.value.clear()
    pendingChanges.value.clear()
    deletedRows.value.clear()
    newRows.value = []
  }

  const hasChanges = computed(() => {
    return pendingChanges.value.size > 0 || deletedRows.value.size > 0 || newRows.value.length > 0
  })

  return {
    editingRows,
    editingCells,
    pendingChanges,
    deletedRows,
    newRows,
    isRowEditing,
    isCellEditing,
    startEditingRow,
    stopEditingRow,
    startEditingCell,
    stopEditingCell,
    setPendingChange,
    getPendingChange,
    clearPendingChanges,
    markAsDeleted,
    unmarkAsDeleted,
    addNewRow,
    removeNewRow,
    clearAll,
    hasChanges,
  }
}

