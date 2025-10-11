import { ref } from 'vue'
import type { ColumnDef } from '../types'

export function useColumnReorder(columns: () => ColumnDef[]) {
  const order = ref<number[]>([])

  function ensureOrder() {
    if (!order.value.length || order.value.length !== columns().length) {
      order.value = columns().map((_, i) => i)
    }
  }

  let dragIndex: number | null = null

  function onDragStart(index: number, e: DragEvent) {
    dragIndex = index
    e.dataTransfer?.setData('text/plain', String(index))
    e.dataTransfer?.setDragImage(new Image(), 0, 0)
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
  }

  function onDrop(index: number): { from: number; to: number } | null {
    if (dragIndex == null) return null
    const arr = [...order.value]
    const fromPos = arr.indexOf(dragIndex)
    const toPos = arr.indexOf(index)
    if (fromPos === -1 || toPos === -1 || fromPos === toPos) {
      dragIndex = null
      return null
    }
    const [removed] = arr.splice(fromPos, 1)
    arr.splice(toPos, 0, removed)
    order.value = arr
    dragIndex = null
    return { from: fromPos, to: toPos }
  }

  function mapColumns<T>(cols: T[]) {
    ensureOrder()
    return order.value.map(i => cols[i])
  }

  return { order, onDragStart, onDragOver, onDrop, mapColumns, ensureOrder }
}
