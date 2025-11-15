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
    const next = new Set(editingRows.value)
    next.add(rowKey)
    editingRows.value = next
  }

  function stopEditingRow(rowKey: string | number) {
    if (!editingRows.value.has(rowKey)) return
    const next = new Set(editingRows.value)
    next.delete(rowKey)
    // Clear cell editing state for this row
    const nextCells = new Map(editingCells.value)
    nextCells.forEach((value, key) => {
      if (value.rowKey === rowKey) {
        nextCells.delete(key)
      }
    })
    editingRows.value = next
    editingCells.value = nextCells
  }

  function startEditingCell(rowKey: string | number, field: string) {
    const key = `${rowKey}:${field}`
    const next = new Map(editingCells.value)
    next.set(key, { rowKey, field })
    editingCells.value = next
  }

  function stopEditingCell(rowKey: string | number, field: string) {
    const key = `${rowKey}:${field}`
    if (!editingCells.value.has(key)) return
    const next = new Map(editingCells.value)
    next.delete(key)
    editingCells.value = next
  }

  function setPendingChange(rowKey: string | number, field: string, value: any) {
    const next = new Map(pendingChanges.value)
    const existing = next.get(rowKey) ?? {}
    next.set(rowKey, { ...existing, [field]: value })
    pendingChanges.value = next
  }

  function removePendingField(rowKey: string | number, field: string) {
    const changes = pendingChanges.value.get(rowKey)
    if (!changes) return
    const nextChanges = { ...changes }
    delete nextChanges[field]
    const next = new Map(pendingChanges.value)
    if (Object.keys(nextChanges).length === 0) {
      next.delete(rowKey)
    } else {
      next.set(rowKey, nextChanges)
    }
    pendingChanges.value = next
  }

  function getPendingChange(rowKey: string | number, field: string): any {
    return pendingChanges.value.get(rowKey)?.[field]
  }

  function clearPendingChanges(rowKey?: string | number) {
    if (rowKey !== undefined) {
      if (!pendingChanges.value.has(rowKey)) return
      const next = new Map(pendingChanges.value)
      next.delete(rowKey)
      pendingChanges.value = next
      return
    }
    pendingChanges.value = new Map()
  }

  function markAsDeleted(rowKey: string | number) {
    const next = new Set(deletedRows.value)
    next.add(rowKey)
    deletedRows.value = next
  }

  function unmarkAsDeleted(rowKey: string | number) {
    if (!deletedRows.value.has(rowKey)) return
    const next = new Set(deletedRows.value)
    next.delete(rowKey)
    deletedRows.value = next
  }

  function addNewRow(row: Record<string, any>) {
    newRows.value = [...newRows.value, row]
  }

  function removeNewRow(index: number) {
    const next = [...newRows.value]
    next.splice(index, 1)
    newRows.value = next
  }

  function clearAll() {
    editingRows.value = new Set()
    editingCells.value = new Map()
    pendingChanges.value = new Map()
    deletedRows.value = new Set()
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
    removePendingField,
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

