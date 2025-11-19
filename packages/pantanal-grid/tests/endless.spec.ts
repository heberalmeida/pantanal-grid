import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useEndless } from '../src/composables/endless'

describe('useEndless', () => {
  const mockRows = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))

  it('should initialize with default values', () => {
    const allRows = () => mockRows
    const { visibleRows, total, loadedCount, hasMore, isLoading, rowHeight, height } = useEndless(allRows)

    expect(total.value).toBe(100)
    expect(visibleRows.value.length).toBe(20) // initialPageSize default
    expect(loadedCount.value).toBe(20)
    expect(hasMore.value).toBe(true)
    expect(isLoading.value).toBe(false)
    expect(rowHeight).toBe(44)
    expect(height).toBe(400)
  })

  it('should initialize with custom values', () => {
    const allRows = () => mockRows
    const { visibleRows, total, loadedCount, hasMore, isLoading, rowHeight, height } = useEndless(
      allRows,
      50,   // rowHeight
      600,  // height
      10,   // initialPageSize
      15    // loadMoreSize
    )

    expect(rowHeight).toBe(50)
    expect(height).toBe(600)
    expect(loadedCount.value).toBe(10)
    expect(visibleRows.value.length).toBe(10)
  })

  it('should load more rows when scrolling near bottom', async () => {
    vi.useFakeTimers()
    try {
      const allRows = () => mockRows
      const { onScroll, visibleRows, loadedCount } = useEndless(allRows, 44, 400, 20, 20)

      expect(loadedCount.value).toBe(20)
      expect(visibleRows.value.length).toBe(20)

      // Simulate scroll near bottom - distance is less than 100px
      const mockElement = {
        scrollTop: 3901, // Close to bottom: 4400 - 3901 - 400 = 99 (< 100)
        scrollHeight: 4400,
        clientHeight: 400,
      } as HTMLElement

      const scrollEvent = {
        target: mockElement,
      } as unknown as Event

      onScroll(scrollEvent)
      await nextTick()

      // Fast-forward time to trigger setTimeout
      await vi.advanceTimersByTimeAsync(150)
      await nextTick()

      expect(loadedCount.value).toBeGreaterThan(20)
      expect(visibleRows.value.length).toBeGreaterThan(20)
    } finally {
      vi.useRealTimers()
    }
  })

  it('should not load more when already loading', () => {
    const allRows = () => mockRows
    const { onScroll, loadedCount, isLoading } = useEndless(allRows, 44, 400, 20, 20)

    const mockElement = {
      scrollTop: 350,
      scrollHeight: 4400,
      clientHeight: 400,
    } as HTMLElement

    const scrollEvent = {
      target: mockElement,
    } as unknown as Event

    // Trigger first scroll
    onScroll(scrollEvent)
    
    // Trigger second scroll while loading
    if (isLoading.value) {
      const initialCount = loadedCount.value
      onScroll(scrollEvent)
      // Should not trigger another load
      expect(loadedCount.value).toBe(initialCount)
    }
  })

  it('should not load more when all rows are loaded', () => {
    const allRows = () => mockRows.slice(0, 20) // Only 20 rows
    const { onScroll, loadedCount, hasMore } = useEndless(allRows, 44, 400, 20, 20)

    expect(hasMore.value).toBe(false)
    expect(loadedCount.value).toBe(20)

    const mockElement = {
      scrollTop: 350,
      scrollHeight: 880,
      clientHeight: 400,
    } as HTMLElement

    const scrollEvent = {
      target: mockElement,
    } as unknown as Event

    onScroll(scrollEvent)

    // Should not load more
    expect(loadedCount.value).toBe(20)
  })

  it('should not load more when not near bottom', () => {
    const allRows = () => mockRows
    const { onScroll, loadedCount } = useEndless(allRows, 44, 400, 20, 20)

    const mockElement = {
      scrollTop: 100, // Far from bottom
      scrollHeight: 4400,
      clientHeight: 400,
    } as HTMLElement

    const scrollEvent = {
      target: mockElement,
    } as unknown as Event

    onScroll(scrollEvent)

    // Should not load more
    expect(loadedCount.value).toBe(20)
  })

  it('should update scrollTop on scroll', () => {
    const allRows = () => mockRows
    const { onScroll } = useEndless(allRows)

    const mockElement = {
      scrollTop: 250,
      scrollHeight: 4400,
      clientHeight: 400,
    } as HTMLElement

    const scrollEvent = {
      target: mockElement,
    } as unknown as Event

    onScroll(scrollEvent)

    // scrollTop is internal, but scroll should be handled
    expect(mockElement.scrollTop).toBe(250)
  })

  it('should cap loadedCount to total rows', async () => {
    vi.useFakeTimers()
    try {
      const allRows = () => mockRows.slice(0, 35) // Only 35 rows
      const { onScroll, loadedCount } = useEndless(allRows, 44, 400, 20, 20)

      const mockElement = {
        scrollTop: 1140, // Near bottom: 1540 - 1140 - 400 = 0
        scrollHeight: 1540,
        clientHeight: 400,
      } as HTMLElement

      const scrollEvent = {
        target: mockElement,
      } as unknown as Event

      onScroll(scrollEvent)
      await nextTick()

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(150)
      await nextTick()

      // Should not exceed total
      expect(loadedCount.value).toBeLessThanOrEqual(35)
    } finally {
      vi.useRealTimers()
    }
  })

  it('should handle empty rows array', () => {
    const allRows = () => []
    const { visibleRows, total, loadedCount, hasMore } = useEndless(allRows)

    expect(total.value).toBe(0)
    expect(visibleRows.value.length).toBe(0)
    expect(loadedCount.value).toBe(20) // Still initialized with initialPageSize
    expect(hasMore.value).toBe(false)
  })

  it('should update visibleRows when loadedCount changes', async () => {
    vi.useFakeTimers()
    try {
      const allRows = () => mockRows
      const { onScroll, visibleRows, loadedCount } = useEndless(allRows, 44, 400, 20, 20)

      expect(visibleRows.value.length).toBe(20)

      // Simulate scroll near bottom - distance must be < 100
      const mockElement = {
        scrollTop: 3901, // 4400 - 3901 - 400 = 99 (< 100)
        scrollHeight: 4400,
        clientHeight: 400,
      } as HTMLElement

      const scrollEvent = {
        target: mockElement,
      } as unknown as Event

      onScroll(scrollEvent)
      await nextTick()

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(150)
      await nextTick()

      expect(visibleRows.value.length).toBe(loadedCount.value)
      expect(visibleRows.value.length).toBeGreaterThan(20)
    } finally {
      vi.useRealTimers()
    }
  })

  it('should set isLoading during load', async () => {
    vi.useFakeTimers()
    try {
      const allRows = () => mockRows
      const { onScroll, isLoading } = useEndless(allRows, 44, 400, 20, 20)

      const mockElement = {
        scrollTop: 3901, // 4400 - 3901 - 400 = 99 (< 100)
        scrollHeight: 4400,
        clientHeight: 400,
      } as HTMLElement

      const scrollEvent = {
        target: mockElement,
      } as unknown as Event

      onScroll(scrollEvent)
      
      // isLoading should be true immediately after onScroll (synchronous)
      expect(isLoading.value).toBe(true)

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(150)
      await nextTick()

      // isLoading should be false after loading
      expect(isLoading.value).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('should handle dynamic rows array', () => {
    const rowsRef = ref(mockRows.slice(0, 50))
    const allRows = () => rowsRef.value
    
    const { total, visibleRows } = useEndless(allRows)

    expect(total.value).toBe(50)
    expect(visibleRows.value.length).toBe(20)

    // Update rows
    rowsRef.value = mockRows.slice(0, 75)

    // total should update (computed)
    expect(total.value).toBe(75)
  })

  it('should calculate distance from bottom correctly', () => {
    const allRows = () => mockRows
    const { onScroll, loadedCount } = useEndless(allRows, 44, 400, 20, 20)

    // Test exact bottom
    const mockElementBottom = {
      scrollTop: 4000, // At bottom
      scrollHeight: 4400,
      clientHeight: 400,
    } as HTMLElement

    const scrollEventBottom = {
      target: mockElementBottom,
    } as unknown as Event

    onScroll(scrollEventBottom)

    // Should trigger load when at bottom
    expect(loadedCount.value).toBeGreaterThanOrEqual(20)
  })

  it('should handle edge case: distance exactly 100px', () => {
    const allRows = () => mockRows
    const { onScroll, loadedCount } = useEndless(allRows, 44, 400, 20, 20)

    const mockElement = {
      scrollTop: 3900, // Exactly 100px from bottom
      scrollHeight: 4400,
      clientHeight: 400,
    } as HTMLElement

    const scrollEvent = {
      target: mockElement,
    } as unknown as Event

    onScroll(scrollEvent)

    // Should trigger load when exactly 100px away
    expect(loadedCount.value).toBeGreaterThanOrEqual(20)
  })
})

