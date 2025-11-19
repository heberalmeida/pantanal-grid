import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFilterPersistence, usePaginationPersistence } from '../src/composables/persistence'
import type { FilterDescriptor } from '../src/types'

describe('useFilterPersistence', () => {
  beforeEach(() => {
    // Clear localStorage and sessionStorage before each test
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('should not persist when enabled is false', () => {
    const filters = ref<FilterDescriptor[]>([])
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    useFilterPersistence(filters, false, 'test-key')
    
    filters.value = [{ field: 'name', operator: 'eq', value: 'test' }]
    
    // Give time for watcher to fire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).not.toHaveBeenCalled()
        resolve()
      }, 100)
    })
  })

  it('should persist filters to localStorage when enabled is true', async () => {
    const filters = ref<FilterDescriptor[]>([])
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    useFilterPersistence(filters, true, 'test-filters')
    
    filters.value = [{ field: 'name', operator: 'eq', value: 'test' }]
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalledWith('test-filters', JSON.stringify([{ field: 'name', operator: 'eq', value: 'test' }]))
        resolve()
      }, 100)
    })
  })

  it('should persist filters to sessionStorage when enabled is sessionStorage', async () => {
    const filters = ref<FilterDescriptor[]>([])
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    useFilterPersistence(filters, 'sessionStorage', 'test-filters')
    await nextTick()
    
    filters.value = [{ field: 'name', operator: 'eq', value: 'test' }]
    await nextTick()
    
    // Wait for watcher to fire
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalled()
        const calls = setItemSpy.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[0]).toBe('test-filters')
        expect(lastCall[1]).toBe(JSON.stringify([{ field: 'name', operator: 'eq', value: 'test' }]))
        resolve()
      }, 100)
    })
  })

  it('should load filters from localStorage on init', () => {
    const filters = ref<FilterDescriptor[]>([])
    const testFilters: FilterDescriptor[] = [{ field: 'name', operator: 'eq', value: 'loaded' }]
    localStorage.setItem('test-filters', JSON.stringify(testFilters))
    
    useFilterPersistence(filters, true, 'test-filters')
    
    expect(filters.value).toEqual(testFilters)
  })

  it('should load filters from sessionStorage on init', () => {
    const filters = ref<FilterDescriptor[]>([])
    const testFilters: FilterDescriptor[] = [{ field: 'age', operator: 'gt', value: 18 }]
    sessionStorage.setItem('test-filters', JSON.stringify(testFilters))
    
    useFilterPersistence(filters, 'sessionStorage', 'test-filters')
    
    expect(filters.value).toEqual(testFilters)
  })

  it('should handle invalid JSON in storage gracefully', () => {
    const filters = ref<FilterDescriptor[]>([])
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem('test-filters', 'invalid json')
    
    useFilterPersistence(filters, true, 'test-filters')
    
    expect(filters.value).toEqual([])
    expect(consoleWarnSpy).toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should handle non-array values in storage gracefully', () => {
    const filters = ref<FilterDescriptor[]>([])
    localStorage.setItem('test-filters', JSON.stringify({ not: 'an array' }))
    
    useFilterPersistence(filters, true, 'test-filters')
    
    expect(filters.value).toEqual([])
  })

  it('should handle storage errors when saving', async () => {
    const filters = ref<FilterDescriptor[]>([])
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    useFilterPersistence(filters, true, 'test-filters')
    
    filters.value = [{ field: 'name', operator: 'eq', value: 'test' }]
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(consoleWarnSpy).toHaveBeenCalled()
        setItemSpy.mockRestore()
        consoleWarnSpy.mockRestore()
        resolve()
      }, 100)
    })
  })

  it('should use default key when not provided', async () => {
    const filters = ref<FilterDescriptor[]>([])
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    useFilterPersistence(filters, true)
    
    filters.value = [{ field: 'name', operator: 'eq', value: 'test' }]
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalledWith('pantanal-grid-filters', expect.any(String))
        resolve()
      }, 100)
    })
  })
})

describe('usePaginationPersistence', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('should not persist when enabled is false', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    usePaginationPersistence(page, pageSize, false, 'test-key')
    
    page.value = 2
    pageSize.value = 20
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).not.toHaveBeenCalled()
        resolve()
      }, 100)
    })
  })

  it('should persist pagination to localStorage when enabled is true', async () => {
    const page = ref(1)
    const pageSize = ref(10)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    page.value = 2
    pageSize.value = 20
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalledWith('test-pagination', JSON.stringify({ page: 2, pageSize: 20 }))
        resolve()
      }, 100)
    })
  })

  it('should persist pagination to sessionStorage when enabled is sessionStorage', async () => {
    const page = ref(1)
    const pageSize = ref(10)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    usePaginationPersistence(page, pageSize, 'sessionStorage', 'test-pagination')
    await nextTick()
    
    page.value = 3
    pageSize.value = 50
    await nextTick()
    
    // Wait for watcher to fire
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalled()
        const calls = setItemSpy.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[0]).toBe('test-pagination')
        expect(lastCall[1]).toBe(JSON.stringify({ page: 3, pageSize: 50 }))
        resolve()
      }, 100)
    })
  })

  it('should load pagination from localStorage on init', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify({ page: 5, pageSize: 25 }))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(5)
    expect(pageSize.value).toBe(25)
  })

  it('should load pagination from sessionStorage on init', () => {
    const page = ref(1)
    const pageSize = ref(10)
    sessionStorage.setItem('test-pagination', JSON.stringify({ page: 7, pageSize: 100 }))
    
    usePaginationPersistence(page, pageSize, 'sessionStorage', 'test-pagination')
    
    expect(page.value).toBe(7)
    expect(pageSize.value).toBe(100)
  })

  it('should ignore invalid page values in storage', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify({ page: 0, pageSize: 25 }))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(1) // Should remain unchanged
    expect(pageSize.value).toBe(25)
  })

  it('should ignore invalid pageSize values in storage', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify({ page: 5, pageSize: -10 }))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(5)
    expect(pageSize.value).toBe(10) // Should remain unchanged
  })

  it('should ignore non-object values in storage', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify([1, 2, 3]))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
  })

  it('should handle invalid JSON in storage gracefully', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem('test-pagination', 'invalid json')
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
    expect(consoleWarnSpy).toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should handle storage errors when saving', async () => {
    const page = ref(1)
    const pageSize = ref(10)
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    page.value = 2
    pageSize.value = 20
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(consoleWarnSpy).toHaveBeenCalled()
        setItemSpy.mockRestore()
        consoleWarnSpy.mockRestore()
        resolve()
      }, 100)
    })
  })

  it('should use default key when not provided', async () => {
    const page = ref(1)
    const pageSize = ref(10)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    usePaginationPersistence(page, pageSize, true)
    
    page.value = 2
    pageSize.value = 20
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalledWith('pantanal-grid-pagination', expect.any(String))
        resolve()
      }, 100)
    })
  })

  it('should handle null values in storage', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify(null))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
  })

  it('should only update page if valid in storage', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify({ page: 'invalid', pageSize: 25 }))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(1) // Should remain unchanged
    expect(pageSize.value).toBe(25)
  })

  it('should only update pageSize if valid in storage', () => {
    const page = ref(1)
    const pageSize = ref(10)
    localStorage.setItem('test-pagination', JSON.stringify({ page: 5, pageSize: 'invalid' }))
    
    usePaginationPersistence(page, pageSize, true, 'test-pagination')
    
    expect(page.value).toBe(5)
    expect(pageSize.value).toBe(10) // Should remain unchanged
  })
})

