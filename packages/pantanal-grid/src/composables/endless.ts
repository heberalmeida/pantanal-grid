import { computed, ref } from 'vue'

export function useEndless<T>(
  allRows: () => T[],
  rowHeight = 44,
  height = 400,
  initialPageSize = 20,
  loadMoreSize = 20
) {
  const scrollTop = ref(0)
  const loadedCount = ref(initialPageSize)
  const isLoading = ref(false)

  const onScroll = (e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
    
    // Check if we're near the bottom (within 100px)
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight
    const distanceFromBottom = scrollHeight - scrollTop.value - clientHeight
    
    if (distanceFromBottom < 100 && !isLoading.value) {
      const total = allRows().length
      if (loadedCount.value < total) {
        isLoading.value = true
        // Simulate async loading
        setTimeout(() => {
          loadedCount.value = Math.min(loadedCount.value + loadMoreSize, total)
          isLoading.value = false
        }, 100)
      }
    }
  }

  const total = computed(() => allRows().length)
  const visibleRows = computed(() => allRows().slice(0, loadedCount.value))
  const hasMore = computed(() => loadedCount.value < total.value)

  return { 
    onScroll, 
    visibleRows, 
    total, 
    loadedCount, 
    hasMore, 
    isLoading,
    rowHeight, 
    height 
  }
}

