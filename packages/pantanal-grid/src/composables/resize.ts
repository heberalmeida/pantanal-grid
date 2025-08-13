import { onBeforeUnmount, ref } from 'vue'
import type { ColumnDef } from '../types'

export function useColumnResize(columns: () => ColumnDef[]) {
  const widths = ref<number[]>([])

  function ensureWidths() {
    if (!widths.value.length || widths.value.length !== columns().length) {
      widths.value = columns().map(c => c.width ?? 0)
    }
  }

  let activeIndex: number | null = null
  let startX = 0
  let startWidth = 0

  function onMouseDown(e: MouseEvent, index: number) {
    activeIndex = index
    startX = e.clientX
    ensureWidths()
    startWidth = widths.value[index] || 0
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    e.preventDefault()
  }

  function onMouseMove(e: MouseEvent) {
    if (activeIndex == null) return
    const dx = e.clientX - startX
    const newW = Math.max(60, startWidth + dx)
    widths.value[activeIndex] = newW
    widths.value = [...widths.value]
  }

  function onMouseUp() {
    activeIndex = null
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onBeforeUnmount(() => onMouseUp())

  return { widths, onMouseDown, ensureWidths }
}
