import { computed, ref } from 'vue'

export function useVirtual<T>(allRows: () => T[], rowHeight = 44, height = 400) {
  const scrollTop = ref(0)
  const onScroll = (e: Event) => {
    scrollTop.value = (e.target as HTMLElement).scrollTop
  }

  const total = computed(() => allRows().length)
  const start = computed(() => Math.floor(scrollTop.value / rowHeight))
  const visibleCount = computed(() => Math.ceil(height / rowHeight) + 4)
  const end = computed(() => Math.min(total.value, start.value + visibleCount.value))
  const topPad = computed(() => start.value * rowHeight)
  const bottomPad = computed(() => Math.max(0, (total.value - end.value) * rowHeight))
  const slice = computed(() => allRows().slice(start.value, end.value))

  return { onScroll, slice, topPad, bottomPad, rowHeight, height, total }
}
